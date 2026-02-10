'use client'
import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const reviews = [
    { name: "Sarah Jenkins", role: "Fashion Blogger", text: "SwiftMart has completely transformed how I shop online. The quality is unmatched and delivery is insanely fast!", rating: 5, avatar: "10" },
    { name: "Mike Chen", role: "Tech Enthusiast", text: "Got my new laptop here. Best price on the market and the customer support helped me pick the right specs.", rating: 5, avatar: "11" },
    { name: "Jessica Alverez", role: "Verified Buyer", text: "Love the variety of products. The return policy gives me peace of mind when trying new brands.", rating: 4, avatar: "12" },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-600 rounded-full blur-[120px] opacity-20"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-blue-400 font-bold tracking-widest text-sm uppercase">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2">Trusted by Thousands</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
                <motion.div 
                    key={idx}
                    whileHover={{ y: -5 }}
                    className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 p-8 rounded-3xl"
                >
                    <div className="flex gap-1 text-yellow-400 mb-6">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-600"} />
                        ))}
                    </div>
                    <p className="text-gray-300 text-lg mb-8 leading-relaxed">"{review.text}"</p>
                    <div className="flex items-center gap-4">
                        <img src={`https://picsum.photos/100/100?random=${review.avatar}`} alt={review.name} className="w-12 h-12 rounded-full border-2 border-blue-500" />
                        <div>
                            <h4 className="font-bold">{review.name}</h4>
                            <p className="text-xs text-gray-400">{review.role}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};
