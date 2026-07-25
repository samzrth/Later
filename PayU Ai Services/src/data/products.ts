import type { IntegrationDoc, ProductId } from "../types";

export const LAZYPAY_URL = "https://lazypay.in/";

export interface ProductMeta {
  id: ProductId;
  name: string;
  tagline: string;
  description: string;
  benefits: string[];
  stats: { label: string; value: string }[];
  badge?: string;
  accent: string;
  crossSellHint: string;
}

export const PRODUCTS: ProductMeta[] = [
  {
    id: "checkout-emi",
    name: "Checkout EMI",
    tagline: "Convert every cart into an EMI opportunity",
    description:
      "Embed cardless and card EMI at checkout. Customers see real-time EMI plans without leaving your payment page — boosting AOV by up to 35%.",
    benefits: [
      "Zero integration friction with PayU Checkout SDK",
      "Instant eligibility check across 15+ bank partners",
      "No-cost EMI campaigns supported out of the box",
      "Real-time EMI calculator on checkout",
    ],
    stats: [
      { label: "Avg. AOV lift", value: "+35%" },
      { label: "Conversion boost", value: "+22%" },
      { label: "Partner banks", value: "15+" },
    ],
    badge: "Most Popular",
    accent: "#10847E",
    crossSellHint: "Pair with Pay in 3 for sub-₹5K carts where EMI isn't viable.",
  },
  {
    id: "bnpl",
    name: "BNPL",
    tagline: "Buy Now, Pay Later — zero friction credit",
    description:
      "Offer instant credit at checkout for eligible customers. LazyPay BNPL increases repeat purchases and reduces cart abandonment for price-sensitive segments.",
    benefits: [
      "Instant approval in under 3 seconds",
      "Flexible repayment — 15 to 45 day cycles",
      "Risk scoring handled by PayU + LazyPay",
      "Seamless re-engagement for returning users",
    ],
    stats: [
      { label: "Approval rate", value: "78%" },
      { label: "Repeat rate", value: "2.4×" },
      { label: "Cart recovery", value: "+18%" },
    ],
    badge: "High Conversion",
    accent: "#D82C51",
    crossSellHint: "Stack with Checkout EMI — offer BNPL as fallback when EMI isn't available.",
  },
  {
    id: "paysense",
    name: "PaySense Integration",
    tagline: "Personal loans at the point of sale",
    description:
      "Enable personal loan disbursement directly at checkout for high-ticket items. PaySense powers instant loan offers for electronics, furniture, and travel.",
    benefits: [
      "Loan offers up to ₹5 lakh instantly",
      "Paperless KYC with Aadhaar + PAN",
      "Merchant gets full payment upfront",
      "Dedicated PaySense underwriting engine",
    ],
    stats: [
      { label: "Max ticket size", value: "₹5L" },
      { label: "Disbursal time", value: "<5 min" },
      { label: "Approval rate", value: "65%" },
    ],
    accent: "#5B4FCF",
    crossSellHint: "Ideal upsell from Checkout EMI when cart value exceeds ₹50,000.",
  },
  {
    id: "pay-in-3",
    name: "Pay in 3",
    tagline: "Split payments, not customers",
    description:
      "Let customers pay in 3 interest-free instalments. Perfect for mid-ticket e-commerce — increases affordability without merchant discounting.",
    benefits: [
      "3 equal instalments, zero interest",
      "Merchant receives full amount upfront",
      "Works for carts ₹1,500 – ₹50,000",
      "Higher conversion on fashion & lifestyle",
    ],
    stats: [
      { label: "Ticket range", value: "₹1.5K–50K" },
      { label: "Conversion lift", value: "+28%" },
      { label: "Default rate", value: "<2%" },
    ],
    badge: "Trending",
    accent: "#E8871E",
    crossSellHint: "Combine with Downpayment + Pay in 3 for premium electronics.",
  },
  {
    id: "downpayment-pay-in-3",
    name: "Downpayment with Pay in 3",
    tagline: "Collect upfront, finance the rest",
    description:
      "Require a configurable downpayment at checkout, then split the remaining amount into 3 easy instalments. Ideal for high-value gadgets and appliances.",
    benefits: [
      "Configurable downpayment % (10–50%)",
      "Reduces merchant exposure on returns",
      "Customer pays less per instalment",
      "Full amount settled to merchant upfront",
    ],
    stats: [
      { label: "Min downpayment", value: "10%" },
      { label: "AOV supported", value: "₹10K+" },
      { label: "Return rate drop", value: "-40%" },
    ],
    accent: "#1A9B4F",
    crossSellHint: "Best paired with PaySense for carts above ₹1 lakh.",
  },
];

