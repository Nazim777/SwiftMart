'use client'
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center transform rotate-3">
                        <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                        SwiftMart
                    </span>
                </div>
                <p className="text-gray-500 leading-relaxed">
                    Your one-stop shop for premium products. We blend quality with convenience to bring you the best online shopping experience.
                </p>
                <div className="flex gap-4">
                    {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                        <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors">
                            <Icon size={18} />
                        </a>
                    ))}
                </div>
            </div>

            {/* Links Columns */}
            {[
                { title: "Shop", links: ["All Products", "New Arrivals", "Best Sellers", "Sale"] },
                { title: "Company", links: ["About Us", "Careers", "Press", "Blog"] },
                { title: "Support", links: ["Help Center", "Returns", "Shipping Info", "Contact"] },
            ].map((col, idx) => (
                <div key={idx}>
                    <h4 className="font-bold text-gray-900 mb-6">{col.title}</h4>
                    <ul className="space-y-4">
                        {col.links.map((link) => (
                            <li key={link}>
                                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">{link}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; 2024 SwiftMart Inc. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-gray-900">Privacy Policy</a>
                <a href="#" className="hover:text-gray-900">Terms of Service</a>
                <a href="#" className="hover:text-gray-900">Cookie Policy</a>
            </div>
        </div>
      </div>
    </footer>
  );
};
