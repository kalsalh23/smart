"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { CATEGORIES, type Product } from "@/lib/types";

interface Props {
  products: Product[];
  brands: string[];
  initialQ: string;
  initialCat: string;
}

export default function ExploreClient({ products, brands, initialQ, initialCat }: Props) {
  const [q, setQ] = useState(initialQ);
  const [cat, setCat] = useState(initialCat || "all");
  const [brand, setBrand] = useState("all");
  const [sort, setSort] = useState("featured");

  const filtered = useMemo(() => {
    let list = products;
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          p.brand.toLowerCase().includes(needle) ||
          (p.description || "").toLowerCase().includes(needle)
      );
    }
    if (cat !== "all") list = list.filter((p) => p.category === cat);
    if (brand !== "all") list = list.filter((p) => p.brand === brand);
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "name":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name, "ar"));
        break;
      default:
        list = [...list].sort(
          (a, b) => Number(b.featured) - Number(a.featured)
        );
    }
    return list;
  }, [products, q, cat, brand, sort]);

  return (
    <div>
      {/* Search */}
      <div className="flex items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-3 shadow-card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-5 w-5 shrink-0 text-ink-faint">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحثي عن عطر أو ماركة..."
          className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-ink-faint"
        />
        {q && (
          <button onClick={() => setQ("")} aria-label="مسح" className="text-ink-faint hover:text-ink">
            ✕
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {[{ key: "all", label: "الكل" }, ...CATEGORIES].map((c) => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
              cat === c.key
                ? "bg-brand-600 text-white shadow-soft"
                : "border border-brand-100 bg-white text-ink-soft hover:border-brand-300"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Brand chips */}
      <div className="no-scrollbar mt-2.5 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setBrand("all")}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
            brand === "all"
              ? "bg-ink text-white"
              : "border border-brand-100 bg-white text-ink-faint hover:border-brand-300"
          }`}
        >
          كل الماركات
        </button>
        {brands.map((b) => (
          <button
            key={b}
            onClick={() => setBrand(b)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 font-display text-xs font-semibold tracking-wide transition ${
              brand === b
                ? "bg-ink text-white"
                : "border border-brand-100 bg-white text-ink-faint hover:border-brand-300"
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Sort + count */}
      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm font-bold text-ink-soft">
          {filtered.length} عطر متوفر
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-brand-100 bg-white px-3 py-2 text-xs font-bold text-ink-soft outline-none"
        >
          <option value="featured">الأكثر رواجاً</option>
          <option value="price-asc">السعر: الأقل أولاً</option>
          <option value="price-desc">السعر: الأعلى أولاً</option>
          <option value="name">الاسم أ-ي</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-4xl">🔍</p>
          <p className="mt-3 font-bold">لا توجد نتائج مطابقة</p>
          <p className="mt-1 text-sm text-ink-faint">
            جرّبي كلمة بحث مختلفة أو غيّري الفلاتر
          </p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-5">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
