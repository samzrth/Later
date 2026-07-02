import { useState, type FormEvent } from "react";
import type { UserRole } from "../types";
import { useAuth } from "../context/AuthContext";
import styles from "./LoginPage.module.css";

const ROLES: { id: UserRole; title: string; subtitle: string; hint: string }[] = [
  {
    id: "integration",
    title: "Integration Support",
    subtitle: "Internal PayU ops — configure merchant onboarding",
    hint: "Password: payu101",
  },
  {
    id: "merchant",
    title: "Merchant1",
    subtitle: "External merchant portal — view config & docs",
    hint: "Password: payumerchant1",
  },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>("integration");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!login(selectedRole, password)) {
      setError("Invalid password. Check the demo credentials below.");
      return;
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <div className={styles.logoMark}>P</div>
          <div>
            <h1>PayU Checkout Finance</h1>
            <p>Ops Panel & Merchant Portal</p>
          </div>
        </div>

        <div className={styles.hero}>
          <h2>Power every checkout with flexible finance</h2>
          <p>
            EMI, BNPL, Pay in 3, PaySense & more — one integration, multiple revenue
            streams. Configure once, go live everywhere.
          </p>
          <ul className={styles.heroList}>
            <li>Checkout EMI — up to 35% AOV lift</li>
            <li>BNPL — 78% instant approval rate</li>
            <li>Pay in 3 — interest-free instalments</li>
            <li>PaySense — loans up to ₹5 lakh</li>
          </ul>
        </div>
      </div>

      <div className={styles.right}>
        <form className={styles.card} onSubmit={handleSubmit}>
          <h3>Sign in</h3>
          <p className={styles.cardSub}>Select your access type to continue</p>

          <div className={styles.roleGrid}>
            {ROLES.map((role) => (
              <button
                key={role.id}
                type="button"
                className={`${styles.roleBtn} ${selectedRole === role.id ? styles.roleActive : ""}`}
                onClick={() => {
                  setSelectedRole(role.id);
                  setError("");
                }}
              >
                <span className={styles.roleTitle}>{role.title}</span>
                <span className={styles.roleSub}>{role.subtitle}</span>
              </button>
            ))}
          </div>

          <label className={styles.field}>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submit}>
            Continue to Dashboard
          </button>

          <div className={styles.demoCreds}>
            <p>Demo credentials</p>
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                className={styles.demoBtn}
                onClick={() => {
                  setSelectedRole(r.id);
                  setPassword(r.id === "integration" ? "payu101" : "payumerchant1");
                  setError("");
                }}
              >
                {r.title} → {r.hint}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
