import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { getProduct, getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) return { title: "عطر غير موجود" };
  return {
    title: `${product.brand} — ${product.name}`,
    description: product.description || undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const all = await getProducts();
  const related = all
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => {
      const score = (x: typeof a) =>
        (x.brand === product.brand ? 2 : 0) +
        (x.category === product.category ? 1 : 0);
      return score(b) - score(a);
    })
    .slice(0, 4);

  return <ProductDetail product={product} related={related} />;
}
