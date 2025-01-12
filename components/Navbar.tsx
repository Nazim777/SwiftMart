'use client';

import Link from 'next/link';
import { SignInButton, SignUpButton,  useUser, } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { ModeToggle } from './MoodToggler';
import { useContext, useEffect, useState } from 'react';
import {  syncUser } from '@/actions/action.user';
import { ShoppingCart } from 'lucide-react';
import { ProductContext } from '@/context/Product.Context';
import UserDropdown from './UserDropdown';

export default function Navbar() {
  const { user } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const {cartItems} = useContext(ProductContext)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      syncUser();
    }
  }, [user]);

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
            <Link href="/products" className="text-sm text-gray-600 hover:text-black dark:hover:text-white">
              Products
            </Link>

            <Link
              href="https://github.com/Nazim777"
              className="text-sm text-gray-600 hover:text-black dark:hover:text-white"
            >
              GitHub
            </Link>
          </div>

          <div className="flex items-center gap-4">
            
            {user&&<Link href="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>}
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
              <UserDropdown/>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}


// import Link from 'next/link';
// import { SignInButton, SignUpButton, UserButton, useUser, SignOutButton } from '@clerk/nextjs';
// import { Button } from '@/components/ui/button';
// import { ModeToggle } from './MoodToggler';
// import { useEffect, useState, useContext } from 'react';
// import { getLoggedInUser, syncUser } from '@/actions/action.user';
// import { User } from './AvatarDisplay';
// import { ShoppingCart } from 'lucide-react'; // Cart icon
// import { ProductContext } from '@/context/Product.Context';
// import { useRouter } from 'next/navigation';
// import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';  // ShadCN UI dropdown

// export default function Navbar() {
//   const { user } = useUser();
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [loggedInUser, setLoggedInUser] = useState<User | null | undefined>(null);
//   const { cartItems } = useContext(ProductContext);
//   const router = useRouter();

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     if (user) {
//       syncUser();
//       const fetchUser = async () => {
//         try {
//           const response = await getLoggedInUser();
//           setLoggedInUser(response);
//         } catch (error) {
//           console.log('error fetching user', error);
//         }
//       };
//       fetchUser();
//     }
//   }, [user]);

//   return (
//     <header
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         isScrolled ? 'bg-white dark:bg-gray-900 shadow-md' : 'bg-transparent'
//       }`}
//     >
//       <nav className="border-b">
//         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-6">
//             <Link href="/" className="text-xl font-bold">
//               SwiftMart
//             </Link>
//             {loggedInUser?.role === 'ADMIN' && (
//               <Link href="/admin" className="text-sm text-gray-600 hover:text-black dark:hover:text-white">
//                 Admin
//               </Link>
//             )}
//             <Link href="/products" className="text-sm text-gray-600 hover:text-black dark:hover:text-white">
//               Products
//             </Link>

//             {user && (
//               <>
//                 <Link href="/orders" className="text-sm text-gray-600 hover:text-black dark:hover:text-white">
//                   Orders
//                 </Link>
//               </>
//             )}

//             <Link href="https://github.com/Nazim777" className="text-sm text-gray-600 hover:text-black dark:hover:text-white">
//               GitHub
//             </Link>
//           </div>

//           <div className="flex items-center gap-4">
//             {/* Cart Icon */}
//             <Link href="/cart" className="relative">
//               <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white" />
//               {cartItems.length > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
//                   {cartItems.length}
//                 </span>
//               )}
//             </Link>
//             <ModeToggle />

//             {/* User Authentication and Dropdown */}
//             {!user ? (
//               <>
//                 <SignInButton mode="modal">
//                   <Button variant="ghost">Sign In</Button>
//                 </SignInButton>
//                 <SignUpButton mode="modal">
//                   <Button>Sign Up</Button>
//                 </SignUpButton>
//               </>
//             ) : (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" className="text-sm text-gray-600 dark:text-gray-300">
//                     {loggedInUser?.name || 'User'}
//                   </Button>
//                 </DropdownMenuTrigger>

//                 <DropdownMenuContent className="bg-white dark:bg-gray-900 shadow-lg rounded-md p-2 mt-2 w-48">
//                   <DropdownMenuItem onClick={() => router.push('/profile')} className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
//                     Profile
//                   </DropdownMenuItem>

//                   {/* Sign Out Button */}
//                   <DropdownMenuItem className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
//                     <SignOutButton>
//                       {/* {({ isLoading }) => (
//                         <Button variant="ghost" className="w-full">
//                           {isLoading ? 'Signing out...' : 'Logout'}
//                         </Button>
//                       )} */}
//                     </SignOutButton>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// }
