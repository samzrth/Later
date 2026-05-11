"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

import { useCart } from "@/context/cart-context";

export function CartDrawer() {
  const { isOpen, closeCart, lines, removeLine } = useCart();

  const subtotal = lines.reduce((sum, l) => sum + l.priceUsd, 0);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart overlay"
            className="fixed inset-0 z-50 bg-[#1a1a1a]/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-[#1a1a1a]/10 bg-[#fafafa] shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
          >
            <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 px-6 py-5">
              <h2
                id="cart-title"
                className="font-serif text-lg tracking-[0.12em] text-[#1a1a1a]"
              >
                Your bag
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="p-2 text-[#1a1a1a]/60 transition hover:text-[#1a1a1a]"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" strokeWidth={1.25} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {lines.length === 0 ? (
                <p className="text-sm leading-relaxed text-[#1a1a1a]/55">
                  Your selection is empty. Explore the collection to add a
                  piece.
                </p>
              ) : (
                <ul className="space-y-8">
                  {lines.map((line) => (
                    <li
                      key={line.id}
                      className="flex gap-4 border-b border-[#1a1a1a]/10 pb-8 last:border-0 last:pb-0"
                    >
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-[#e8e8e8]">
                        <Image
                          src={line.imageFront}
                          alt="Placeholder — 3D rendered male model, high-fashion lighting, showcasing men's undergarment"
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/products/${line.slug}`}
                          onClick={closeCart}
                          className="font-serif text-base text-[#1a1a1a] transition hover:text-[#d4af37]"
                        >
                          {line.productName}
                        </Link>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#1a1a1a]/45">
                          {line.sku}
                        </p>
                        <p className="mt-2 text-xs text-[#1a1a1a]/65">
                          {line.colorLabel} · Size {line.size}
                        </p>
                        {line.embroidery ? (
                          <p className="mt-2 text-xs text-[#1a1a1a]/80">
                            Embroidery:{" "}
                            <span
                              className="text-[#1a1a1a]"
                              style={{
                                fontFamily: "var(--font-embroidery), cursive",
                              }}
                            >
                              {line.embroidery}
                            </span>
                          </p>
                        ) : null}
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span className="text-sm text-[#1a1a1a]">
                            ${line.priceUsd}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeLine(line.id)}
                            className="text-[11px] uppercase tracking-[0.14em] text-[#1a1a1a]/40 underline-offset-4 transition hover:text-[#1a1a1a] hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-[#1a1a1a]/10 px-6 py-6">
              <div className="flex items-baseline justify-between text-sm">
                <span className="uppercase tracking-[0.16em] text-[#1a1a1a]/50">
                  Subtotal
                </span>
                <span className="font-serif text-xl text-[#1a1a1a]">
                  ${subtotal}
                </span>
              </div>
              <p className="mt-2 text-xs text-[#1a1a1a]/45">
                Shipping and duties calculated at checkout. This is a demo
                storefront.
              </p>
              <button
                type="button"
                className="mt-6 w-full border border-[#1a1a1a] bg-[#1a1a1a] py-3 text-xs uppercase tracking-[0.22em] text-[#fafafa] transition hover:bg-[#2a2a2a]"
              >
                Checkout
              </button>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
