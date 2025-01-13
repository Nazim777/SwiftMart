'use server'
import { stripe } from "@/utils/stripe";
import { prisma } from "@/lib/prisma";
import { PaymentStatus, Prisma, Status } from "@prisma/client";
import { isAdmin } from "./action.user";
import { revalidatePath } from "next/cache";





type CreateOrderInput = {
  userId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
};

export const CreateOrderAndPayment = async (input: CreateOrderInput) => {
  try {
    // 1. First transaction: Validate products and create order
    const { order, verifiedProducts } = await prisma.$transaction(async (tx) => {
      // Verify products and check stock
      const verifiedProducts = await Promise.all(
        input.items.map(async (item) => {
          const product = await tx.product.findUniqueOrThrow({
            where: { id: item.productId },
          });
          
          if (product.stock < item.quantity) {
            throw new Error(`Product ${product.name} is out of stock`);
          }
          
          return product;
        })
      );

      // Calculate prices
      const subtotal = input.items.reduce((total, item, index) => {
        return total + (verifiedProducts[index].price * item.quantity);
      }, 0);

      const shipping = 10;
      const tax = 0;
      const discount = 0;
      const totalPrice = subtotal + shipping;

      // Create order
      const order = await tx.order.create({
        data: {
          userId: input.userId,
          status: Status.PENDING,
          totalPrice,
          tax,
          discount,
          orderItems: {
            create: input.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      return { order, verifiedProducts };
    }, {
      timeout: 10000,
    });

    // 2. Create Stripe checkout session (outside transaction)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: order.orderItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
            description: item.product.description,
            images: [item.product.url],
          },
          unit_amount: Math.round(item.product.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        orderId: order.id,
        userId: input.userId,
      },
    });

    // 3. Second transaction: Update stock and create payment
    const { payment } = await prisma.$transaction(async (tx) => {
      // Create payment record
      const payment = await tx.payment.create({
        data: {
          stripePaymentId: session.id,
          amount: order.totalPrice,
          status: PaymentStatus.PENDING,
          userId: input.userId,
          orderId: order.id,
        },
      });

      // Update product stock
      await Promise.all(
        input.items.map((item, index) =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              stock: verifiedProducts[index].stock - item.quantity,
            },
          })
        )
      );

      // Clear cart items
      const cart = await tx.cart.findUniqueOrThrow({
        where: { userId: input.userId }
      });

      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          productId: {
            in: input.items.map(item => item.productId)
          }
        }
      });

      return { payment };
    }, {
      timeout: 10000,
    });

    return {
      order,
      payment,
      checkoutUrl: session.url,
    };

  } catch (error) {
    console.error("CreateOrderAndPayment error:", error);
    
    // Add specific error handling
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`Database error: ${error.message}`);
    }
    
    if (error instanceof stripe.errors.StripeError) {
      throw new Error(`Payment processing error: ${error.message}`);
    }

    throw new Error("Error creating order and payment");
  }
};






export const handlePaymentSuccess = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { stripePaymentId: session.id },
      data: { status: PaymentStatus.SUCCESS },
    });

    await tx.order.update({
      where: { id: session?.metadata?.orderId },
      data: { status: Status.COMPLETED },
    });
  });
  return session;
};


export const handlePaymentFailure = async(sessionId:string)=>{
    const session= await stripe.checkout.sessions.retrieve(sessionId)
    
    await prisma.$transaction(async(tx)=>{
      // validating session data 
      if (!session.metadata?.userId) {
        throw new Error("User ID is missing in session metadata.");
      }

        await tx.payment.update({
            where:{stripePaymentId:session.id},
            data:{status:PaymentStatus.FAILED}
        })

        const order = await tx.order.findUniqueOrThrow({
            where:{id:session?.metadata?.orderId},
            include:{
                orderItems:true
            }
        })

        // restore product stock

        for(const item of order.orderItems){
            await tx.product.update({
            where:{id:item.productId},
            data:{
                stock:{
                    increment:item.quantity
                }
            }

            })
        }

        await tx.order.update({
            where:{id:order.id},
            data:{
                status:Status.CANCELED
            }
        })



        // find cart by userId
        let cart = await tx.cart.findUnique({
          where: { userId: session.metadata?.userId },
        });
        
        // If the cart doesn't exist, create it
        if (!cart) {
          cart = await tx.cart.create({
            data: { userId:session?.metadata?.userId },
          });
        }
    
        // Add the order items back to the cart
        await tx.cartItem.createMany({
          data: order.orderItems.map((item) => ({
            cartId: cart.id,
            productId: item.productId,
            quantity: item.quantity,
          })),
          skipDuplicates: true, // Avoid duplicates if applicable
        });

    })
    return session
}



export const getAllOrdersForUser  = async(userId:string
)=>{
  try {
    const response = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        orders: {
          include: {
            orderItems: {
              include: {
                product: {
                  select: {
                    name: true,
                    price: true,
                    url: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    return {data:response.orders,success:true}
  } catch (error) {
    console.log('error',error)
    throw new Error('Error getting orders....')
    
  }
}





export async function getOrders() {
  try {
    const admin = await isAdmin();
        if (!admin) {
          throw new Error("Unauthorized");
        }

    return await prisma.order.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
}

export const  updateOrderStatus= async (orderId: string, status: Status) =>{

  console.log('orderId',orderId,'status',status)
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }
   

   const response =  await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

     revalidatePath('/admin/orders');
    return { success: true,data:response };
  } catch (error) {
    console.error('Error updating order:', error);
    throw new Error('Failed to update order');
  }
}

export async function cancelOrder(orderId: string) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      throw new Error("Unauthorized");
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELED' },
    });

    revalidatePath('/admin/orders');
    return { success: true };
  } catch (error) {
    console.error('Error canceling order:', error);
    throw new Error('Failed to cancel order');
  }
}
