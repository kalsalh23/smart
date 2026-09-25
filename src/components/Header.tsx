"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useStore } from "./StoreContext";
import { STORE } from "@/lib/types";

function Icon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    home: <path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    heart: <path d="M12 20.5S4 15.3 4 9.9A4.4 4.4 0 0 1 8.4 5.5c1.5 0 2.9.8 3.6 2a4.2 4.2 0 0 1 3.6-2A4.4 4.4 0 0 1 20 9.9c0 5.4-8 10.6-8 10.6z" />,
    bag: (
      <>
        <path d="M6 8h12l-1 12a1 1 0 0 1-1 .9H8a1 1 0 0 1-1-.9z" />
        <path d="M9 10V6a3 3 0 0 1 6 0v4" />
      </>
    ),
    grid: (
      <>
        <rect x="4" y="4" width="7" height="7" rx="1.5" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" />
      </>
    ),
    compass: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="m15 9-2 5-4 1 2-5z" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths[name]}
    </svg>
  );
}

export function Badge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="absolute -top-1.5 -left-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
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
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:h-[72px]">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo.jpg"
            alt={STORE.nameEn}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-brand-100 md:h-11 md:w-11"
          />
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold tracking-[0.28em] text-brand-700">
              VIOLET
            </span>
            <span className="block text-[11px] font-semibold text-ink-faint">
              فيوليت للعطور الأصلية
            </span>
          </span>
        </Link>

        <nav className="mr-6 hidden items-center gap-6 text-sm font-semibold text-ink-soft md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`transition hover:text-brand-600 ${
                pathname === l.href ? "text-brand-700" : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <form
          action="/explore"
          className="ms-auto hidden w-64 items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-4 py-2 md:flex"
        >
          <Icon name="search" className="h-5 w-5 text-ink-faint" />
          <input
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحثي عن عطرك المفضل..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink-faint"
          />
        </form>

        <div className="ms-auto flex items-center gap-1.5 md:ms-3">
          <Link
            href="/explore"
            aria-label="بحث"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-brand-50 md:hidden"
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
    </header>
  );
}
