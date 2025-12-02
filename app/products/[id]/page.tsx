"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getProduct } from "@/actions/action.products";
import ProductSkeletonLoader from "@/components/ProductSleletonLoader";
import { ProductType } from "@/types/product";

import {
  ArrowLeft,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RefreshCw,
  Minus,
  Plus,
  Share2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useUser } from "@clerk/nextjs";
import { getLoggedInUser } from "@/actions/action.user";
import { addToCart, getCartItem } from "@/actions/action.cart";
import { ProductContext } from "@/context/Product.Context";
import CustomError from "@/app/_components/CustomError";
import Spinner from "@/components/Spinner";

// === CART FLY ANIMATION ======================
const flyToCart = (img: string) => {
  const el = document.createElement("img");
  el.src = img;
  el.className =
    "fixed w-14 h-14 rounded-xl border object-cover animate-fly-cart";
  el.style.top = "50%";
  el.style.left = "50%";
  el.style.zIndex = "9999";
  document.body.appendChild(el);

  setTimeout(() => {
    el.style.transform = "translate(500px,-300px) scale(0)";
    el.style.opacity = "0";
  }, 100);

  setTimeout(() => el.remove(), 900);
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { cartItems, setCartItems } = useContext(ProductContext);
  //const [activeImage, setActiveImage] = useState(0);
  const [triggerAddToCart, setTriggerAddToCart] = useState(false);
  const [addtoCartLoader,setAddtoCartLoader] = useState(false)
  const [buyNowLoader,setBuyNowLoader] = useState(false)

  const [error,setError] = useState<string | null>(null)
  const handleTriggerAddToCart = (val: boolean) => setTriggerAddToCart(val);

  const fetchCart = async () => {
    try {
      const user = await getLoggedInUser();
      if (user) {
        const response = await getCartItem(user.id);
        if (response?.succes) {
          setCartItems(response.data);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTriggerAddToCart(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [triggerAddToCart]);

  const fetchProduct = async () => {
    setError(null)
    try {
      const res = await getProduct(params.id);
      if (res?.success) setProduct(res.data);
    } catch (err) {
      console.log(err);
      setError('Failed to load product. Please try again later!')
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  if(error){
    return <CustomError error = {error}/>
  }
  if (loading) return <ProductSkeletonLoader />;
  if (!product)
    return <p className="text-center py-32 text-xl">Product not found</p>;

  const isOutOfStock = product.stock <= 0;

  const { user } = useUser();

  const addToCartItem = async () => {
    if (isOutOfStock) {
      toast.error("Product is out of stock", { theme: "colored" });
      return;
    }

    if (!user) {
      toast.info("Please sign in to add items to cart", { theme: "colored" });
      return;
    }
    const isInCart = cartItems.some((item) => item.product.id === product.id);
    if (isInCart) {
      toast.info("Product is already in cart", { theme: "colored" });
      return;
    }

    flyToCart(product.url); // Fly animation
    setAddtoCartLoader(true)
    try {
      const loggedUser = await getLoggedInUser();
      if (!loggedUser) return;

      const response = await addToCart(loggedUser.id, product.id, quantity);
      if (response?.success) {
        toast.success("Product added to cart", { theme: "colored" });
        handleTriggerAddToCart(true);
      } else {
        toast.error("Failed to add product to cart", { theme: "colored" });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", { theme: "colored" });
    }finally{
      setAddtoCartLoader(false)
    }
  };

  const buyNow = async () => {
    if (isOutOfStock) {
      toast.error("Product is out of stock", { theme: "colored" });
      return;
    }

    if (!user) {
      toast.info("Please sign in to buy the item", { theme: "colored" });
      return;
    }

    const isInCart = cartItems.some((item) => item.product.id === product.id);

    if(!isInCart){
    await addToCartItem();
    } // Add to cart first
    router.push("/cart"); // Navigate to cart/checkout
  };

  return (
    <div className="bg-white min-h-screen pb-12 mt-14">
      {/* BACK BUTTON */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-600 hover:text-black"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 px-5">
        {/* IMAGE + THUMBNAILS */}
        <div>
          <div className="rounded-2xl overflow-hidden relative bg-gray-100 border h-[400px]">
            <Image
              src={product.url}
              alt={product.name}
              fill
              className="object-cover"
            />

            {isOutOfStock && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <span className="bg-red-600 text-white px-5 py-2 rounded-full font-bold">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* THUMB STRIP (Optional future multiple images support) */}
          <div className="grid grid-cols-4 gap-3 mt-4 opacity-60 pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-full h-20 rounded-lg bg-gray-200" />
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* PRICE */}
          <div className="flex items-end gap-4 border-b pb-4">
            <span className="text-4xl font-bold text-gray-900">
              ${product.price}
            </span>
            {/* No old price conditionally handled */}
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* QUANTITY */}
          {!isOutOfStock && (
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Quantity</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2"
                >
                  <Minus />
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(q + 1, product.stock))
                  }
                  className="p-2"
                >
                  <Plus />
                </button>
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex gap-3">
            <button
              disabled={isOutOfStock || addtoCartLoader}
              onClick={addToCartItem}
              className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 font-semibold
                ${
                  isOutOfStock
                    ? "bg-gray-100 text-gray-400"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
            >
              {addtoCartLoader?<Spinner/>:<><ShoppingCart /> Add to Cart</>}
            </button>

            <button
              disabled={isOutOfStock || addtoCartLoader}
              onClick={buyNow}
              className={`flex-1 py-4 rounded-xl font-semibold border
                ${
                  isOutOfStock
                    ? "border-gray-200 text-gray-400"
                    : "border-black hover:bg-gray-50"
                }`}
            >
              {addtoCartLoader?<Spinner/>:'Buy Now'}
            </button>

            <button className="p-4 rounded-xl border">
              <Share2 />
            </button>
          </div>

          {/* BADGES */}
          <div className="grid grid-cols-3 gap-5 pt-8 border-t text-sm">
            <div className="flex gap-3">
              <Truck />
              <span>Free Shipping</span>
            </div>
            <div className="flex gap-3">
              <ShieldCheck />
              <span>Secure Payment</span>
            </div>
            <div className="flex gap-3">
              <RefreshCw />
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
