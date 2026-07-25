import type { CSSProperties, ReactNode } from "react";
import styles from "../MerchantConfigPanel.module.css";

interface FieldProps {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  type?: string;
  placeholder?: string;
}

export function Field({ label, value, onChange, readOnly, type = "text", placeholder }: FieldProps) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      />
    </label>
  );
}

interface SelectProps {
  label: string;
  value: string;
  options: readonly string[];
  onChange?: (v: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  readOnly,
  placeholder = "Select an item",
}: SelectProps) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <select
        value={value}
        disabled={readOnly}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Card({
  title,
  enabled,
  onToggle,
  readOnly,
  children,
}: {
  title: string;
  enabled?: boolean;
  onToggle?: (v: boolean) => void;
  readOnly?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h4>{title}</h4>
        {onToggle !== undefined && (
          <label className={styles.enabledToggle}>
            <span>Enabled</span>
            <input
              type="checkbox"
              checked={enabled}
              disabled={readOnly}
              onChange={(e) => onToggle(e.target.checked)}
            />
            <span className={styles.toggleTrack} />
          </label>
        )}
      </div>
      <div className={styles.cardBody}>{children}</div>
    </div>
  );
}

export function SubSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.subSection}>
      <h5>{title}</h5>
      {children}
    </div>
  );
}

export function Grid({ children, cols = 2 }: { children: ReactNode; cols?: number }) {
  return (
    <div className={styles.grid} style={{ "--cols": cols } as CSSProperties}>
      {children}
    </div>
  );
}
