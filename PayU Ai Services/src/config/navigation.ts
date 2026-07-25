export interface NavItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export const MERCHANT_NAV: NavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "settings", label: "My Settings" },
  { id: "reporting", label: "Reporting" },
  { id: "products", label: "Explore Products" },
  { id: "help", label: "Help Center" },
];

export const INTEGRATION_NAV: NavItem[] = [
  { id: "merchants", label: "Merchants" },
  { id: "goals", label: "Goals", disabled: true },
];
