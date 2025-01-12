'use client'
import { createContext, useState } from "react";
import { cartItemType } from '../types/cart'
type ContainerPropsType = {
    children:React.ReactNode;
}


const InitialcartItemsData:cartItemType[]= [
        {
        id: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        productId: '',
        quantity: 0,
        cartId: '',
        product:{
            id: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            name: '',
            url: '',
            description: '',
            price: 0,
            stock: 0
        }
        }
   
]






type productContextType = {
    cartItems: cartItemType[]
    setCartItems:React.Dispatch<React.SetStateAction<cartItemType[]>>
}



const productContextInitialState = {
    cartItems:InitialcartItemsData,
    setCartItems:()=>{}
}


const ProductContext = createContext<productContextType>(productContextInitialState)


const ProductContextProvider = (props:ContainerPropsType)=>{

    const [cartItems,setCartItems] = useState<cartItemType[]>(InitialcartItemsData)
    return(
        <>
        <ProductContext.Provider value={{cartItems,setCartItems}}>
            {props.children}
        </ProductContext.Provider>
        </>
    )

}

export {ProductContext,ProductContextProvider}