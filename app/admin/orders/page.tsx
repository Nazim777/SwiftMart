export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { getLoggedInUser } from '@/actions/action.user';
import { getOrders } from '@/actions/order.action';
import { AdminOrdersPage } from '@/components/AdminOrders';

export default async function AdminOrdersRoute() {
  const user = await getLoggedInUser();
  
  if (!user || user.role !== 'ADMIN') {
    redirect('/');
  }

  const orders = await getOrders();

  return <AdminOrdersPage initialOrders={orders} />;
}
