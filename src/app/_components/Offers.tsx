'use client'
import React from 'react';
import { motion } from 'framer-motion';

export const Offers: React.FC = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="relative h-80 rounded-3xl overflow-hidden group"
                    >
                        <img src="https://picsum.photos/800/600?random=50" alt="Spring Sale" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-transparent flex flex-col justify-center p-12">
                            <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">LIMITED TIME</span>
                            <h3 className="text-3xl font-bold text-white mb-2">Spring Sale</h3>
                            <p className="text-blue-100 mb-6">Get 20% off on all new arrivals.</p>
                            <button className="w-fit px-6 py-3 bg-white text-blue-900 font-bold rounded-xl hover:bg-gray-100 transition">Shop Sale</button>
                        </div>
                    </motion.div>

                    <div className="grid gap-8">
                         <motion.div 
                             whileHover={{ scale: 1.02 }}
                             className="relative h-[150px] rounded-3xl overflow-hidden bg-purple-600 flex items-center justify-between p-8"
                         >
                            <div className="z-10">
                                <h3 className="text-2xl font-bold text-white">Bundle Deal</h3>
                                <p className="text-purple-100 text-sm">Buy 1 Get 1 Free on Select Items</p>
                            </div>
                            <div className="w-32 h-32 bg-white/20 rounded-full absolute -right-10 -bottom-10 blur-2xl"></div>
                            <button className="z-10 bg-purple-800 text-white px-5 py-2 rounded-lg font-semibold hover:bg-purple-900 transition">View</button>
                         </motion.div>

                         <motion.div 
                             whileHover={{ scale: 1.02 }}
                             className="relative h-[150px] rounded-3xl overflow-hidden bg-gray-900 flex items-center justify-between p-8"
                         >
                            <div className="z-10">
                                <h3 className="text-2xl font-bold text-white">Free Shipping</h3>
                                <p className="text-gray-400 text-sm">On all electronics over $500</p>
                            </div>
                            <div className="w-32 h-32 bg-blue-500/20 rounded-full absolute -right-10 -top-10 blur-2xl"></div>
                            <button className="z-10 bg-gray-700 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-600 transition">Details</button>
                         </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
