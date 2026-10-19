import React, { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, ShoppingBag } from "lucide-react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

export default function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      fetchAllProducts();
    } else {
      setSearchTerm("");
    }
  }, [isOpen]);

  // Global keydown for ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose ? onClose() : null;
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setResults(res.data.slice(0, 6)); // default recommendations
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (val) => {
    setSearchTerm(val);
    if (!val.trim()) {
      fetchAllProducts();
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/products?search=${encodeURIComponent(val)}`);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Search Input Box */}
        <div className="flex items-center px-6 py-4 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search iPhone, MacBook, Sony, 4K monitors..."
            className="w-full bg-transparent text-white text-base focus:outline-none placeholder-slate-500"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearch("")}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[11px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700/60">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
            {searchTerm ? `Search Results (${results.length})` : "Trending Suggestions"}
          </p>

          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm">Searching catalog...</div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No products found matching "{searchTerm}"
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-800/80 transition group cursor-pointer"
                onClick={() => {
                  addToCart(product);
                  onClose();
                }}
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-950 p-1"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                        {product.brand}
                      </span>
                      <span className="font-bold text-sm text-white group-hover:text-blue-400 transition">
                        {product.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-bold text-sm text-white">
                      ${product.price.toLocaleString()}
                    </span>
                    {product.discount > 0 && (
                      <span className="block text-[10px] text-rose-400 font-semibold">
                        Save {product.discount}%
                      </span>
                    )}
                  </div>
                  <button
                    className="p-2 rounded-xl bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition"
                    title="Add to Bag"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Click any product to add to your bag instantly</span>
          <span className="text-blue-400 font-semibold cursor-pointer" onClick={onClose}>
            Close
          </span>
        </div>
      </div>
    </div>
  );
}
