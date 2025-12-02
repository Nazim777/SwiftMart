"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ShoppingBag, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { addToCart } from "@/actions/action.cart";
import { getLoggedInUser } from "@/actions/action.user";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {ProductType} from '@/types/product'


type ProductCardProps = {
  product: ProductType;
  isInCart: boolean;
  handleTriggerAddToCart: (v: boolean) => void;
};

export default function ProductCard({
  product,
  isInCart,
  handleTriggerAddToCart,
}: ProductCardProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [fly, setFly] = useState(false);

  const imgRef = useRef<HTMLDivElement | null>(null);

  const handleAddToCart = async (id: string) => {
    // ❌ Out of stock
    if (product.stock <= 0) {
      return toast.error("❌ Product is out of stock", { theme: "colored" });
    }

    // ⚠ Already in cart
    if (isInCart) {
      return toast.warning("⚠ Product already in cart", { theme: "colored" });
    }

    setLoading(true);

    try {
      const logged = await getLoggedInUser();
      if (!logged) return;

      const res = await addToCart(logged.id, id, 1);

      if (res?.success) {
        handleTriggerAddToCart(true);
        toast.success("🛒 Added to cart", { theme: "colored" });

        setFly(true); // Trigger animation
        setTimeout(() => setFly(false), 900);
      }
    } catch (error) {
      toast.error("Something went wrong", { theme: "colored" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      viewport={{ once: true }}
      className="group bg-white rounded-3xl p-4 shadow-lg hover:shadow-2xl 
                 transition-all duration-300 relative overflow-hidden border border-gray-100"
    >
      {/* Image */}
      <div ref={imgRef} className="relative h-64 rounded-2xl overflow-hidden bg-gray-100">
        <Image
          src={product.url}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Hover Action Buttons */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300 flex items-center justify-center gap-3">

          {!user ? (
            <SignInButton mode="modal">
              <button
                disabled={product.stock <= 0}
                className={`p-3 rounded-full shadow-lg transition transform hover:scale-110
                  ${product.stock > 0 ? "bg-white text-gray-800 hover:bg-blue-600 hover:text-white" : "bg-gray-200 cursor-not-allowed"}`}
              >
                <ShoppingBag size={20} />
              </button>
            </SignInButton>
          ) : (
            <button
              disabled={product.stock <= 0}
              onClick={() => handleAddToCart(product.id)}
              className={`p-3 rounded-full shadow-lg transition transform hover:scale-110
                ${product.stock > 0 ? "bg-white text-gray-800 hover:bg-blue-600 hover:text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
            >
              {loading ? "..." : <ShoppingBag size={20} />}
            </button>
          )}

          <Link href={`/products/${product.id}`}>
            <button className="p-3 bg-white rounded-full text-gray-800 shadow-lg 
                               hover:bg-blue-600 hover:text-white transition transform hover:scale-110">
              <Eye size={20} />
            </button>
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="pt-4 px-2">
        <p className="text-xs text-blue-500 font-semibold uppercase tracking-wider mb-1">
          {product.categories[0].category.name}
        </p>

        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
          <span className="text-lg font-bold text-blue-600">${product.price}</span>
        </div>

        <p
          className={`text-xs mt-1 ${
            product.stock > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </p>
      </div>

      {/* 🛍 Fly-to-Cart Animation */}
      <AnimatePresence>
        {fly && (
          <motion.div
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{ opacity: 1, scale: 1.2, x: 160, y: -260 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="w-12 h-12 bg-blue-600 rounded-full shadow-xl flex items-center justify-center fixed z-[999]"
          >
            <ShoppingBag className="text-white" size={18} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}