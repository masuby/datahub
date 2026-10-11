import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { chromeExtra } from "@/i18n/extra/chrome";
import { WHATSAPP_NUMBER } from "@/lib/contact-info";
import { ActionRailBar } from "./MobileMenu";

/**
 * Mobile action rail (§6.11, below 1024px only): "Start a conversation"
 * (the contact page), fixed to the bottom edge, with WhatsApp at its right
 * end — the floating WhatsApp button (FloatingWhatsApp, iteration 3), which
 * settles into the room the rail keeps for it. Behaviour lives in the client
 * island; this only supplies the strings and links. Without a WhatsApp
 * number there is no button, and the action takes the full width.
 */
export async function ActionRail({ lang }: { lang: Locale }) {
  const t = await getDictionary(lang);
  return (
    <ActionRailBar
      label={t.rail.label}
      dock={Boolean(WHATSAPP_NUMBER)}
      ctaLabel={t.rail.cta}
      ctaShortLabel={chromeExtra[lang].rail.ctaShort}
      ctaHref={localePath(lang, "/contact")}
    />
  );
}
