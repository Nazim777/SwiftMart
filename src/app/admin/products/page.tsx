import { getLoggedInUser } from "@/features/user/actions/action.user";
export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import AdminProductPage from "@/features/admin/components/AdminProductPage"
import React from 'react'

const page = async() => {
  const user = await getLoggedInUser();
    
    if (!user || user.role !== 'ADMIN') {
      return  redirect('/');
    }
  return <AdminProductPage/>
}

export default page
