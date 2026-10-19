import React from "react";
import { ShoppingBag, Eye, Check } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, onQuickView }) {
  const { addToCart, cartItems } = useCart();
  const {
    _id,
    title,
    brand,
    price,
    originalPrice,
    discount,
    image,
    rating,
    reviewsCount,
    tag,
    inStock,
  } = product;

  const isAlreadyInBag = cartItems.some((item) => item._id === _id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div
      onClick={() => onQuickView && onQuickView(product)}
      className="group relative flex flex-col rounded-3xl bg-slate-900/60 border border-slate-800/80 overflow-hidden hover:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5 cursor-pointer"
    >
      {/* Image Container with Badges */}
      <div className="relative w-full h-64 bg-slate-950 overflow-hidden flex items-center justify-center p-6">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center rounded-2xl group-hover:scale-105 transition duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          {tag && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-blue-600/90 text-white backdrop-blur-md shadow-md">
              {tag}
            </span>
          )}
          {discount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-600 text-white shadow-md">
              -{discount}%
            </span>
          )}
        </div>

        {/* Quick View Floating Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute bottom-3 right-3 p-2.5 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 hover:text-white hover:bg-blue-600 transition shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-200"
          title="Quick View Specs"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Out of stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400 border border-rose-500/40 px-3 py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand and Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-blue-400">
              {brand}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] bg-slate-800/60 px-2 py-0.5 rounded-lg border border-slate-700/40">
              <span className="font-bold text-amber-400">{rating}</span>
              <span className="text-slate-400">({reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition line-clamp-1">
            {title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price and Cart Button */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-white">
                ${price.toLocaleString()}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-xs text-slate-500 line-through">
                  ${originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400">Free shipping</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`p-2.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition ${
              isAlreadyInBag
                ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30"
                : inStock
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 active:scale-95"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
            title="Add to Bag"
          >
            {isAlreadyInBag ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">In Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
