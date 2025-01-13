// utils/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

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
import { PaymentStatus, Status } from '@prisma/client';
import { stripe } from '../utils/stripe';
import { prisma } from '../lib/prisma';

interface CreateOrderInput {
  userId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export async function createOrderAndPayment(input: CreateOrderInput) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Verify products and calculate total
      const verifiedProducts = [];
      for (const item of input.items) {
        const product = await tx.product.findUniqueOrThrow({
          where: { id: item.productId }
        });
        verifiedProducts.push(product);
      }

      // 2. Check stock availability
      for (let i = 0; i < input.items.length; i++) {
        if (verifiedProducts[i].stock < input.items[i].quantity) {
          throw new Error(`Product ${verifiedProducts[i].name} is out of stock`);
        }
      }

      // 3. Calculate total price
      let subtotal = 0;
      for (let i = 0; i < input.items.length; i++) {
        subtotal += verifiedProducts[i].price * input.items[i].quantity;
      }

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
      for (let i = 0; i < input.items.length; i++) {
        await tx.product.update({
          where: { id: input.items[i].productId },
          data: {
            stock: verifiedProducts[i].stock - input.items[i].quantity
          }
        });
      }

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

export async function handlePaymentSuccess(sessionId: string) {
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

export async function handlePaymentFailure(sessionId: string) {
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
    for (const item of order.orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity
          }
        }
      });
    }

    await tx.order.update({
      where: { id: order.id },
      data: { status: Status.CANCELED }
    });
  });

  return session;
}

// pages/api/create-checkout.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createOrderAndPayment } from '../../services/orderService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const result = await createOrderAndPayment(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error creating checkout:', error);
    res.status(500).json({ message: 'Error creating checkout' });
  }
}

// pages/api/webhook.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { handlePaymentSuccess, handlePaymentFailure } from '../../services/orderService';

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
        await handlePaymentSuccess(session.id);
        break;
      }
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handlePaymentFailure(session.id);
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

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

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