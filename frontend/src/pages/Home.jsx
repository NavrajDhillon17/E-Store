import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  ShoppingBag,
  Zap,
  Flame,
  ShieldCheck,
  Cpu,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Keyboard
} from "lucide-react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import ProductQuickView from "../components/ProductQuickView";
import { useCart } from "../context/CartContext";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await api.get("/products");
        setFeaturedProducts(res.data);
      } catch (err) {
        console.error("Failed to load featured products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const categories = [
    {
      id: "smartphones",
      name: "Smartphones",
      desc: "iPhone, Galaxy & Pixel",
      icon: Smartphone,
      color: "from-blue-600 to-cyan-500",
    },
    {
      id: "laptops",
      name: "Laptops & PCs",
      desc: "MacBook, XPS & ROG",
      icon: Laptop,
      color: "from-indigo-600 to-purple-500",
    },
    {
      id: "audio",
      name: "Audio & Sound",
      desc: "Sony, AirPods & Bose",
      icon: Headphones,
      color: "from-rose-600 to-amber-500",
    },
    {
      id: "wearables",
      name: "Wearables",
      desc: "Ultra 2, Watch 7 & Garmin",
      icon: Watch,
      color: "from-emerald-600 to-teal-500",
    },
    {
      id: "accessories",
      name: "Gaming & Gear",
      desc: "Keychron, 4K Monitors & MX",
      icon: Keyboard,
      color: "from-violet-600 to-pink-500",
    },
  ];

  const heroItem = featuredProducts.find((p) => p.title.includes("iPhone 16 Pro Max")) || featuredProducts[0];
  const spotlightItem = featuredProducts.find((p) => p.title.includes("MacBook Pro 16")) || featuredProducts[1];
  const audioItem = featuredProducts.find((p) => p.title.includes("Sony WH-1000XM5")) || featuredProducts[2];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                PREMIUM HARDWARE & ELECTRONICS
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
                Engineered for <br className="hidden sm:inline" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
                  Peak Performance.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Discover flagship smartphones, M4 workstations, audiophile headphones, and pro accessories from the world’s leading tech innovators.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/shop"
                  className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 transition active:scale-95 flex items-center gap-2"
                >
                  Explore Catalog
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => heroItem && setQuickViewProduct(heroItem)}
                  className="px-7 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-sm transition"
                >
                  View Featured Flagship
                </button>
              </div>

              {/* Highlights pills */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>100% Genuine Tech</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Instant 2-Day Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-400" />
                  <span>Exclusive Promo Deals</span>
                </div>
              </div>
            </div>

            {/* Right Hero Showcase Card */}
            {heroItem && (
              <div className="lg:col-span-5">
                <div
                  onClick={() => setQuickViewProduct(heroItem)}
                  className="relative group rounded-3xl p-6 bg-gradient-to-b from-slate-800/80 to-slate-900/80 border border-slate-700/70 shadow-2xl backdrop-blur-xl hover:border-blue-500/50 transition duration-300 cursor-pointer"
                >
                  <div className="relative h-80 rounded-2xl overflow-hidden bg-slate-950 p-4 flex items-center justify-center">
                    <img
                      src={heroItem.image}
                      alt={heroItem.title}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-600 text-white shadow-lg">
                      {heroItem.tag || "Flagship Choice"}
                    </span>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                        {heroItem.brand}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1 group-hover:text-blue-400 transition">
                        {heroItem.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {heroItem.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-white">
                        ${heroItem.price.toLocaleString()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(heroItem);
                        }}
                        className="mt-2 w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Category Quick Navigator */}
      <section className="py-14 border-y border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Browse By Category</h2>
              <p className="text-xs text-slate-400 mt-1">Curated collections of premium hardware</p>
            </div>
            <Link
              to="/shop"
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
            >
              See All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="group relative flex flex-col p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">{cat.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Handpicked Innovations
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-1">Trending Tech Releases</h2>
            </div>
            <Link
              to="/shop"
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5"
            >
              Explore All Devices ({featuredProducts.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-96 rounded-3xl bg-slate-900/50 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Spotlight Dual Banner */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Spotlight 1: MacBook Pro */}
            {spotlightItem && (
              <div
                onClick={() => setQuickViewProduct(spotlightItem)}
                className="relative rounded-3xl p-8 bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 overflow-hidden group hover:border-indigo-500/40 transition cursor-pointer flex flex-col justify-between h-[420px]"
              >
                <div className="relative z-10 max-w-sm">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Pro Computing
                  </span>
                  <h3 className="text-3xl font-extrabold text-white mt-3">
                    {spotlightItem.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                    {spotlightItem.description}
                  </p>
                  <div className="mt-4 text-2xl font-extrabold text-white">
                    From ${spotlightItem.price.toLocaleString()}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(spotlightItem);
                    }}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition"
                  >
                    Add to Bag
                  </button>
                </div>
                <img
                  src={spotlightItem.image}
                  alt={spotlightItem.title}
                  className="absolute -right-10 -bottom-10 w-72 h-72 object-cover rounded-2xl group-hover:scale-105 transition duration-500 opacity-80"
                />
              </div>
            )}

            {/* Spotlight 2: Audiophile Sound */}
            {audioItem && (
              <div
                onClick={() => setQuickViewProduct(audioItem)}
                className="relative rounded-3xl p-8 bg-gradient-to-br from-slate-900 to-rose-950/40 border border-slate-800 overflow-hidden group hover:border-rose-500/40 transition cursor-pointer flex flex-col justify-between h-[420px]"
              >
                <div className="relative z-10 max-w-sm">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Pure Sound
                  </span>
                  <h3 className="text-3xl font-extrabold text-white mt-3">
                    {audioItem.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                    {audioItem.description}
                  </p>
                  <div className="mt-4 text-2xl font-extrabold text-white">
                    From ${audioItem.price.toLocaleString()}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(audioItem);
                    }}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition"
                  >
                    Add to Bag
                  </button>
                </div>
                <img
                  src={audioItem.image}
                  alt={audioItem.title}
                  className="absolute -right-10 -bottom-10 w-72 h-72 object-cover rounded-2xl group-hover:scale-105 transition duration-500 opacity-80"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Promo Coupon Banner */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase bg-white/20 text-white tracking-widest">
                EXCLUSIVE COMMUNITY BENEFIT
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                Save 15% on Your Entire First Order
              </h2>
              <p className="text-sm sm:text-base text-blue-100 font-normal">
                Use promotional voucher code <span className="font-mono font-bold bg-white text-blue-900 px-2 py-0.5 rounded-md">HAVEN15</span> at checkout to unlock your savings on any hardware item today.
              </p>
              <div className="pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-blue-900 font-extrabold text-sm shadow-xl transition active:scale-95"
                >
                  Claim & Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
