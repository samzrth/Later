import type { Metadata } from "next";

import { ProductCard } from "@/components/product/product-card";
import { PRODUCTS } from "@/data/products";

export const metadata: Metadata = {
  title: "Collection · Later Atelier",
  description:
    "Men's luxury undergarments — V-Shape briefs, U-Shape trunks, and tailored boxers.",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <header className="max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#d4af37]">
          The line
        </p>
        <h1 className="mt-4 font-serif text-4xl text-[#1a1a1a] md:text-5xl">
          Three silhouettes. One discipline.
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-[#1a1a1a]/65">
          Hover each piece to study the secondary angle — a quiet nod to how
          the garment moves on the body.
        </p>
      </header>

      <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
