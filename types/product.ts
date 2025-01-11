import { getAllProducts } from "@/actions/action.products";

export type productTypeForCreateAndEdit={
    id?:string;
    name: string;
    url: string;
    description: string;
    price: number;
    stock: number;
    categories?: string[]; 
  
  }


  // export type ProductReturnType = Awaited<ReturnType<typeof getAllProducts>>;


 export type ProductType = {
    id: string;
    name: string;
    price: number;
    stock: number;
    url:string;
    description:string;
    createdAt: Date;
    updatedAt: Date;
    categories: { 
    category: {id:string, name: string },
    createdAt: Date;
    updatedAt: Date;
    categoryId: string;
    productId: string;  }[];
  }
  