export const INTEGRATION_DOCS: IntegrationDoc[] = [
  {
    id: "doc-emi",
    productId: "checkout-emi",
    title: "Checkout EMI Integration Guide",
    summary: "Step-by-step SDK integration for cardless and card EMI at PayU Checkout.",
    downloadLabel: "Download EMI SDK Guide (PDF)",
    sections: [
      {
        heading: "Prerequisites",
        content:
          "Active PayU merchant account, Checkout Finance product enabled, test credentials from Ops Panel, and HTTPS callback URLs whitelisted.",
      },
      {
        heading: "Integration Steps",
        content:
          "1. Include PayU Checkout SDK\n2. Pass product flag `checkout_emi: true` in payment request\n3. Configure success/failure URLs in Ops Panel\n4. Handle webhook `emi.status` events\n5. Go live after UAT sign-off",
      },
      {
        heading: "Testing",
        content:
          "Use test MID with amount ₹3,000–₹50,000. Test cards available in sandbox docs. Verify EMI plan display and webhook payload.",
      },
    ],
  },
  {
    id: "doc-bnpl",
    productId: "bnpl",
    title: "BNPL Integration Guide",
    summary: "Enable LazyPay BNPL at checkout with minimal code changes.",
    downloadLabel: "Download BNPL Integration Kit",
    sections: [
      {
        heading: "Overview",
        content:
          "BNPL uses LazyPay's credit line. Customer sees 'Pay with LazyPay' option when eligible. Merchant receives full settlement T+1.",
      },
      {
        heading: "API Flow",
        content:
          "Initiate payment → LazyPay eligibility check → Customer OTP verification → Payment confirmation → Webhook `bnpl.captured`.",
      },
      {
        heading: "Go-Live Checklist",
        content:
          "Webhook URL verified, production keys configured, refund flow tested, customer support escalation path documented.",
      },
    ],
  },
  {
    id: "doc-paysense",
    productId: "paysense",
    title: "PaySense Integration Guide",
    summary: "Embed personal loan offers for high-ticket checkout flows.",
    downloadLabel: "Download PaySense API Spec",
    sections: [
      {
        heading: "When to Use",
        content:
          "Cart value ≥ ₹15,000 and category in approved list (electronics, furniture, travel). PaySense handles full loan lifecycle.",
      },
      {
        heading: "Integration",
        content:
          "Redirect flow or embedded widget. Pass `paysense_enabled: true` and cart metadata. Handle redirect back with loan status.",
      },
      {
        heading: "Settlement",
        content:
          "Merchant receives 100% upfront upon loan disbursal. Settlement report available in PayU dashboard.",
      },
    ],
  },
  {
    id: "doc-payin3",
    productId: "pay-in-3",
    title: "Pay in 3 Integration Guide",
    summary: "Add interest-free 3-part payments to your checkout.",
    downloadLabel: "Download Pay in 3 Quick Start",
    sections: [
      {
        heading: "Eligibility",
        content:
          "Cart ₹1,500–₹50,000. Customer must pass LazyPay credit check. Product categories: fashion, lifestyle, electronics (sub-50K).",
      },
      {
        heading: "Checkout Flow",
        content:
          "Customer selects Pay in 3 → LazyPay auth → First instalment charged → Order confirmed → Instalments 2 & 3 auto-debited.",
      },
      {
        heading: "Webhooks",
        content:
          "Subscribe to `payin3.instalment.success` and `payin3.instalment.failed` for order management integration.",
      },
    ],
  },
  {
    id: "doc-downpayment",
    productId: "downpayment-pay-in-3",
    title: "Downpayment + Pay in 3 Guide",
    summary: "Configure split downpayment + instalment flows for premium products.",
    downloadLabel: "Download Downpayment Config Guide",
    sections: [
      {
        heading: "Configuration",
        content:
          "Set downpayment % in Ops Panel (10–50%). Remaining amount split into 3 equal instalments. Min cart value ₹10,000 recommended.",
      },
      {
        heading: "Customer Experience",
        content:
          "Checkout shows: Pay ₹X now + 3 × ₹Y later. Clear breakdown reduces drop-off. Downpayment is non-refundable per policy.",
      },
      {
        heading: "Merchant Benefits",
        content:
          "Lower return fraud, higher commitment signal, full settlement including downpayment within standard T+1 cycle.",
      },
    ],
  },
];

