"use server";
import { prisma } from "@/lib/prisma";

export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number = 1
) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("Please login to create add to cart...");
    }

    // update or create cart
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // check if the product is already in the cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return { cart: updatedCart, success: true };
  } catch (error) {
    console.log("error", error);
    throw new Error("Error creating cart");
  }
};

export const getCartItem = async (userId: string) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: { include: { product: true } } },
    });
    if (!cart) {
      throw new Error("You don't have any cart!...");
    }
    return {data:cart.cartItems, succes:true}
  } catch (error) {
    console.log('error',error)
    throw new Error("Error getting cart...")
  }
};


export const deleteCartItem = async(cartItemId:string)=>{
  try {
    const response = await prisma.cartItem.delete({where:{id:cartItemId}})
    return {data:response,success:true}
  } catch (error) {
    console.log('error',error)
    throw new Error('Error deleting cartItem...')
    
  }
}


export const updateCartItemQuatity = async(cartItemId:string,newQuantity:number)=>{
  try {
    const response = await prisma.cartItem.update({
      where:{
        id:cartItemId
      },data:{
        quantity:newQuantity
      }
    })
    return {data:response,success:true}
  } catch (error) {
    console.log('error',error)
    throw new Error('Error updating cartItem quntity....')
    
  }

}