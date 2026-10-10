/**
 * Applies the saved or system theme before first paint.
 *
 * Runs synchronously while the browser parses <head>, so a visitor who chose
 * dark never sees a flash of light (or the reverse). It must carry the
 * per-request CSP nonce: the production policy has no 'unsafe-inline' for
 * scripts, and without the nonce the browser would silently refuse to run it.
 *
 * `theme` in localStorage is "light" | "dark"; absent means "follow the
 * system". The toggle (ThemeToggle.tsx) writes the same key and class.
 */
export const THEME_STORAGE_KEY = "theme";

const SCRIPT = `(function(){try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"}catch(e){}})()`;

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
