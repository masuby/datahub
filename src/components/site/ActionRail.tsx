import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { chromeExtra } from "@/i18n/extra/chrome";
import { WHATSAPP_HREF, WHATSAPP_NUMBER } from "@/lib/contact-info";
import { ActionRailBar } from "./MobileMenu";

/**
 * Mobile action rail (§6.11, below 1024px only): WhatsApp + "Start a
 * conversation" (the contact page), fixed to the bottom edge. Behaviour
 * lives in the client island; this only supplies the strings and links. The
 * WhatsApp half disappears when no number is configured.
 */
export async function ActionRail({ lang }: { lang: Locale }) {
  const t = await getDictionary(lang);
  return (
    <ActionRailBar
      label={t.rail.label}
      whatsappLabel={t.rail.whatsapp}
      whatsappHref={WHATSAPP_NUMBER ? WHATSAPP_HREF : ""}
      newTabLabel={t.a11y.opensNewTab}
      ctaLabel={t.rail.cta}
      ctaShortLabel={chromeExtra[lang].rail.ctaShort}
      ctaHref={localePath(lang, "/contact")}
    />
  );
}
