import { ProductType } from "./product";

export type cartType = {
    id:string;
    createdAt: Date;
    updatedAt: Date;
    userId:string;
    cartItems:cartItemType[]

}

export type cartItemType = {

    id:string;
    createdAt: Date;
    updatedAt: Date;
    productId:string;
    quantity: number;
    cartId:string;
    product: cartProductType
}

type cartProductType ={
    id: string;
    name: string;
    price: number;
    stock: number;
    url:string;
    description:string;
    createdAt: Date;
    updatedAt: Date;
}