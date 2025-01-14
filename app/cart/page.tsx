"use client";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { Trash2, MinusCircle, PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLoggedInUser } from "@/actions/action.user";
import {
  deleteCartItem,
  getCartItem,
  updateCartItemQuatity,
} from "@/actions/action.cart";
import ButtonLoader from "@/components/ButtonLoader";
import CartPageSkeleton from "@/components/CartSkeletonLoader";
import { ProductContext } from "@/context/Product.Context";
import { toast } from "react-toastify";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
const CartPage = () => {
  
  const {user} = useUser()
  const router = useRouter()

  if(!user){
    router.push('/')
  } 
 
  const {cartItems:cartItem,setCartItems:setCartItem} = useContext(ProductContext)
  const [loading, setLoading] = useState(false);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [change,setChange] = useState<number | null | string>(null)
  const fetchCart = async () => {
    setLoading(true);
    try {
      const user = await getLoggedInUser();
      if (user) {
        const response = await getCartItem(user.id);
        if (response.succes) {
          setCartItem(response.data);
        }
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (
    id: string,
    prevQuantity: number,
    delta: number
  ) => {
    setLoadingItemId(id)
    setChange(delta)
    const newQuantity = prevQuantity + delta;
    try {
      const response = await updateCartItemQuatity(id, newQuantity);
      if (response.success) {
        setCartItem(
          cartItem?.map((item) => {
            if (item.id === id) {
              const newQuantity = Math.max(1, item.quantity + delta);
              return { ...item, quantity: newQuantity };
            }
            return item;
          })
        );
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoadingItemId(null)
    }
  };

  const removeItem = async (id: string) => {
    setLoadingItemId(id)
    setChange('delete')
    try {
      const response = await deleteCartItem(id);
      if (response.success) {
        setCartItem(cartItem?.filter((item) => item.id !== id));
        toast.success('product removed from the cart....',{theme:'colored'})
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoadingItemId(null)
    }
  };

  const shipping = 10.0;
  const subTotalAndTotal = () => {
    const subtotal = cartItem?.reduce(
      (sum, item) => sum + item?.product?.price * item.quantity,
      0
    );
    if (subtotal) {
      const total = subtotal + shipping;
      return { subtotal, total };
    }
  };





  // Conditional rendering based on the loading state
  if (loading) {
     return <CartPageSkeleton />;
  }



  // handle checkout


    const handleCheckout = async () => {

      const items = cartItem.map(item=>({
        productId:item.productId,
        quantity:item.quantity
      }))
      const user = await getLoggedInUser()
      
      
      try {
        setLoading(true);

        
        const response = await fetch('/api/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            userId:user?.id
          })
        });
  
        if (!response.ok) {
          throw new Error('Checkout failed');
        }
  
        const { checkoutUrl } = await response.json();
         window.location.href = checkoutUrl;
      } catch (error) {
        console.error('Checkout error:', error);
        // alert('Error processing checkout. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  

  


  return (
    <div className="max-w-4xl mx-auto p-4 mt-14">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main cart content */}
        <div className="lg:col-span-2">
          {cartItem?.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-gray-500">Your cart is empty</p>
              </CardContent>
            </Card>
          ) : (
            cartItem?.map((item) => (
              <Card key={item.id} className="mb-4">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item?.product?.url}
                      alt={item?.product?.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {item?.product?.name}
                      </h3>
                      <p className="text-gray-600">
                        ${item?.product?.price?.toFixed(2)}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <ButtonLoader
                          onClick={() =>
                            updateQuantity(item.id, item.quantity, -1)
                          }
                          isLoading={loadingItemId === item.id && change===-1}
                          icon={<MinusCircle className="w-5 h-5" />}
                          disabled={item.quantity == 1}
                        ></ButtonLoader>
                        <span className="mx-2">{item.quantity}</span>

                        <ButtonLoader
                          key={item.id}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity, 1)
                          }
                          isLoading={loadingItemId === item.id && change===1}
                          icon={<PlusCircle className="w-5 h-5" />}
                          disabled={item.quantity == item.product.stock}
                        ></ButtonLoader>
                        <ButtonLoader
                          key={item.id}
                          onClick={() => removeItem(item.id)}
                          isLoading={loadingItemId === item.id && change==='delete'}
                          icon={<Trash2 className="w-5 h-5" />}
                        ></ButtonLoader>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subTotalAndTotal()?.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${subTotalAndTotal()?.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <button
                className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};


 

export default CartPage;
