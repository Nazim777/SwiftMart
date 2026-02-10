"use client";
import React, { useState, useEffect, useContext } from "react";
import { ShoppingCart, Search, Menu, X, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductContext } from "@/components/providers/Product.Context";
import Link from "next/link";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import UserDropdown from "@/features/user/components/UserDropdown";
import { usePathname, useRouter } from "next/navigation";
import { syncUser } from "@/features/user/actions/action.user";
export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartItems } = useContext(ProductContext);
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const { user } = useUser();
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const router = useRouter();

  useEffect(() => {
    if (user) {
      syncUser();
    }
  }, [user]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isLanding
          ? isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm py-4"
            : "bg-transparent py-6"
          : "bg-white shadow text-gray-900 py-3"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center transform rotate-3">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span
            className={`text-2xl font-extrabold tracking-tight ${
              isLanding && !isScrolled ? "text-white" : "text-gray-900"
            }`}
          >
            SwiftMart
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            className={`p-2 rounded-full hover:bg-black/5 transition ${
              isLanding && !isScrolled ? "text-white" : "text-gray-700"
            }`}
          >
            <Search size={20} />
          </button>
          <button
            className={`p-2 rounded-full hover:bg-black/5 transition relative ${
              isLanding && !isScrolled ? "text-white" : "text-gray-700"
            }`}
          >
            {!user ? (
              <>
                {" "}
                <ShoppingCart size={20} />
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  0
                </span>
              </>
            ) : (
              <>
                <Link href="/cart" className="relative">
                  <ShoppingCart size={20} />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {cartItems?.length}
                  </span>
                </Link>
              </>
            )}
          </button>
          <button
            className={`hidden md:block px-5 py-2 rounded-full font-semibold text-sm transition ${
              isLanding && !isScrolled
                ? "bg-white text-blue-900 hover:bg-blue-50"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {!user ? <SignInButton mode="modal" /> : <UserDropdown />}
          </button>
          <button
            className={`md:hidden p-2 rounded-lg ${
              isScrolled ? "text-gray-900" : "text-white"
            }`}
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-50 flex flex-col p-6 md:hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-2xl font-bold text-blue-900">
                SwiftMart
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              <hr className="border-gray-100" />
              {!user ? (
                <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200">
                  <SignUpButton mode="modal">Sign In / Sign Up</SignUpButton>
                </button>
              ) : (
                <UserDropdown />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// "use client";
// import React, { useState, useEffect, useContext } from "react";
// import { ShoppingCart, Search, Menu, X } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { usePathname, useRouter } from "next/navigation";
// import { ProductContext } from "@/components/providers/Product.Context";
// import Link from "next/link";
// import { SignInButton, useUser } from "@clerk/nextjs";
// import UserDropdown from "@/features/user/components/UserDropdown";

// export const Navbar: React.FC = () => {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const pathname = usePathname();   // detect current route
//   const isLanding = pathname === "/"; // check if landing page

//   const router = useRouter();
//   const { cartItems } = useContext(ProductContext);
//   const { user } = useUser();

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <nav
//       className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300
//       ${isLanding
//         ? (isScrolled ? "bg-white text-gray-900" : "bg-transparent text-white")
//         : "bg-white shadow text-gray-900"}
//       `}
//     >
//       <div className="container mx-auto px-6 py-4 flex justify-between items-center">

//         {/* Logo */}
//         <div onClick={() => router.push("/")} className="flex items-center gap-2 cursor-pointer">
//           <div className={`w-8 h-8 rounded-lg flex items-center justify-center
//               ${isLanding && !isScrolled ? "bg-white text-blue-600" : "bg-blue-600 text-white"}`}>
//             <span className="font-bold text-lg">S</span>
//           </div>

//           <span className="text-2xl font-extrabold tracking-tight">SwiftMart</span>
//         </div>

//         {/* Icons */}
//         <div className="flex items-center gap-4">

//           <button className="p-2 rounded-full hover:bg-black/5 transition">
//             <Search size={20} />
//           </button>

//           {!user ? (
//             <button className="relative p-2">
//               <ShoppingCart size={20} />
//               <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">0</span>
//             </button>
//           ) : (
//             <Link href="/cart" className="relative p-2">
//               <ShoppingCart size={20} />
//               <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
//                 {cartItems?.length || 0}
//               </span>
//             </Link>
//           )}

//           <div>
//             {!user ? <SignInButton mode="modal" /> : <UserDropdown />}
//           </div>

//         </div>
//       </div>
//     </nav>
//   );
// };
