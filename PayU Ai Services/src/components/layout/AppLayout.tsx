import type { ReactNode } from "react";
import type { NavItem } from "../../config/navigation";
import PayULogo from "../PayULogo";
import AppHeader from "./AppHeader";
import SideNav from "./SideNav";
import styles from "./AppLayout.module.css";

interface AppLayoutProps {
  title: string;
  subtitle?: string;
  navItems: NavItem[];
  activeNavId: string;
  onNavSelect?: (id: string) => void;
  navSectionLabel?: string;
  children: ReactNode;
}

export default function AppLayout({
  title,
  subtitle,
  navItems,
  activeNavId,
  onNavSelect,
  navSectionLabel,
  children,
}: AppLayoutProps) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <PayULogo variant="light" size="md" />
        </div>
        <SideNav
          items={navItems}
          activeId={activeNavId}
          onSelect={onNavSelect}
          sectionLabel={navSectionLabel}
        />
      </aside>

      <div className={styles.main}>
        <AppHeader title={title} subtitle={subtitle} />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
