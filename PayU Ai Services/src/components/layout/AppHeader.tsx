import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import PayULogo from "../PayULogo";
import styles from "./AppHeader.module.css";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AppHeader({ title, subtitle }: AppHeaderProps) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initial = user?.displayName.charAt(0).toUpperCase() ?? "?";
  const roleLabel = user?.role === "integration" ? "Internal" : "Merchant";

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <PayULogo variant="dark" size="sm" />
        <div className={styles.divider} aria-hidden />
        <div className={styles.titles}>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>

      <div className={styles.profile} ref={menuRef}>
        <button
          type="button"
          className={styles.profileBtn}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <span className={styles.avatar}>{initial}</span>
          <span className={styles.profileName}>{user?.displayName}</span>
          <span className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}>▾</span>
        </button>

        {open && (
          <div className={styles.dropdown} role="menu">
            <div className={styles.dropdownHeader}>
              <span className={styles.dropdownAvatar}>{initial}</span>
              <div>
                <strong>{user?.displayName}</strong>
                <span className={styles.roleBadge}>{roleLabel}</span>
              </div>
            </div>
            <div className={styles.dropdownDivider} />
            <button type="button" className={styles.logoutItem} role="menuitem" onClick={logout}>
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
