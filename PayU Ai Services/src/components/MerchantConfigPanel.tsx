import { useState } from "react";
import type { Merchant, MerchantSettings, ProductId } from "../types";
import { PRODUCTS } from "../data/products";
import Toggle from "./shared/Toggle";
import styles from "./MerchantConfigPanel.module.css";

interface MerchantConfigPanelProps {
  merchant: Merchant;
  readOnly?: boolean;
  onSave?: (settings: MerchantSettings) => void;
}

type Section = "basic" | "credentials" | "urls" | "products" | "checkout" | "limits" | "notes";

const SECTIONS: { id: Section; label: string }[] = [
  { id: "basic", label: "Merchant Details" },
  { id: "credentials", label: "API Credentials" },
  { id: "urls", label: "URL Configuration" },
  { id: "products", label: "Product Configuration" },
  { id: "checkout", label: "Checkout Experience" },
  { id: "limits", label: "Limits & Risk" },
  { id: "notes", label: "Internal Notes" },
];

export default function MerchantConfigPanel({
  merchant,
  readOnly = false,
  onSave,
}: MerchantConfigPanelProps) {
  const [settings, setSettings] = useState<MerchantSettings>(merchant.settings);
  const [activeSection, setActiveSection] = useState<Section>("basic");
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof MerchantSettings>(key: K, value: MerchantSettings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
    setSaved(false);
  };

  const updateProduct = (id: ProductId, patch: Partial<MerchantSettings["products"][ProductId]>) => {
    setSettings((s) => ({
      ...s,
      products: {
        ...s.products,
        [id]: { ...s.products[id], ...patch },
      },
    }));
    setSaved(false);
  };

  const handleSave = () => {
    onSave?.(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const renderField = (
    label: string,
    key: keyof MerchantSettings,
    type: "text" | "number" | "email" | "url" = "text",
  ) => (
    <label className={styles.field} key={String(key)}>
      <span>{label}</span>
      <input
        type={type}
        value={String(settings[key] ?? "")}
        readOnly={readOnly}
        onChange={(e) => {
          const val =
            type === "number" ? Number(e.target.value) : e.target.value;
          update(key, val as MerchantSettings[typeof key]);
        }}
      />
    </label>
  );

  return (
    <div className={styles.panel}>
      <nav className={styles.sectionNav}>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`${styles.sectionBtn} ${activeSection === s.id ? styles.sectionActive : ""}`}
            onClick={() => setActiveSection(s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      <div className={styles.formArea}>
        {activeSection === "basic" && (
          <section className={styles.section}>
            <h3>Merchant Details</h3>
            <p className={styles.sectionDesc}>Basic merchant identity and contact information.</p>
            <div className={styles.grid}>
              {renderField("Merchant Name", "merchantName")}
              {renderField("Merchant ID (MID)", "mid")}
              {renderField("Contact Email", "contactEmail", "email")}
            </div>
            <div className={styles.toggleRow}>
              <Toggle
                id="testMode"
                label="Test Mode"
                checked={settings.testMode}
                disabled={readOnly}
                onChange={(v) => update("testMode", v)}
              />
              <span className={styles.toggleHint}>
                {settings.testMode ? "Sandbox transactions only" : "Live production mode"}
              </span>
            </div>
          </section>
        )}

        {activeSection === "credentials" && (
          <section className={styles.section}>
            <h3>API Credentials</h3>
            <p className={styles.sectionDesc}>
              Keys used for PayU Checkout Finance SDK integration.
            </p>
            <div className={styles.grid}>
              {renderField("Merchant Key", "merchantKey")}
              {renderField("Salt", "salt")}
              {renderField("Client ID", "clientId")}
            </div>
          </section>
        )}

        {activeSection === "urls" && (
          <section className={styles.section}>
            <h3>URL Configuration</h3>
            <p className={styles.sectionDesc}>
              Redirect and webhook endpoints for payment lifecycle events.
            </p>
            <div className={styles.grid}>
              {renderField("Success URL", "successUrl", "url")}
              {renderField("Failure URL", "failureUrl", "url")}
              {renderField("Cancel URL", "cancelUrl", "url")}
              {renderField("Webhook URL", "webhookUrl", "url")}
            </div>
          </section>
        )}

        {activeSection === "products" && (
          <section className={styles.section}>
            <h3>Product Configuration</h3>
            <p className={styles.sectionDesc}>
              Enable finance products and set per-product limits. Changes sync to merchant portal instantly.
            </p>
            <div className={styles.productCards}>
              {PRODUCTS.map((product) => {
                const cfg = settings.products[product.id];
                return (
                  <div
                    key={product.id}
                    className={`${styles.productCard} ${cfg.enabled ? styles.productEnabled : ""}`}
                    style={{ "--accent": product.accent } as React.CSSProperties}
                  >
                    <div className={styles.productHeader}>
                      <div>
                        <h4>{product.name}</h4>
                        <p>{product.tagline}</p>
                      </div>
                      <Toggle
                        id={`product-${product.id}`}
                        checked={cfg.enabled}
                        disabled={readOnly}
                        onChange={(v) => updateProduct(product.id, { enabled: v })}
                      />
                    </div>
                    {cfg.enabled && (
                      <div className={styles.productFields}>
                        <label className={styles.field}>
                          <span>Min Amount (₹)</span>
                          <input
                            type="number"
                            value={cfg.minAmount}
                            readOnly={readOnly}
                            onChange={(e) =>
                              updateProduct(product.id, { minAmount: Number(e.target.value) })
                            }
                          />
                        </label>
                        <label className={styles.field}>
                          <span>Max Amount (₹)</span>
                          <input
                            type="number"
                            value={cfg.maxAmount}
                            readOnly={readOnly}
                            onChange={(e) =>
                              updateProduct(product.id, { maxAmount: Number(e.target.value) })
                            }
                          />
                        </label>
                        {cfg.tenures !== undefined && (
                          <label className={styles.field}>
                            <span>EMI Tenures (months)</span>
                            <input
                              type="text"
                              value={cfg.tenures}
                              readOnly={readOnly}
                              placeholder="3,6,9,12,18,24"
                              onChange={(e) =>
                                updateProduct(product.id, { tenures: e.target.value })
                              }
                            />
                          </label>
                        )}
                        {cfg.downpaymentPercent !== undefined && (
                          <label className={styles.field}>
                            <span>Downpayment %</span>
                            <input
                              type="number"
                              value={cfg.downpaymentPercent}
                              readOnly={readOnly}
                              min={10}
                              max={50}
                              onChange={(e) =>
                                updateProduct(product.id, {
                                  downpaymentPercent: Number(e.target.value),
                                })
                              }
                            />
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {activeSection === "checkout" && (
          <section className={styles.section}>
            <h3>Checkout Experience</h3>
            <p className={styles.sectionDesc}>Branding and UX toggles for the checkout widget.</p>
            <div className={styles.grid}>
              {renderField("Logo URL", "logoUrl", "url")}
              {renderField("Theme Color", "themeColor")}
              {renderField("Session Timeout (minutes)", "sessionTimeoutMinutes", "number")}
            </div>
            <div className={styles.toggleGroup}>
              <Toggle
                id="autoCapture"
                label="Auto Capture"
                checked={settings.autoCapture}
                disabled={readOnly}
                onChange={(v) => update("autoCapture", v)}
              />
              <Toggle
                id="preAuth"
                label="Pre-Auth Enabled"
                checked={settings.preAuthEnabled}
                disabled={readOnly}
                onChange={(v) => update("preAuthEnabled", v)}
              />
              <Toggle
                id="emiCalc"
                label="Show EMI Calculator"
                checked={settings.showEmiCalculator}
                disabled={readOnly}
                onChange={(v) => update("showEmiCalculator", v)}
              />
            </div>
          </section>
        )}

        {activeSection === "limits" && (
          <section className={styles.section}>
            <h3>Limits & Risk</h3>
            <p className={styles.sectionDesc}>Transaction boundaries and daily caps.</p>
            <div className={styles.grid}>
              {renderField("Global Min Amount (₹)", "globalMinAmount", "number")}
              {renderField("Global Max Amount (₹)", "globalMaxAmount", "number")}
              {renderField("Daily Transaction Limit (₹)", "dailyTransactionLimit", "number")}
            </div>
          </section>
        )}

        {activeSection === "notes" && (
          <section className={styles.section}>
            <h3>Internal Notes</h3>
            <p className={styles.sectionDesc}>
              {readOnly
                ? "Notes from integration team (read-only for merchants)."
                : "Private notes visible only to Integration Support."}
            </p>
            <label className={styles.fieldFull}>
              <span>Notes</span>
              <textarea
                rows={5}
                value={settings.notes}
                readOnly={readOnly}
                placeholder="Integration notes, UAT status, go-live checklist..."
                onChange={(e) => update("notes", e.target.value)}
              />
            </label>
          </section>
        )}

        {!readOnly && onSave && (
          <div className={styles.saveBar}>
            {saved && <span className={styles.savedMsg}>✓ Settings saved — synced to merchant portal</span>}
            <button type="button" className={styles.saveBtn} onClick={handleSave}>
              Save Configuration
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
