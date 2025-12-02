import { getLoggedInUser } from '@/actions/action.user';
export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import AdminProductPage from '@/components/ui/AdminProductPage'
import React from 'react'

const page = async() => {
  const user = await getLoggedInUser();
    
    if (!user || user.role !== 'ADMIN') {
      return  redirect('/');
    }
  return <AdminProductPage/>
}

export default page
