import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMerchants } from "../context/MerchantContext";
import { MERCHANT_NAV } from "../config/navigation";
import {
  countEnabledProducts,
  getEnabledProducts,
  getMerchantMid,
  getMerchantName,
} from "../utils/productHelpers";
import AppLayout from "./layout/AppLayout";
import MerchantConfigPanel from "./MerchantConfigPanel";
import HelpCenter from "./HelpCenter";
import ProductShowcase from "./ProductShowcase";
import Reporting from "./Reporting";
import styles from "./MerchantPortal.module.css";

type Tab = "overview" | "settings" | "reporting" | "products" | "help";

export default function MerchantPortal() {
  const { user } = useAuth();
  const { getMerchant } = useMerchants();
  const [tab, setTab] = useState<Tab>("overview");

  const merchant = user?.merchantId ? getMerchant(user.merchantId) : undefined;

  if (!merchant) {
    return (
      <AppLayout
        title="Merchant Portal"
        subtitle="No merchant linked to this account"
        navItems={MERCHANT_NAV}
        activeNavId="overview"
      >
        <p>Contact Integration Support to link your account.</p>
      </AppLayout>
    );
  }

  const enabledProducts = getEnabledProducts(merchant.settings);
  const enabledCount = countEnabledProducts(merchant.settings);

  return (
    <AppLayout
      title={merchant.displayName}
      subtitle={`MID: ${getMerchantMid(merchant.settings)} · ${enabledCount} finance products active`}
      navItems={MERCHANT_NAV}
      activeNavId={tab}
      onNavSelect={(id) => setTab(id as Tab)}
      navSectionLabel="Your Portal"
    >
      {tab === "overview" && (
        <div className={styles.overview}>
          <div className={styles.welcomeBanner}>
            <div>
              <h2>Welcome back, {getMerchantName(merchant.settings)}</h2>
              <p>
                Your Checkout Finance integration is{" "}
                <strong>{merchant.settings.testMode ? "in Test Mode" : "Live"}</strong>.
                Settings are managed by PayU Integration Support and update in real time.
              </p>
            </div>
            <span className={styles.liveSync}>● Live sync active</span>
          </div>

          <div className={styles.quickStats}>
            <div className={styles.quickStat}>
              <span>Active Products</span>
              <strong>{enabledCount}</strong>
            </div>
            <div className={styles.quickStat}>
              <span>Test Mode</span>
              <strong>{merchant.settings.testMode ? "On" : "Off"}</strong>
            </div>
            <div className={styles.quickStat}>
              <span>BNPL</span>
              <strong>{merchant.settings.bnpl.enabled ? "On" : "Off"}</strong>
            </div>
            <div className={styles.quickStat}>
              <span>Last Updated</span>
              <strong>{new Date(merchant.lastUpdated).toLocaleDateString()}</strong>
            </div>
          </div>

          <section className={styles.crossSellBanner}>
            <h3>Unlock more revenue at checkout</h3>
            <p>
              Merchants with 3+ finance products see 2.1× higher conversion. Talk to your PayU
              account manager to enable BNPL or PaySense.
            </p>
            <button type="button" className={styles.exploreBtn} onClick={() => setTab("products")}>
              Explore all products →
            </button>
          </section>

          <ProductShowcase enabledProducts={enabledProducts} compact onViewAll={() => setTab("products")} />
        </div>
      )}

      {tab === "settings" && (
        <div>
          <div className={styles.readOnlyBanner}>
            These settings are configured by PayU Integration Support. Contact your account
            manager to request changes.
          </div>
          <MerchantConfigPanel merchant={merchant} readOnly />
        </div>
      )}

      {tab === "reporting" && (
        <Reporting merchantId={merchant.id} merchantName={getMerchantName(merchant.settings)} />
      )}

      {tab === "products" && <ProductShowcase enabledProducts={enabledProducts} />}

      {tab === "help" && <HelpCenter enabledProducts={enabledProducts} />}
    </AppLayout>
  );
}
