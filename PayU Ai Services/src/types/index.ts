export type UserRole = "integration" | "merchant";

export type ProductId =
  | "checkout-emi"
  | "bnpl"
  | "paysense"
  | "pay-in-3"
  | "downpayment-pay-in-3";

export interface TenurePolicy {
  id: string;
  months: number;
  minTxnAmount: string;
  maxTxnAmount: string;
  interestType: string;
  interestValue: string;
  pfType: string;
  pfValue: string;
  dpType: string;
  dpValue: string;
}

export interface BnplConfig {
  enabled: boolean;
  mdrPercent: string;
  capValueCr: string;
}

export interface CheckoutPayInParts {
  enabled: boolean;
  minTxnAmount: string;
  mdrPercent: string;
  type: string;
  mdrPercentSecondary: string;
  downpayment: boolean;
}

export interface CheckoutStdEmi {
  enabled: boolean;
  minTxnAmount: string;
  mdrPercent: string;
  type: string;
  mdrPercentSecondary: string;
  downpayment: boolean;
}

export interface CheckoutFlags {
  cofCapValue: string;
  signUpMode: string;
  signUpModeSecondary: string;
  autoLogin: string;
  inlineSupportEligibility: string;
  allowNoBnplUser: string;
  subventionRate: string;
  emiTags: string;
  orderExpiryTimeSeconds: string;
  inlinePosition: string;
  category: string;
  checkAvailLimit: string;
  checkLpMitc: string;
  supportLatestMitcOnly: string;
  merchantCollectingDownpayment: string;
  loanConfirmationAllowed: string;
  loanConfirmationAutoCancelMins: string;
  uploadSelfieAllowed: string;
}

export interface CheckoutConfig {
  enabled: boolean;
  payInParts: CheckoutPayInParts;
  stdEmi: CheckoutStdEmi;
  flags: CheckoutFlags;
}

export interface BasicDetails {
  subMerchantId: string;
  subMerchantLegalName: string;
  subMerchantUrl: string;
  type: string;
  legalName: string;
  whitelisted: boolean;
}

export interface PolicyDetails {
  payInPartsTenures: TenurePolicy[];
  stdEmiTenures: TenurePolicy[];
}

export interface MerchantSettings {
  basicDetails: BasicDetails;
  bnpl: BnplConfig;
  checkout: CheckoutConfig;
  policyDetails: PolicyDetails;
  ordersWebhookUrl: string;
  onboardingWebhookUrl: string;
  merchantKey: string;
  salt: string;
  clientId: string;
  testMode: boolean;
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

export interface ReportSchedule {
  emails: string[];
  autoTrigger: boolean;
  frequency: "daily" | "weekly";
}

export type ReportTimeRange = "7d" | "30d" | "90d";

export interface ReportDataPoint {
  date: string;
  orders: number;
  autopaySuccessRate: number;
  kycApprovalRate: number;
  txnSuccessRate: number;
}
