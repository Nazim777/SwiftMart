export const dynamic = 'force-dynamic';
import { getLoggedInUser } from '@/actions/action.user';
import Link from 'next/link';
import { redirect } from 'next/navigation';


export  default  async function PaymentSuccess() {
  
  const user = await getLoggedInUser()

  if(!user){
    redirect('/')
  }
  

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




