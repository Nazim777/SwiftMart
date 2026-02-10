export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import AdminDashboard from "@/features/admin/components/AdminDashboard";
import { getLoggedInUser } from "@/features/user/actions/action.user";

export default async function AdminDashboardRoute() {
  const user = await getLoggedInUser();

  if (!user || user.role !== "ADMIN") {
   return redirect("/");
  }


  return <AdminDashboard/>;
}
