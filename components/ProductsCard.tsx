"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { ProductType } from "@/types/product";
import Link from "next/link";
import { addToCart } from "@/actions/action.cart";
import { getLoggedInUser } from "@/actions/action.user";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { SignInButton, useUser } from "@clerk/nextjs";
type productProps = {
  product: ProductType;
  isInCart: boolean;
  handleTriggerAddToCart: (text: boolean) => void;
};

const ProductsCard = ({
  product,
  isInCart,
  handleTriggerAddToCart,
}: productProps) => {
  const router = useRouter();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const handleAddToCart = async (productId: string) => {
    setLoading(true);
    const user = await getLoggedInUser();
    if (user) {
      const response = await addToCart(user?.id, productId, 1);
      if (response.success) {
        // console.log('response',response.cart)
        handleTriggerAddToCart(true);
        toast.success("product added to the cart...", { theme: "colored" });
      }
    }
    try {
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card key={product.id} className="shadow-lg">
      <CardHeader className="p-0 relative">
        <Image
          src={product.url}
          alt={product.name}
          width={300}
          height={200}
          className="rounded-t-lg object-cover w-full h-48"
        />
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
        <p
          className={`text-sm ${
            product.stock > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </p>
        <p className="text-lg font-bold text-blue-600">${product.price}</p>
        <div className="flex justify-between mt-4">
          <Link href={`/products/${product.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
          {product.stock > 0 && (
            <>
              {!user ? (
                <SignInButton mode="modal">
                  <Button> Add To Cart</Button>
                </SignInButton>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    if (isInCart) {
                      router.push("/cart");
                    } else {
                      handleAddToCart(product.id);
                    }
                  }}
                >
                  {loading
                    ? "Adding"
                    : isInCart
                    ? "Already in Cart"
                    : "Add to Cart"}
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductsCard;
