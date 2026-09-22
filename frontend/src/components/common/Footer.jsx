import React from 'react';
import { ShoppingBag, Heart, Shield, Truck, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950/80 text-slate-400 text-sm backdrop-blur-md">
      {/* Feature Value Props */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-slate-800/60">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 p-3 glass-card rounded-2xl">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Fast Shipping</h4>
              <p className="text-xs text-slate-400">Dispatched within 24 hrs</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3 p-3 glass-card rounded-2xl">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Secure Payment</h4>
              <p className="text-xs text-slate-400">JWT & Simulated Gateways</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3 p-3 glass-card rounded-2xl">
            <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Easy Returns</h4>
              <p className="text-xs text-slate-400">Hassle-free cancellation</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3 p-3 glass-card rounded-2xl">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Live Inventory</h4>
              <p className="text-xs text-slate-400">Real-time stock reservation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              Shop<span className="gradient-text">Verse</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            A production-ready full stack e-commerce platform built with Spring Boot, Spring Security, JWT, PostgreSQL, and React.js.
          </p>
        </div>

        <div>
          <h5 className="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">Quick Links</h5>
          <ul className="space-y-2 text-xs">
            <li><Link to="/products" className="hover:text-indigo-400 transition-colors">Browse Products</Link></li>
            <li><Link to="/cart" className="hover:text-indigo-400 transition-colors">Shopping Cart</Link></li>
            <li><Link to="/orders" className="hover:text-indigo-400 transition-colors">Order Tracking</Link></li>
            <li><Link to="/addresses" className="hover:text-indigo-400 transition-colors">Delivery Addresses</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">Categories</h5>
          <ul className="space-y-2 text-xs">
            <li><Link to="/products?category=Electronics" className="hover:text-indigo-400 transition-colors">Electronics</Link></li>
            <li><Link to="/products?category=Fashion" className="hover:text-indigo-400 transition-colors">Fashion & Apparel</Link></li>
            <li><Link to="/products?category=Home" className="hover:text-indigo-400 transition-colors">Home & Living</Link></li>
            <li><Link to="/products?category=Books" className="hover:text-indigo-400 transition-colors">Books & Media</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">Technology Stack</h5>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-indigo-300">Spring Boot 3.4</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-cyan-300">React 19</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-pink-300">JWT Auth</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-emerald-300">PostgreSQL</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-amber-300">Axios</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} ShopVerse E-Commerce. All rights reserved.</p>
        <p className="flex items-center gap-1 mt-2 sm:mt-0">
          Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Java & React Full Stack
        </p>
      </div>
    </footer>
  );
};

export default Footer;
