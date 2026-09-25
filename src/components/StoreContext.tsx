"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, Product } from "@/lib/types";

interface StoreState {
  cart: CartItem[];
  wishlist: CartItem[];
  cartCount: number;
  cartTotal: number;
  toast: string | null;
  addToCart: (p: Product, qty?: number) => void;
  updateQty: (slug: string, qty: number) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
  toggleWishlist: (p: Product) => void;
  isWishlisted: (slug: string) => boolean;
  showToast: (msg: string) => void;
}

const StoreCtx = createContext<StoreState | null>(null);

const CART_KEY = "violet_cart_v1";
const WISH_KEY = "violet_wishlist_v1";

function load<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function save(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable */
  }
}

function toCartItem(p: Product, qty: number): CartItem {
  return {
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    price: p.price,
    size: p.size,
    image_url: p.image_url,
    qty,
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(load(CART_KEY));
    setWishlist(load(WISH_KEY));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) save(CART_KEY, cart);
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) save(WISH_KEY, wishlist);
  }, [wishlist, hydrated]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const addToCart = useCallback(
    (p: Product, qty = 1) => {
      setCart((prev) => {
        const found = prev.find((i) => i.slug === p.slug);
        if (found) {
          return prev.map((i) =>
            i.slug === p.slug ? { ...i, qty: i.qty + qty } : i
          );
        }
        return [...prev, toCartItem(p, qty)];
      });
      showToast(`تمت إضافة «${p.name}» إلى السلة`);
    },
    [showToast]
  );

  const updateQty = useCallback((slug: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((i) => i.slug !== slug)
        : prev.map((i) => (i.slug === slug ? { ...i, qty } : i))
    );
  }, []);

  const removeFromCart = useCallback((slug: string) => {
    setCart((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (p: Product) => {
      setWishlist((prev) => {
        const exists = prev.some((i) => i.slug === p.slug);
        if (exists) {
          showToast("تمت الإزالة من المفضلة");
          return prev.filter((i) => i.slug !== p.slug);
        }
        showToast("تمت الإضافة إلى المفضلة");
        return [...prev, toCartItem(p, 1)];
      });
    },
    [showToast]
  );

  const isWishlisted = useCallback(
    (slug: string) => wishlist.some((i) => i.slug === slug),
    [wishlist]
  );

  const value = useMemo<StoreState>(() => {
    const cartCount = cart.reduce((s, i) => s + i.qty, 0);
    const cartTotal = cart.reduce((s, i) => s + i.qty * i.price, 0);
    return {
      cart,
      wishlist,
      cartCount,
      cartTotal,
      toast,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      showToast,
    };
  }, [
    cart,
    wishlist,
    toast,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    toggleWishlist,
    isWishlisted,
    showToast,
  ]);

  return (
    <StoreCtx.Provider value={value}>
      {children}
      {toast && (
        <div className="fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 md:bottom-8">
          <div className="animate-fadeUp rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-soft">
            {toast}
          </div>
        </div>
      )}
    </StoreCtx.Provider>
  );
}

export function useStore(): StoreState {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
