import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Merchant } from "../types";
import { createDefaultSettings } from "../data/defaults";

const STORAGE_KEY = "payu-checkout-finance-merchants-v2";

const DEFAULT_MERCHANTS: Merchant[] = [
  {
    id: "merchant1",
    displayName: "Merchant1 — Fashion Hub",
    status: "active",
    linkedLoginId: "merchant1",
    lastUpdated: new Date().toISOString(),
    updatedBy: "Integration Support",
    settings: createDefaultSettings("Fashion Hub", "MCHT1001"),
  },
  {
    id: "merchant2",
    displayName: "TechMart Electronics",
    status: "pending",
    linkedLoginId: "techmart",
    lastUpdated: new Date().toISOString(),
    updatedBy: "Integration Support",
    settings: createDefaultSettings("TechMart Electronics", "MCHT2048"),
  },
  {
    id: "merchant3",
    displayName: "TravelEase Bookings",
    status: "inactive",
    linkedLoginId: "travelease",
    lastUpdated: new Date().toISOString(),
    updatedBy: "Integration Support",
    settings: createDefaultSettings("TravelEase Bookings", "MCHT3099"),
  },
];

function loadMerchants(): Merchant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Merchant[];
  } catch {
    /* use defaults */
  }
  return DEFAULT_MERCHANTS;
}

interface MerchantContextValue {
  merchants: Merchant[];
  getMerchant: (id: string) => Merchant | undefined;
  updateMerchant: (id: string, settings: Merchant["settings"], updatedBy: string) => void;
  updateMerchantStatus: (id: string, status: Merchant["status"]) => void;
}

const MerchantContext = createContext<MerchantContextValue | null>(null);

export function MerchantProvider({ children }: { children: ReactNode }) {
  const [merchants, setMerchants] = useState<Merchant[]>(loadMerchants);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merchants));
  }, [merchants]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setMerchants(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const getMerchant = useCallback(
    (id: string) => merchants.find((m) => m.id === id),
    [merchants],
  );

  const updateMerchant = useCallback(
    (id: string, settings: Merchant["settings"], updatedBy: string) => {
      setMerchants((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                settings,
                lastUpdated: new Date().toISOString(),
                updatedBy,
              }
            : m,
        ),
      );
    },
    [],
  );

  const updateMerchantStatus = useCallback((id: string, status: Merchant["status"]) => {
    setMerchants((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  }, []);

  const value = useMemo(
    () => ({ merchants, getMerchant, updateMerchant, updateMerchantStatus }),
    [merchants, getMerchant, updateMerchant, updateMerchantStatus],
  );

  return <MerchantContext.Provider value={value}>{children}</MerchantContext.Provider>;
}

export function useMerchants() {
  const ctx = useContext(MerchantContext);
  if (!ctx) throw new Error("useMerchants must be used within MerchantProvider");
  return ctx;
}
