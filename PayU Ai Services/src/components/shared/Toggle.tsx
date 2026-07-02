import styles from "./Toggle.module.css";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
}

export default function Toggle({ checked, onChange, disabled, label, id }: ToggleProps) {
  return (
    <label className={`${styles.toggle} ${disabled ? styles.disabled : ""}`} htmlFor={id}>
      {label && <span className={styles.label}>{label}</span>}
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className={styles.input}
      />
      <span className={styles.track} aria-hidden />
    </label>
  );
}
