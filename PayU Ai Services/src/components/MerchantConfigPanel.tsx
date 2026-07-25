import { useState } from "react";
import type { Merchant, MerchantSettings, TenurePolicy } from "../types";
import { DROPDOWN_OPTIONS } from "../data/defaults";
import Toggle from "./shared/Toggle";
import { Card, Field, Grid, SelectField, SubSection } from "./config/ConfigFields";
import styles from "./MerchantConfigPanel.module.css";

interface MerchantConfigPanelProps {
  merchant: Merchant;
  readOnly?: boolean;
  onSave?: (settings: MerchantSettings) => void;
}

type Section = "basic" | "credentials" | "webhooks" | "products" | "notes";
type ProductTab = "details" | "policy";

const SECTIONS: { id: Section; label: string }[] = [
  { id: "basic", label: "Sub-merchant Details" },
  { id: "credentials", label: "API Credentials" },
  { id: "webhooks", label: "URL Configuration" },
  { id: "products", label: "Product Configuration" },
  { id: "notes", label: "Internal Notes" },
];

function newTenure(months: number): TenurePolicy {
  return {
    id: `t-${Date.now()}-${months}`,
    months,
    minTxnAmount: "",
    maxTxnAmount: "",
    interestType: "",
    interestValue: "",
    pfType: "Absolute",
    pfValue: "",
    dpType: "Binary",
    dpValue: "",
  };
}

function TenureBlock({
  tenure,
  readOnly,
  onChange,
  onDelete,
}: {
  tenure: TenurePolicy;
  readOnly?: boolean;
  onChange: (t: TenurePolicy) => void;
  onDelete: () => void;
}) {
  const set = <K extends keyof TenurePolicy>(k: K, v: TenurePolicy[K]) =>
    onChange({ ...tenure, [k]: v });

  return (
    <div className={styles.tenureBlock}>
      <div className={styles.tenureHeader}>
        <strong>{tenure.months} Month</strong>
        {!readOnly && (
          <button type="button" className={styles.deleteBtn} onClick={onDelete}>
            Delete
          </button>
        )}
      </div>
      <Grid>
        <Field label="Min Txn Amount" value={tenure.minTxnAmount} readOnly={readOnly} placeholder="Value" onChange={(v) => set("minTxnAmount", v)} />
        <Field label="Max Txn Amount" value={tenure.maxTxnAmount} readOnly={readOnly} placeholder="Value" onChange={(v) => set("maxTxnAmount", v)} />
        <SelectField label="Interest Type" value={tenure.interestType} options={DROPDOWN_OPTIONS.interestType} readOnly={readOnly} onChange={(v) => set("interestType", v)} />
        <Field label="Interest Value" value={tenure.interestValue} readOnly={readOnly} placeholder="Value" onChange={(v) => set("interestValue", v)} />
        <SelectField label="PF" value={tenure.pfType} options={DROPDOWN_OPTIONS.pfType} readOnly={readOnly} onChange={(v) => set("pfType", v)} />
        <Field label="PF Value" value={tenure.pfValue} readOnly={readOnly} placeholder="Value" onChange={(v) => set("pfValue", v)} />
        <SelectField label="DP Type" value={tenure.dpType} options={DROPDOWN_OPTIONS.dpType} readOnly={readOnly} onChange={(v) => set("dpType", v)} />
        <Field label="DP" value={tenure.dpValue} readOnly={readOnly} placeholder="Value" onChange={(v) => set("dpValue", v)} />
      </Grid>
    </div>
  );
}

