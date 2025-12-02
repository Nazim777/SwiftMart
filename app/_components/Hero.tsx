"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export const Hero: React.FC = () => {
  const router = useRouter();
  const [showAdminModal,setShowAdminModal] = useState(false);
  useEffect(()=>{
  const handler = setTimeout(()=>setShowAdminModal(true),1000);
  return () =>clearTimeout(handler);
  },[])
  return (
      <div className="relative w-full min-h-[90vh] flex items-center overflow-hidden bg-blue-600">
    <div className="relative w-full min-h-[90vh] flex items-center overflow-hidden bg-blue-600">
      {/* Background Gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-400/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/30 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-purple-500/20 rounded-full blur-[80px]" />
        {/* Mesh Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-900 opacity-90 mix-blend-multiply" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-block px-4 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full">
              <span className="text-blue-100 font-medium text-sm tracking-wide">
                NEW SUMMER COLLECTION 2025
              </span>
            </div>
           

            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
              Upgrade Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                Lifestyle Today.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100 max-w-xl leading-relaxed">
              Discover the latest tech, fashion trends, and premium accessories
              at unbeatable prices. Fast shipping worldwide.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                onClick={() => router.push("/products")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-blue-700 rounded-full font-bold text-lg shadow-xl shadow-blue-900/20 flex items-center gap-2"
              >
                Shop Now <ArrowRight size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/10 transition"
              >
                View Catalog
              </motion.button>
            </div>

            <div className="pt-8 flex items-center gap-8 text-blue-200/60">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-blue-600 bg-gray-300 overflow-hidden"
                  >
                    <img
                      src={`https://picsum.photos/100/100?random=${i + 20}`}
                      alt="user"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm font-medium text-blue-600">
                <span className="text-blue-600 font-bold block">15k+</span>{" "}
                Happy Customers
              </div>
            </div>
          </motion.div>

          {/* Hero Image / Visuals */}
          <div className="relative hidden lg:block h-[600px]">
            {/* Main Product Image (Abstract Composition) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative w-full h-full">
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-20, 20, -20] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-10 right-10 w-64 h-80 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-4 transform rotate-6 z-20"
                >
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D"
                    alt="Fashion"
                    className="w-full h-full object-cover rounded-2xl opacity-90"
                  />
                </motion.div>

                <motion.div
                  animate={{ y: [15, -15, 15] }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute bottom-20 left-10 w-72 h-64 bg-white rounded-3xl shadow-2xl overflow-hidden z-30 flex items-center justify-center p-6 transform -rotate-3"
                >
                  <img
                    src="https://cdn.prod.website-files.com/622488277ab5ee818d179d9f/6851ef68b64528a9ee3e9af3_6633f57bd5f74992577ce526_pasted_image_0-5.webp"
                    alt="Tech"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur p-3 rounded-xl shadow-sm">
                    <p className="font-bold text-gray-900">Modern Tech</p>
                    <p className="text-xs text-gray-500">$999.00</p>
                  </div>
                </motion.div>

                {/* Decorative Circle */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/10 rounded-full z-0"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="absolute top-0 left-1/2 w-4 h-4 bg-white/50 rounded-full blur-[2px]" />
                  <div className="absolute bottom-0 left-1/2 w-8 h-8 bg-blue-300/30 rounded-full blur-[4px]" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Wave Separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="fill-white"
        >
          <path
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,117.3C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>


{showAdminModal && ( 
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-xl p-6 w-80 max-w-sm text-center relative shadow-lg">
            <h2 className="text-lg font-bold mb-4">Admin Access</h2>
            <p className="mb-2">
              <span className="font-semibold">Email:</span> <span className="font-mono">admin@gmail.com</span>
            </p>
            <p className="mb-4">
              <span className="font-semibold">Password:</span> <span className="font-mono">12345678</span>
            </p>
            <button
              onClick={() => setShowAdminModal(false)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
