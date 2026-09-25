import Link from "next/link";
import Icon from "@/components/Icon";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full border border-ink/10 bg-white text-brand-700 shadow-card">
        <Icon name="bottle" className="h-8 w-8" strokeWidth={1.3} />
      </span>
      <h1 className="mt-6 font-display-ar text-2xl font-bold">الصفحة غير موجودة</h1>
      <p className="mt-2 text-[13px] leading-7 text-ink-faint">
        يبدو أن العطر الذي تبحثين عنه غير متاح — جرّبي الاستكشاف من جديد
      </p>
      <Link
        href="/explore"
        className="mt-7 rounded-full bg-ink px-8 py-3.5 text-[13px] font-bold text-white shadow-soft transition hover:bg-plum"
      >
        تسوّقي العطور
      </Link>
    </div>
  );
}
