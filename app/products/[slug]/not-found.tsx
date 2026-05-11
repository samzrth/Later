import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-32 text-center">
      <h1 className="font-serif text-3xl text-[#1a1a1a]">Piece not found</h1>
      <p className="mt-4 text-sm leading-relaxed text-[#1a1a1a]/60">
        The style you requested is unavailable. Return to the collection to
        continue.
      </p>
      <Link
        href="/products"
        className="mt-10 border border-[#1a1a1a] px-8 py-3 text-xs uppercase tracking-[0.2em] text-[#1a1a1a] transition hover:bg-[#1a1a1a] hover:text-[#fafafa]"
      >
        View collection
      </Link>
    </div>
  );
}
