import styles from "./PayULogo.module.css";

interface PayULogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

export default function PayULogo({ variant = "light", size = "md" }: PayULogoProps) {
  const fill = variant === "light" ? "#ffffff" : "#10847e";
  const financeFill = variant === "light" ? "#ffffff" : "#1a202c";

  return (
    <div className={`${styles.logo} ${styles[size]}`} aria-label="PayU Finance">
      <svg viewBox="0 0 140 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svg}>
        <text x="0" y="24" fill={fill} fontFamily="Inter, sans-serif" fontSize="22" fontWeight="700">
          payu
        </text>
        <line x1="58" y1="8" x2="58" y2="26" stroke={fill} strokeWidth="1.5" opacity="0.5" />
        <text
          x="66"
          y="24"
          fill={financeFill}
          fontFamily="Inter, sans-serif"
          fontSize="18"
          fontWeight="400"
          opacity={variant === "light" ? 0.95 : 1}
        >
          Finance
        </text>
      </svg>
    </div>
  );
}
