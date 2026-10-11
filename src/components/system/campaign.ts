/**
 * The campaign tag, in one place: how it is read from an address, cleaned,
 * and carried onto a link — for the client islands (RefKeeper, HeaderShell's
 * withCampaign, the contact form) and, as inline-script source, for the
 * scripts that run in <head> before any bundle (RefScript, HardLinks).
 *
 * Posters and statuses link to `/?ref=<channel>`; `?utm_source=` is read when
 * there is no `ref`. A tag is lower-case letters, digits, `_` and `-`, at most
 * 40 characters; anything else is dropped. Plain module, no "use client":
 * the server renders the script strings.
 */
export const REF_STORAGE_KEY = "dh-ref";

/** What a tag may not contain, and how long it may be. */
const REF_JUNK = /[^a-z0-9_-]/g;
const REF_MAX = 40;

/** Anything that is not a page of the site: an API route, a build asset, a file. */
const NOT_A_PAGE = /^\/(?:api|_next)\/|\.[^/]*$/;

/**
 * Dispatched on window once HeaderShell's click handler is listening, so the
 * <head> fallback in RefScript stands down and never acts on a click too.
 */
export const LINKS_READY_EVENT = "dh-links-ready";

export function sanitizeRef(raw: string | null | undefined): string {
  return (raw ?? "").toLowerCase().replace(REF_JUNK, "").slice(0, REF_MAX);
}

/** The tag a query string carries: `ref`, else `utm_source`, sanitised; "" when none. */
export function refOf(search: string): string {
  const params = new URLSearchParams(search);
  return sanitizeRef(params.get("ref") ?? params.get("utm_source"));
}

/** A path that is a page of the site, not an API route, build asset or file. */
export const isPagePath = (path: string) => !NOT_A_PAGE.test(path);

/**
 * `href` (a path, optionally with a #fragment) carrying `?ref=<tag>` before
 * its fragment — unless there is no tag or `href` has a query of its own.
 */
export function tagHref(href: string, ref: string): string {
  const hashAt = href.indexOf("#");
  const path = hashAt < 0 ? href : href.slice(0, hashAt);
  if (!ref || path.includes("?")) return href;
  return `${path}?ref=${ref}${hashAt < 0 ? "" : href.slice(hashAt)}`;
}

/**
 * The rules above as ES5 source for the inline scripts, built from the same
 * constants so the two cannot drift apart. It declares, inside the caller's
 * function scope:
 *
 *   r      the address bar's tag ("" when none, or if anything throws);
 *   lk(e)  the same-origin link a plain left click `e` follows, or null;
 *   tg(a)  where link `a` should go to carry the tag, or "" to leave it be:
 *          a page link without a query of its own gets `?ref=` before its
 *          #fragment (as tagHref); a language link (hreflang) the whole
 *          query and fragment of the address bar, as LangSwitch's langHref.
 *
 * One template literal, on purpose: never split it into parts joined with
 * `+`. Next 16's minifier (SWC) mis-folds two template literals joined that
 * way once it has inlined the constants they interpolate, and drops the end
 * of the left one. Split, the production build lost `)}catch(x){}` and all
 * of lk, so every inline script built on this threw a SyntaxError and never
 * ran. Only a production build shows it; the source reads fine.
 */
export const CAMPAIGN_JS = `var r="";try{var q=new URLSearchParams(location.search),v=q.get("ref");if(v===null)v=q.get("utm_source");r=(v||"").toLowerCase().replace(${REF_JUNK},"").slice(0,${REF_MAX})}catch(x){}function lk(e){if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return null;var a=e.target&&e.target.closest&&e.target.closest("a[href]");return a&&!a.hasAttribute("download")&&!(a.target&&a.target!=="_self")&&a.origin===location.origin?a:null}function tg(a){if(!r||a.search||${NOT_A_PAGE}.test(a.pathname))return"";return a.hasAttribute("hreflang")?a.pathname+location.search+location.hash:a.pathname+"?ref="+r+a.hash}`;
