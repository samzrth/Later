export type UserRole = "integration" | "merchant";

export type ProductId =
  | "checkout-emi"
  | "bnpl"
  | "paysense"
  | "pay-in-3"
  | "downpayment-pay-in-3";

export interface ProductConfig {
  enabled: boolean;
  minAmount: number;
  maxAmount: number;
  tenures?: string;
  downpaymentPercent?: number;
  displayOrder: number;
}

export interface MerchantSettings {
  merchantName: string;
  mid: string;
  contactEmail: string;
  merchantKey: string;
  salt: string;
  clientId: string;
  successUrl: string;
  failureUrl: string;
  cancelUrl: string;
  webhookUrl: string;
  logoUrl: string;
  themeColor: string;
  testMode: boolean;
  autoCapture: boolean;
  preAuthEnabled: boolean;
  showEmiCalculator: boolean;
  sessionTimeoutMinutes: number;
  dailyTransactionLimit: number;
  globalMinAmount: number;
  globalMaxAmount: number;
  products: Record<ProductId, ProductConfig>;
  notes: string;
}

export interface Merchant {
  id: string;
  displayName: string;
  status: "active" | "pending" | "inactive";
  linkedLoginId: string;
  settings: MerchantSettings;
  lastUpdated: string;
  updatedBy: string;
}

export interface AuthUser {
  role: UserRole;
  displayName: string;
  merchantId?: string;
}

export interface IntegrationDoc {
  id: string;
  productId: ProductId;
  title: string;
  summary: string;
  sections: { heading: string; content: string }[];
  downloadLabel: string;
}
