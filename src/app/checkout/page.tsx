"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/components/StoreContext";
import Icon from "@/components/Icon";
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
        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-ink/10 bg-white text-brand-700 shadow-card">
          <Icon name="bag" className="h-8 w-8" strokeWidth={1.3} />
        </span>
        <h1 className="mt-6 font-display-ar text-2xl font-bold">سلتك فارغة</h1>
        <Link
          href="/explore"
          className="mt-7 rounded-full bg-ink px-8 py-3.5 text-[13px] font-bold text-white shadow-soft transition hover:bg-plum"
        >
          ابدئي التسوّق
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
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold-400/70 bg-gold-500/10 text-gold-700">
          <Icon name="check" className="h-9 w-9" strokeWidth={1.8} />
        </span>
        <h1 className="mt-6 font-display-ar text-[28px] font-bold">تم استلام طلبك!</h1>
        <p className="mt-2 text-sm leading-8 text-ink-soft">
          شكراً {done.customer_name} 🌸 سيتواصل معك فريق فيوليت قريباً لتأكيد
          الطلب وترتيب التوصيل.
        </p>
        <div className="mt-6 rounded-2xl border border-ink/8 bg-white p-5 text-start shadow-card">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-faint">
            ملخص الطلب
          </p>
          <ul className="mt-3 space-y-2 text-[13px] font-semibold text-ink-soft">
            {done.items.map((i) => (
              <li key={i.slug} className="flex justify-between gap-2">
                <span className="line-clamp-1">{i.name} ×{i.qty}</span>
                <span className="font-bold text-ink">
                  {formatPrice(i.price * i.qty)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex justify-between border-t border-ink/10 pt-3">
            <span className="font-display-ar text-base font-bold">الإجمالي</span>
            <span className="font-display text-lg font-bold text-plum">
              {formatPrice(done.total)}
            </span>
          </p>
        </div>
        <a
          href={`https://wa.me/${STORE.phoneIntl}?text=${waText}`}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-[#1FA855] px-8 py-3.5 text-[13px] font-bold text-white shadow-soft transition hover:opacity-90"
        >
          <Icon name="whatsapp" className="h-[18px] w-[18px]" />
          إرسال الطلب عبر واتساب
        </a>
        <p className="mt-5">
          <Link href="/explore" className="text-[13px] font-bold text-plum underline-offset-4 hover:underline">
            متابعة التسوّق
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="font-display-ar text-2xl font-bold md:text-3xl">إتمام الطلب</h1>
      <p className="mt-1.5 text-[13px] text-ink-faint">
        الدفع عند الاستلام — توصيل داخل دمشق وريفها
      </p>

      <form onSubmit={submit} className="mt-6 grid gap-5 md:grid-cols-5">
        <div className="space-y-4 md:col-span-3">
          <div className="rounded-2xl border border-ink/8 bg-white p-5 shadow-card">
            <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">
              معلومات التوصيل
            </h2>
            <div className="space-y-3.5">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-ink-soft">الاسم الكامل *</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: سارة أحمد"
                  className="w-full rounded-xl border border-ink/10 bg-brand-50/40 px-4 py-3 text-sm font-semibold outline-none transition focus:border-brand-400 focus:bg-white"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-ink-soft">رقم الهاتف / واتساب *</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  placeholder="09XXXXXXXX"
                  dir="ltr"
                  className="w-full rounded-xl border border-ink/10 bg-brand-50/40 px-4 py-3 text-start text-sm font-semibold outline-none transition focus:border-brand-400 focus:bg-white"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-ink-soft">المدينة</span>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-ink/10 bg-brand-50/40 px-4 py-3 text-sm font-semibold outline-none transition focus:border-brand-400 focus:bg-white"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-ink-soft">العنوان التفصيلي *</span>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="الحي، الشارع، أقرب معلم"
                  className="w-full rounded-xl border border-ink/10 bg-brand-50/40 px-4 py-3 text-sm font-semibold outline-none transition focus:border-brand-400 focus:bg-white"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-ink-soft">ملاحظات (اختياري)</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="وقت التوصيل المناسب، تغليف هدية..."
                  className="w-full resize-none rounded-xl border border-ink/10 bg-brand-50/40 px-4 py-3 text-sm font-semibold outline-none transition focus:border-brand-400 focus:bg-white"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="rounded-2xl border border-ink/8 bg-white p-5 shadow-card md:sticky md:top-28">
            <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">
              ملخص السلة
            </h2>
            <ul className="space-y-3">
              {cart.map((i) => (
                <li key={i.slug} className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={i.image_url || "/products/placeholder.svg"}
                    alt={i.name}
                    className="h-12 w-12 rounded-lg object-cover ring-1 ring-black/5"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-xs font-bold">{i.name}</p>
                    <p className="mt-0.5 text-[11px] text-ink-faint">×{i.qty}</p>
                  </div>
                  <p className="text-xs font-extrabold">
                    {formatPrice(i.price * i.qty)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3.5">
              <span className="font-display-ar text-base font-bold">الإجمالي</span>
              <span className="font-display text-lg font-bold text-plum">
                {formatPrice(cartTotal)}
              </span>
            </div>
            {error && (
              <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2.5 text-xs font-bold text-rose-700">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full rounded-full bg-ink py-3.5 text-[13px] font-bold text-white shadow-soft transition hover:bg-plum disabled:opacity-60"
            >
              {loading ? "جارٍ إرسال الطلب..." : "تأكيد الطلب"}
            </button>
            <p className="mt-3.5 text-center text-[11px] leading-5 text-ink-faint">
              بتأكيد الطلب أنت توافقين على أن يتواصل معك فريقنا لتأكيد التفاصيل.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
