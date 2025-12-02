'use client'
import React from 'react';

export const Newsletter: React.FC = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-5xl bg-blue-600 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-blue-600/30">
        
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Stay in the Loop</h2>
            <p className="text-blue-100 mb-10 max-w-2xl mx-auto text-lg">
                Subscribe to our newsletter to get exclusive deals, new arrival alerts, and styling tips directly to your inbox.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="px-6 py-4 rounded-full flex-1 outline-none text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-blue-400/50 transition"
                />
                <button className="px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-black transition shadow-lg">
                    Subscribe
                </button>
            </form>
            
            <p className="text-blue-200 text-sm mt-6">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  );
};