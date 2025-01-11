"use client";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { ProductType } from "@/types/product";
import { getProduct } from "@/actions/action.products";
import ProductSkeletonLoader from "@/components/ProductSleletonLoader";


export default function ProductPage ({ params }: { params: { id: string } }){
  const router = useRouter();
  const [product,setProduct] = useState<ProductType | null>()
 const [loading,setLoading] = useState(false)



  const fetchProduct  =async()=>{
    setLoading(true)
    try {
      const response = await getProduct(params.id)
      if(response?.success){
        setProduct(response.data)
      }
    } catch (error) {
      console.log('error',error)
      
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchProduct()


  },[params.id])

  return (
   <div className="mt-14">
     {loading?<ProductSkeletonLoader/>:<div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="flex flex-col items-center md:w-1/2">
          {product&&<Image
            src={product?.url}
            alt={product?.name}
            width={400}
            height={300}
            className="rounded-lg"
          />}
        </div>

        <div className="md:w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl font-semibold">{product?.name}</h1>
          <p className="text-lg text-gray-600">{product?.description}</p>

          <div className="flex items-center gap-4 mt-4">
            <p className="text-xl font-semibold">
              Price: ${product?.price.toFixed(2)}
            </p>
            <p className="text-md text-gray-500">Stock: {product?.stock}</p>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-gray-500">Categories:</p>
            <ul className="list-disc pl-5 text-gray-700">
              {product?.categories.map((item, index) => (
                <li key={index}>{item?.category?.name}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    </div>}
   </div>
    
  );
};


