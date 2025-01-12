'use client'
import { useAdminGuard } from '@/custom-hooks/UseAdminGuard'
import React from 'react'

const page = () => {
  // admin guard(admin accessible only)
    const {} = useAdminGuard()
      
  return (
    <div>
        <h4>orders page</h4>
      
    </div>
  )
}

export default page
