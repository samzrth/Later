import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  nav?: ReactNode;
}

export default function Layout({ children, title, subtitle, nav }: LayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <div className={styles.logoMark}>P</div>
          <div>
            <strong>Checkout Finance</strong>
            <span>PayU Ops Panel</span>
          </div>
        </div>

        {nav}

        <div className={styles.sidebarFooter}>
          <div className={styles.userBadge}>
            <span className={styles.avatar}>{user?.displayName.charAt(0)}</span>
            <div>
              <strong>{user?.displayName}</strong>
              <span>{user?.role === "integration" ? "Internal" : "Merchant"}</span>
            </div>
          </div>
          <button type="button" className={styles.logoutBtn} onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </header>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
