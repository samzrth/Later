import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMerchants } from "../context/MerchantContext";
import Layout from "./Layout";
import MerchantConfigPanel from "./MerchantConfigPanel";
import HelpCenter from "./HelpCenter";
import ProductShowcase from "./ProductShowcase";
import styles from "./MerchantPortal.module.css";

type Tab = "overview" | "settings" | "products" | "help";

export default function MerchantPortal() {
  const { user } = useAuth();
  const { getMerchant } = useMerchants();
  const [tab, setTab] = useState<Tab>("overview");

  const merchant = user?.merchantId ? getMerchant(user.merchantId) : undefined;

  if (!merchant) {
    return (
      <Layout title="Merchant Portal" subtitle="No merchant linked to this account">
        <p>Contact Integration Support to link your account.</p>
      </Layout>
    );
  }

  const enabledCount = Object.values(merchant.settings.products).filter((p) => p.enabled).length;

  const nav = (
    <nav className={styles.sideNav}>
      <span className={styles.navLabel}>Your Portal</span>
      {(
        [
          ["overview", "Overview"],
          ["settings", "My Settings"],
          ["products", "Explore Products"],
          ["help", "Help Center"],
        ] as const
      ).map(([id, label]) => (
        <button
          key={id}
          type="button"
          className={tab === id ? styles.navItemActive : styles.navItem}
          onClick={() => setTab(id)}
        >
          {label}
        </button>
      ))}
    </nav>
  );

  return (
    <Layout
      title={merchant.displayName}
      subtitle={`MID: ${merchant.settings.mid} · ${enabledCount} finance products active`}
      nav={nav}
    >
      {tab === "overview" && (
        <div className={styles.overview}>
          <div className={styles.welcomeBanner}>
            <div>
              <h2>Welcome back, {merchant.settings.merchantName}</h2>
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
              <span>EMI Calculator</span>
              <strong>{merchant.settings.showEmiCalculator ? "Visible" : "Hidden"}</strong>
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

          <ProductShowcase
            enabledProducts={merchant.settings.products}
            compact
            onViewAll={() => setTab("products")}
          />
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

      {tab === "products" && (
        <ProductShowcase enabledProducts={merchant.settings.products} />
      )}

      {tab === "help" && <HelpCenter enabledProducts={merchant.settings.products} />}
    </Layout>
  );
}
