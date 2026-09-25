"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/components/StoreContext";
import { createPublicClient } from "@/lib/supabase";
import { formatPrice } from "@/lib/format";
import { STORE, type Order } from "@/lib/types";

const CITIES = ["دمشق", "ريف دمشق", "دمشق وريفها"];

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState(CITIES[0]);
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Order | null>(null);

  if (cart.length === 0 && !done) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <span className="text-5xl">🛍️</span>
        <h1 className="mt-4 text-xl font-extrabold">سلتك فارغة</h1>
        <Link
          href="/explore"
          className="mt-6 rounded-full bg-brand-600 px-7 py-3 text-sm font-extrabold text-white"
        >
          ابدأ التسوّق
        </Link>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError("يرجى تعبئة الاسم والهاتف والعنوان");
      return;
    }
    setLoading(true);
    try {
      const supabase = createPublicClient();
      const payload = {
        customer_name: name.trim(),
        phone: phone.trim(),
        city,
        address: address.trim(),
        note: note.trim() || null,
        items: cart.map((i) => ({
          slug: i.slug,
          name: i.name,
          brand: i.brand,
          price: i.price,
          qty: i.qty,
          image_url: i.image_url,
        })),
        total: cartTotal,
      };
      // No .select() here: the SELECT policy is admin-only, so PostgREST
      // would return zero rows and .single() would fail on a successful insert.
      const { error: dbError } = await supabase.from("orders").insert(payload);
      if (dbError) throw dbError;

      setDone({
        ...payload,
        id: "local",
        status: "new",
        created_at: new Date().toISOString(),
      } as Order);
      clearCart();
    } catch {
      // Even if saving fails, the user can order via WhatsApp below
      setError("تعذّر حفظ الطلب تلقائياً — يمكنك إرسال الطلب عبر واتساب مباشرة.");
      setDone({
        id: "wa",
        customer_name: name.trim(),
        phone: phone.trim(),
        city,
        address: address.trim(),
        items: cart.map((i) => ({ ...i })),
        total: cartTotal,
        note: note.trim() || null,
        status: "new",
        created_at: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    const lines = done.items
      .map((i) => `• ${i.name} ×${i.qty} — ${formatPrice(i.price * i.qty)}`)
      .join("\n");
    const waText = encodeURIComponent(
      `مرحباً فيوليت 👋\nطلب جديد:\n${lines}\n\nالإجمالي: ${formatPrice(done.total)}\nالاسم: ${done.customer_name}\nالهاتف: ${done.phone}\nالمدينة: ${done.city}\nالعنوان: ${done.address}${done.note ? `\nملاحظات: ${done.note}` : ""}`
    );

    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <span className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-[#128C4A]/10 text-4xl">
          ✅
        </span>
        <h1 className="mt-4 text-2xl font-black">تم استلام طلبك!</h1>
        <p className="mt-2 text-sm leading-7 text-ink-soft">
          شكراً {done.customer_name} 🌸 سيتواصل معك فريق فيوليت قريباً لتأكيد
          الطلب وترتيب التوصيل.
        </p>
        <div className="mt-5 rounded-3xl border border-brand-100 bg-white p-4 text-start shadow-card">
          <p className="text-xs font-bold text-ink-faint">ملخص الطلب</p>
          <ul className="mt-2 space-y-1.5 text-xs font-semibold text-ink-soft">
            {done.items.map((i) => (
              <li key={i.slug} className="flex justify-between gap-2">
                <span className="line-clamp-1">{i.name} ×{i.qty}</span>
                <span>{formatPrice(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 flex justify-between border-t border-dashed border-brand-100 pt-2 text-sm font-black">
            <span>الإجمالي</span>
            <span className="text-brand-700">{formatPrice(done.total)}</span>
          </p>
        </div>
        <a
          href={`https://wa.me/${STORE.phoneIntl}?text=${waText}`}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3 text-sm font-extrabold text-white shadow-soft transition hover:opacity-90"
        >
          إرسال الطلب عبر واتساب
        </a>
        <p className="mt-4">
          <Link href="/explore" className="text-sm font-bold text-brand-600">
            متابعة التسوّق
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-black">إتمام الطلب</h1>
      <p className="mt-1 text-sm text-ink-faint">
        الدفع عند الاستلام — توصيل داخل دمشق وريفها
      </p>

      <form onSubmit={submit} className="mt-5 grid gap-5 md:grid-cols-5">
        <div className="space-y-4 md:col-span-3">
          <div className="rounded-3xl border border-brand-100 bg-white p-5 shadow-card">
            <h2 className="mb-4 text-sm font-extrabold">معلومات التوصيل</h2>
            <div className="space-y-3.5">
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-ink-soft">الاسم الكامل *</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: سارة أحمد"
                  className="w-full rounded-2xl border border-brand-100 bg-brand-50/50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-brand-400 focus:bg-white"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-ink-soft">رقم الهاتف / واتساب *</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  placeholder="09XXXXXXXX"
                  dir="ltr"
                  className="w-full rounded-2xl border border-brand-100 bg-brand-50/50 px-4 py-3 text-start text-sm font-semibold outline-none transition focus:border-brand-400 focus:bg-white"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-ink-soft">المدينة</span>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-2xl border border-brand-100 bg-brand-50/50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-brand-400 focus:bg-white"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-ink-soft">العنوان التفصيلي *</span>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="الحي، الشارع، أقرب معلم"
                  className="w-full rounded-2xl border border-brand-100 bg-brand-50/50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-brand-400 focus:bg-white"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-ink-soft">ملاحظات (اختياري)</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="وقت التوصيل المناسب، تغليف هدية..."
                  className="w-full resize-none rounded-2xl border border-brand-100 bg-brand-50/50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-brand-400 focus:bg-white"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="rounded-3xl border border-brand-100 bg-white p-5 shadow-card md:sticky md:top-24">
            <h2 className="mb-4 text-sm font-extrabold">ملخص السلة</h2>
            <ul className="space-y-3">
              {cart.map((i) => (
                <li key={i.slug} className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={i.image_url || "/products/placeholder.svg"}
                    alt={i.name}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-xs font-extrabold">{i.name}</p>
                    <p className="text-[11px] text-ink-faint">×{i.qty}</p>
                  </div>
                  <p className="text-xs font-extrabold">
                    {formatPrice(i.price * i.qty)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-dashed border-brand-100 pt-3 text-base font-black">
              <span>الإجمالي</span>
              <span className="text-brand-700">{formatPrice(cartTotal)}</span>
            </div>
            {error && (
              <p className="mt-3 rounded-2xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-full bg-brand-600 py-3.5 text-sm font-extrabold text-white shadow-soft transition hover:bg-brand-700 disabled:opacity-60"
            >
              {loading ? "جارٍ إرسال الطلب..." : "تأكيد الطلب"}
            </button>
            <p className="mt-3 text-center text-[11px] leading-5 text-ink-faint">
              بتأكيد الطلب أنت توافق على أن يتواصل معك فريقنا لتأكيد التفاصيل.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
