import type { NavItem } from "../../config/navigation";
import styles from "./SideNav.module.css";

interface SideNavProps {
  items: NavItem[];
  activeId: string;
  onSelect?: (id: string) => void;
  sectionLabel?: string;
}

export default function SideNav({ items, activeId, onSelect, sectionLabel = "Navigation" }: SideNavProps) {
  return (
    <nav className={styles.nav}>
      <span className={styles.label}>{sectionLabel}</span>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          disabled={item.disabled}
          className={activeId === item.id ? styles.itemActive : styles.item}
          onClick={() => !item.disabled && onSelect?.(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
