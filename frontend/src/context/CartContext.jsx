import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "./ToastContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("novastore_cart");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState(() => {
    return localStorage.getItem("novastore_promo") || "";
  });

  const [discountPercent, setDiscountPercent] = useState(() => {
    const promo = localStorage.getItem("novastore_promo");
    return promo === "HAVEN15" || promo === "NOVA15" || promo === "VOLT15" ? 15 : 0;
  });

  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem("novastore_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, selectedColor = "") => {
    const color = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : "Default");
    
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item._id === product._id && item.selectedColor === color
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          _id: product._id,
          title: product.title,
          brand: product.brand,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          selectedColor: color,
          quantity: quantity,
        },
      ];
    });

    addToast(`Added "${product.title}" to your Bag`, "success");
  };

  const removeFromCart = (id, selectedColor) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item._id === id && item.selectedColor === selectedColor))
    );
    addToast("Item removed from Bag", "info");
  };

  const updateQuantity = (id, selectedColor, delta) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item._id === id && item.selectedColor === selectedColor) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("novastore_cart");
  };

  const applyPromoCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "HAVEN15" || cleanCode === "VOLT15" || cleanCode === "NOVA15") {
      setPromoCode("HAVEN15");
      setDiscountPercent(15);
      localStorage.setItem("novastore_promo", "HAVEN15");
      addToast("Promo code 'HAVEN15' applied! 15% discount granted.", "success");
      return true;
    } else if (cleanCode === "FREESHIP") {
      setPromoCode(cleanCode);
      setDiscountPercent(5);
      localStorage.setItem("novastore_promo", cleanCode);
      addToast("Coupon 'FREESHIP' applied! Bonus 5% discount granted.", "success");
      return true;
    } else {
      addToast("Invalid discount code. Try 'HAVEN15'", "error");
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode("");
    setDiscountPercent(0);
    localStorage.removeItem("novastore_promo");
    addToast("Discount code removed", "info");
  };

  // Calculations
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const estimatedTax = Math.round((subtotal - discountAmount) * 0.08); // 8% tax
  const shippingCost = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const totalAmount = Math.max(0, subtotal - discountAmount + estimatedTax + shippingCost);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        promoCode,
        discountPercent,
        applyPromoCode,
        removePromoCode,
        totalItemsCount,
        subtotal,
        discountAmount,
        estimatedTax,
        shippingCost,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
