export type Category = "women" | "men" | "unisex" | "gift";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  old_price: number | null;
  size: string | null;
  description: string | null;
  notes_top: string | null;
  notes_heart: string | null;
  notes_base: string | null;
  image_url: string | null;
  in_stock: boolean;
  featured: boolean;
  created_at?: string;
}

export interface CartItem {
  slug: string;
  name: string;
  brand: string;
  price: number;
  size: string | null;
  image_url: string | null;
  qty: number;
}

export interface OrderItem {
  slug: string;
  name: string;
  brand: string;
  price: number;
  qty: number;
  image_url: string | null;
}

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string | null;
  items: OrderItem[];
  total: number;
  note: string | null;
  status: string;
  created_at: string;
}

export const CATEGORIES: { key: Category; label: string }[] = [
  { key: "women", label: "نسائية" },
  { key: "men", label: "رجالية" },
  { key: "unisex", label: "للجنسين" },
  { key: "gift", label: "أطقم وهدايا" },
];

export const STORE = {
  nameAr: "فيوليت للعطور",
  nameEn: "VIOLET PERFUME",
  phone: "0959587754",
  phoneIntl: "963959587754",
  instagram: "https://www.instagram.com/violeet_perfumess/",
  address: "دمشق - سوريا | الشعلان - جانب بنك بيبولوس (شهبّا)",
  tagline: "المكان الأول لبيع البرفيوم الأورجيال",
  freeShipFrom: 50,
};
