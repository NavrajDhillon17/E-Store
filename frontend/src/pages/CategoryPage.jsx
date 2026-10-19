import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, Filter } from "lucide-react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import ProductQuickView from "../components/ProductQuickView";

export default function CategoryPage() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const categoryMeta = {
    smartphones: {
      title: "Smartphones & Tablets",
      tagline: "Ultra-high resolution displays, pro titanium frames & next-gen AI silicon.",
      badge: "Flagship Mobile",
      gradient: "from-blue-600/30 via-cyan-600/10 to-transparent",
    },
    laptops: {
      title: "Laptops & Workstations",
      tagline: "Engineered for intense compiles, 4K rendering, and uninterrupted battery runtime.",
      badge: "Compute Powerhouses",
      gradient: "from-indigo-600/30 via-purple-600/10 to-transparent",
    },
    audio: {
      title: "Audio & Sound",
      tagline: "Lossless spatial soundstages, active noise cancellation, and all-day acoustic comfort.",
      badge: "High-Fidelity Audio",
      gradient: "from-rose-600/30 via-amber-600/10 to-transparent",
    },
    wearables: {
      title: "Smartwatches & Wearables",
      tagline: "Rugged dive-ready durability, biometric vitals tracking, and multi-frequency GPS.",
      badge: "Active Health",
      gradient: "from-emerald-600/30 via-teal-600/10 to-transparent",
    },
    accessories: {
      title: "Gaming & Desktop Gear",
      tagline: "Custom mechanical keyboards, high-speed GaN charging hubs, and 4K displays.",
      badge: "Creator Essentials",
      gradient: "from-violet-600/30 via-pink-600/10 to-transparent",
    },
  };

  const currentMeta = categoryMeta[categoryName?.toLowerCase()] || {
    title: categoryName ? categoryName.toUpperCase() : "Category",
    tagline: "Explore our handpicked collection of certified hardware.",
    badge: "Haven Certified",
    gradient: "from-blue-600/30 via-indigo-600/10 to-transparent",
  };

  useEffect(() => {
    fetchCategoryProducts();
  }, [categoryName, selectedBrand, sortBy]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      let query = `?category=${categoryName}`;
      if (selectedBrand !== "all") query += `&brand=${selectedBrand}`;
      if (sortBy) query += `&sort=${sortBy}`;

      const res = await api.get(`/products${query}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load category products:", err);
    } finally {
      setLoading(false);
    }
  };

  const availableBrands = ["all", ...new Set(products.map((p) => p.brand))];

  return (
    <div className="min-h-screen bg-[#0b0f19] pt-28 pb-20 text-slate-100 overflow-x-hidden">
      {/* Category Hero Banner */}
      <section className="relative overflow-hidden mb-12 border-b border-slate-800">
        <div className={`absolute inset-0 bg-gradient-to-r ${currentMeta.gradient} pointer-events-none`} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/shop" className="hover:text-white">Shop</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-400 capitalize">{categoryName}</span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> {currentMeta.badge}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {currentMeta.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-2 leading-relaxed">
            {currentMeta.tagline}
          </p>

          {/* Quick Brand Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-800/80">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">
                Brands:
              </span>
              {availableBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                    selectedBrand === brand
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-slate-900/50 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-slate-900/40 border border-slate-800 p-8">
            <h3 className="text-lg font-bold text-white">No products found</h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">
              No devices found for this brand filter.
            </p>
            <button
              onClick={() => setSelectedBrand("all")}
              className="px-6 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              Reset Brand Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </div>

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
