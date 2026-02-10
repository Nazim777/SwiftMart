'use client'
import React from 'react';
import { Truck, ShieldCheck, Clock, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Truck size={32} />,
    title: "Fast Shipping",
    desc: "Free delivery for all orders over $150. Track your package in real-time."
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Secure Payment",
    desc: "100% secure payment with 256-bit encryption for safe transactions."
  },
  {
    icon: <Clock size={32} />,
    title: "24/7 Support",
    desc: "Dedicated support team available around the clock to assist you."
  },
  {
    icon: <RefreshCcw size={32} />,
    title: "Money Back",
    desc: "30-day money-back guarantee if you are not satisfied with the product."
  }
];

export const Features: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Shop SwiftMart?</h2>
             <p className="text-gray-500 mt-4">We prioritize your experience above everything else.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-blue-50/50 hover:bg-blue-50 transition-colors text-center border border-transparent hover:border-blue-100 group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center mx-auto mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
