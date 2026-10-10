import "server-only";
import { defineDict } from "../dict";

/**
 * Strings the site chrome needs that the main dictionary does not carry.
 * `rail.ctaShort` is the action rail's button label on phones narrower than
 * 360px, where `rail.cta` cannot fit on one line beside the WhatsApp link.
 */
export const chromeExtra = defineDict({
  en: {
    rail: {
      ctaShort: "Get in touch",
    },
  },
  sw: {
    rail: {
      ctaShort: "Wasiliana nasi",
    },
  },
});
