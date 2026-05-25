export const SIZES = ["S", "M", "L", "XL"] as const;
export type Size = (typeof SIZES)[number];

export const COLORS = [
  { id: "obsidian-black", label: "Obsidian Black", code: "OBS" },
  { id: "midnight-navy", label: "Midnight Navy", code: "NAV" },
  { id: "slate-grey", label: "Slate Grey", code: "SLG" },
  { id: "deep-olive", label: "Deep Olive", code: "OLV" },
] as const;
export type Color = (typeof COLORS)[number];

export type CategoryId = "v-shape" | "u-shape" | "boxers";

export type Product = {
  id: string;
  slug: string;
  category: CategoryId;
  categoryLabel: string;
  skuPrefix: string;
  name: string;
  tagline: string;
  description: string;
  priceUsd: number;
  /** Primary listing image — placeholder for 3D hero render */
  imageFront: string;
  /** Alternate angle for PLP hover — placeholder for secondary 3D angle */
  imageBack: string;
  /** Waistband / back detail for embroidery preview */
  embroideryPreviewImage: string;
  highlights: string[];
};

export const PRODUCTS: Product[] = [
  {
    id: "prod-vshape",
    slug: "v-shape-briefs",
    category: "v-shape",
    categoryLabel: "V-Shape (Briefs)",
    skuPrefix: "VS",
    name: "Atelier V Brief",
    tagline: "Architectural support, invisible line.",
    description:
      "Precision-cut brief with a sculpted V-front and featherweight micromodal blend. Designed for all-day ease and a quietly confident silhouette.",
    priceUsd: 68,
    imageFront:
      "https://images.unsplash.com/photo-1640765937555-6f413ed1d936?auto=format&fit=crop&w=1200&q=80",
    imageBack:
      "https://images.unsplash.com/photo-1656587132121-aaccc57589cf?auto=format&fit=crop&w=1200&q=80",
    embroideryPreviewImage:
      "https://images.unsplash.com/photo-1601393709771-3938c63d41a6?auto=format&fit=crop&w=900&q=80",
    highlights: [
      "Italian-spun micromodal with natural stretch recovery",
      "Flatlock seams and heat-bonded labels",
      "Low-profile waistband engineered for embroidery",
    ],
  },
  {
    id: "prod-ushape",
    slug: "u-shape-trunks",
    category: "u-shape",
    categoryLabel: "U-Shape (Trunks)",
    skuPrefix: "US",
    name: "Contour U Trunk",
    tagline: "Longer line, same restraint.",
    description:
      "A modern trunk with a supportive U-cup and extended leg for frictionless movement. Tailored for travel, desk, and evening alike.",
    priceUsd: 72,
    imageFront:
      "https://images.unsplash.com/photo-1561504599-f900052636b3?auto=format&fit=crop&w=1200&q=80",
    imageBack:
      "https://images.unsplash.com/photo-1590291432660-66bca4431392?auto=format&fit=crop&w=1200&q=80",
    embroideryPreviewImage:
      "https://images.unsplash.com/photo-1601393710008-984348f7447b?auto=format&fit=crop&w=900&q=80",
    highlights: [
      "Ergonomic U-panel without bulky padding",
      "Breathable pique knit along the inner thigh",
      "Monogram-ready rear waistband",
    ],
  },
  {
    id: "prod-boxers",
    slug: "tailored-boxers",
    category: "boxers",
    categoryLabel: "Boxers",
    skuPrefix: "BX",
    name: "House Boxer",
    tagline: "Relaxed drape, disciplined tailoring.",
    description:
      "A structured boxer short with a refined side vent and mother-of-pearl button fly. Room to move, none of the slouch.",
    priceUsd: 78,
    imageFront:
      "https://images.unsplash.com/photo-1604981742511-2b85ff3a0ae8?auto=format&fit=crop&w=1200&q=80",
    imageBack:
      "https://images.unsplash.com/photo-1683449155666-7531f07a9b68?auto=format&fit=crop&w=1200&q=80",
    embroideryPreviewImage:
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=900&q=80",
    highlights: [
      "Brushed cotton-linen hand with matte finish",
      "Interior French seams",
      "Discreet rear tab suited for monogram embroidery",
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getColorById(id: string): Color | undefined {
  return COLORS.find((c) => c.id === id);
}

export function buildSku(
  skuPrefix: string,
  colorCode: string,
  size: Size,
): string {
  return `${skuPrefix}-${colorCode}-${size}`;
}
