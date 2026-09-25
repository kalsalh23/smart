import ExploreClient from "@/components/ExploreClient";
import { getProducts, getBrands } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata = { title: "تسوّق العطور" };

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { q?: string; cat?: string };
}) {
  const products = await getProducts();
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-5 text-2xl font-black md:text-3xl">
        تسوّق <span className="text-brand-600">العطور الأصلية</span>
      </h1>
      <ExploreClient
        products={products}
        brands={getBrands(products)}
        initialQ={searchParams.q || ""}
        initialCat={searchParams.cat || ""}
      />
    </div>
  );
}
