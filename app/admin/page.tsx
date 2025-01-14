export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { getDashboardStats } from '@/actions/action.analytics';
import AdminDashboard from '@/components/AdminDashboard';
import { getLoggedInUser } from '@/actions/action.user';

export default async function AdminDashboardRoute() {
  const user = await getLoggedInUser();
  
  if (!user || user.role !== 'ADMIN') {
    redirect('/');
  }

  const stats = await getDashboardStats();

  return <AdminDashboard initialStats={stats} />;
}
