"use client";

import { useCallback, useEffect, useState } from "react";
import { createAdminClient } from "@/lib/supabase";
import { formatPrice, formatDate } from "@/lib/format";
import { CATEGORIES, type Order, type Product } from "@/lib/types";

const KEY_STORAGE = "violet_admin_key";

const EMPTY_FORM = {
  slug: "",
  name: "",
  brand: "",
  category: "women",
  price: "",
  old_price: "",
  size: "",
  description: "",
  notes_top: "",
  notes_heart: "",
  notes_base: "",
  image_url: "",
  featured: false,
  in_stock: true,
};

type FormState = typeof EMPTY_FORM;

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [passInput, setPassInput] = useState("");
  const [authError, setAuthError] = useState(false);
  const [tab, setTab] = useState<"products" | "orders">("products");

  const [products, setProducts] = useState<Product[] | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    setAdminKey(sessionStorage.getItem(KEY_STORAGE));
  }, []);

  const client = useCallback(() => createAdminClient(adminKey || ""), [adminKey]);

  const loadAll = useCallback(async () => {
    const supabase = client();
    const { data: prods, error: e1 } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts(e1 ? [] : (prods as Product[]));
    const { data: ords, error: e2 } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders(e2 ? [] : (ords as Order[]));
  }, [client]);

  useEffect(() => {
    if (adminKey) loadAll();
  }, [adminKey, loadAll]);

  function tryLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(false);
    sessionStorage.setItem(KEY_STORAGE, passInput.trim());
    setAdminKey(passInput.trim());
  }

  function editProduct(p: Product) {
    setEditingId(p.id);
    setForm({
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: String(p.price),
      old_price: p.old_price ? String(p.old_price) : "",
      size: p.size || "",
      description: p.description || "",
      notes_top: p.notes_top || "",
      notes_heart: p.notes_heart || "",
      notes_base: p.notes_base || "",
      image_url: p.image_url || "",
      featured: p.featured,
      in_stock: p.in_stock,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const supabase = client();
      const slug =
        form.slug.trim() ||
        form.name.trim().toLowerCase().replace(/[^a-z0-9\u0621-\u064A]+/g, "-").replace(/^-+|-+$/g, "");
      const payload = {
        slug,
        name: form.name.trim(),
        brand: form.brand.trim(),
        category: form.category,
        price: Number(form.price) || 0,
        old_price: form.old_price ? Number(form.old_price) : null,
        size: form.size.trim() || null,
        description: form.description.trim() || null,
        notes_top: form.notes_top.trim() || null,
        notes_heart: form.notes_heart.trim() || null,
        notes_base: form.notes_base.trim() || null,
        image_url: form.image_url.trim() || null,
        featured: form.featured,
        in_stock: form.in_stock,
      };
      const { error } = editingId
        ? await supabase.from("products").update(payload).eq("id", editingId)
        : await supabase.from("products").insert(payload);
      if (error) {
        setMsg("خطأ: " + error.message + " — تحققي من كلمة سر الإدارة");
      } else {
        setMsg(editingId ? "تم تحديث المنتج ✅" : "تمت إضافة المنتج ✅");
        setForm(EMPTY_FORM);
        setEditingId(null);
        loadAll();
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(p: Product) {
    if (!window.confirm(`حذف «${p.name}» نهائياً؟`)) return;
    const supabase = client();
    await supabase.from("products").delete().eq("id", p.id);
    setMsg("تم حذف المنتج 🗑️");
    loadAll();
  }

  async function setOrderStatus(order: Order, status: string) {
    const supabase = client();
    await supabase.from("orders").update({ status }).eq("id", order.id);
    loadAll();
  }

  function logout() {
    sessionStorage.removeItem(KEY_STORAGE);
    setAdminKey(null);
    setProducts(null);
    setOrders(null);
  }

  // ---------- Login gate ----------
  if (!adminKey) {
    return (
      <div className="mx-auto max-w-sm px-4 py-20">
        <div className="rounded-4xl border border-brand-100 bg-white p-7 text-center shadow-soft">
          <span className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-brand-100 text-2xl">
            🔐
          </span>
          <h1 className="mt-4 text-xl font-black">لوحة إدارة فيوليت</h1>
          <p className="mt-1.5 text-xs leading-6 text-ink-faint">
            أدخلي كلمة سر الإدارة لإدارة المنتجات والطلبات
          </p>
          <form onSubmit={tryLogin} className="mt-5 space-y-3">
            <input
              type="password"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              placeholder="كلمة السر"
              className="w-full rounded-2xl border border-brand-100 bg-brand-50/50 px-4 py-3 text-center text-sm font-bold outline-none focus:border-brand-400 focus:bg-white"
            />
            {authError && (
              <p className="text-xs font-bold text-rose-500">كلمة سر غير صحيحة</p>
            )}
            <button className="w-full rounded-full bg-brand-600 py-3 text-sm font-extrabold text-white transition hover:bg-brand-700">
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-2xl border border-brand-100 bg-brand-50/50 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-brand-400 focus:bg-white";

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black">
          لوحة الإدارة <span className="text-brand-600">| VIOLET</span>
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-brand-100 bg-white p-1 shadow-card">
            <button
              onClick={() => setTab("products")}
              className={`rounded-full px-4 py-1.5 text-xs font-extrabold transition ${
                tab === "products" ? "bg-brand-600 text-white" : "text-ink-soft"
              }`}
            >
              المنتجات ({products?.length ?? "..."})
            </button>
            <button
              onClick={() => setTab("orders")}
              className={`rounded-full px-4 py-1.5 text-xs font-extrabold transition ${
                tab === "orders" ? "bg-brand-600 text-white" : "text-ink-soft"
              }`}
            >
              الطلبات ({orders?.length ?? "..."})
            </button>
          </div>
          <button
            onClick={logout}
            className="rounded-full border border-brand-100 bg-white px-4 py-2 text-xs font-bold text-ink-faint hover:text-ink"
          >
            خروج
          </button>
        </div>
      </div>

      {msg && (
        <p className="mt-3 rounded-2xl bg-brand-50 px-4 py-2.5 text-xs font-bold text-brand-700">
          {msg}
        </p>
      )}

      {tab === "products" && (
        <div className="mt-5 grid gap-5 lg:grid-cols-5">
          {/* Form */}
          <form
            onSubmit={saveProduct}
            className="rounded-4xl border border-brand-100 bg-white p-5 shadow-card lg:col-span-2 lg:sticky lg:top-24 lg:max-h-[80vh] lg:overflow-y-auto"
          >
            <h2 className="mb-4 text-sm font-extrabold">
              {editingId ? "تعديل منتج" : "إضافة منتج جديد"}
            </h2>
            <div className="space-y-3">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="اسم العطر *" required className={inputCls} />
              <div className="grid grid-cols-2 gap-3">
                <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="الماركة *" required className={inputCls} />
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                  {CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="السعر $" required type="number" min="0" step="0.5" className={inputCls} />
                <input value={form.old_price} onChange={(e) => setForm({ ...form, old_price: e.target.value })} placeholder="السعر قبل الخصم" type="number" min="0" step="0.5" className={inputCls} />
              </div>
              <input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="الحجم (مثال: 100 مل)" className={inputCls} />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="الوصف" rows={3} className={inputCls + " resize-none"} />
              <div className="grid grid-cols-1 gap-3 rounded-2xl bg-brand-50/60 p-3">
                <p className="text-[11px] font-bold text-ink-faint">المكونات العطرية</p>
                <input value={form.notes_top} onChange={(e) => setForm({ ...form, notes_top: e.target.value })} placeholder="المقدمة" className={inputCls} />
                <input value={form.notes_heart} onChange={(e) => setForm({ ...form, notes_heart: e.target.value })} placeholder="القلب" className={inputCls} />
                <input value={form.notes_base} onChange={(e) => setForm({ ...form, notes_base: e.target.value })} placeholder="القاعدة" className={inputCls} />
              </div>
              <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="رابط الصورة (اختياري)" dir="ltr" className={inputCls + " text-start"} />
              <div className="flex items-center gap-5 pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-ink-soft">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 accent-brand-600" />
                  منتج مميز
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-ink-soft">
                  <input type="checkbox" checked={form.in_stock} onChange={(e) => setForm({ ...form, in_stock: e.target.checked })} className="h-4 w-4 accent-brand-600" />
                  متوفر
                </label>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-full bg-brand-600 py-3 text-sm font-extrabold text-white transition hover:bg-brand-700 disabled:opacity-60"
              >
                {saving ? "جارٍ الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة المنتج"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(EMPTY_FORM);
                  }}
                  className="rounded-full border border-brand-100 px-5 text-sm font-bold text-ink-faint hover:text-ink"
                >
                  إلغاء
                </button>
              )}
            </div>
          </form>

          {/* Products list */}
          <div className="space-y-3 lg:col-span-3">
            {products === null && <p className="text-sm text-ink-faint">جارٍ التحميل...</p>}
            {products?.length === 0 && (
              <p className="rounded-3xl border border-dashed border-brand-200 p-8 text-center text-sm font-bold text-ink-faint">
                لا توجد منتجات — أضيفي أول منتج من النموذج
              </p>
            )}
            {products?.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-3xl border border-brand-100 bg-white p-3 shadow-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image_url || "/products/placeholder.svg"}
                  alt={p.name}
                  className="h-14 w-14 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-extrabold">{p.name}</p>
                  <p className="text-[11px] font-bold text-brand-500">
                    {p.brand} • {formatPrice(p.price)}{" "}
                    {p.featured && "• ⭐ مميز"} {!p.in_stock && "• ❌ غير متوفر"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    onClick={() => editProduct(p)}
                    className="rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-extrabold text-brand-700 hover:bg-brand-100"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => deleteProduct(p)}
                    className="rounded-full bg-rose-50 px-3.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="mt-5 space-y-3">
          {orders === null && <p className="text-sm text-ink-faint">جارٍ التحميل...</p>}
          {orders?.length === 0 && (
            <p className="rounded-3xl border border-dashed border-brand-200 p-8 text-center text-sm font-bold text-ink-faint">
              لا توجد طلبات بعد
            </p>
          )}
          {orders?.map((o) => (
            <div
              key={o.id}
              className="rounded-3xl border border-brand-100 bg-white p-4 shadow-card"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-extrabold">
                    {o.customer_name}{" "}
                    <span className="text-xs font-bold text-ink-faint" dir="ltr">
                      {o.phone}
                    </span>
                  </p>
                  <p className="text-[11px] font-semibold text-ink-faint">
                    {o.city} — {o.address} • {formatDate(o.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={o.status}
                    onChange={(e) => setOrderStatus(o, e.target.value)}
                    className="rounded-full border border-brand-100 px-3 py-1.5 text-xs font-bold outline-none"
                  >
                    <option value="new">جديد</option>
                    <option value="confirmed">مؤكد</option>
                    <option value="delivered">تم التوصيل</option>
                    <option value="cancelled">ملغى</option>
                  </select>
                  <a
                    href={`https://wa.me/963${o.phone.replace(/^0+/, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[#25D366]/15 px-3.5 py-1.5 text-xs font-extrabold text-[#128C4A]"
                  >
                    واتساب
                  </a>
                </div>
              </div>
              <ul className="mt-3 space-y-1 border-t border-dashed border-brand-100 pt-3 text-xs font-semibold text-ink-soft">
                {o.items?.map((i) => (
                  <li key={i.slug} className="flex justify-between gap-2">
                    <span>{i.name} ×{i.qty}</span>
                    <span>{formatPrice(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex items-center justify-between">
                {o.note && (
                  <p className="text-[11px] text-ink-faint">📝 {o.note}</p>
                )}
                <p className="ms-auto text-sm font-black text-brand-700">
                  {formatPrice(o.total)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
