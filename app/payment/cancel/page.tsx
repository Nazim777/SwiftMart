interface CancelPageProps {
  searchParams: {
    session_id?: string;
  };
}

import { handlePaymentFailure } from '@/actions/order.action';
import Link from 'next/link';

export default async function PaymentCancel({searchParams}:CancelPageProps) {
  const sessionId = searchParams?.session_id;
  console.log('sessionId',sessionId)
  if(sessionId){
    await handlePaymentFailure(sessionId)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-red-600">
            Payment Cancelled
          </h2>
          <div className="mt-4">
            <svg
              className="mx-auto h-12 w-12 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Your payment was cancelled. No charges were made.
          </p>
          <div className="mt-6 space-y-4">
            <Link
              href="/cart"
              className="block text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Return to Cart
            </Link>
            <Link
              href="/"
              className="block text-sm font-medium text-gray-600 hover:text-gray-500"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}