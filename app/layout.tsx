import type { Metadata } from "next";
import { Great_Vibes, Inter, Playfair_Display } from "next/font/google";

import { CartDrawer } from "@/components/cart/cart-drawer";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Providers } from "@/components/providers";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-embroidery",
});

export const metadata: Metadata = {
  title: {
    default: "Later Atelier · Men's Luxury Undergarments",
    template: "%s · Later Atelier",
  },
  description:
    "Luxury men's undergarments — V-Shape briefs, U-Shape trunks, and tailored boxers. Minimal, artisanal, made to be lived in.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#fafafa] font-sans text-[#1a1a1a]">
        <Providers>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
