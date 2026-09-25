"use client";

import Link from "next/link";
import { useStore } from "./StoreContext";
import Icon from "./Icon";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wished = isWishlisted(product.slug);
  const discount =
    product.old_price && product.old_price > product.price
      ? Math.round((1 - product.price / product.old_price) * 100)
      : null;

  return (
    <div className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <button
        aria-label="أضف للمفضلة"
        onClick={() => toggleWishlist(product)}
        className={`absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5 transition ${
          wished ? "text-rose-600" : "text-ink-soft hover:text-rose-500"
        }`}
      >
        <Icon name="heart" className="h-[17px] w-[17px]" strokeWidth={wished ? 2 : 1.5} />
      </button>

      {discount && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-[#7E2243] px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
          خصم {discount}%
        </span>
      )}

      <Link href={`/product/${product.slug}`} className="block">
        <div className="aspect-square w-full overflow-hidden bg-brand-50/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image_url || "/products/placeholder.svg"}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-4 text-start">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-700">
          {product.brand}
        </p>
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 min-h-[2.7em] text-[13px] font-bold leading-snug text-ink transition hover:text-plum"
        >
          {product.name}
        </Link>
        {product.size && (
          <p className="text-[11px] text-ink-faint">{product.size}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[17px] font-extrabold tracking-tight text-ink">
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
            className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white shadow-sm transition hover:bg-plum disabled:cursor-not-allowed disabled:bg-ink-faint/30"
          >
            <Icon name="bag" className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!product.in_stock && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/70 text-[13px] font-bold text-ink backdrop-blur-[1px]">
          نفدت الكمية
        </span>
      )}
    </div>
  );
}
