"use client";

import Link from "next/link";
import { useStore } from "@/components/StoreContext";
import { formatPrice } from "@/lib/format";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-blush text-4xl">
          💜
        </span>
        <h1 className="mt-5 text-xl font-extrabold">قائمة المفضلة فارغة</h1>
        <p className="mt-2 text-sm leading-7 text-ink-faint">
          اضغط على أيقونة القلب في أي عطر لحفظه هنا
        </p>
        <Link
          href="/explore"
          className="mt-6 rounded-full bg-brand-600 px-7 py-3 text-sm font-extrabold text-white shadow-soft transition hover:bg-brand-700"
        >
          استكشف العطور
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-black">المفضلة</h1>
      <div className="mt-5 space-y-3">
        {wishlist.map((item) => (
          <div
            key={item.slug}
            className="flex items-center gap-3 rounded-3xl border border-brand-100 bg-white p-3 shadow-card"
          >
            <Link href={`/product/${item.slug}`} className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_url || "/products/placeholder.svg"}
                alt={item.name}
                className="h-20 w-20 rounded-2xl object-cover"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-brand-500">{item.brand}</p>
              <Link
                href={`/product/${item.slug}`}
                className="line-clamp-1 text-sm font-extrabold hover:text-brand-700"
              >
                {item.name}
              </Link>
              <p className="mt-0.5 text-base font-extrabold text-ink">
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
                className="rounded-full bg-brand-600 px-4 py-2 text-xs font-extrabold text-white transition hover:bg-brand-700"
              >
                أضف للسلة
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
                className="rounded-full border border-brand-100 px-4 py-2 text-xs font-bold text-ink-faint transition hover:border-rose-200 hover:text-rose-500"
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
