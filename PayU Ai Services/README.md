# PayU Checkout Finance — Ops Panel & Merchant Portal

Dual-portal dashboard for PayU Checkout Finance product onboarding and merchant self-service.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5174](http://localhost:5174)

## Demo Logins

| Role | Password | Access |
|------|----------|--------|
| **Integration Support** | `payu101` | Configure merchant onboarding (toggles, URLs, product limits) |
| **Merchant1** | `payumerchant1` | View synced settings, help center, product cross-sell |

## Features

### Integration Support (Internal)
- Merchant list with status, enabled products, and configure CTA
- Full ops panel: merchant details, API credentials, URLs, product toggles, checkout UX, limits
- Changes persist in localStorage and sync to Merchant1 portal in real time

### Merchant1 (External)
- Read-only view of all settings configured by Integration Support
- Help Center with integration docs for enabled products
- Product showcase with cross-sell for Checkout EMI, BNPL, PaySense, Pay in 3, Downpayment + Pay in 3
- All product CTAs link to [lazypay.in](https://lazypay.in/)

## Sync Demo

1. Log in as **Integration Support** → open **Merchant1 — Fashion Hub** → toggle products → **Save**
2. Sign out → log in as **Merchant1** → see updated settings under **My Settings**
