import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  Store,
  ChevronDown
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import SearchModal from "./SearchModal";

export default function Navbar() {
  const { totalItemsCount } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Explore All", path: "/shop" },
    { name: "Smartphones", path: "/category/smartphones" },
    { name: "Laptops", path: "/category/laptops" },
    { name: "Audio", path: "/category/audio" },
    { name: "Wearables", path: "/category/wearables" },
    { name: "Accessories", path: "/category/accessories" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/20 py-3"
            : "bg-slate-950/60 backdrop-blur-md border-b border-slate-800/40 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition border border-blue-400/30 text-white">
              <Store className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-white flex items-center">
                Haven<span className="text-blue-500">Tech</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition hover:text-white relative py-1 ${
                    isActive ? "text-blue-400 font-semibold" : ""
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition flex items-center gap-2"
              title="Search catalog"
            >
              <Search className="w-5 h-5" />
              <span className="hidden lg:inline text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60">
                ⌘K
              </span>
            </button>

            {/* Shopping Bag */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-slate-950 animate-pulse">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-800/70 border border-slate-800 transition"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-slate-200 hidden sm:inline">
                      {user.name.split(" ")[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-slate-800/80">
                        <p className="text-xs font-medium text-slate-400">Signed in as</p>
                        <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            <Shield className="w-3 h-3" /> Administrator
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-200 hover:bg-blue-600/20 hover:text-blue-400 transition"
                        >
                          <Shield className="w-4 h-4 text-blue-400" />
                          Admin CMS Dashboard
                        </Link>
                      )}

                      <Link
                        to="/cart"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 transition"
                      >
                        <ShoppingBag className="w-4 h-4 text-slate-400" />
                        My Bag ({totalItemsCount})
                      </Link>

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition border-t border-slate-800/60 mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs font-semibold px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" />
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-4 pt-3 pb-6 bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-200 hover:bg-slate-800 hover:text-blue-400 transition"
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="block px-3 py-2.5 rounded-xl text-base font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20"
              >
                Admin Control Center
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
