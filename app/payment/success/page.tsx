'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccess() {
  const router = useRouter();
  // const { session_id } = router.query;
  const [orderDetails, setOrderDetails] = useState(null);

  // useEffect(() => {
  //   if (session_id) {
  //     // Verify the session and get order details
  //     fetch(`/api/verify-payment?session_id=${session_id}`)
  //       .then(res => res.json())
  //       .then(data => setOrderDetails(data))
  //       .catch(error => console.error('Error:', error));
  //   }
  // }, [session_id]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-green-600">
            Payment Successful!
          </h2>
          <div className="mt-4">
            <svg
              className="mx-auto h-12 w-12 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          {orderDetails && (
            <div className="mt-4 text-left">
              <p className="text-sm text-gray-600">
                {/* Order ID: {orderDetails?.orderId} */}
              </p>
              <p className="text-sm text-gray-600">
                {/* Total Amount: ${orderDetails?.amount} */}
              </p>
            </div>
          )}
          <div className="mt-6">
            <Link
              href="/orders"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View Your Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}