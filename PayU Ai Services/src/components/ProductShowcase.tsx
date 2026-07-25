import type { ProductId } from "../types";
import { LAZYPAY_URL, PRODUCTS } from "../data/products";
import styles from "./ProductShowcase.module.css";

interface ProductShowcaseProps {
  enabledProducts: Record<ProductId, { enabled: boolean }>;
  compact?: boolean;
  onViewAll?: () => void;
}

export default function ProductShowcase({
  enabledProducts,
  compact = false,
  onViewAll,
}: ProductShowcaseProps) {
  const displayProducts = compact
    ? PRODUCTS.filter((p) => !enabledProducts[p.id]?.enabled).slice(0, 2)
    : PRODUCTS;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2>{compact ? "Recommended for you" : "Checkout Finance Products"}</h2>
          <p>
            {compact
              ? "Products not yet enabled on your account — unlock new revenue streams."
              : "Explore PayU's full suite of checkout finance solutions. All powered by LazyPay."}
          </p>
        </div>
        {compact && onViewAll && (
          <button type="button" className={styles.viewAllBtn} onClick={onViewAll}>
            View all →
          </button>
        )}
      </div>

      <div className={`${styles.grid} ${compact ? styles.gridCompact : ""}`}>
        {displayProducts.map((product) => {
          const isEnabled = enabledProducts[product.id]?.enabled;
          return (
            <article
              key={product.id}
              className={styles.card}
              style={{ "--accent": product.accent } as React.CSSProperties}
            >
              <div className={styles.cardHeader}>
                {product.badge && <span className={styles.badge}>{product.badge}</span>}
                {isEnabled && <span className={styles.enabledTag}>Active on your account</span>}
              </div>

              <h3>{product.name}</h3>
              <p className={styles.tagline}>{product.tagline}</p>
              <p className={styles.desc}>{product.description}</p>

              <div className={styles.stats}>
                {product.stats.map((s) => (
                  <div key={s.label} className={styles.stat}>
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>

              <ul className={styles.benefits}>
                {product.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>

              <div className={styles.crossSell}>
                <span>PM Tip:</span> {product.crossSellHint}
              </div>

              <a
                href={LAZYPAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cta}
              >
                {isEnabled ? "Learn more on LazyPay" : "Enable via LazyPay →"}
              </a>
            </article>
          );
        })}
      </div>

      {!compact && (
        <div className={styles.bundleBanner}>
          <h3>Bundle & Save: Checkout Finance Suite</h3>
          <p>
            Enable Checkout EMI + BNPL + Pay in 3 together and get priority integration support,
            co-branded checkout widgets, and a dedicated success manager. Merchants see an average
            2.1× conversion lift within 30 days.
          </p>
          <a href={LAZYPAY_URL} target="_blank" rel="noopener noreferrer" className={styles.bundleCta}>
            Talk to us on LazyPay →
          </a>
        </div>
      )}
    </section>
  );
}
