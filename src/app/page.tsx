import Link from "next/link";
import { getProducts } from "@/lib/products";
import { CATEGORIES } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import { STORE } from "@/lib/types";

export const dynamic = "force-dynamic";

const BRANDS = [
  "YSL", "Chanel", "D&G", "Dior", "Givenchy", "Paco Rabanne", "Narciso",
  "Roberto Cavalli", "Jean Paul", "Elie Saab", "Versace", "Lancôme",
];

function CategoryIcon({ cat }: { cat: string }) {
  const common = "h-7 w-7";
  switch (cat) {
    case "women":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={common}>
          <path d="M9 4.5 12 7l3-2.5 4 4-2 2.5v8.5a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V11L5 8.5z" />
        </svg>
      );
    case "men":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={common}>
          <circle cx="10" cy="8" r="3" />
          <path d="M6.5 13.5 10 12l3.5 1.5L15 19H5z" />
          <path d="m15 9 5-5m0 0h-3.5M20 4v3.5" />
        </svg>
      );
    case "unisex":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={common}>
          <rect x="9" y="8" width="6" height="11" rx="1.5" />
          <path d="M10.5 8V5.5h3V8M9.5 4h5" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={common}>
          <rect x="4" y="9" width="16" height="11" rx="1.5" />
          <path d="M12 9v11M4 9h16M12 9s-1.5-5-4.5-5a2.5 2.5 0 0 0 0 5M12 9s1.5-5 4.5-5a2.5 2.5 0 0 1 0 5" />
        </svg>
      );
  }
}

export default async function HomePage() {
  const products = await getProducts();
  const bestSellers = products.filter((p) => p.featured).slice(0, 8);
  const newList = [...products].reverse().slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="mt-4 overflow-hidden rounded-4xl bg-gradient-to-l from-brand-100 via-[#F2EAFB] to-blush p-6 shadow-soft md:p-10">
        <div className="grid items-center gap-6 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <span className="inline-block rounded-full bg-brand-600 px-3 py-1 text-[11px] font-bold text-white">
              وصل حديثاً
            </span>
            <h1 className="mt-3 text-3xl font-black leading-tight text-ink md:text-5xl">
              عطور أصلية
              <br />
              <span className="text-brand-600">لكل مزاج ومناسبة</span>
            </h1>
            <p className="mt-3 max-w-md text-sm leading-7 text-ink-soft md:text-base">
              من أشهر الماركات العالمية: YSL، شانيل، دولتشي آند غابانا، جيفنشي
              وأكثر — مضمونة أورجيال 100٪.
            </p>
            <Link
              href="/explore"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700"
            >
              تسوّق الآن
              <span aria-hidden>←</span>
            </Link>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-3 rounded-4xl bg-white/50" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero.jpg"
                alt="متجر فيوليت للعطور"
                className="relative aspect-[4/3] w-full rounded-4xl object-cover shadow-soft"
              />
            </div>
          </div>
        </div>
      </section>

      {/* USP strip */}
      <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { icon: "✅", title: "أورجيال 100٪", sub: "ضمان الاستبدال" },
          { icon: "🚚", title: "توصيل سريع", sub: "دمشق والريف" },
          { icon: "💵", title: "الدفع عند الاستلام", sub: "خالية من المخاطر" },
        ].map((u) => (
          <div
            key={u.title}
            className="flex items-center gap-3 rounded-3xl border border-brand-100 bg-white px-4 py-3.5 shadow-card"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-xl">
              {u.icon}
            </span>
            <div>
              <p className="text-sm font-extrabold">{u.title}</p>
              <p className="text-xs text-ink-faint">{u.sub}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold">الأقسام</h2>
          <Link href="/explore" className="text-sm font-bold text-brand-600">
            عرض الكل
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              href={`/explore?cat=${c.key}`}
              className="group flex flex-col items-center gap-2 rounded-3xl border border-brand-100 bg-white py-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand-300"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
                <CategoryIcon cat={c.key} />
              </span>
              <span className="text-xs font-bold md:text-sm">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold">الأكثر مبيعاً</h2>
          <Link href="/explore" className="text-sm font-bold text-brand-600">
            عرض الكل
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-5">
          {bestSellers.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Brands marquee */}
      <section className="mt-10 overflow-hidden rounded-3xl border border-brand-100 bg-white py-4 shadow-card">
        <div className="flex w-max animate-marquee gap-8 whitespace-nowrap px-4">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span
              key={i}
              className="font-display text-lg font-semibold tracking-[0.2em] text-brand-800/70"
            >
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold">وصل حديثاً</h2>
          <Link href="/explore" className="text-sm font-bold text-brand-600">
            عرض الكل
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-5">
          {newList.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* About / store */}
      <section className="mt-12 grid items-center gap-6 rounded-4xl border border-brand-100 bg-white p-6 shadow-soft md:grid-cols-2 md:p-10">
        <div className="grid grid-cols-2 gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/store-1.jpg"
            alt="أرفف العطور"
            className="col-span-2 h-44 w-full rounded-3xl object-cover md:h-56"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/store-2.jpg"
            alt="أرفف العطور"
            className="h-32 w-full rounded-3xl object-cover md:h-40"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo.jpg"
            alt="شعار فيوليت"
            className="h-32 w-full rounded-3xl object-cover md:h-40"
          />
        </div>
        <div>
          <p className="font-display text-3xl font-bold tracking-[0.3em] text-brand-700">
            VIOLET
          </p>
          <h2 className="mt-2 text-2xl font-extrabold leading-snug">
            تجربة تسوّق فاخرة في قلب دمشق
          </h2>
          <p className="mt-3 text-sm leading-7 text-ink-soft">
            {STORE.tagline} — نوصل في دمشق وريفها لكافة التجارات، ونتشرف بثقتكم
            وخدمتكم دائماً.
          </p>
          <ul className="mt-4 space-y-2.5 text-sm font-semibold text-ink-soft">
            <li>📍 {STORE.address}</li>
            <li dir="ltr" className="text-start">
              📞 {STORE.phone}
            </li>
          </ul>
          <a
            href={STORE.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-[#F58529] via-[#DD2A7B] to-[#8134AF] px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:opacity-90"
          >
            تابعنا على إنستغرام
          </a>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="mt-10 overflow-hidden rounded-4xl bg-gradient-to-l from-brand-700 to-brand-500 p-8 text-center text-white shadow-soft md:p-12">
        <h2 className="text-2xl font-black md:text-3xl">
          محتاج مساعدة باختيار عطرك؟
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-white/85">
          فريقنا جاهز يساعدك تختار العطر المناسب لك أو هدية مميزة — تواصل معنا
          الآن على واتساب.
        </p>
        <a
          href={`https://wa.me/${STORE.phoneIntl}`}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-extrabold text-brand-700 shadow-soft transition hover:bg-brand-50"
        >
          تواصل عبر واتساب
        </a>
      </section>
    </div>
  );
}
