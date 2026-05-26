# Samarth — LazyPay Chatbot

A CTA-driven + natural-language hybrid chatbot UI for LazyPay, styled after the Alia chat experience.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5174](http://localhost:5174)

## Flow

1. **Greeting** — Samarth says hello and shows `9560648813`
2. **Confirm** — CTAs: Correct, Edit, End Chat
3. **Edit** — Update number, then product list
4. **Products** — Paylater (green/active); others greyed → hover tooltip + link to [lazypay.in](https://lazypay.in)
5. **Actionables** — Transactions, Repayments/charges/fees, Previous Menu, Main Menu, End Chat
6. **Natural language** — After selecting an actionable, type questions in the input bar
