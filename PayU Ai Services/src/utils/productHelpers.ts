import type { MerchantSettings, ProductId } from "../types";

export function getEnabledProducts(
  settings: MerchantSettings,
): Record<ProductId, { enabled: boolean }> {
  return {
    "checkout-emi": { enabled: settings.checkout.enabled && settings.checkout.stdEmi.enabled },
    bnpl: { enabled: settings.bnpl.enabled },
    paysense: { enabled: false },
    "pay-in-3": {
      enabled: settings.checkout.enabled && settings.checkout.payInParts.enabled,
    },
    "downpayment-pay-in-3": {
      enabled:
        settings.checkout.enabled &&
        settings.checkout.payInParts.enabled &&
        settings.checkout.payInParts.downpayment,
    },
  };
}

export function countEnabledProducts(settings: MerchantSettings): number {
  return Object.values(getEnabledProducts(settings)).filter((p) => p.enabled).length;
}

export function getMerchantMid(settings: MerchantSettings): string {
  return settings.basicDetails.subMerchantId;
}

export function getMerchantName(settings: MerchantSettings): string {
  return settings.basicDetails.subMerchantLegalName;
}
