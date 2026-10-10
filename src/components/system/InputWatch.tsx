/**
 * Notes whether the visitor has scrolled, touched or pressed anything before
 * the page's script is running: a flag on window, set by the first such
 * event. HeaderShell reads it before landing a page that arrived with
 * #section in its URL — someone who has already started reading elsewhere
 * is not pulled back. An inline <head> script, because the interesting
 * moment is before hydration; carries the request's CSP nonce.
 */
const EVENTS = '["wheel","touchstart","keydown","pointerdown"]';
const SCRIPT = `(function(){var e=${EVENTS};function f(){window.__dhInput=1;e.forEach(function(t){removeEventListener(t,f,true)})}e.forEach(function(t){addEventListener(t,f,{capture:true,passive:true})})})()`;

export function InputWatch({ nonce }: { nonce?: string }) {
  return (
    <script
      nonce={nonce}
      // React does not serialise `nonce` to the client tree.
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: SCRIPT }}
    />
  );
}
