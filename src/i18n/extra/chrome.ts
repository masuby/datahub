import "server-only";
import { defineDict } from "../dict";

/**
 * Strings the site chrome needs that the main dictionary does not carry.
 * `rail.ctaShort` is the action rail's button label on phones narrower than
 * 360px, where `rail.cta` cannot fit on one line beside the WhatsApp link.
 * `footer.*` names the footer links to pages that used to be sections of the
 * home page and had no footer entry of their own.
 */
export const chromeExtra = defineDict({
  en: {
    rail: {
      ctaShort: "Get in touch",
    },
    footer: {
      allServices: "All services",
      dashboards: "Sample dashboards",
      contactPage: "Contact form",
    },
  },
  sw: {
    rail: {
      ctaShort: "Wasiliana nasi",
    },
    footer: {
      allServices: "Huduma zote",
      dashboards: "Dashibodi za mfano",
      contactPage: "Fomu ya mawasiliano",
    },
  },
});
