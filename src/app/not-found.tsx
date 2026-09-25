import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <span className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 text-4xl">
        🧴
      </span>
      <h1 className="mt-5 text-2xl font-black">الصفحة غير موجودة</h1>
      <p className="mt-2 text-sm leading-7 text-ink-faint">
        يبدو أن العطر الذي تبحثين عنه غير متاح — جرّبي الاستكشاف من جديد
      </p>
      <Link
        href="/explore"
        className="mt-6 rounded-full bg-brand-600 px-7 py-3 text-sm font-extrabold text-white shadow-soft transition hover:bg-brand-700"
      >
        تسوّق العطور
      </Link>
    </div>
  );
}
