export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import AdminUsersPage from '@/components/AdminUsersPage';
import { getLoggedInUser } from '@/actions/action.user';

export default async function AdminUsersRoute() {
  const user = await getLoggedInUser();
  
  if (!user || user.role !== 'ADMIN') {
    return  redirect('/');
  }

  return <AdminUsersPage/>;
}
