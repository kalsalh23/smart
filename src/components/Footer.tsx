import Link from "next/link";
import Icon from "./Icon";
import { STORE } from "@/lib/types";

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-white/70">
      {/* Gold hairline */}
      <div className="h-px bg-gradient-to-l from-transparent via-gold-500/60 to-transparent" />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo.jpg"
              alt="VIOLET"
              className="h-14 w-14 rounded-full object-cover ring-1 ring-gold-400/60"
            />
            <div>
              <p className="font-display text-2xl font-semibold tracking-[0.35em] text-white">
                VIOLET
              </p>
              <p className="mt-1 text-[11px] font-medium tracking-wide text-gold-400">
                للعطور الأصلية — دمشق
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-xs text-[13px] leading-7 text-white/60">
            كل العطورات المكية الأورجيال بانتظارك. نوصل في دمشق وريفها لكافة
            التجارات، ونتشرف بثقتكم وخدمتكم دائماً.
          </p>
        </div>

        <div>
          <h3 className="mb-5 text-[11px] font-bold tracking-[0.25em] text-gold-400">
            تواصلي معنا
          </h3>
          <ul className="space-y-4 text-[13px]">
            <li className="flex items-start gap-3">
              <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
              {STORE.address}
            </li>
            <li className="flex items-center gap-3" dir="ltr">
              <Icon name="phone" className="h-4 w-4 shrink-0 text-gold-400" />
              <a href={`tel:${STORE.phone}`} className="hover:text-white">
                {STORE.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Icon name="instagram" className="h-4 w-4 shrink-0 text-gold-400" />
              <a
                href={STORE.instagram}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                violeet_perfumess@
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-[11px] font-bold tracking-[0.25em] text-gold-400">
            روابط سريعة
          </h3>
          <ul className="space-y-3.5 text-[13px]">
            {[
              { href: "/explore", label: "كل العطور" },
              { href: "/explore?cat=women", label: "عطور نسائية" },
              { href: "/explore?cat=men", label: "عطور رجالية" },
              { href: "/explore?cat=gift", label: "أطقم وهدايا" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-gold-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-[11px] text-white/40">
        © {new Date().getFullYear()} VIOLET PERFUME — دمشق، سوريا. جميع الحقوق
        محفوظة.
      </div>
    </footer>
  );
}
