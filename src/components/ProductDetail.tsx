"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "./StoreContext";
import Icon from "./Icon";
import { formatPrice } from "@/lib/format";
import { STORE, type Product } from "@/lib/types";

function NoteCard({
  title,
  notes,
  icon,
}: {
  title: string;
  notes: string | null;
  icon: "citrus" | "flower" | "drops";
}) {
  return (
    <div className="rounded-2xl border border-ink/8 bg-white p-4 text-center shadow-card">
      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/70 text-gold-700">
        <Icon name={icon} className="h-5 w-5" strokeWidth={1.4} />
      </span>
      <p className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-ink-faint">
        {title}
      </p>
      <p className="mt-1.5 text-xs font-semibold leading-5 text-ink">
        {notes || "—"}
      </p>
    </div>
  );
}

function RelatedCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="aspect-square w-full overflow-hidden bg-brand-50/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image_url || "/products/placeholder.svg"}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4 text-start">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-700">
          {product.brand}
        </p>
        <p className="line-clamp-2 min-h-[2.7em] text-[13px] font-bold leading-snug">
          {product.name}
        </p>
        <p className="mt-auto pt-1.5 text-[15px] font-extrabold">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}

export default function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [qty, setQty] = useState(1);
  const wished = isWishlisted(product.slug);

  const discount =
    product.old_price && product.old_price > product.price
      ? Math.round((1 - product.price / product.old_price) * 100)
      : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <nav className="mb-5 flex items-center gap-2 text-xs font-semibold text-ink-faint">
        <Link href="/" className="transition hover:text-plum">الرئيسية</Link>
        <span className="text-ink-faint/50">/</span>
        <Link href="/explore" className="transition hover:text-plum">تسوّق</Link>
        <span className="text-ink-faint/50">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-7 md:grid-cols-2">
        {/* Image */}
        <div className="relative overflow-hidden rounded-4xl border border-ink/8 bg-white shadow-soft">
          {discount && (
            <span className="absolute right-4 top-4 z-10 rounded-full bg-[#7E2243] px-3 py-1.5 text-[11px] font-bold text-white shadow-sm">
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
              <p className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-brand-700">
                {product.brand}
              </p>
              <h1 className="mt-2 font-display-ar text-[26px] font-bold leading-snug text-ink md:text-3xl">
                {product.name}
              </h1>
              {product.size && (
                <p className="mt-1.5 text-[13px] font-medium text-ink-faint">
                  الحجم: {product.size}
                </p>
              )}
            </div>
            <button
              aria-label="المفضلة"
              onClick={() => toggleWishlist(product)}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition ${
                wished
                  ? "border-rose-200 bg-rose-50 text-rose-600"
                  : "border-ink/10 bg-white text-ink-soft hover:text-rose-500"
              }`}
            >
              <Icon name="heart" className="h-5 w-5" strokeWidth={wished ? 2 : 1.5} />
            </button>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-[32px] font-bold text-ink">
              {formatPrice(product.price)}
            </span>
            {product.old_price && (
              <span className="text-lg text-ink-faint line-through">
                {formatPrice(product.old_price)}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/70 bg-gold-500/10 px-3 py-1 text-[11px] font-bold text-gold-700">
              <Icon name="shield" className="h-3.5 w-3.5" strokeWidth={1.6} />
              أصلي 100٪
            </span>
          </div>

          {product.description && (
            <p className="mt-5 border-t border-ink/8 pt-5 text-sm leading-8 text-ink-soft">
              {product.description}
            </p>
          )}

          {/* Notes */}
          <h2 className="mt-7 text-[11px] font-bold uppercase tracking-[0.25em] text-ink-faint">
            المكوّنات العطرية
          </h2>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <NoteCard title="المقدمة" notes={product.notes_top} icon="citrus" />
            <NoteCard title="القلب" notes={product.notes_heart} icon="flower" />
            <NoteCard title="القاعدة" notes={product.notes_base} icon="drops" />
          </div>

          {/* Qty + CTA */}
          <div className="mt-7 flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border border-ink/12 bg-white px-2 py-1.5">
              <button
                aria-label="زيادة"
                onClick={() => setQty((v) => Math.min(99, v + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink transition hover:bg-brand-50"
              >
                <Icon name="plus" className="h-4 w-4" strokeWidth={1.8} />
              </button>
              <span className="w-7 text-center text-sm font-extrabold">{qty}</span>
              <button
                aria-label="إنقاص"
                onClick={() => setQty((v) => Math.max(1, v - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink transition hover:bg-brand-50"
              >
                <Icon name="minus" className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>
            <button
              disabled={!product.in_stock}
              onClick={() => addToCart(product, qty)}
              className="flex flex-1 items-center justify-center gap-2.5 rounded-full bg-ink px-6 py-3.5 text-[13px] font-bold text-white shadow-soft transition hover:bg-plum disabled:cursor-not-allowed disabled:bg-ink-faint/30"
            >
              <Icon name="bag" className="h-[18px] w-[18px]" />
              {product.in_stock ? "أضيفي إلى السلة" : "نفدت الكمية"}
            </button>
          </div>

          <a
            href={`https://wa.me/${STORE.phoneIntl}?text=${encodeURIComponent(
              `مرحباً فيوليت 👋\nأرغب بطلب: ${product.name} (${product.brand})${product.size ? " - " + product.size : ""}\nالسعر: ${formatPrice(product.price)}`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex items-center justify-center gap-2.5 rounded-full border border-[#1FA855]/40 bg-[#1FA855]/8 px-6 py-3 text-[13px] font-bold text-[#147A3D] transition hover:bg-[#1FA855]/15"
          >
            <Icon name="whatsapp" className="h-[18px] w-[18px]" />
            اطلبي مباشرة عبر واتساب
          </a>

          <ul className="mt-6 grid grid-cols-1 gap-2.5 border-t border-ink/8 pt-5 text-xs font-semibold text-ink-soft sm:grid-cols-2">
            <li className="flex items-center gap-2.5">
              <Icon name="shield" className="h-4 w-4 text-gold-600" />
              ضمان الأصالة أو استرجاع المبلغ
            </li>
            <li className="flex items-center gap-2.5">
              <Icon name="truck" className="h-4 w-4 text-gold-600" />
              توصيل داخل دمشق والريف
            </li>
          </ul>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <div className="mb-5">
            <p className="eyebrow">YOU MAY ALSO LIKE</p>
            <h2 className="mt-1.5 font-display-ar text-2xl font-bold text-ink md:text-3xl">
              قد يعجبك أيضاً
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
            {related.map((p) => (
              <RelatedCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
