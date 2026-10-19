import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  CheckCircle2,
  CreditCard,
  Building2,
  X,
  Printer
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discountPercent,
    promoCode,
    applyPromoCode,
    removePromoCode,
    discountAmount,
    estimatedTax,
    shippingCost,
    totalAmount,
    totalItemsCount,
  } = useCart();

  const { user } = useAuth();
  const { addToast } = useToast();

  const [inputPromo, setInputPromo] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  // Checkout Form State
  const [shippingDetails, setShippingDetails] = useState({
    fullName: user ? user.name : "",
    email: user ? user.email : "",
    address: "742 Evergreen Terrace",
    city: "San Francisco",
    state: "CA",
    postalCode: "94107",
    paymentMethod: "apple_pay",
    cardNumber: "•••• •••• •••• 4242",
  });

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    if (!inputPromo.trim()) return;
    applyPromoCode(inputPromo.trim());
    setInputPromo("");
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!shippingDetails.fullName || !shippingDetails.email || !shippingDetails.address) {
      addToast("Please fill in all shipping details", "error");
      return;
    }

    setIsProcessingOrder(true);

    setTimeout(() => {
      const generatedOrderId = "NS-" + Math.floor(100000 + Math.random() * 900000);
      const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      const confirmedOrder = {
        orderId: generatedOrderId,
        date: new Date().toLocaleDateString(),
        deliveryDate,
        items: [...cartItems],
        totalAmount,
        subtotal,
        discountAmount,
        estimatedTax,
        shippingCost,
        shippingDetails: { ...shippingDetails },
      };

      setOrderConfirmed(confirmedOrder);
      setIsProcessingOrder(false);
      setIsCheckoutOpen(false);
      clearCart();
      addToast("Order placed successfully!", "success");
    }, 1500);
  };

  const freeShippingProgress = Math.min(100, Math.round((subtotal / 150) * 100));
  const remainingForFreeShipping = Math.max(0, 150 - subtotal);

  return (
    <div className="min-h-screen bg-[#0b0f19] pt-28 pb-20 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-8 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-blue-500" />
          Review Your Bag ({totalItemsCount})
        </h1>

        {cartItems.length === 0 && !orderConfirmed ? (
          /* Empty Bag State */
          <div className="py-20 text-center rounded-3xl bg-slate-900/40 border border-slate-800 p-10 max-w-xl mx-auto">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Your Bag is Empty</h2>
            <p className="text-sm text-slate-400 mb-8 max-w-sm mx-auto">
              Explore our curated selection of flagship smartphones, M4 workstations, and pro audio gear.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Col: Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Shipping Progress Indicator */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-blue-400" />
                    {subtotal >= 150 ? (
                      <strong className="text-emerald-400">
                        You unlocked Free Express Shipping!
                      </strong>
                    ) : (
                      <span>
                        Add <strong>${remainingForFreeShipping}</strong> more for Free Shipping
                      </span>
                    )}
                  </span>
                  <span className="font-bold text-slate-400">{freeShippingProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={`${item._id}-${item.selectedColor}`}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 gap-4 hover:border-slate-700 transition"
                  >
                    {/* Thumbnail and Title */}
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 rounded-xl object-cover bg-slate-950 p-1 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                          {item.brand}
                        </span>
                        <h3 className="font-bold text-base text-white mt-1">
                          {item.title}
                        </h3>
                        {item.selectedColor && (
                          <p className="text-xs text-slate-400 mt-0.5">
                            Color: <span className="text-slate-300">{item.selectedColor}</span>
                          </p>
                        )}
                        <span className="sm:hidden font-extrabold text-sm text-white mt-1 block">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls and Remove */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      {/* Quantity Stepper */}
                      <div className="flex items-center rounded-xl bg-slate-800/80 border border-slate-700/60 p-1">
                        <button
                          onClick={() => updateQuantity(item._id, item.selectedColor, -1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white rounded-lg hover:bg-slate-700"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.selectedColor, 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white rounded-lg hover:bg-slate-700"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price (Desktop) */}
                      <div className="hidden sm:block text-right min-w-[90px]">
                        <span className="font-extrabold text-base text-white">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                        <span className="block text-[11px] text-slate-500">
                          ${item.price.toLocaleString()} each
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item._id, item.selectedColor)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons below list */}
              <div className="flex items-center justify-between pt-4">
                <Link
                  to="/shop"
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
                >
                  ← Continue Exploring
                </Link>
                <button
                  onClick={clearCart}
                  className="text-xs text-slate-500 hover:text-rose-400 transition"
                >
                  Empty Bag
                </button>
              </div>
            </div>

            {/* Right Col: Order Summary */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-5">
                <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
                  Order Summary
                </h3>

                {/* Promo Code Input */}
                <div>
                  <form onSubmit={handlePromoSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={inputPromo}
                      onChange={(e) => setInputPromo(e.target.value)}
                      placeholder="Promo code (e.g. NOVA15)"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition"
                    >
                      Apply
                    </button>
                  </form>
                  {promoCode && (
                    <div className="mt-2 flex items-center justify-between text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" /> Code: <strong>{promoCode}</strong> (-{discountPercent}%)
                      </span>
                      <button
                        onClick={removePromoCode}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Financial Breakdown */}
                <div className="space-y-3 text-xs border-t border-slate-800 pt-4">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-semibold text-white">
                      ${subtotal.toLocaleString()}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Promo Discount ({discountPercent}%)</span>
                      <span>-${discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-400">
                    <span>Estimated Sales Tax (8%)</span>
                    <span className="font-semibold text-white">
                      ${estimatedTax.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Express Shipping</span>
                    <span className="font-semibold text-white">
                      {shippingCost === 0 ? (
                        <strong className="text-emerald-400">FREE</strong>
                      ) : (
                        `$${shippingCost}`
                      )}
                    </span>
                  </div>

                  <div className="border-t border-slate-800 pt-3 flex justify-between text-base font-extrabold text-white">
                    <span>Total Amount</span>
                    <span className="text-xl text-blue-400">
                      ${totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Checkout Trigger Button */}
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 transition active:scale-95 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Trust perks */}
                <div className="pt-2 text-[11px] text-slate-500 text-center space-y-1">
                  <p className="flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Encrypted 256-Bit SSL Checkout
                  </p>
                  <p>30-Day Money Back Guarantee Included</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <h3 className="font-extrabold text-lg text-white">Fast & Secure Checkout</h3>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handlePlaceOrder} className="p-6 overflow-y-auto space-y-5">
              {/* Shipping Address */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-3">
                  1. Delivery Information
                </span>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingDetails.fullName}
                        onChange={(e) =>
                          setShippingDetails({ ...shippingDetails, fullName: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={shippingDetails.email}
                        onChange={(e) =>
                          setShippingDetails({ ...shippingDetails, email: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingDetails.address}
                      onChange={(e) =>
                        setShippingDetails({ ...shippingDetails, address: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      placeholder="123 Tech Boulevard"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingDetails.city}
                        onChange={(e) =>
                          setShippingDetails({ ...shippingDetails, city: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingDetails.state}
                        onChange={(e) =>
                          setShippingDetails({ ...shippingDetails, state: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingDetails.postalCode}
                        onChange={(e) =>
                          setShippingDetails({ ...shippingDetails, postalCode: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-3 border-t border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-3">
                  2. Select Payment Method
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setShippingDetails({ ...shippingDetails, paymentMethod: "apple_pay" })
                    }
                    className={`p-3 rounded-2xl border text-center transition ${
                      shippingDetails.paymentMethod === "apple_pay"
                        ? "bg-blue-600/20 border-blue-500 text-white font-bold"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-xs block">Apple Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setShippingDetails({ ...shippingDetails, paymentMethod: "card" })
                    }
                    className={`p-3 rounded-2xl border text-center transition ${
                      shippingDetails.paymentMethod === "card"
                        ? "bg-blue-600/20 border-blue-500 text-white font-bold"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-xs block">Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setShippingDetails({ ...shippingDetails, paymentMethod: "cod" })
                    }
                    className={`p-3 rounded-2xl border text-center transition ${
                      shippingDetails.paymentMethod === "cod"
                        ? "bg-blue-600/20 border-blue-500 text-white font-bold"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-xs block">Pay on Delivery</span>
                  </button>
                </div>
              </div>

              {/* Summary inside modal */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Charged Amount</span>
                  <p className="text-base font-extrabold text-white">
                    ${totalAmount.toLocaleString()}
                  </p>
                </div>
                <span className="text-emerald-400 font-semibold">Includes Taxes & Delivery</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessingOrder}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2"
              >
                {isProcessingOrder ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payment...</span>
                  </div>
                ) : (
                  <span>Complete Purchase • ${totalAmount.toLocaleString()}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Confirmation Invoice Modal */}
      {orderConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Top Success Badge */}
            <div className="text-center pb-6 border-b border-slate-800">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                Payment Confirmed!
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Receipt generated for Order <strong>#{orderConfirmed.orderId}</strong>
              </p>
            </div>

            {/* Delivery Estimation */}
            <div className="my-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400">Estimated Delivery</span>
                <p className="font-bold text-sm text-emerald-400">
                  {orderConfirmed.deliveryDate} (Express Dispatch)
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400">Recipient</span>
                <p className="font-bold text-xs text-white">
                  {orderConfirmed.shippingDetails.fullName}
                </p>
              </div>
            </div>

            {/* Itemized list */}
            <div className="space-y-3 pb-6 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Purchased Gear ({orderConfirmed.items.length})
              </span>
              {orderConfirmed.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-950 p-1"
                    />
                    <div>
                      <span className="font-bold text-white">{item.title}</span>
                      <span className="text-slate-400 block text-[11px]">
                        Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ""}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-white">
                    ${(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="py-4 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>${orderConfirmed.subtotal.toLocaleString()}</span>
              </div>
              {orderConfirmed.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Savings Applied</span>
                  <span>-${orderConfirmed.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Sales Tax</span>
                <span>${orderConfirmed.estimatedTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery</span>
                <span>{orderConfirmed.shippingCost === 0 ? "FREE" : `$${orderConfirmed.shippingCost}`}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Amount Paid</span>
                <span className="text-blue-400">${orderConfirmed.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
              <button
                onClick={() => setOrderConfirmed(null)}
                className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg transition"
              >
                Return to Store
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
