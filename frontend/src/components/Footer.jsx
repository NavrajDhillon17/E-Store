import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Store, ArrowRight, ShieldCheck, Truck, RefreshCw, Headphones } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    addToast("Thanks for subscribing to Haven Tech Insider!", "success");
    setEmail("");
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400">
      {/* Value Propositions Strip */}
      <div className="border-b border-slate-800/60 py-10 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Free Express Shipping</h4>
                <p className="text-xs text-slate-400 mt-0.5">Complimentary on orders over $150</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">2-Year Warranty</h4>
                <p className="text-xs text-slate-400 mt-0.5">Official manufacturer guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">30-Day Hassle-Free Returns</h4>
                <p className="text-xs text-slate-400 mt-0.5">Money back with zero questions asked</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">24/7 Expert Support</h4>
                <p className="text-xs text-slate-400 mt-0.5">Live chat with tech specialists</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Store className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Haven<span className="text-blue-500">Tech</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm">
              The premier destination for cutting-edge electronics, flagship smartphones, pro workstations, and audiophile gear.
            </p>

            <form onSubmit={handleSubscribe} className="pt-2">
              <span className="block text-xs font-semibold text-slate-300 mb-2">Subscribe for product drops & 15% off</span>
              <div className="flex max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-200 px-4 py-2.5 rounded-l-xl focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-r-xl transition flex items-center justify-center shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Shop Hardware</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/category/smartphones" className="hover:text-blue-400 transition">Smartphones & Tablets</Link></li>
              <li><Link to="/category/laptops" className="hover:text-blue-400 transition">Laptops & Workstations</Link></li>
              <li><Link to="/category/audio" className="hover:text-blue-400 transition">Audio & Sound</Link></li>
              <li><Link to="/category/wearables" className="hover:text-blue-400 transition">Smartwatches</Link></li>
              <li><Link to="/category/accessories" className="hover:text-blue-400 transition">Keyboards & Monitors</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/cart" className="hover:text-blue-400 transition">Order Tracking</Link></li>
              <li><a href="#shipping" className="hover:text-blue-400 transition">Shipping Policies</a></li>
              <li><a href="#returns" className="hover:text-blue-400 transition">Returns & Exchanges</a></li>
              <li><a href="#warranty" className="hover:text-blue-400 transition">Warranty Claims</a></li>
              <li><a href="#help" className="hover:text-blue-400 transition">Help Center</a></li>
            </ul>
          </div>

          {/* Account & Admin */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Portal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/login" className="hover:text-blue-400 transition">Customer Sign In</Link></li>
              <li><Link to="/register" className="hover:text-blue-400 transition">Create Account</Link></li>
              <li><Link to="/admin" className="hover:text-blue-400 transition">Admin Dashboard</Link></li>
              <li><a href="#security" className="hover:text-blue-400 transition">Privacy & Security</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
          <p>© {new Date().getFullYear()} Haven Tech Inc. All rights reserved. Built with MERN Stack & Tailwind CSS.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-500">Fast & Secure Payments</span>
            <span className="text-slate-400 font-semibold">Apple Pay</span>
            <span className="text-slate-400 font-semibold">Visa</span>
            <span className="text-slate-400 font-semibold">Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
