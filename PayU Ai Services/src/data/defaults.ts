import type { MerchantSettings, TenurePolicy } from "../types";

function tenure(id: string, months: number, overrides: Partial<TenurePolicy> = {}): TenurePolicy {
  return {
    id,
    months,
    minTxnAmount: "",
    maxTxnAmount: "",
    interestType: "",
    interestValue: "",
    pfType: "Absolute",
    pfValue: "",
    dpType: "Binary",
    dpValue: "",
    ...overrides,
  };
}

export function createDefaultSettings(name: string, mid: string): MerchantSettings {
  return {
    basicDetails: {
      subMerchantId: mid,
      subMerchantLegalName: name,
      subMerchantUrl: `https://${name.toLowerCase().replace(/\s+/g, "")}.com`,
      type: "Sub merchant",
      legalName: "PayU",
      whitelisted: true,
    },
    bnpl: {
      enabled: true,
      mdrPercent: "",
      capValueCr: "",
    },
    checkout: {
      enabled: true,
      payInParts: {
        enabled: false,
        minTxnAmount: "",
        mdrPercent: "",
        type: "",
        mdrPercentSecondary: "",
        downpayment: false,
      },
      stdEmi: {
        enabled: true,
        minTxnAmount: "",
        mdrPercent: "",
        type: "",
        mdrPercentSecondary: "",
        downpayment: false,
      },
      flags: {
        cofCapValue: "",
        signUpMode: "",
        signUpModeSecondary: "",
        autoLogin: "",
        inlineSupportEligibility: "",
        allowNoBnplUser: "",
        subventionRate: "",
        emiTags: "",
        orderExpiryTimeSeconds: "",
        inlinePosition: "Pre-KYC",
        category: "",
        checkAvailLimit: "",
        checkLpMitc: "",
        supportLatestMitcOnly: "",
        merchantCollectingDownpayment: "",
        loanConfirmationAllowed: "",
        loanConfirmationAutoCancelMins: "",
        uploadSelfieAllowed: "",
      },
    },
    policyDetails: {
      payInPartsTenures: [
        tenure("pip-3", 3, { minTxnAmount: "1500", maxTxnAmount: "50000" }),
        tenure("pip-6", 6, { minTxnAmount: "3000", maxTxnAmount: "100000" }),
      ],
      stdEmiTenures: [
        tenure("emi-3", 3, { minTxnAmount: "3000", maxTxnAmount: "500000" }),
        tenure("emi-6", 6, { minTxnAmount: "5000", maxTxnAmount: "500000" }),
      ],
    },
    ordersWebhookUrl: "https://merchant.com/webhooks/orders",
    onboardingWebhookUrl: "https://merchant.com/webhooks/onboarding",
    merchantKey: `key_${mid}`,
    salt: `salt_${mid}_prod`,
    clientId: `client_${mid}`,
    testMode: true,
    notes: "",
  };
}

export const DROPDOWN_OPTIONS = {
  type: ["Sub merchant", "Aggregator", "Marketplace"],
  interestType: ["Flat", "Reducing", "No Cost"],
  pfType: ["Absolute", "Percentage"],
  dpType: ["Binary", "Percentage", "Fixed"],
  signUpMode: ["OTP", "Email", "Social", "Guest"],
  autoLogin: ["Enabled", "Disabled", "Conditional"],
  inlineSupportEligibility: ["All Users", "BNPL Only", "EMI Only", "None"],
  allowNoBnplUser: ["Yes", "No"],
  inlinePosition: ["Pre-KYC", "Post-KYC", "Checkout", "Inline"],
  category: ["Fashion", "Electronics", "Travel", "General"],
  yesNo: ["Yes", "No"],
  checkoutType: ["Standard", "Premium", "No Cost EMI"],
  tenureMonths: [3, 6, 12, 18, 24],
} as const;
