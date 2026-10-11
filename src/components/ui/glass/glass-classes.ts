import styles from "./Glass.module.css";

/**
 * The classes a glass host needs: `glass` (the CSS tier, rim, focus, press)
 * plus its tint. `royal` (the primary button) is liquid metal too: its ring
 * and sheen are layers that <GlassSurface metal /> renders inside the host.
 * Kept out of GlassSurface.tsx ("use client"): server components import
 * these strings directly.
 *
 * `nav` and `navRound` are the header's quieter glass (iteration 5b §K): a
 * pill-shaped host, plain at rest, a clear-glass pill on hover or focus; the
 * host marked data-active="true" shows the sky pill that <NavPill /> renders
 * inside it. `navRound` draws the clear glass as a circle (the theme toggle).
 */
export const glassClasses = {
  royal: `${styles.glass} ${styles.royal}`,
  green: `${styles.glass} ${styles.green}`,
  teal: `${styles.glass} ${styles.teal}`,
  nav: styles.navGlass,
  navRound: `${styles.navGlass} ${styles.navRound}`,
} as const;
