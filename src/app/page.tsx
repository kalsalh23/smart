import Link from "next/link";
import { getProducts } from "@/lib/products";
import { CATEGORIES, STORE } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import SectionHead from "@/components/SectionHead";
import Icon from "@/components/Icon";

export const dynamic = "force-dynamic";

const BRANDS = [
  "YSL", "CHANEL", "D&G", "DIOR", "GIVENCHY", "PACO RABANNE", "NARCISO",
  "ROBERTO CAVALLI", "JEAN PAUL", "ELIE SAAB", "VERSACE", "LANCÔME",
];

function CategoryIcon({ cat, className = "h-6 w-6" }: { cat: string; className?: string }) {
  switch (cat) {
    case "women":
      return <Icon name="dress" className={className} />;
    case "men":
      return <Icon name="suit" className={className} />;
    case "unisex":
      return <Icon name="bottle" className={className} />;
    default:
      return <Icon name="gift" className={className} />;
  }
}

function OrnamentDivider() {
  return (
    <div className="mt-16 flex items-center justify-center gap-3">
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-500/50" />
      <Icon name="sparkle" className="h-4 w-4 text-gold-500" strokeWidth={1.4} />
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-500/50" />
    </div>
  );
}

export default async function HomePage() {
  const products = await getProducts();
  const bestSellers = products.filter((p) => p.featured).slice(0, 8);
  const newList = [...products].reverse().slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Hero — editorial */}
      <section className="mt-5 overflow-hidden rounded-4xl border border-ink/8 bg-white shadow-soft">
        <div className="grid items-stretch md:grid-cols-2">
          <div className="order-2 flex flex-col justify-center p-7 md:order-1 md:p-12">
            <p className="eyebrow">VIOLET — DAMASCUS</p>
            <h1 className="mt-3 font-display-ar text-[34px] font-bold leading-[1.25] text-ink md:text-[44px]">
              عطورٌ أصلية
              <br />
              <span className="text-brand-700">لكلّ مزاجٍ ومناسبة</span>
            </h1>
            <div className="mt-4 h-px w-24 bg-gradient-to-l from-gold-500 to-gold-500/0" />
            <p className="mt-4 max-w-md text-sm leading-8 text-ink-soft md:text-[15px]">
              من أشهر الماركات العالمية — YSL، شانيل، دولتشي آند غابانا،
              جيفنشي وأكثر. مضمونة أورجيال 100٪ مع تغليف هدايا فاخر.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-3.5 text-[13px] font-bold text-white transition hover:bg-plum"
              >
                تسوّق التشكيلة
                <Icon name="arrowStart" className="h-4 w-4" />
              </Link>
              <a
                href={`https://wa.me/${STORE.phoneIntl}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-[13px] font-bold text-ink transition hover:border-plum hover:text-plum"
              >
                <Icon name="whatsapp" className="h-4 w-4 text-[#1FA855]" />
                اطلبي عبر واتساب
              </a>
            </div>
          </div>

          <div className="order-1 relative md:order-2">
            <div className="relative h-full min-h-[260px] p-4 md:p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero.jpg"
                alt="متجر فيوليت للعطور — دمشق"
                className="h-full w-full rounded-3xl object-cover"
              />
              {/* authenticity seal */}
              <div className="absolute bottom-6 right-6 flex h-20 w-20 flex-col items-center justify-center rounded-full border border-gold-400 bg-white/95 text-center shadow-soft md:h-24 md:w-24">
                <Icon name="shield" className="h-5 w-5 text-gold-600" strokeWidth={1.4} />
                <span className="mt-1 text-[10px] font-extrabold leading-tight text-ink">
                  أصلي
                  <br />
                  100٪
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USP strip */}
      <section className="mt-5 grid grid-cols-1 divide-y divide-ink/6 overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-card sm:grid-cols-3 sm:divide-y-0 sm:divide-x sm:divide-x-reverse">
        {[
          { icon: "shield", title: "أورجيال 100٪", sub: "ضمان الأصالة والاستبدال" },
          { icon: "truck", title: "توصيل سريع", sub: "داخل دمشق وريفها" },
          { icon: "cash", title: "الدفع عند الاستلام", sub: "تجربة شراء مريحة" },
        ].map((u) => (
          <div key={u.title} className="flex items-center gap-3.5 px-5 py-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-400/70 text-gold-700">
              <Icon name={u.icon as "shield"} className="h-5 w-5" strokeWidth={1.4} />
            </span>
            <div>
              <p className="text-[13px] font-extrabold text-ink">{u.title}</p>
              <p className="mt-0.5 text-[11px] text-ink-faint">{u.sub}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="mt-14">
        <SectionHead eyebrow="COLLECTIONS" title="تسوّقي حسب القسم" linkHref="/explore" />
        <div className="grid grid-cols-4 gap-3 md:gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              href={`/explore?cat=${c.key}`}
              className="group flex flex-col items-center gap-2.5 rounded-2xl border border-ink/8 bg-white py-5 shadow-card transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition group-hover:bg-plum group-hover:text-white">
                <CategoryIcon cat={c.key} />
              </span>
              <span className="text-[11px] font-bold text-ink md:text-[13px]">
                {c.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="mt-14">
        <SectionHead eyebrow="BEST SELLERS" title="الأكثر مبيعاً" linkHref="/explore" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
          {bestSellers.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Brands marquee */}
      <section className="mt-14 overflow-hidden rounded-2xl border border-ink/8 bg-white py-5 shadow-card">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap px-5">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span
              key={i}
              className="font-display text-base font-medium tracking-[0.3em] text-ink/45"
            >
              {b}
            </span>
          ))}
        </div>
      </section>

      <OrnamentDivider />

      {/* New arrivals */}
      <section className="mt-10">
        <SectionHead eyebrow="NEW ARRIVALS" title="وصل حديثاً" linkHref="/explore" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
          {newList.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* About / store */}
      <section className="mt-16 grid items-center gap-8 overflow-hidden rounded-4xl border border-ink/8 bg-white p-6 shadow-soft md:grid-cols-2 md:p-10">
        <div className="grid grid-cols-2 gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/store-1.jpg"
            alt="أرفف العطور في المتجر"
            className="col-span-2 h-44 w-full rounded-2xl object-cover md:h-60"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/store-2.jpg"
            alt="عطور ماركات عالمية"
            className="h-32 w-full rounded-2xl object-cover md:h-44"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo.jpg"
            alt="شعار فيوليت"
            className="h-32 w-full rounded-2xl object-cover md:h-44"
          />
        </div>
        <div>
          <p className="eyebrow">OUR STORE</p>
          <h2 className="mt-2 font-display-ar text-[28px] font-bold leading-snug text-ink md:text-4xl">
            تجربة تسوّقٍ فاخرة
            <br />
            في قلب دمشق
          </h2>
          <div className="mt-4 h-px w-24 bg-gradient-to-l from-gold-500 to-gold-500/0" />
          <p className="mt-4 text-sm leading-8 text-ink-soft">
            {STORE.tagline} — نوصل في دمشق وريفها لكافة التجارات، ونتشرف بثقتكم
            وخدمتكم دائماً.
          </p>
          <ul className="mt-6 space-y-3.5 text-[13px] font-semibold text-ink-soft">
            <li className="flex items-center gap-3">
              <Icon name="pin" className="h-[18px] w-[18px] shrink-0 text-gold-600" />
              {STORE.address}
            </li>
            <li className="flex items-center gap-3" dir="ltr">
              <Icon name="phone" className="h-[18px] w-[18px] shrink-0 text-gold-600" />
              <span className="font-display text-base tracking-wider">{STORE.phone}</span>
            </li>
            <li className="flex items-center gap-3">
              <Icon name="clock" className="h-[18px] w-[18px] shrink-0 text-gold-600" />
              يومياً من 10 صباحاً حتى 10 مساءً
            </li>
          </ul>
          <a
            href={STORE.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3 text-[13px] font-bold text-white transition hover:bg-plum"
          >
            <Icon name="instagram" className="h-4 w-4" />
            تابعينا على إنستغرام
          </a>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section
        className="mt-14 overflow-hidden rounded-4xl bg-ink p-9 text-center shadow-soft md:p-14"
        style={{
          backgroundImage:
            "radial-gradient(600px 220px at 50% 0%, rgba(123,63,190,.28), transparent 70%)",
        }}
      >
        <p className="eyebrow !text-gold-400">PERSONAL SERVICE</p>
        <h2 className="mx-auto mt-3 max-w-xl font-display-ar text-[28px] font-bold leading-snug text-white md:text-4xl">
          محتاجة مساعدة باختيار عطرك؟
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-8 text-white/65">
          فريقنا جاهز يساعدك تختاري العطر المناسب لك أو هدية مميزة — تواصلي معنا
          الآن على واتساب وسنرشدك بخبرة.
        </p>
        <a
          href={`https://wa.me/${STORE.phoneIntl}`}
          target="_blank"
          rel="noreferrer"
          className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-[13px] font-extrabold text-ink shadow-soft transition hover:bg-gold-300 hover:text-ink"
        >
          <Icon name="whatsapp" className="h-[18px] w-[18px] text-[#1FA855]" />
          تواصلي عبر واتساب
        </a>
      </section>
    </div>
  );
}
