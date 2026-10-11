import { CAMPAIGN_JS } from "./campaign";

/**
 * For a page drawn outside the site's root layout — the global 404, which
 * renders its own <html>. next/link cannot cross from there into the site:
 * a click that landed before its prefetch finished changed the URL and title
 * but left the 404 on screen, and wedged the router for every later click.
 * So every link to another page here is a full page load.
 *
 * An inline <head> script, not an effect: it must be listening before React
 * hydrates, or a click in that window is replayed to next/link's handler.
 * Capture phase on document, registered first, so it runs before next/link,
 * which sees defaultPrevented and stands down. Same-page fragments (the skip
 * link) and the language already showing (aria-current, which LangSwitch
 * turns into a no-op) are left alone. Carries the request's CSP nonce.
 *
 * HeaderShell stands down here too (defaultPrevented), so the campaign tag
 * is carried by this script instead: a dead poster link still carries
 * `?ref=`, and a page link without a query of its own opens with it, the
 * same rule as withCampaign — where sessionStorage is blocked, the URL is
 * the only place the tag survives.
 */
const SCRIPT = `(function(){${CAMPAIGN_JS}document.addEventListener("click",function(e){var a=lk(e);if(!a||a.hasAttribute("aria-current"))return;if(a.pathname===location.pathname&&a.search===location.search&&a.hash)return;e.preventDefault();location.assign(tg(a)||a.href)},true)})()`;

export function HardLinks({ nonce }: { nonce?: string }) {
  return (
    <script
      nonce={nonce}
      // React does not serialise `nonce` to the client tree.
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: SCRIPT }}
    />
  );
}
