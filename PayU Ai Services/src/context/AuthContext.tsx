import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthUser, UserRole } from "../types";

interface AuthContextValue {
  user: AuthUser | null;
  login: (role: UserRole, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const CREDENTIALS: Record<UserRole, { password: string; displayName: string; merchantId?: string }> = {
  integration: { password: "payu101", displayName: "Integration Support" },
  merchant: { password: "payumerchant1", displayName: "Merchant1", merchantId: "merchant1" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (role: UserRole, password: string) => {
    const cred = CREDENTIALS[role];
    if (password !== cred.password) return false;
    setUser({
      role,
      displayName: cred.displayName,
      merchantId: cred.merchantId,
    });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
