import Link from "next/link";
import { STORE } from "@/lib/types";

export default function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white/75">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo.jpg"
              alt="VIOLET"
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="font-display text-xl font-bold tracking-[0.3em] text-white">
                VIOLET
              </p>
              <p className="text-sm font-semibold text-brand-300">
                {STORE.tagline}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7">
            كل العطورات المكية الأورجيال بانتظارك. نوصل في دمشق وريفها لكافة
            التجارات، ونتشرف بثقتكم وخدمتكم دائماً.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-white">تواصل معنا</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <span aria-hidden>📍</span>
              {STORE.address}
            </li>
            <li className="flex items-center gap-2" dir="ltr">
              <span aria-hidden>📞</span>
              <a href={`tel:${STORE.phone}`} className="hover:text-white">
                {STORE.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden>✈️</span>
              <a
                href={STORE.instagram}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                violeet_perfumess@ على إنستغرام
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-white">روابط سريعة</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/explore" className="hover:text-white">
                كل العطور
              </Link>
            </li>
            <li>
              <Link href="/explore?cat=women" className="hover:text-white">
                عطور نسائية
              </Link>
            </li>
            <li>
              <Link href="/explore?cat=men" className="hover:text-white">
                عطور رجالية
              </Link>
            </li>
            <li>
              <Link href="/explore?cat=gift" className="hover:text-white">
                أطقم وهدايا
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} VIOLET PERFUME — دمشق، سوريا. جميع الحقوق
        محفوظة.
      </div>
    </footer>
  );
}