export default function MerchantConfigPanel({
  merchant,
  readOnly = false,
  onSave,
}: MerchantConfigPanelProps) {
  const [settings, setSettings] = useState<MerchantSettings>(merchant.settings);
  const [activeSection, setActiveSection] = useState<Section>("basic");
  const [productTab, setProductTab] = useState<ProductTab>("details");
  const [saved, setSaved] = useState(false);
  const [showTenureMenu, setShowTenureMenu] = useState<"pip" | "emi" | null>(null);

  const update = <K extends keyof MerchantSettings>(key: K, value: MerchantSettings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    onSave?.(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addTenure = (type: "pip" | "emi", months: number) => {
    const key = type === "pip" ? "payInPartsTenures" : "stdEmiTenures";
    update("policyDetails", {
      ...settings.policyDetails,
      [key]: [...settings.policyDetails[key], newTenure(months)],
    });
    setShowTenureMenu(null);
  };

  const removeTenure = (type: "pip" | "emi", id: string) => {
    const key = type === "pip" ? "payInPartsTenures" : "stdEmiTenures";
    update("policyDetails", {
      ...settings.policyDetails,
      [key]: settings.policyDetails[key].filter((t) => t.id !== id),
    });
  };

  const updateTenure = (type: "pip" | "emi", updated: TenurePolicy) => {
    const key = type === "pip" ? "payInPartsTenures" : "stdEmiTenures";
    update("policyDetails", {
      ...settings.policyDetails,
      [key]: settings.policyDetails[key].map((t) => (t.id === updated.id ? updated : t)),
    });
  };

  const flags = settings.checkout.flags;

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
            <h3>Basic Details</h3>
            <Card title="Basic Details">
              <Grid>
                <Field label="Sub Merchant ID" value={settings.basicDetails.subMerchantId} readOnly={readOnly} placeholder="Enter your name..." onChange={(v) => update("basicDetails", { ...settings.basicDetails, subMerchantId: v })} />
                <Field label="Sub Merchant Legal Name" value={settings.basicDetails.subMerchantLegalName} readOnly={readOnly} placeholder="Enter legal name..." onChange={(v) => update("basicDetails", { ...settings.basicDetails, subMerchantLegalName: v })} />
                <Field label="Sub Merchant URL" value={settings.basicDetails.subMerchantUrl} readOnly={readOnly} placeholder="Enter URL..." onChange={(v) => update("basicDetails", { ...settings.basicDetails, subMerchantUrl: v })} />
                <SelectField label="Type" value={settings.basicDetails.type} options={DROPDOWN_OPTIONS.type} readOnly={readOnly} onChange={(v) => update("basicDetails", { ...settings.basicDetails, type: v })} />
                <Field label="Legal name" value={settings.basicDetails.legalName} readOnly={readOnly} onChange={(v) => update("basicDetails", { ...settings.basicDetails, legalName: v })} />
              </Grid>
              <label className={styles.checkboxRow}>
                <input type="checkbox" checked={settings.basicDetails.whitelisted} disabled={readOnly} onChange={(e) => update("basicDetails", { ...settings.basicDetails, whitelisted: e.target.checked })} />
                <span>Whitelisted</span>
              </label>
              <div className={styles.toggleRow}>
                <Toggle id="testMode" label="Test Mode" checked={settings.testMode} disabled={readOnly} onChange={(v) => update("testMode", v)} />
                <span className={styles.toggleHint}>{settings.testMode ? "Sandbox transactions only" : "Live production mode"}</span>
              </div>
            </Card>
          </section>
        )}

        {activeSection === "credentials" && (
          <section className={styles.section}>
            <h3>API Credentials</h3>
            <Grid>
              <Field label="Merchant Key" value={settings.merchantKey} readOnly={readOnly} onChange={(v) => update("merchantKey", v)} />
              <Field label="Salt" value={settings.salt} readOnly={readOnly} onChange={(v) => update("salt", v)} />
              <Field label="Client ID" value={settings.clientId} readOnly={readOnly} onChange={(v) => update("clientId", v)} />
            </Grid>
          </section>
        )}

        {activeSection === "webhooks" && (
          <section className={styles.section}>
            <h3>URL Configuration</h3>
            <p className={styles.sectionDesc}>Webhook endpoints for order and onboarding events.</p>
            <Grid cols={1}>
              <Field label="Orders webhook" value={settings.ordersWebhookUrl} readOnly={readOnly} placeholder="https://..." onChange={(v) => update("ordersWebhookUrl", v)} />
              <Field label="Onboarding webhook" value={settings.onboardingWebhookUrl} readOnly={readOnly} placeholder="https://..." onChange={(v) => update("onboardingWebhookUrl", v)} />
            </Grid>
          </section>
        )}

        {activeSection === "products" && (
          <section className={styles.section}>
            <div className={styles.productTabs}>
              <button type="button" className={productTab === "details" ? styles.productTabActive : styles.productTab} onClick={() => setProductTab("details")}>
                Sub-merchant Details
              </button>
              <button type="button" className={productTab === "policy" ? styles.productTabActive : styles.productTab} onClick={() => setProductTab("policy")}>
                Policy Details
              </button>
            </div>

            {productTab === "details" && (
              <div className={styles.productStack}>
                <Card title="BNPL" enabled={settings.bnpl.enabled} readOnly={readOnly} onToggle={(v) => update("bnpl", { ...settings.bnpl, enabled: v })}>
                  <SubSection title="Settings">
                    <Grid>
                      <Field label="MDR (%)" value={settings.bnpl.mdrPercent} readOnly={readOnly} placeholder="Enter your MDR" onChange={(v) => update("bnpl", { ...settings.bnpl, mdrPercent: v })} />
                      <Field label="CAP Value (CR)" value={settings.bnpl.capValueCr} readOnly={readOnly} placeholder="Enter your MDR" onChange={(v) => update("bnpl", { ...settings.bnpl, capValueCr: v })} />
                    </Grid>
                  </SubSection>
                </Card>

                <Card title="Checkout" enabled={settings.checkout.enabled} readOnly={readOnly} onToggle={(v) => update("checkout", { ...settings.checkout, enabled: v })}>
                  <SubSection title="Checkout Pay in Parts">
                    <div className={styles.inlineToggle}>
                      <Toggle id="pip" label="Enabled" checked={settings.checkout.payInParts.enabled} disabled={readOnly} onChange={(v) => update("checkout", { ...settings.checkout, payInParts: { ...settings.checkout.payInParts, enabled: v } })} />
                    </div>
                    <Grid>
                      <Field label="Min Txn Amount" value={settings.checkout.payInParts.minTxnAmount} readOnly={readOnly} placeholder="Enter value" onChange={(v) => update("checkout", { ...settings.checkout, payInParts: { ...settings.checkout.payInParts, minTxnAmount: v } })} />
                      <Field label="MDR (%)" value={settings.checkout.payInParts.mdrPercent} readOnly={readOnly} placeholder="Enter your MDR" onChange={(v) => update("checkout", { ...settings.checkout, payInParts: { ...settings.checkout.payInParts, mdrPercent: v } })} />
                      <SelectField label="Type" value={settings.checkout.payInParts.type} options={DROPDOWN_OPTIONS.checkoutType} readOnly={readOnly} onChange={(v) => update("checkout", { ...settings.checkout, payInParts: { ...settings.checkout.payInParts, type: v } })} />
                      <Field label="MDR (%)" value={settings.checkout.payInParts.mdrPercentSecondary} readOnly={readOnly} placeholder="Enter value" onChange={(v) => update("checkout", { ...settings.checkout, payInParts: { ...settings.checkout.payInParts, mdrPercentSecondary: v } })} />
                    </Grid>
                    <div className={styles.inlineToggle}>
                      <Toggle id="pipDp" label="Downpayment" checked={settings.checkout.payInParts.downpayment} disabled={readOnly} onChange={(v) => update("checkout", { ...settings.checkout, payInParts: { ...settings.checkout.payInParts, downpayment: v } })} />
                    </div>
                  </SubSection>

                  <SubSection title="Checkout STD EMI">
                    <div className={styles.inlineToggle}>
                      <Toggle id="stdEmi" label="Enabled" checked={settings.checkout.stdEmi.enabled} disabled={readOnly} onChange={(v) => update("checkout", { ...settings.checkout, stdEmi: { ...settings.checkout.stdEmi, enabled: v } })} />
                    </div>
                    <Grid>
                      <Field label="Min Txn Amount" value={settings.checkout.stdEmi.minTxnAmount} readOnly={readOnly} placeholder="Enter value" onChange={(v) => update("checkout", { ...settings.checkout, stdEmi: { ...settings.checkout.stdEmi, minTxnAmount: v } })} />
                      <Field label="MDR (%)" value={settings.checkout.stdEmi.mdrPercent} readOnly={readOnly} placeholder="Enter your MDR" onChange={(v) => update("checkout", { ...settings.checkout, stdEmi: { ...settings.checkout.stdEmi, mdrPercent: v } })} />
                      <SelectField label="Type" value={settings.checkout.stdEmi.type} options={DROPDOWN_OPTIONS.checkoutType} readOnly={readOnly} onChange={(v) => update("checkout", { ...settings.checkout, stdEmi: { ...settings.checkout.stdEmi, type: v } })} />
                      <Field label="MDR (%)" value={settings.checkout.stdEmi.mdrPercentSecondary} readOnly={readOnly} placeholder="Enter value" onChange={(v) => update("checkout", { ...settings.checkout, stdEmi: { ...settings.checkout.stdEmi, mdrPercentSecondary: v } })} />
                    </Grid>
                    <div className={styles.inlineToggle}>
                      <Toggle id="emiDp" label="Downpayment" checked={settings.checkout.stdEmi.downpayment} disabled={readOnly} onChange={(v) => update("checkout", { ...settings.checkout, stdEmi: { ...settings.checkout.stdEmi, downpayment: v } })} />
                    </div>
                  </SubSection>

                  <SubSection title="Checkout Flags">
                    <Grid>
                      <Field label="COF Cap Value" value={flags.cofCapValue} readOnly={readOnly} placeholder="Enter your Value" onChange={(v) => update("checkout", { ...settings.checkout, flags: { ...flags, cofCapValue: v } })} />
                      <SelectField label="Sign up Mode" value={flags.signUpMode} options={DROPDOWN_OPTIONS.signUpMode} readOnly={readOnly} onChange={(v) => update("checkout", { ...settings.checkout, flags: { ...flags, signUpMode: v } })} />
                      <SelectField label="Sign up Mode" value={flags.signUpModeSecondary} options={DROPDOWN_OPTIONS.signUpMode} readOnly={readOnly} placeholder="Select a Value" onChange={(v) => update("checkout", { ...settings.checkout, flags: { ...flags, signUpModeSecondary: v } })} />
                      <SelectField label="Auto Login" value={flags.autoLogin} options={DROPDOWN_OPTIONS.autoLogin} readOnly={readOnly} placeholder="Select a Value" onChange={(v) => update("checkout", { ...settings.checkout, flags: { ...flags, autoLogin: v } })} />
                      <SelectField label="Inline Support Eligibility" value={flags.inlineSupportEligibility} options={DROPDOWN_OPTIONS.inlineSupportEligibility} readOnly={readOnly} placeholder="Select a Value" onChange={(v) => update("checkout", { ...settings.checkout, flags: { ...flags, inlineSupportEligibility: v } })} />
                      <SelectField label="Allow No-BNPL User" value={flags.allowNoBnplUser} options={DROPDOWN_OPTIONS.yesNo} readOnly={readOnly} placeholder="Select a Value" onChange={(v) => update("checkout", { ...settings.checkout, flags: { ...flags, allowNoBnplUser: v } })} />
                      <Field label="Subvention Rate" value={flags.subventionRate} readOnly={readOnly} placeholder="Enter your Value" onChange={(v) => update("checkout", { ...settings.checkout, flags: { ...flags, subventionRate: v } })} />
                      <Field label="EMI Tags" value={flags.emiTags} readOnly={readOnly} placeholder="Enter your Value" onChange={(v) => update("checkout", { ...settings.checkout, flags: { ...flags, emiTags: v } })} />
                      <Field label="Order Expiry Time (Seconds)" value={flags.orderExpiryTimeSeconds} readOnly={readOnly} placeholder="Enter your Value" onChange={(v) => update("checkout", { ...settings.checkout, flags: { ...flags, orderExpiryTimeSeconds: v } })} />
                      <SelectField label="Inline Position" value={flags.inlinePosition} options={DROPDOWN_OPTIONS.inlinePosition} readOnly={readOnly} onChange={(v) => update("checkout", { ...settings.checkout, flags: { ...flags, inlinePosition: v } })} />
                      <SelectField label="Category" value={flags.category} options={DROPDOWN_OPTIONS.category} readOnly={readOnly} onChange={(v) => update("checkout", { ...settings.checkout, flags: { ...flags, category: v } })} />
                      <SelectField label="Check Avail Limit" value={flags.checkAvailLimit} options={DROPDOWN_OPTIONS.yesNo} readOnly={readOnly} onChange={(v) => update("checkout", { ...settings.checkout, flags: { ...flags, checkAvailLimit: v } })} />
                      <SelectField label="Check LP MITC" value={flags.checkLpMitc} options={DROPDOWN_OPTIONS.yesNo} readOnly={readOnly} onChange={(v) => update("checkout", { ...settings.checkout, flags: { ...flags, checkLpMitc: v } })} />
                      <SelectField label="Support for Latest MITC Only" value={flags.supportLatestMitcOnly} options={DROPDOWN_OPTIONS.yesNo} readOnly={readOnly} onChange={(v) => update("checkout", { ...settings.checkout, flags: { ...flags, supportLatestMitcOnly: v } })} />
                      <SelectField label="Merchant Collecting Downpayment (DP)" value={flags.merchantCollectingDownpayment} options={DROPDOWN_OPTIONS.yesNo} readOnly={readOnly} onChange={(v) => update("checkout", { ...settings.checkout, flags: { ...flags, merchantCollectingDownpayment: v } })} />
                      <SelectField label="Loan Confirmation Allowed" value={flags.loanConfirmationAllowed} options={DROPDOWN_OPTIONS.yesNo} readOnly={readOnly} onChange={(v) => update("checkout", { ...settings.checkout, flags: { ...flags, loanConfirmationAllowed: v } })} />
                      <Field label="Loan Confirmation Auto cancel (Mins)" value={flags.loanConfirmationAutoCancelMins} readOnly={readOnly} placeholder="Enter your Value" onChange={(v) => update("checkout", { ...settings.checkout, flags: { ...flags, loanConfirmationAutoCancelMins: v } })} />
                      <SelectField label="Upload Selfie Allowed" value={flags.uploadSelfieAllowed} options={DROPDOWN_OPTIONS.yesNo} readOnly={readOnly} onChange={(v) => update("checkout", { ...settings.checkout, flags: { ...flags, uploadSelfieAllowed: v } })} />
                    </Grid>
                  </SubSection>
                </Card>
              </div>
            )}

            {productTab === "policy" && (
              <div className={styles.productStack}>
                <Card title="Pay in parts">
                  {settings.policyDetails.payInPartsTenures.map((t) => (
                    <TenureBlock key={t.id} tenure={t} readOnly={readOnly} onChange={(updated) => updateTenure("pip", updated)} onDelete={() => removeTenure("pip", t.id)} />
                  ))}
                  {!readOnly && (
                    <div className={styles.addTenureWrap}>
                      <button type="button" className={styles.addTenureBtn} onClick={() => setShowTenureMenu(showTenureMenu === "pip" ? null : "pip")}>
                        Add new tenure ▾
                      </button>
                      {showTenureMenu === "pip" && (
                        <div className={styles.tenureMenu}>
                          {DROPDOWN_OPTIONS.tenureMonths.map((m) => (
                            <button key={m} type="button" onClick={() => addTenure("pip", m)}>{m} Months</button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Card>

                <Card title="Std EMI">
                  {settings.policyDetails.stdEmiTenures.map((t) => (
                    <TenureBlock key={t.id} tenure={t} readOnly={readOnly} onChange={(updated) => updateTenure("emi", updated)} onDelete={() => removeTenure("emi", t.id)} />
                  ))}
                  {!readOnly && (
                    <div className={styles.addTenureWrap}>
                      <button type="button" className={styles.addTenureBtn} onClick={() => setShowTenureMenu(showTenureMenu === "emi" ? null : "emi")}>
                        Add new tenure ▾
                      </button>
                      {showTenureMenu === "emi" && (
                        <div className={styles.tenureMenu}>
                          {DROPDOWN_OPTIONS.tenureMonths.map((m) => (
                            <button key={m} type="button" onClick={() => addTenure("emi", m)}>{m} Months</button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </div>
            )}
          </section>
        )}

        {activeSection === "notes" && (
          <section className={styles.section}>
            <h3>Internal Notes</h3>
            <label className={styles.fieldFull}>
              <span>Notes</span>
              <textarea rows={5} value={settings.notes} readOnly={readOnly} placeholder="Integration notes..." onChange={(e) => update("notes", e.target.value)} />
            </label>
          </section>
        )}

        {!readOnly && onSave && (
          <div className={styles.saveBar}>
            {saved && <span className={styles.savedMsg}>✓ Settings saved — synced to merchant portal</span>}
            <button type="button" className={styles.saveBtn} onClick={handleSave}>Save Configuration</button>
          </div>
        )}
      </div>
    </div>
  );
}
