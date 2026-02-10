export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import AdminUsersPage from "@/features/admin/components/AdminUsersPage";
import { getLoggedInUser } from "@/features/user/actions/action.user";

export default async function AdminUsersRoute() {
  const user = await getLoggedInUser();

  if (!user || user.role !== 'ADMIN') {
    return redirect('/');
  }

  return <AdminUsersPage />;
}
