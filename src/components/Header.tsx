"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useStore } from "./StoreContext";
import Icon from "./Icon";
import { STORE } from "@/lib/types";

function Badge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="absolute -top-1 -left-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-plum px-1 text-[10px] font-bold text-white ring-2 ring-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function Header() {
  const { cartCount, wishlist } = useStore();
  const pathname = usePathname();
  const [q, setQ] = useState("");

  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/explore", label: "تسوّق" },
    { href: "/explore?cat=gift", label: "أطقم وهدايا" },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement bar */}
      <div className="flex items-center justify-center gap-2 bg-ink px-4 py-2 text-[11px] font-medium text-white/85">
        <Icon name="truck" className="h-3.5 w-3.5 text-gold-400" />
        توصيل لكل دمشق وريفها
        <span className="text-white/30">•</span>
        الدفع عند الاستلام
      </div>

      <div className="border-b border-ink/8 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:h-[74px]">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo.jpg"
              alt={STORE.nameEn}
              className="h-10 w-10 rounded-full object-cover ring-1 ring-gold-400/60 md:h-12 md:w-12"
            />
            <span className="leading-none">
              <span className="block font-display text-xl font-semibold tracking-[0.3em] text-ink">
                VIOLET
              </span>
              <span className="mt-1 block text-[10px] font-medium text-ink-faint">
                للعطور الأصلية — دمشق
              </span>
            </span>
          </Link>

          <nav className="mr-8 hidden items-center gap-7 text-[13px] font-semibold text-ink-soft md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`transition hover:text-plum ${
                  pathname === l.href ? "text-plum" : ""
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <form
            action="/explore"
            className="ms-auto hidden w-60 items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 focus-within:border-brand-300 md:flex"
          >
            <Icon name="search" className="h-4 w-4 text-ink-faint" />
            <input
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحثي عن عطرك المفضل..."
              className="w-full bg-transparent text-[13px] outline-none placeholder:text-ink-faint"
            />
          </form>

          <div className="ms-auto flex items-center gap-1 md:ms-3">
            <Link
              href="/explore"
              aria-label="بحث"
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-brand-50 md:hidden"
            >
              <Icon name="search" />
            </Link>
            <Link
              href="/wishlist"
              aria-label="المفضلة"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-brand-50"
            >
              <Icon name="heart" />
              <Badge count={wishlist.length} />
            </Link>
            <Link
              href="/cart"
              aria-label="السلة"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-brand-50"
            >
              <Icon name="bag" />
              <Badge count={cartCount} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
