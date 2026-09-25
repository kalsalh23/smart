"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "./StoreContext";
import { formatPrice } from "@/lib/format";
import { STORE, type Product } from "@/lib/types";

function NoteCard({ title, notes, icon }: { title: string; notes: string | null; icon: string }) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-3 text-center shadow-card">
      <span className="text-xl">{icon}</span>
      <p className="mt-1 text-[11px] font-bold text-ink-faint">{title}</p>
      <p className="mt-1 text-xs font-semibold leading-5 text-ink">{notes || "—"}</p>
    </div>
  );
}

export default function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [qty, setQty] = useState(1);
  const wished = isWishlisted(product.slug);

  const discount =
    product.old_price && product.old_price > product.price
      ? Math.round((1 - product.price / product.old_price) * 100)
      : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <nav className="mb-4 flex items-center gap-2 text-xs font-semibold text-ink-faint">
        <Link href="/" className="hover:text-brand-600">الرئيسية</Link>
        <span>/</span>
        <Link href="/explore" className="hover:text-brand-600">تسوّق</Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Image */}
        <div className="relative overflow-hidden rounded-4xl border border-brand-100 bg-white shadow-soft">
          {discount && (
            <span className="absolute right-4 top-4 z-10 rounded-full bg-blush px-3 py-1.5 text-xs font-bold text-rose-600">
              خصم {discount}%
            </span>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image_url || "/products/placeholder.svg"}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-sm font-semibold tracking-[0.25em] text-brand-500">
                {product.brand}
              </p>
              <h1 className="mt-1 text-2xl font-black leading-snug md:text-3xl">
                {product.name}
              </h1>
              {product.size && (
                <p className="mt-1 text-sm font-semibold text-ink-faint">
                  الحجم: {product.size}
                </p>
              )}
            </div>
            <button
              aria-label="المفضلة"
              onClick={() => toggleWishlist(product)}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition ${
                wished
                  ? "border-brand-200 bg-brand-50 text-brand-600"
                  : "border-brand-100 bg-white text-ink-faint hover:text-brand-500"
              }`}
            >
              <svg viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M12 20.5S4 15.3 4 9.9A4.4 4.4 0 0 1 8.4 5.5c1.5 0 2.9.8 3.6 2a4.2 4.2 0 0 1 3.6-2A4.4 4.4 0 0 1 20 9.9c0 5.4-8 10.6-8 10.6z" />
              </svg>
            </button>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-black text-ink">
              {formatPrice(product.price)}
            </span>
            {product.old_price && (
              <span className="text-lg text-ink-faint line-through">
                {formatPrice(product.old_price)}
              </span>
            )}
            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700">
              أصلي 100٪
            </span>
          </div>

          {product.description && (
            <p className="mt-4 text-sm leading-8 text-ink-soft">
              {product.description}
            </p>
          )}

          {/* Notes */}
          <h2 className="mt-6 text-sm font-extrabold">المكوّنات العطرية</h2>
          <div className="mt-2.5 grid grid-cols-3 gap-2.5">
            <NoteCard icon="🍋" title="المقدمة" notes={product.notes_top} />
            <NoteCard icon="🌸" title="القلب" notes={product.notes_heart} />
            <NoteCard icon="🍯" title="القاعدة" notes={product.notes_base} />
          </div>

          {/* Qty + CTA */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border border-brand-100 bg-white px-2 py-1.5 shadow-card">
              <button
                aria-label="زيادة"
                onClick={() => setQty((v) => Math.min(99, v + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold text-brand-600 hover:bg-brand-50"
              >
                +
              </button>
              <span className="w-8 text-center text-sm font-extrabold">{qty}</span>
              <button
                aria-label="إنقاص"
                onClick={() => setQty((v) => Math.max(1, v - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold text-ink-soft hover:bg-brand-50"
              >
                −
              </button>
            </div>
            <button
              disabled={!product.in_stock}
              onClick={() => addToCart(product, qty)}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-ink-faint/40"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M6 8h12l-1 12a1 1 0 0 1-1 .9H8a1 1 0 0 1-1-.9z" />
                <path d="M9 10V6a3 3 0 0 1 6 0v4" />
              </svg>
              {product.in_stock ? "أضف إلى السلة" : "نفدت الكمية"}
            </button>
          </div>

          <a
            href={`https://wa.me/${STORE.phoneIntl}?text=${encodeURIComponent(
              `مرحباً فيوليت 👋\nأرغب بطلب: ${product.name} (${product.brand})${product.size ? " - " + product.size : ""}\nالسعر: ${formatPrice(product.price)}`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-6 py-3 text-sm font-extrabold text-[#128C4A] transition hover:bg-[#25D366]/20"
          >
            اطلب مباشرة عبر واتساب
          </a>

          <ul className="mt-5 grid grid-cols-1 gap-2 text-xs font-semibold text-ink-soft sm:grid-cols-2">
            <li className="flex items-center gap-2">✅ ضمان الأصالة أو استرجاع المبلغ</li>
            <li className="flex items-center gap-2">🚚 توصيل داخل دمشق والريف</li>
          </ul>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-extrabold">قد يعجبك أيضاً</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-5">
            {related.map((p) => (
              <LinkCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function LinkCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="aspect-square w-full overflow-hidden bg-brand-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image_url || "/products/placeholder.svg"}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3.5 text-start">
        <p className="text-[11px] font-bold text-brand-500">{product.brand}</p>
        <p className="line-clamp-2 min-h-[2.6em] text-sm font-bold leading-snug">
          {product.name}
        </p>
        <p className="mt-auto pt-1 text-base font-extrabold">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
