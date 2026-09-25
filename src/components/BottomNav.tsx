"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "./StoreContext";
import Icon from "./Icon";

const items = [
  { href: "/", label: "الرئيسية", icon: "home" },
  { href: "/explore", label: "تسوّق", icon: "compass" },
  { href: "/wishlist", label: "المفضلة", icon: "heart" },
  { href: "/cart", label: "السلة", icon: "bag" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const { cartCount, wishlist } = useStore();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-ink pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="grid grid-cols-4">
        {items.map((it) => {
          const active =
            it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
          const badge =
            it.icon === "bag" ? cartCount : it.icon === "heart" ? wishlist.length : 0;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`relative flex flex-col items-center gap-1 pt-2.5 pb-2 text-[10px] font-semibold transition ${
                active ? "text-gold-300" : "text-white/55"
              }`}
            >
              <span className={`absolute top-0 h-[2px] w-8 rounded-full ${active ? "bg-gold-400" : "bg-transparent"}`} />
              <span className="relative">
                <Icon name={it.icon} className="h-[22px] w-[22px]" />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -left-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-plum px-1 text-[9px] font-bold text-white ring-1 ring-white/20">
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
