export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { getLoggedInUser } from '@/actions/action.user';
import { AdminOrdersPage } from '@/components/AdminOrders';

export default async function AdminOrdersRoute() {
  const user = await getLoggedInUser();
  
  if (!user || user.role !== 'ADMIN') {
  return  redirect('/');
  }

  return <AdminOrdersPage/>;
}
