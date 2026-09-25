"use client";

import Link from "next/link";
import { useStore } from "@/components/StoreContext";
import Icon from "@/components/Icon";
import { formatPrice } from "@/lib/format";
import { STORE } from "@/lib/types";

export default function CartPage() {
  const { cart, cartTotal, updateQty, removeFromCart } = useStore();

  const remaining = Math.max(0, STORE.freeShipFrom - cartTotal);
  const progress = Math.min(100, (cartTotal / STORE.freeShipFrom) * 100);

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-ink/10 bg-white text-brand-700 shadow-card">
          <Icon name="bag" className="h-8 w-8" strokeWidth={1.3} />
        </span>
        <h1 className="mt-6 font-display-ar text-2xl font-bold">سلة التسوق فارغة</h1>
        <p className="mt-2 text-[13px] leading-7 text-ink-faint">
          اكتشفي مجموعتنا من العطور الأصلية واختياري ما يناسب ذوقك
        </p>
        <Link
          href="/explore"
          className="mt-7 rounded-full bg-ink px-8 py-3.5 text-[13px] font-bold text-white shadow-soft transition hover:bg-plum"
        >
          ابدئي التسوّق
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="font-display-ar text-2xl font-bold md:text-3xl">سلة التسوق</h1>

      {/* Free shipping progress */}
      <div className="mt-4 rounded-2xl border border-ink/8 bg-white p-4 shadow-card">
        {remaining > 0 ? (
          <p className="flex items-center gap-2 text-xs font-bold text-ink-soft">
            <Icon name="truck" className="h-4 w-4 text-gold-600" />
            أضيفي بقيمة{" "}
            <span className="text-plum">{formatPrice(remaining)}</span> للحصول
            على توصيل مجاني
          </p>
        ) : (
          <p className="flex items-center gap-2 text-xs font-bold text-[#147A3D]">
            <Icon name="check" className="h-4 w-4" strokeWidth={2} />
            حصلتِ على توصيل مجاني
          </p>
        )}
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-brand-100">
          <div
            className="h-full rounded-full bg-plum transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Items */}
      <div className="mt-4 space-y-3">
        {cart.map((item) => (
          <div
            key={item.slug}
            className="flex gap-3.5 rounded-2xl border border-ink/8 bg-white p-3.5 shadow-card"
          >
            <Link href={`/product/${item.slug}`} className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_url || "/products/placeholder.svg"}
                alt={item.name}
                className="h-20 w-20 rounded-xl object-cover ring-1 ring-black/5 md:h-24 md:w-24"
              />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-700">
                    {item.brand}
                  </p>
                  <Link
                    href={`/product/${item.slug}`}
                    className="line-clamp-1 text-sm font-bold transition hover:text-plum"
                  >
                    {item.name}
                  </Link>
                  {item.size && (
                    <p className="mt-0.5 text-[11px] text-ink-faint">{item.size}</p>
                  )}
                </div>
                <button
                  aria-label="إزالة"
                  onClick={() => removeFromCart(item.slug)}
                  className="text-ink-faint transition hover:text-rose-600"
                >
                  <Icon name="trash" className="h-[18px] w-[18px]" />
                </button>
              </div>
              <div className="mt-auto flex items-center justify-between pt-2.5">
                <div className="flex items-center gap-0.5 rounded-full border border-ink/10 px-1 py-1">
                  <button
                    aria-label="زيادة"
                    onClick={() => updateQty(item.slug, item.qty + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-ink transition hover:bg-brand-50"
                  >
                    <Icon name="plus" className="h-3.5 w-3.5" strokeWidth={1.8} />
                  </button>
                  <span className="w-7 text-center text-sm font-extrabold">
                    {item.qty}
                  </span>
                  <button
                    aria-label="إنقاص"
                    onClick={() => updateQty(item.slug, item.qty - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-ink transition hover:bg-brand-50"
                  >
                    <Icon name="minus" className="h-3.5 w-3.5" strokeWidth={1.8} />
                  </button>
                </div>
                <p className="text-[17px] font-extrabold">
                  {formatPrice(item.price * item.qty)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 rounded-2xl border border-ink/8 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between text-[13px] font-semibold text-ink-soft">
          <span>المجموع الفرعي</span>
          <span className="font-bold text-ink">{formatPrice(cartTotal)}</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[13px] font-semibold text-ink-soft">
          <span>التوصيل</span>
          <span className="font-bold text-ink">
            {remaining > 0 ? "يُحدد عند الطلب" : "مجاني"}
          </span>
        </div>
        <div className="mt-3.5 flex items-center justify-between border-t border-ink/10 pt-3.5">
          <span className="font-display-ar text-lg font-bold">الإجمالي</span>
          <span className="font-display text-xl font-bold text-plum">
            {formatPrice(cartTotal)}
          </span>
        </div>
        <Link
          href="/checkout"
          className="mt-5 flex items-center justify-center gap-2.5 rounded-full bg-ink py-3.5 text-[13px] font-bold text-white shadow-soft transition hover:bg-plum"
        >
          إتمام الطلب
          <Icon name="arrowStart" className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
