"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { products } from "@/lib/productData";
import { clearCart as clearStoredCart, readCart, writeCart } from "@/lib/cartStorage";
import { useSiteAuth } from "@/context/SiteAuthContext";

const CartContext = createContext(null);

function normalizeQuantity(quantity) {
  const parsed = Number.parseInt(quantity, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return 1;
  return Math.min(parsed, 99);
}

function mergeCartItem(items, productId, quantity) {
  const nextItems = [...items];
  const existingIndex = nextItems.findIndex((item) => item.productId === productId);

  if (existingIndex >= 0) {
    nextItems[existingIndex] = {
      ...nextItems[existingIndex],
      quantity: Math.min(nextItems[existingIndex].quantity + quantity, 99),
    };
    return nextItems;
  }

  return [...nextItems, { productId, quantity }];
}

export function CartProvider({ children }) {
  const { user, ready } = useSiteAuth();
  const userEmail = user?.email || null;
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!ready) return;

    if (!userEmail) {
      setItems([]);
      return;
    }

    setItems(readCart(userEmail));
  }, [ready, userEmail]);

  const persistItems = useCallback(
    (nextItems) => {
      if (!userEmail) {
        setItems([]);
        return [];
      }

      writeCart(userEmail, nextItems);
      setItems(nextItems);
      return nextItems;
    },
    [userEmail]
  );

  const addItem = useCallback(
    (productId, quantity = 1) => {
      if (!userEmail) {
        return { ok: false, error: "auth_required" };
      }

      const product = products.find((item) => item.id === productId);
      if (!product) {
        return { ok: false, error: "not_found" };
      }

      if (!product.inStock) {
        return { ok: false, error: "out_of_stock" };
      }

      const safeQuantity = normalizeQuantity(quantity);
      persistItems(mergeCartItem(items, productId, safeQuantity));

      return { ok: true };
    },
    [items, persistItems, userEmail]
  );

  const updateItemQuantity = useCallback(
    (productId, quantity) => {
      if (!userEmail) return;

      const safeQuantity = normalizeQuantity(quantity);
      persistItems(
        items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: safeQuantity }
            : item
        )
      );
    },
    [items, persistItems, userEmail]
  );

  const removeItem = useCallback(
    (productId) => {
      if (!userEmail) return;
      persistItems(items.filter((item) => item.productId !== productId));
    },
    [items, persistItems, userEmail]
  );

  const clearCart = useCallback(() => {
    if (!userEmail) return;
    clearStoredCart(userEmail);
    setItems([]);
  }, [userEmail]);

  const cartItems = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((row) => row.id === item.productId);
          if (!product) return null;

          return {
            ...item,
            product,
            lineTotal: product.price * item.quantity,
          };
        })
        .filter(Boolean),
    [items]
  );

  const itemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.lineTotal, 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      itemCount,
      subtotal,
      addItem,
      updateItemQuantity,
      removeItem,
      clearCart,
    }),
    [cartItems, itemCount, subtotal, addItem, updateItemQuantity, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
