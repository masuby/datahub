import { CAMPAIGN_JS, LINKS_READY_EVENT, REF_STORAGE_KEY } from "./campaign";

/**
 * Keeps the campaign tag from the first moment the page is on screen.
 *
 * The poster QR code opens `/?ref=qr` on a phone that may take seconds to
 * hydrate. A tap on "Start a conversation" in that window is a plain browser
 * navigation: RefKeeper's effect never ran, and HeaderShell is not yet there
 * to carry the tag, so the lead arrived without it. This inline <head> script
 * runs while the page is parsed instead:
 *
 * - it copies the sanitised tag to sessionStorage["dh-ref"], first touch
 *   wins, exactly as RefKeeper does;
 * - only when storage is blocked, it also listens for clicks (capture phase,
 *   on document, before React's own listener) and opens a page link that has
 *   no query of its own at the same address plus `?ref=` (a language link at
 *   the whole query, as LangSwitch does). That is a full page load, which is
 *   what the tap was anyway; next/link sees defaultPrevented and stands down.
 *   HeaderShell announces when its own handler is listening and this one
 *   steps aside, so a click is only ever tagged once.
 *
 * Carries the request's CSP nonce, like ThemeScript.
 */
const SCRIPT = `(function(){${CAMPAIGN_JS}if(!r)return;try{if(!sessionStorage.getItem("${REF_STORAGE_KEY}"))sessionStorage.setItem("${REF_STORAGE_KEY}",r);return}catch(x){}function h(e){var a=lk(e),u=a&&tg(a);if(u){e.preventDefault();location.assign(u)}}document.addEventListener("click",h,true);addEventListener("${LINKS_READY_EVENT}",function(){document.removeEventListener("click",h,true)},{once:true})})()`;

export function RefScript({ nonce }: { nonce?: string }) {
  return (
    <script
      nonce={nonce}
      // React does not serialise `nonce` to the client tree.
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: SCRIPT }}
    />
  );
}
