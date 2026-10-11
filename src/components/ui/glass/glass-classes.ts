import styles from "./Glass.module.css";

/**
 * The classes a glass host needs: `glass` (the CSS tier, rim, focus, press)
 * plus its tint. Kept out of GlassSurface.tsx ("use client"): server
 * components import these strings directly.
 */
export const glassClasses = {
  royal: `${styles.glass} ${styles.royal}`,
  green: `${styles.glass} ${styles.green}`,
  teal: `${styles.glass} ${styles.teal}`,
} as const;
