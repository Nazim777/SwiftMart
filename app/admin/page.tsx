'use client'
import { useAdminGuard } from '@/custom-hooks/UseAdminGuard'
const page = () => {
  const {isLoading,loggedInUser} = useAdminGuard()
  if(isLoading){
    return <h1>Loading....</h1>
  }
  return (
    <div>
        <h4>Admin Dashboard , Welcome Admin</h4>
    </div>
  )
}

export default page
