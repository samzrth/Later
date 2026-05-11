"use client";

import { useCart } from "@/context/cart-context";

type CartTriggerProps = {
  label: React.ReactNode;
  className?: string;
};

export function CartTrigger({ label, className }: CartTriggerProps) {
  const { toggleCart, lines } = useCart();
  return (
    <button type="button" onClick={toggleCart} className={className}>
      {label}
      {lines.length > 0 ? (
        <span className="ml-1 text-[10px] text-[#d4af37]">({lines.length})</span>
      ) : null}
    </button>
  );
}
