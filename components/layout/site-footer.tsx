import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#1a1a1a]/10 bg-[#fafafa]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 text-xs uppercase tracking-[0.18em] text-[#1a1a1a]/45 md:flex-row md:items-center md:justify-between md:px-10">
        <p>© {new Date().getFullYear()} Later Atelier</p>
        <div className="flex gap-8">
          <Link href="/products" className="transition hover:text-[#d4af37]">
            Shop
          </Link>
          <span className="cursor-default">Client services</span>
        </div>
      </div>
    </footer>
  );
}
