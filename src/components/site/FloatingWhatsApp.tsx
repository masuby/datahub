import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { chromeExtra } from "@/i18n/extra/chrome";
import { whatsappHref } from "@/lib/contact-info";
import { WhatsAppFab } from "./MobileMenu";

/**
 * The floating WhatsApp button (iteration-3 §A), on every page: mounted by
 * the root layout and by the global 404, so it stays put while pages change.
 * WhatsApp's own green circle with its white glyph, bottom right, above the
 * page; "Chat with us" beside it on wide screens. It opens the chat in the
 * page's language (whatsappHref), in a new tab.
 *
 * On phones it joins the action rail instead of covering it: while the rail
 * is up, the rail keeps the right end free and the button settles into it,
 * as the rail's WhatsApp half (see WhatsAppFab and ActionRailBar).
 *
 * It sits in a labelled landmark of its own ("WhatsApp chat", an <aside>
 * after the page's footer), so people who move through a page by its
 * landmarks meet it too. (The action rail is "Quick contact".)
 *
 * Without a WhatsApp number configured it is not rendered at all, like every
 * other WhatsApp affordance. Behaviour lives in the client island; this only
 * supplies the link and the strings.
 */
export async function FloatingWhatsApp({ lang }: { lang: Locale }) {
  const href = whatsappHref(lang);
  if (!href) return null;
  const t = await getDictionary(lang);
  const x = chromeExtra[lang].whatsapp;
  return (
    <aside aria-label={x.region}>
      <WhatsAppFab href={href} label={x.label} name={`${x.name} ${t.a11y.opensNewTab}`} />
    </aside>
  );
}
