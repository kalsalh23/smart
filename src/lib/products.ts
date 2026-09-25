import { createPublicClient } from "./supabase";
import { FALLBACK_PRODUCTS } from "./catalog";
import type { Product } from "./types";

/** All products from Supabase, with graceful fallback to the built-in catalog. */
export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return FALLBACK_PRODUCTS;
    return data as Product[];
  } catch {
    return FALLBACK_PRODUCTS;
  }
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug);
}

export function getBrands(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.brand))];
}
