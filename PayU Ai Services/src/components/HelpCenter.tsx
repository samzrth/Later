import { useState } from "react";
import type { ProductId } from "../types";
import { INTEGRATION_DOCS, LAZYPAY_URL, PRODUCTS } from "../data/products";
import styles from "./HelpCenter.module.css";

interface HelpCenterProps {
  enabledProducts: Record<ProductId, { enabled: boolean }>;
}

export default function HelpCenter({ enabledProducts }: HelpCenterProps) {
  const [expandedId, setExpandedId] = useState<string | null>(INTEGRATION_DOCS[0]?.id ?? null);

  const enabledDocs = INTEGRATION_DOCS.filter((d) => enabledProducts[d.productId]?.enabled);
  const allDocs = INTEGRATION_DOCS;

  return (
    <div className={styles.help}>
      <div className={styles.intro}>
        <h2>Integration Help Center</h2>
        <p>
          Documentation, guides, and API references for your enabled Checkout Finance products.
          Need hands-on support? Visit{" "}
          <a href={LAZYPAY_URL} target="_blank" rel="noopener noreferrer">
            lazypay.in
          </a>
          .
        </p>
      </div>

      {enabledDocs.length > 0 && (
        <section className={styles.section}>
          <h3>Your Active Integrations</h3>
          <div className={styles.docList}>
            {enabledDocs.map((doc) => {
              const product = PRODUCTS.find((p) => p.id === doc.productId);
              const isOpen = expandedId === doc.id;
              return (
                <article key={doc.id} className={styles.docCard}>
                  <button
                    type="button"
                    className={styles.docHeader}
                    onClick={() => setExpandedId(isOpen ? null : doc.id)}
                  >
                    <div>
                      <span
                        className={styles.docAccent}
                        style={{ background: product?.accent }}
                      />
                      <div>
                        <strong>{doc.title}</strong>
                        <p>{doc.summary}</p>
                      </div>
                    </div>
                    <span className={styles.chevron}>{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div className={styles.docBody}>
                      {doc.sections.map((s) => (
                        <div key={s.heading} className={styles.docSection}>
                          <h4>{s.heading}</h4>
                          <pre className={styles.docContent}>{s.content}</pre>
                        </div>
                      ))}
                      <a
                        href={LAZYPAY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.downloadBtn}
                      >
                        {doc.downloadLabel} →
                      </a>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h3>All Product Documentation</h3>
        <p className={styles.sectionSub}>
          Browse guides for products you can enable. Contact PayU to activate additional products.
        </p>
        <div className={styles.allDocsGrid}>
          {allDocs.map((doc) => {
            const product = PRODUCTS.find((p) => p.id === doc.productId);
            const isEnabled = enabledProducts[doc.productId]?.enabled;
            return (
              <div key={doc.id} className={styles.miniDoc}>
                <div className={styles.miniDocTop}>
                  <span
                    className={styles.miniAccent}
                    style={{ background: product?.accent }}
                  />
                  <strong>{product?.name}</strong>
                  {isEnabled ? (
                    <span className={styles.activeLabel}>Active</span>
                  ) : (
                    <span className={styles.inactiveLabel}>Not enabled</span>
                  )}
                </div>
                <p>{doc.summary}</p>
                <a href={LAZYPAY_URL} target="_blank" rel="noopener noreferrer">
                  Read on LazyPay →
                </a>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.faq}>
        <h3>Quick FAQ</h3>
        <div className={styles.faqGrid}>
          <div>
            <strong>How do I go live?</strong>
            <p>
              Complete UAT in test mode, get Integration Support sign-off, then toggle off Test
              Mode in your settings.
            </p>
          </div>
          <div>
            <strong>Where are my API keys?</strong>
            <p>View them in My Settings → API Credentials. Never share salt in client-side code.</p>
          </div>
          <div>
            <strong>How do webhooks work?</strong>
            <p>
              Configure your webhook URL in settings. PayU sends POST events for payment lifecycle
              updates.
            </p>
          </div>
          <div>
            <strong>Can I enable more products?</strong>
            <p>
              Yes! Explore Products tab or contact your PayU account manager. Most additions go live
              within 48 hours.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
