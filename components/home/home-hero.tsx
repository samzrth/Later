"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function HomeHero() {
  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden bg-[#1a1a1a]">
      {/*
        Cinematic hero — replace with looping 3D film of the house avatar in final production.
      */}
      <Image
        src="https://images.unsplash.com/photo-1721725222871-7e70364e7b29?auto=format&fit=crop&w=2400&q=85"
        alt="Editorial men's innerwear campaign — model in briefs, muted premium lighting"
        fill
        priority
        className="object-cover opacity-90"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/35 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-20 md:px-16 md:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-[11px] uppercase tracking-[0.35em] text-[#d4af37]"
        >
          Later Atelier
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-xl font-serif text-4xl leading-tight text-[#fafafa] md:text-6xl md:leading-[1.05]"
        >
          Underthings, considered as outer poise.
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10"
        >
          <Link
            href="/products"
            className="inline-flex border border-[#fafafa]/80 px-10 py-3 text-xs uppercase tracking-[0.28em] text-[#fafafa] transition hover:border-[#d4af37] hover:text-[#d4af37]"
          >
            Enter the shop
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
