"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

import {
  COLORS,
  SIZES,
  buildSku,
  getColorById,
  type Product,
  type Size,
} from "@/data/products";
import { useCart } from "@/context/cart-context";

type ProductDetailProps = {
  product: Product;
};

const MAX_EMBROIDERY = 10;

export function ProductDetail({ product }: ProductDetailProps) {
  const { addLine } = useCart();
  const [size, setSize] = useState<Size>("M");
  const [colorId, setColorId] = useState<(typeof COLORS)[number]["id"]>(
    COLORS[0].id,
  );
  const [personalize, setPersonalize] = useState(false);
  const [embroidery, setEmbroidery] = useState("");

  const color = getColorById(colorId);
  const sku = useMemo(() => {
    if (!color) return "";
    return buildSku(product.skuPrefix, color.code, size);
  }, [color, product.skuPrefix, size]);

  const previewText = embroidery.trim().slice(0, MAX_EMBROIDERY);

  function handleAddToCart() {
    if (!color) return;
    addLine({
      sku,
      productName: product.name,
      slug: product.slug,
      size,
      colorLabel: color.label,
      priceUsd: product.priceUsd,
      imageFront: product.imageFront,
      embroidery: personalize && previewText ? previewText : undefined,
    });
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-16 md:px-10 lg:py-20">
      <div className="space-y-4">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#e8e8e8]">
          {/*
            Visual direction: 3D rendered male model, high-fashion lighting,
            showcasing the garment type — using photographic placeholder until final renders ship.
          */}
          <Image
            src={product.imageFront}
            alt={`3D rendered male model, high-fashion lighting, showcasing ${product.categoryLabel}`}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#1a1a1a]/45">
          Swipe-ready imagery — final campaign uses full 3D renders.
        </p>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#d4af37]">
          {product.categoryLabel}
        </p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight text-[#1a1a1a] md:text-5xl">
          {product.name}
        </h1>
        <p className="mt-2 font-serif text-lg text-[#1a1a1a]/70">
          {product.tagline}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-[#1a1a1a]/75">
          {product.description}
        </p>
        <p className="mt-8 font-serif text-2xl text-[#1a1a1a]">
          ${product.priceUsd}
        </p>

        <div className="mt-10 space-y-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#1a1a1a]/50">
              Color
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {COLORS.map((c) => {
                const selected = c.id === colorId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColorId(c.id)}
                    className="group relative flex flex-col items-center gap-2"
                    aria-pressed={selected}
                    aria-label={c.label}
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${
                        selected
                          ? "border-[#d4af37] ring-1 ring-[#d4af37]/40"
                          : "border-[#1a1a1a]/15 hover:border-[#1a1a1a]/35"
                      }`}
                    >
                      <span
                        className="h-8 w-8 rounded-full border border-[#1a1a1a]/10"
                        style={{
                          background:
                            c.id === "obsidian-black"
                              ? "#141414"
                              : c.id === "midnight-navy"
                                ? "#1b2740"
                                : c.id === "slate-grey"
                                  ? "#6f7378"
                                  : "#2f3828",
                        }}
                      />
                      {selected ? (
                        <span className="sr-only">Selected</span>
                      ) : null}
                    </span>
                    <span className="max-w-[5.5rem] text-center text-[10px] uppercase tracking-[0.12em] text-[#1a1a1a]/55">
                      {c.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#1a1a1a]/50">
              Size
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SIZES.map((s) => {
                const selected = s === size;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`min-w-[3rem] border px-4 py-2 text-xs uppercase tracking-[0.18em] transition ${
                      selected
                        ? "border-[#1a1a1a] bg-[#1a1a1a] text-[#fafafa]"
                        : "border-[#1a1a1a]/15 text-[#1a1a1a] hover:border-[#1a1a1a]/35"
                    }`}
                    aria-pressed={selected}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border border-[#1a1a1a]/10 bg-white/40 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-serif text-lg text-[#1a1a1a]">
                  Add personalization
                </p>
                <p className="mt-1 text-xs text-[#1a1a1a]/55">
                  Monogram the rear waistband — up to {MAX_EMBROIDERY}{" "}
                  characters.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={personalize}
                aria-label="Toggle personalization"
                onClick={() => {
                  setPersonalize((p) => !p);
                  if (personalize) setEmbroidery("");
                }}
                className={`relative h-8 w-14 shrink-0 rounded-full border transition ${
                  personalize
                    ? "border-[#d4af37] bg-[#1a1a1a]"
                    : "border-[#1a1a1a]/20 bg-[#fafafa]"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#fafafa] shadow transition ${
                    personalize ? "translate-x-6" : "translate-x-0"
                  }`}
                >
                  {personalize ? (
                    <Check className="h-3.5 w-3.5 text-[#1a1a1a]" />
                  ) : null}
                </span>
              </button>
            </div>

            <AnimatePresence initial={false}>
              {personalize ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-6">
                    <label
                      htmlFor="embroidery-input"
                      className="text-[11px] uppercase tracking-[0.2em] text-[#1a1a1a]/50"
                    >
                      Embroidery
                    </label>
                    <input
                      id="embroidery-input"
                      maxLength={MAX_EMBROIDERY}
                      value={embroidery}
                      onChange={(e) =>
                        setEmbroidery(
                          e.target.value.slice(0, MAX_EMBROIDERY),
                        )
                      }
                      placeholder="Initials"
                      className="mt-3 w-full border border-[#1a1a1a]/15 bg-[#fafafa] px-3 py-2 text-sm tracking-wide text-[#1a1a1a] outline-none transition placeholder:text-[#1a1a1a]/30 focus:border-[#d4af37]"
                    />
                    <p className="mt-2 text-right text-[10px] text-[#1a1a1a]/40">
                      {previewText.length}/{MAX_EMBROIDERY}
                    </p>

                    <div className="mt-6">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-[#1a1a1a]/50">
                        Live preview
                      </p>
                      <div className="relative mt-3 aspect-[16/9] w-full overflow-hidden bg-[#dcdcdc]">
                        {/*
                          Placeholder for back waistband / logo zone —
                          final art is embroidered thread on garment mesh.
                        */}
                        <Image
                          src={product.embroideryPreviewImage}
                          alt={`3D rendered male model, high-fashion lighting, showcasing ${product.categoryLabel} rear waistband for monogram preview`}
                          fill
                          className="object-cover"
                          sizes="(min-width: 768px) 40vw, 100vw"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                        <div className="absolute inset-x-0 bottom-[18%] flex justify-center">
                          <span
                            className="max-w-[90%] truncate text-center text-3xl text-[#f8f4ea] drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] md:text-4xl"
                            style={{
                              fontFamily: "var(--font-embroidery), cursive",
                            }}
                          >
                            {previewText || "Preview"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#1a1a1a]/45">
              SKU · {sku}
            </p>
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full border border-[#1a1a1a] bg-[#1a1a1a] py-3.5 text-xs uppercase tracking-[0.24em] text-[#fafafa] transition hover:bg-[#2a2a2a]"
            >
              Add to bag
            </button>
          </div>

          <ul className="space-y-3 border-t border-[#1a1a1a]/10 pt-8 text-sm text-[#1a1a1a]/70">
            {product.highlights.map((h) => (
              <li key={h} className="flex gap-3">
                <span className="mt-1.5 h-px w-6 shrink-0 bg-[#d4af37]/80" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
