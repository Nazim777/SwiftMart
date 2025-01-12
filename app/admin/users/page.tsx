'use client'
import { useAdminGuard } from '@/custom-hooks/UseAdminGuard'
import React from 'react'

const page = () => {
  // admin guard(admin accessible only)
    const {} = useAdminGuard()
      


  return (
    <div>
        <h3>Users page</h3>
      
    </div>
  )
}

export default page
