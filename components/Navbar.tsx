'use client';

import Link from 'next/link';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { ModeToggle } from './MoodToggler';
import { useEffect, useState } from 'react';
import { getLoggedInUser, syncUser } from '@/actions/action.user';
import { User } from './AvatarDisplay';

export default function Navbar() {
  const { user } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [loggedInUser,setLoggedInUser] = useState<User | null | undefined>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  useEffect(()=>{
  if(user){
    syncUser()
    
      const fetchUser = async()=>{
        try {
          const response = await getLoggedInUser()
          setLoggedInUser(response)
        } catch (error) {
          console.log('error fetching user',error)
          
        }
      }
      fetchUser()
  }
  },[user])

  
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white dark:bg-gray-900 shadow-md' : 'bg-transparent'
      }`}
    >
      <nav className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold">
              SwiftMart
            </Link>
            {loggedInUser?.role==='ADMIN'&&<Link href="/admin" className="text-sm text-gray-600 hover:text-black dark:hover:text-white">
             Admin
            </Link>}
            <Link href="/products" className="text-sm text-gray-600 hover:text-black dark:hover:text-white">
              Products
            </Link>
            
            {user && (
              <>
                <Link href="/cart" className="text-sm text-gray-600 hover:text-black dark:hover:text-white">
                  Cart
                </Link>
                <Link href="/orders" className="text-sm text-gray-600 hover:text-black dark:hover:text-white">
                  Orders
                </Link>
                <Link href="/profile" className="text-sm text-gray-600 hover:text-black dark:hover:text-white">
                  Profile
                </Link>
              </>
            )}

            <Link
              href="https://github.com/Nazim777"
              className="text-sm text-gray-600 hover:text-black dark:hover:text-white"
            >
              GitHub
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ModeToggle />
            {!user ? (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Sign Up</Button>
                </SignUpButton>
              </>
            ) : (
              <UserButton afterSignOutUrl="/" />
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
