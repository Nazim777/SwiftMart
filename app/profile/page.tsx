import { getLoggedInUser } from '@/actions/action.user'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileForm from "@/components/ProfileForm";
import AvatarDisplay from "@/components/AvatarDisplay";
const page =  async() => {
    const user = await getLoggedInUser()
   
    
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900  mt-20">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center">
            <AvatarDisplay user={user} />
          </div>
          <ProfileForm user={user} />
        </CardContent>
      </Card>
    </div>
  )
}

export default page
