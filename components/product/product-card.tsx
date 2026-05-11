"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import type { Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const [hover, setHover] = useState(false);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#e8e8e8]">
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: hover ? 0 : 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={product.imageFront}
            alt={`3D rendered male model, high-fashion lighting, showcasing ${product.categoryLabel}`}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          />
        </motion.div>
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: hover ? 1 : 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={product.imageBack}
            alt={`3D rendered male model, alternate angle, high-fashion lighting, showcasing ${product.categoryLabel}`}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          />
        </motion.div>
      </div>
      <div className="mt-5 flex items-start justify-between gap-4 border-b border-transparent pb-4 transition group-hover:border-[#1a1a1a]/15">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">
            {product.categoryLabel}
          </p>
          <h2 className="mt-2 font-serif text-xl text-[#1a1a1a]">
            {product.name}
          </h2>
        </div>
        <p className="mt-6 font-serif text-base text-[#1a1a1a]/70">
          ${product.priceUsd}
        </p>
      </div>
    </Link>
  );
}
