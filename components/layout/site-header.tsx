import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { CartTrigger } from "@/components/cart/cart-trigger";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#1a1a1a]/10 bg-[#fafafa]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-10">
        <Link
          href="/"
          className="font-serif text-xl tracking-[0.2em] text-[#1a1a1a] md:text-2xl"
        >
          LATER
        </Link>
        <nav className="flex items-center gap-10 text-sm uppercase tracking-[0.18em] text-[#1a1a1a]/80">
          <Link href="/products" className="transition hover:text-[#d4af37]">
            Shop
          </Link>
          <CartTrigger
            className="inline-flex items-center gap-2 text-[#1a1a1a] transition hover:text-[#d4af37]"
            label={
              <>
                <ShoppingBag className="h-4 w-4" strokeWidth={1.25} />
                <span className="hidden sm:inline">Bag</span>
              </>
            }
          />
        </nav>
      </div>
    </header>
  );
}
