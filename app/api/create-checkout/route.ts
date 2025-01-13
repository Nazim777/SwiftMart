import { CreateOrderAndPayment } from "@/actions/order.action";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req:NextRequest){
    try {
        const body = await req.json()
        console.log('body',body)
        const result = await CreateOrderAndPayment(body)
        return NextResponse.json(result,{status:200})
    } catch (error) {
        console.error('Error creating checkout:', error);
    return NextResponse.json({ message: 'Error creating checkout' }, { status: 500 });
        
    }

}
