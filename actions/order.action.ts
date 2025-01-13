import { stripe } from "@/utils/stripe";
import { prisma } from "@/lib/prisma";
import { PaymentStatus, Status } from "@prisma/client";

type createOrderInput = {
  userId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
};

export const CreateOrderAndPayment = async (input: createOrderInput) => {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. verify product and calculate total
      const verifiedProducts = [];
      for (const item of input.items) {
        const product = await tx.product.findUniqueOrThrow({
          where: { id: item.productId },
        });
        verifiedProducts.push(product);
      }

      // 2. check stock availablity
      for (let i = 0; i < input.items.length; i++) {
        if (verifiedProducts[i].stock < input.items[i].quantity) {
          throw new Error(
            `Product ${verifiedProducts[i].name} is out of stock`
          );
        }
      }

      // 3 calculate the total price
      let subtotal = 0;
      for (let i = 0; i < input.items.length; i++) {
        subtotal += verifiedProducts[i].price * input.items[i].quantity;
      }

      // including tax and shipping fee
      let shipping = 10;
      let tax = 0;
      let discount = 0;
      const totalPrice = subtotal + shipping;

      // 4 create order
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

      // 5 create stripe checkout session
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

      // 6 create payment
      const payment = await tx.payment.create({
        data: {
          stripePaymentId: session.id,
          amount: totalPrice,
          status: PaymentStatus.PENDING,
          userId: input.userId,
          orderId: order.id,
        },
      });

      // 7 update product stock
      for (let i = 0; i < input.items.length; i++) {
        await tx.product.update({
          where: { id: input.items[i].productId },
          data: {
            stock: verifiedProducts[i].stock - input.items[i].quantity,
          },
        });
      }

      
      // update cart
      for(let i =0; i<input.items.length; i++){
        await tx.cartItem.deleteMany({
          where:{productId:input.items[i].productId}
        })
      }

      return {
        order,
        payment,
        checkoutUrl: session.url,
      };
    });
  } catch (error) {
    console.log("error", error);
    throw new Error("Error creating payment");
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

    })
    return session
}
