import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/utils/stripe";
import Stripe from "stripe";
import { handlePaymentSuccess,handlePaymentFailure } from "@/actions/order.action";
export async function POST(req:NextRequest){

    const body = await req.text();

    const signature = headers().get("Stripe-Signature") as string;
    if (!signature) {
        console.log("not signature found");
        return NextResponse.json({ error: "No Stripe Signature" }, { status: 500 });
      }
      try {
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )

        switch(event.type){
            case 'checkout.session.completed':{
                const session = event.data.object as Stripe.Checkout.Session
                await handlePaymentSuccess(session.id)
                break
            }
            case 'checkout.session.expired':{
                const session = event.data.object as Stripe.Checkout.Session;
                await handlePaymentFailure(session.id)
                break;
            }
        }
        NextResponse.json({received:true})
        
      } catch (error) {
        console.error('Webhook error:', error);
        // NextResponse.json(400).send(`Webhook Error: ${error.message}`);
        
      }
}