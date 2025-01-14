export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { getUsers } from '@/actions/action.user';
import AdminUsersPage from '@/components/AdminUsersPage';
import { getLoggedInUser } from '@/actions/action.user';

export default async function AdminUsersRoute() {
  const user = await getLoggedInUser();
  
  if (!user || user.role !== 'ADMIN') {
    redirect('/');
  }

  const users = await getUsers();

  return <AdminUsersPage initialUsers={users} />;
}
