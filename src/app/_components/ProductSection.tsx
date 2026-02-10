"use client";

import { useState, useEffect, useContext } from "react";
import { getCartItem } from "@/features/cart/actions/action.cart";
import { getLoggedInUser } from "@/features/user/actions/action.user";
import ProductCard from "@/features/products/components/ProductsCard";
import { useRouter } from "next/navigation";

import { ArrowRight } from "lucide-react";
import { ProductType } from "@/types/product";
import { ProductContext } from "@/components/providers/Product.Context";

type productsProps = {
  products: ProductType[] | [] | undefined;
  error: string | undefined;
};
export const ProductSection = ({ products, error }: productsProps) => {
  //fetch cart and update to the cart context
  const { cartItems, setCartItems } = useContext(ProductContext);
  const [triggerAddToCart, setTriggerAddToCart] = useState(false);
  const handleTriggerAddToCart = (text: boolean) => {
    setTriggerAddToCart(text);
  };
  const fetchCart = async () => {
    try {
      const user = await getLoggedInUser();
      if (user) {
        const response = await getCartItem(user.id);
        if (response.success) {
          setCartItems(response.data);
        }
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setTriggerAddToCart(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [triggerAddToCart]);

  const router = useRouter()
  if (error) {
    return (
      <div className="p-6 min-h-screen flex justify-center items-center text-center">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg shadow-md w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-2">⚠ Something went wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!products) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="animate-pulse text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <section className="py-24 bg-gray-50" id="products">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-xl">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Our Latest <span className="text-blue-600">Drops</span>
            </h2>
            <p className="text-gray-600">
              Curated specifically for the modern connoisseur. Quality meets
              design in our latest collection.
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition" onClick={() => router.push('/products')}>
            View All Collection <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products &&
            products.map((product: ProductType) => {
              const isInCart = cartItems?.some(
                (item) => item.product.id === product.id
              );

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  isInCart={isInCart}
                  handleTriggerAddToCart={handleTriggerAddToCart}
                />
              );
            })}
        </div>

        <button className="md:hidden w-full mt-8 py-4 border border-blue-600 text-blue-600 rounded-xl font-bold" >
          View All Collection
        </button>
      </div>
    </section>
  );
};
