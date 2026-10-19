import React, { useState } from "react";
import { X, ShoppingBag, Check, Shield, Truck, RotateCcw } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ProductQuickView({ product, onClose }) {
  if (!product) return null;

  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : ""
  );
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image */}
          <div className="relative bg-slate-950 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-800">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-72 md:h-96 object-cover rounded-2xl shadow-xl"
            />
            {product.tag && (
              <span className="absolute top-6 left-6 px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-600 text-white shadow-lg">
                {product.tag}
              </span>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Brand and Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1.5 bg-slate-800/60 px-2.5 py-1 rounded-full text-xs">
                  <span className="font-bold text-amber-400">{product.rating}</span>
                  <span className="text-slate-400">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-white mt-2">{product.title}</h2>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-white">
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-slate-500 line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    Save {product.discount}%
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-xs leading-relaxed text-slate-300">
                {product.description}
              </p>

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-5">
                  <span className="text-xs font-semibold text-slate-300 block mb-2">
                    Finish / Color: <strong className="text-blue-400">{selectedColor}</strong>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                          selectedColor === color
                            ? "bg-blue-600/20 border-blue-500 text-blue-300 font-semibold"
                            : "bg-slate-800/50 border-slate-700/60 text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bullet Features */}
              {product.features && product.features.length > 0 && (
                <div className="mt-5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Key Highlights
                  </span>
                  <ul className="space-y-1.5">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <div className="flex items-center gap-3">
                {/* Quantity Control */}
                <div className="flex items-center rounded-xl bg-slate-800 border border-slate-700/60 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white rounded-lg hover:bg-slate-700"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white rounded-lg hover:bg-slate-700"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-3 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95 ${
                    product.inStock
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Bag • ${(product.price * quantity).toLocaleString()}
                </button>
              </div>

              {/* Guarantees */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] text-slate-400 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Truck className="w-3 h-3 text-blue-400" /> Free Delivery
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-400" /> Official Warranty
                </div>
                <div className="flex items-center justify-center gap-1">
                  <RotateCcw className="w-3 h-3 text-amber-400" /> 30-Day Return
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
