
export const dynamic = 'force-dynamic';
import { getLoggedInUser } from "@/actions/action.user";
import {  getAllOrdersForUser } from "@/actions/order.action";
import { OrderHistoryPage } from "@/components/OrderHistoryPage";
import { redirect } from "next/navigation";


export default async function OrdersPage() {
  const user = await getLoggedInUser();
  
  if (!user) {
    redirect('/');
  }

 
const { data: orders } = await getAllOrdersForUser(user.id);
 

  return <OrderHistoryPage orders={orders} />;
}