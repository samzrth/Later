import Link from "next/link";

import { HomeHero } from "@/components/home/home-hero";
import { ProductCard } from "@/components/product/product-card";
import { PRODUCTS } from "@/data/products";

export default function Home() {
  const featured = PRODUCTS;

  return (
    <div className="flex flex-col">
      <HomeHero />

      <section className="border-b border-[#1a1a1a]/10 bg-[#fafafa] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#d4af37]">
                Featured styles
              </p>
              <h2 className="mt-3 font-serif text-3xl text-[#1a1a1a] md:text-4xl">
                The essentials, distilled.
              </h2>
            </div>
            <Link
              href="/products"
              className="shrink-0 text-xs uppercase tracking-[0.2em] text-[#1a1a1a]/55 underline-offset-8 transition hover:text-[#d4af37] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f3f1ec] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#d4af37]">
              Philosophy
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-snug text-[#1a1a1a] md:text-4xl">
              Materials that speak softly — and last.
            </h2>
          </div>
          <div className="space-y-6 text-sm leading-relaxed text-[#1a1a1a]/72">
            <p>
              We treat the layer closest to the skin with the same reverence as
              a tailored jacket: fiber origin, hand, recovery, and the way light
              falls across a matte surface.
            </p>
            <p>
              Each piece is assembled in limited runs, with trims chosen to
              disappear against the body and finishing that resists torque
              through long days.
            </p>
            <p className="text-[#1a1a1a]">
              Optional monogram embroidery is executed in tonal thread — never
              loud, never novelty — so the mark reads as heritage, not
              branding.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
