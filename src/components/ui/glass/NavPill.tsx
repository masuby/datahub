import styles from "./Glass.module.css";

/**
 * The sky liquid-glass pill of the header's current page or language
 * (iteration 5b §K; Glass.module.css, "Navigation glass"). Rendered in every
 * `glassClasses.nav` host, hidden until the host carries data-active="true",
 * so a change of page cross-fades it from one item to the next. Decorative:
 * the host's aria-current says which one is current. Server-safe.
 */
export function NavPill() {
  return <span aria-hidden="true" className={styles.navPill} />;
}
