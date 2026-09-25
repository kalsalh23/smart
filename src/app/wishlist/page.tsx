"use client";

import Link from "next/link";
import { useStore } from "@/components/StoreContext";
import Icon from "@/components/Icon";
import { formatPrice } from "@/lib/format";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-ink/10 bg-white text-rose-500 shadow-card">
          <Icon name="heart" className="h-8 w-8" strokeWidth={1.3} />
        </span>
        <h1 className="mt-6 font-display-ar text-2xl font-bold">قائمة المفضلة فارغة</h1>
        <p className="mt-2 text-[13px] leading-7 text-ink-faint">
          اضغطي على أيقونة القلب في أي عطر لحفظه هنا
        </p>
        <Link
          href="/explore"
          className="mt-7 rounded-full bg-ink px-8 py-3.5 text-[13px] font-bold text-white shadow-soft transition hover:bg-plum"
        >
          استكشفي العطور
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="font-display-ar text-2xl font-bold md:text-3xl">المفضلة</h1>
      <div className="mt-5 space-y-3">
        {wishlist.map((item) => (
          <div
            key={item.slug}
            className="flex items-center gap-3.5 rounded-2xl border border-ink/8 bg-white p-3.5 shadow-card"
          >
            <Link href={`/product/${item.slug}`} className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_url || "/products/placeholder.svg"}
                alt={item.name}
                className="h-20 w-20 rounded-xl object-cover ring-1 ring-black/5"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-700">
                {item.brand}
              </p>
              <Link
                href={`/product/${item.slug}`}
                className="line-clamp-1 text-sm font-bold transition hover:text-plum"
              >
                {item.name}
              </Link>
              <p className="mt-1 text-[17px] font-extrabold text-ink">
                {formatPrice(item.price)}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() =>
                  addToCart(
                    {
                      id: item.slug,
                      slug: item.slug,
                      name: item.name,
                      brand: item.brand,
                      category: "unisex",
                      price: item.price,
                      old_price: null,
                      size: item.size,
                      description: null,
                      notes_top: null,
                      notes_heart: null,
                      notes_base: null,
                      image_url: item.image_url,
                      in_stock: true,
                      featured: false,
                    },
                    1
                  )
                }
                className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-white transition hover:bg-plum"
              >
                أضيفي للسلة
              </button>
              <button
                onClick={() =>
                  toggleWishlist({
                    id: item.slug,
                    slug: item.slug,
                    name: item.name,
                    brand: item.brand,
                    category: "unisex",
                    price: item.price,
                    old_price: null,
                    size: item.size,
                    description: null,
                    notes_top: null,
                    notes_heart: null,
                    notes_base: null,
                    image_url: item.image_url,
                    in_stock: true,
                    featured: false,
                  })
                }
                className="rounded-full border border-ink/10 px-4 py-2 text-xs font-bold text-ink-faint transition hover:border-rose-200 hover:text-rose-600"
              >
                إزالة
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
