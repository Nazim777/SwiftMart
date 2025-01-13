// utils/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

// types/index.ts
export interface CreateOrderInput {
  userId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// services/orderService.ts
import { CreateOrderInput } from '../types';
import { prisma } from '../lib/prisma';
import { stripe } from '../utils/stripe';
import { PaymentStatus, Status } from '@prisma/client';

export class OrderService {
  static async createOrderAndPayment(input: CreateOrderInput) {
    try {
      return await prisma.$transaction(async (tx) => {
        // 1. Verify products and calculate total
        const products = await Promise.all(
          input.items.map(item =>
            tx.product.findUniqueOrThrow({
              where: { id: item.productId }
            })
          )
        );

        // 2. Check stock availability
        const stockCheck = products.every((product, index) => 
          product.stock >= input.items[index].quantity
        );

        if (!stockCheck) {
          throw new Error('Some products are out of stock');
        }

        // 3. Calculate total price
        const subtotal = input.items.reduce((total, item, index) => {
          return total + (products[index].price * item.quantity);
        }, 0);

        const tax = subtotal * 0.1;
        const totalPrice = subtotal + tax;

        // 4. Create order
        const order = await tx.order.create({
          data: {
            userId: input.userId,
            status: Status.PENDING,
            totalPrice,
            tax,
            orderItems: {
              create: input.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity
              }))
            }
          },
          include: {
            orderItems: {
              include: {
                product: true
              }
            }
          }
        });

        // 5. Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: order.orderItems.map(item => ({
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.product.name,
                description: item.product.description,
                images: [item.product.url],
              },
              unit_amount: Math.round(item.product.price * 100),
            },
            quantity: item.quantity,
          })),
          mode: 'payment',
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel?session_id={CHECKOUT_SESSION_ID}`,
          metadata: {
            orderId: order.id,
            userId: input.userId,
          },
        });

        // 6. Create payment record
        const payment = await tx.payment.create({
          data: {
            stripePaymentId: session.id,
            amount: totalPrice,
            status: PaymentStatus.PENDING,
            userId: input.userId,
            orderId: order.id
          }
        });

        // 7. Update product stock
        await Promise.all(
          input.items.map((item, index) =>
            tx.product.update({
              where: { id: item.productId },
              data: {
                stock: products[index].stock - item.quantity
              }
            })
          )
        );

        return {
          order,
          payment,
          checkoutUrl: session.url
        };
      });
    } catch (error) {
      throw error;
    }
  }

  static async handlePaymentSuccess(sessionId: string) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { stripePaymentId: session.id },
        data: { status: PaymentStatus.SUCCESS }
      });

      await tx.order.update({
        where: { id: session.metadata.orderId },
        data: { status: Status.COMPLETED }
      });
    });

    return session;
  }

  static async handlePaymentFailure(sessionId: string) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { stripePaymentId: session.id },
        data: { status: PaymentStatus.FAILED }
      });

      const order = await tx.order.findUniqueOrThrow({
        where: { id: session.metadata.orderId },
        include: { orderItems: true }
      });

      // Restore product stock
      await Promise.all(
        order.orderItems.map(item =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity
              }
            }
          })
        )
      );

      await tx.order.update({
        where: { id: order.id },
        data: { status: Status.CANCELED }
      });
    });

    return session;
  }
}

// pages/api/create-checkout.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { OrderService } from '../../services/orderService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const result = await OrderService.createOrderAndPayment(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error creating checkout:', error);
    res.status(500).json({ message: 'Error creating checkout' });
  }
}

// pages/api/webhook.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { OrderService } from '../../services/orderService';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature']!;
  const rawBody = await getRawBody(req);

  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await OrderService.handlePaymentSuccess(session.id);
        break;
      }
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        await OrderService.handlePaymentFailure(session.id);
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
}

// components/CheckoutButton.tsx
import { useState } from 'react';

interface CheckoutButtonProps {
  items: Array<{ productId: string; quantity: number }>;
  userId: string;
}

export function CheckoutButton({ items, userId }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          userId
        })
      });

      const { checkoutUrl } = await response.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error processing checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Processing...' : 'Checkout'}
    </button>
  );
}

// pages/payment/success.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function PaymentSuccess() {
  const router = useRouter();
  const { session_id } = router.query;
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (session_id) {
      fetch(`/api/verify-payment?session_id=${session_id}`)
        .then(res => res.json())
        .then(setOrderDetails)
        .catch(console.error);
    }
  }, [session_id]);

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
          {orderDetails && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Order ID: {orderDetails.orderId}
              </p>
              <p className="text-sm text-gray-600">
                Amount: ${orderDetails.amount}
              </p>
            </div>
          )}
          <div className="mt-6">
            <Link
              href="/orders"
              className="text-indigo-600 hover:text-indigo-500"
            >
              View Your Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// pages/payment/cancel.tsx
import Link from 'next/link';

export default function PaymentCancel() {
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
          <div className="mt-6 space-y-4">
            <Link
              href="/cart"
              className="block text-indigo-600 hover:text-indigo-500"
            >
              Return to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}