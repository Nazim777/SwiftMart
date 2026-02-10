'use client'
export const dynamic = 'force-dynamic';
import { getLoggedInUser } from "@/features/user/actions/action.user";
import {  getAllOrdersForUser } from "@/features/orders/actions/order.action";
import Orders from "@/features/orders/components/OrderHistoryPage";
//import { OrderHistoryPage } from "@/features/orders/components/OrderHistoryPage";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomError from "../_components/CustomError";
import DashboardLoader from "@/components/ui/DashboardLoader";



export default  function OrdersPage() {
   const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState<string | null>(null)
  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      setError(null)
      try {
        const user = await getLoggedInUser();
        if (!user) return redirect("/");

        const { data } = await getAllOrdersForUser(user.id);
        setOrders(data);
      } catch (err) {
        toast.error("Failed to load orders");
        console.log(err);
        setError('Failed to load orders. Pleae try again later!')
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if(error){
    return <CustomError error = {error}/>
  }

  if (loading) return <DashboardLoader loading="Loading Orders..."/>
 

  return <Orders orders={orders} />;
}
