"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "./StoreContext";

function Icon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    home: <path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />,
    compass: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="m15 9-2 5-4 1 2-5z" />
      </>
    ),
    heart: <path d="M12 20.5S4 15.3 4 9.9A4.4 4.4 0 0 1 8.4 5.5c1.5 0 2.9.8 3.6 2a4.2 4.2 0 0 1 3.6-2A4.4 4.4 0 0 1 20 9.9c0 5.4-8 10.6-8 10.6z" />,
    bag: (
      <>
        <path d="M6 8h12l-1 12a1 1 0 0 1-1 .9H8a1 1 0 0 1-1-.9z" />
        <path d="M9 10V6a3 3 0 0 1 6 0v4" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths[name]}
    </svg>
  );
}

const items = [
  { href: "/", label: "الرئيسية", icon: "home" },
  { href: "/explore", label: "تسوّق", icon: "compass" },
  { href: "/wishlist", label: "المفضلة", icon: "heart" },
  { href: "/cart", label: "السلة", icon: "bag" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { cartCount, wishlist } = useStore();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-ink pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="grid grid-cols-4">
        {items.map((it) => {
          const active =
            it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
          const badge = it.icon === "bag" ? cartCount : it.icon === "heart" ? wishlist.length : 0;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition ${
                active ? "text-brand-300" : "text-white/60"
              }`}
            >
              <span className="relative">
                <Icon name={it.icon} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -left-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[9px] font-bold text-white">
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </span>
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
