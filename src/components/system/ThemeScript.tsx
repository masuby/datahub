/**
 * Applies the saved theme before first paint.
 *
 * Runs synchronously while the browser parses <head>, so a visitor who chose
 * dark never sees a flash of light. It must carry the per-request CSP nonce:
 * the production policy has no 'unsafe-inline' for scripts, and without the
 * nonce the browser would silently refuse to run it.
 *
 * `theme` in localStorage is "dark" | "system"; absent (or anything else)
 * means light, the site's default whatever the device prefers (owner, 2 Nov
 * 2026). "system" follows prefers-color-scheme. It sets BOTH `.dark` and
 * `.light`, so the page's tokens never depend on the media query. The
 * toggles (ThemeToggle, ThemeSettings) write the same key and classes.
 */
export const THEME_STORAGE_KEY = "theme";

const SCRIPT = `(function(){try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");var d=s==="dark"||(s==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.classList.toggle("light",!d);r.style.colorScheme=d?"dark":"light"}catch(e){}})()`;

export function ThemeScript({ nonce }: { nonce?: string }) {
  return (
    <script
      nonce={nonce}
      // React does not serialise `nonce` to the client tree, so the attribute
      // always differs between server HTML and client render.
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: SCRIPT }}
    />
  );
}
