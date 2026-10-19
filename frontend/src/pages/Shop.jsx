import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Filter,
  SlidersHorizontal,
  X,
  Check,
  RotateCcw,
  Search
} from "lucide-react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import ProductQuickView from "../components/ProductQuickView";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [selectedBrand, setSelectedBrand] = useState(
    searchParams.get("brand") || "all"
  );
  const [maxPrice, setMaxPrice] = useState(4000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "smartphones", name: "Smartphones" },
    { id: "laptops", name: "Laptops & Computers" },
    { id: "audio", name: "Audio & Sound" },
    { id: "wearables", name: "Smartwatches" },
    { id: "accessories", name: "Gaming & Accessories" },
  ];

  const brands = [
    "All",
    "Apple",
    "Samsung",
    "Sony",
    "Dell",
    "Google",
    "Bose",
    "ASUS",
    "Lenovo",
    "Logitech",
    "Garmin",
    "Keychron",
    "Anker",
    "LG",
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedBrand, maxPrice, inStockOnly, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let queryParams = [];

      if (selectedCategory && selectedCategory !== "all") {
        queryParams.push(`category=${encodeURIComponent(selectedCategory)}`);
      }
      if (selectedBrand && selectedBrand !== "all") {
        queryParams.push(`brand=${encodeURIComponent(selectedBrand)}`);
      }
      if (maxPrice < 4000) {
        queryParams.push(`maxPrice=${maxPrice}`);
      }
      if (inStockOnly) {
        queryParams.push(`inStock=true`);
      }
      if (sortBy) {
        queryParams.push(`sort=${sortBy}`);
      }
      if (searchQuery.trim()) {
        queryParams.push(`search=${encodeURIComponent(searchQuery.trim())}`);
      }

      const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
      const res = await api.get(`/products${queryString}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load shop products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand("all");
    setMaxPrice(4000);
    setInStockOnly(false);
    setSortBy("newest");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] pt-28 pb-20 text-slate-100 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Hardware Catalog
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Explore authentic high-performance tech from verified global brands
            </p>
          </div>

          {/* Quick Search & Sort Bar */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by keyword..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 pr-8"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Grid: Filters Sidebar + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 sticky top-28 bg-slate-900/50 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-400" />
                Refine Selection
              </span>
              <button
                onClick={resetFilters}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Categories */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Categories
              </span>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? "bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30"
                        : "text-slate-300 hover:bg-slate-800/60"
                    }`}
                  >
                    <span>{cat.name}</span>
                    {selectedCategory === cat.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="pt-4 border-t border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Brand
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b === "All" ? "all" : b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      (selectedBrand === b || (b === "All" && selectedBrand === "all"))
                        ? "bg-blue-600 text-white border-blue-500 font-bold"
                        : "bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                <span>Max Budget</span>
                <span className="text-white">${maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50"
                max="4000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>$50</span>
                <span>$4,000+</span>
              </div>
            </div>

            {/* In-Stock Toggle */}
            <div className="pt-4 border-t border-slate-800">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-slate-300">In-Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
                />
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {/* Status indicator */}
            <div className="flex items-center justify-between mb-6 text-xs text-slate-400">
              <span>Showing <strong className="text-white">{products.length}</strong> devices</span>
              {(selectedCategory !== "all" || selectedBrand !== "all" || maxPrice < 4000) && (
                <span className="text-blue-400">Filtered results active</span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-96 rounded-3xl bg-slate-900/50 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center rounded-3xl bg-slate-900/30 border border-slate-800 p-8">
                <p className="text-base font-bold text-white mb-2">No matching products found</p>
                <p className="text-xs text-slate-400 mb-6">
                  Try adjusting your filters, budget slider, or search terms.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
        </div>
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
