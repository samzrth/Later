import { useState } from "react";
import { useMerchants } from "../context/MerchantContext";
import { INTEGRATION_NAV } from "../config/navigation";
import {
  countEnabledProducts,
  getEnabledProducts,
  getMerchantMid,
} from "../utils/productHelpers";
import AppLayout from "./layout/AppLayout";
import MerchantConfigPanel from "./MerchantConfigPanel";
import styles from "./IntegrationPortal.module.css";

export default function IntegrationPortal() {
  const { merchants, updateMerchant } = useMerchants();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = selectedId ? merchants.find((m) => m.id === selectedId) : null;

  const statusClass = (status: string) => {
    if (status === "active") return styles.statusActive;
    if (status === "pending") return styles.statusPending;
    return styles.statusInactive;
  };

  if (selected) {
    return (
      <AppLayout
        title={selected.displayName}
        subtitle={`MID: ${getMerchantMid(selected.settings)} · Last updated ${new Date(selected.lastUpdated).toLocaleString()}`}
        navItems={INTEGRATION_NAV}
        activeNavId="merchants"
        navSectionLabel="Navigation"
      >
        <button type="button" className={styles.backBtn} onClick={() => setSelectedId(null)}>
          ← Back to merchant list
        </button>
        <MerchantConfigPanel
          merchant={selected}
          onSave={(settings) => updateMerchant(selected.id, settings, "Integration Support")}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Merchant Onboarding"
      subtitle="Select a merchant to configure Checkout Finance settings"
      navItems={INTEGRATION_NAV}
      activeNavId="merchants"
      navSectionLabel="Navigation"
    >
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span>Total Merchants</span>
          <strong>{merchants.length}</strong>
        </div>
        <div className={styles.statCard}>
          <span>Active</span>
          <strong>{merchants.filter((m) => m.status === "active").length}</strong>
        </div>
        <div className={styles.statCard}>
          <span>Pending Setup</span>
          <strong>{merchants.filter((m) => m.status === "pending").length}</strong>
        </div>
      </div>

      <div className={styles.listHeader}>
        <h2>Existing Merchants</h2>
        <button type="button" className={styles.addBtn} disabled title="Coming soon">
          + Add Merchant
        </button>
      </div>

      <div className={styles.merchantGrid}>
        {merchants.map((merchant) => {
          const enabledCount = countEnabledProducts(merchant.settings);
          const enabled = getEnabledProducts(merchant.settings);
          return (
            <article key={merchant.id} className={styles.merchantCard}>
              <div className={styles.cardTop}>
                <div>
                  <h3>{merchant.displayName}</h3>
                  <p>MID: {getMerchantMid(merchant.settings)}</p>
                </div>
                <span className={`${styles.status} ${statusClass(merchant.status)}`}>
                  {merchant.status}
                </span>
              </div>

              <div className={styles.cardMeta}>
                <div>
                  <span>Products enabled</span>
                  <strong>{enabledCount} / 5</strong>
                </div>
                <div>
                  <span>Mode</span>
                  <strong>{merchant.settings.testMode ? "Test" : "Live"}</strong>
                </div>
                <div>
                  <span>Updated by</span>
                  <strong>{merchant.updatedBy}</strong>
                </div>
              </div>

              <div className={styles.productPills}>
                {Object.entries(enabled)
                  .filter(([, cfg]) => cfg.enabled)
                  .map(([id]) => (
                    <span key={id} className={styles.pill}>
                      {id.replace(/-/g, " ")}
                    </span>
                  ))}
                {enabledCount === 0 && (
                  <span className={styles.pillEmpty}>No products enabled</span>
                )}
              </div>

              <button
                type="button"
                className={styles.configureBtn}
                onClick={() => setSelectedId(merchant.id)}
              >
                Configure Settings →
              </button>
            </article>
          );
        })}
      </div>
    </AppLayout>
  );
}
