"use client";

import Link from "next/link";
import { useStore } from "./StoreContext";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M12 20.5S4 15.3 4 9.9A4.4 4.4 0 0 1 8.4 5.5c1.5 0 2.9.8 3.6 2a4.2 4.2 0 0 1 3.6-2A4.4 4.4 0 0 1 20 9.9c0 5.4-8 10.6-8 10.6z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
      <path d="M6 8h12l-1 12a1 1 0 0 1-1 .9H8a1 1 0 0 1-1-.9z" />
      <path d="M9 10V6a3 3 0 0 1 6 0v4" />
    </svg>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wished = isWishlisted(product.slug);
  const discount =
    product.old_price && product.old_price > product.price
      ? Math.round((1 - product.price / product.old_price) * 100)
      : null;

  return (
    <div className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft">
      <button
        aria-label="أضف للمفضلة"
        onClick={() => toggleWishlist(product)}
        className={`absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow transition ${
          wished ? "text-brand-600" : "text-ink-faint hover:text-brand-500"
        }`}
      >
        <HeartIcon filled={wished} />
      </button>

      {discount && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-blush px-2.5 py-1 text-[11px] font-bold text-rose-600">
          خصم {discount}%
        </span>
      )}

      <Link href={`/product/${product.slug}`} className="block">
        <div className="aspect-square w-full overflow-hidden bg-brand-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image_url || "/products/placeholder.svg"}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-3.5 text-start">
        <p className="text-[11px] font-bold tracking-wide text-brand-500">
          {product.brand}
        </p>
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 min-h-[2.6em] text-sm font-bold leading-snug text-ink hover:text-brand-700"
        >
          {product.name}
        </Link>
        {product.size && (
          <p className="text-[11px] text-ink-faint">{product.size}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-ink">
              {formatPrice(product.price)}
            </span>
            {product.old_price && (
              <span className="text-xs text-ink-faint line-through">
                {formatPrice(product.old_price)}
              </span>
            )}
          </div>
          <button
            aria-label="أضف إلى السلة"
            disabled={!product.in_stock}
            onClick={() => addToCart(product)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white shadow transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-ink-faint/40"
          >
            <BagIcon />
          </button>
        </div>
      </div>

      {!product.in_stock && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/60 text-sm font-bold text-ink">
          نفدت الكمية
        </span>
      )}
    </div>
  );
}
