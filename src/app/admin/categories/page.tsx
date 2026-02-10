import { getLoggedInUser } from "@/features/user/actions/action.user";
export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import React from 'react'
import AdminCategoriesPage from "@/features/admin/components/AdminCategoryPage";

const page = async() => {
  const user = await getLoggedInUser();
    
    if (!user || user.role !== 'ADMIN') {
      return  redirect('/');
    }
  return <AdminCategoriesPage/>
}

export default page
