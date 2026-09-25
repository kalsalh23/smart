"use client";

import Link from "next/link";
import { useStore } from "@/components/StoreContext";
import { formatPrice } from "@/lib/format";
import { STORE } from "@/lib/types";

export default function CartPage() {
  const { cart, cartTotal, updateQty, removeFromCart } = useStore();

  const remaining = Math.max(0, STORE.freeShipFrom - cartTotal);
  const progress = Math.min(100, (cartTotal / STORE.freeShipFrom) * 100);

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 text-4xl">
          🛍️
        </span>
        <h1 className="mt-5 text-xl font-extrabold">سلة التسوق فارغة</h1>
        <p className="mt-2 text-sm leading-7 text-ink-faint">
          اكتشف مجموعتنا من العطور الأصلية واختر ما يناسب ذوقك
        </p>
        <Link
          href="/explore"
          className="mt-6 rounded-full bg-brand-600 px-7 py-3 text-sm font-extrabold text-white shadow-soft transition hover:bg-brand-700"
        >
          ابدأ التسوّق
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-black">سلة التسوق</h1>

      {/* Free shipping progress */}
      <div className="mt-4 rounded-3xl border border-brand-100 bg-white p-4 shadow-card">
        {remaining > 0 ? (
          <p className="text-xs font-bold text-ink-soft">
            أضف بقيمة <span className="text-brand-600">{formatPrice(remaining)}</span> للحصول على توصيل مجاني 🚚
          </p>
        ) : (
          <p className="text-xs font-bold text-[#128C4A]">
            مبروك! حصلت على توصيل مجاني 🎉
          </p>
        )}
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-100">
          <div
            className="h-full rounded-full bg-gradient-to-l from-brand-400 to-brand-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Items */}
      <div className="mt-4 space-y-3">
        {cart.map((item) => (
          <div
            key={item.slug}
            className="flex gap-3 rounded-3xl border border-brand-100 bg-white p-3 shadow-card"
          >
            <Link href={`/product/${item.slug}`} className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_url || "/products/placeholder.svg"}
                alt={item.name}
                className="h-20 w-20 rounded-2xl object-cover md:h-24 md:w-24"
              />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-brand-500">{item.brand}</p>
                  <Link
                    href={`/product/${item.slug}`}
                    className="line-clamp-1 text-sm font-extrabold hover:text-brand-700"
                  >
                    {item.name}
                  </Link>
                  {item.size && (
                    <p className="text-[11px] text-ink-faint">{item.size}</p>
                  )}
                </div>
                <button
                  aria-label="إزالة"
                  onClick={() => removeFromCart(item.slug)}
                  className="text-ink-faint transition hover:text-rose-500"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M4 7h16M10 11v6m4-6v6M6 7l1 13a1 1 0 0 0 1 .9h8a1 1 0 0 0 1-.9l1-13M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              </div>
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center gap-1 rounded-full border border-brand-100 px-1.5 py-1">
                  <button
                    aria-label="زيادة"
                    onClick={() => updateQty(item.slug, item.qty + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-base font-bold text-brand-600 hover:bg-brand-50"
                  >
                    +
                  </button>
                  <span className="w-7 text-center text-sm font-extrabold">{item.qty}</span>
                  <button
                    aria-label="إنقاص"
                    onClick={() => updateQty(item.slug, item.qty - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-base font-bold text-ink-soft hover:bg-brand-50"
                  >
                    −
                  </button>
                </div>
                <p className="text-base font-extrabold">
                  {formatPrice(item.price * item.qty)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 rounded-3xl border border-brand-100 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between text-sm font-bold text-ink-soft">
          <span>المجموع الفرعي</span>
          <span>{formatPrice(cartTotal)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm font-bold text-ink-soft">
          <span>التوصيل</span>
          <span>{remaining > 0 ? "يُحدد عند الطلب" : "مجاني"}</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-dashed border-brand-100 pt-3 text-base font-black">
          <span>الإجمالي</span>
          <span className="text-brand-700">{formatPrice(cartTotal)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-4 flex items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-sm font-extrabold text-white shadow-soft transition hover:bg-brand-700"
        >
          إتمام الطلب
          <span aria-hidden>←</span>
        </Link>
      </div>
    </div>
  );
}
