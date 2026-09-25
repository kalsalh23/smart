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
      <p className="eyebrow">SHOP ALL</p>
      <h1 className="mt-1.5 font-display-ar text-[26px] font-bold md:text-3xl">
        تسوّق <span className="text-brand-700">العطور الأصلية</span>
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
