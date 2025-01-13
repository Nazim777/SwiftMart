import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'; // Assuming you have this Button component
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { SignOutButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { getLoggedInUser } from "@/actions/action.user";
import { User } from "./AvatarDisplay";
export default function UserDropdown() {
  const { user } = useUser();  // From Clerk
  const [isOpen, setIsOpen] = useState(false);  // Dropdown open state
  const router = useRouter();
 const [loggedInUser,setLoggeInUser] = useState<undefined | null | User>()
 const fetchLoggedInUser = async ()=>{
  try {
    const response = await getLoggedInUser()
    setLoggeInUser(response)
  } catch (error) {
    
  }
 }
 useEffect(()=>{
  fetchLoggedInUser()
 },[])
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold shadow-md">
          {user?.firstName?.charAt(0)?.toUpperCase() || 'User'}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="bg-white dark:bg-gray-900 shadow-lg rounded-md p-2 mt-2 w-48 ">
        <DropdownMenuItem onClick={() => router.push('/profile')} className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer">
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/orders')} className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer">
          Orders
        </DropdownMenuItem>
        {
          loggedInUser?.role==='ADMIN'&&<DropdownMenuItem onClick={() => router.push('/admin')} className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer">
          Admin
        </DropdownMenuItem>
        }

        {/* Sign Out Button using Clerk's SignOutButton component */}
        <DropdownMenuItem className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
          <SignOutButton>
            Sign out
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
