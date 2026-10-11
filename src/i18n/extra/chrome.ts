import "server-only";
import { defineDict } from "../dict";

/**
 * Strings the site chrome needs that the main dictionary does not carry.
 * `rail.ctaShort` is the action rail's button label on phones narrower than
 * 360px, where `rail.cta` cannot fit on one line. `footer.*` names the
 * footer links to pages that used to be sections of the home page and had
 * no footer entry of their own.
 *
 * Iteration 3 (§A): `wordmark` is the footer's living slogan — "From Data
 * to" and one word that writes itself, in Title Case as the brand board
 * sets it; `name` is its accessible name, constant while the word changes.
 * `social` names the icons of DataHub's profiles: `profile` for a linked
 * icon ({network} is the network's own name), `pending` for one whose link
 * is not set yet (src/lib/social.ts). `whatsapp` is the floating button:
 * `label` shown beside it on wide screens, `name` its accessible name,
 * `region` the name of the landmark it sits in.
 */
export const chromeExtra = defineDict({
  en: {
    rail: {
      ctaShort: "Get in touch",
    },
    footer: {
      allServices: "All services",
      contactPage: "Contact form",
    },
    wordmark: {
      line1: "From Data to",
      words: ["Decisions", "Insights", "Automations", "Analytics"],
      name: "From Data to Decisions, Insights, Automations and Analytics",
    },
    social: {
      label: "DataHub on social media",
      profile: "DataHub on {network}",
      pending: "{network}: link coming soon",
    },
    whatsapp: {
      label: "Chat with us",
      name: "Chat with us on WhatsApp",
      region: "WhatsApp chat",
    },
  },
  sw: {
    rail: {
      ctaShort: "Wasiliana nasi",
    },
    footer: {
      allServices: "Huduma zote",
      contactPage: "Fomu ya mawasiliano",
    },
    wordmark: {
      line1: "Kutoka Data hadi",
      words: ["Maamuzi", "Maarifa", "Otomatiki", "Uchambuzi"],
      name: "Kutoka Data hadi Maamuzi, Maarifa, Otomatiki na Uchambuzi",
    },
    social: {
      label: "DataHub kwenye mitandao ya kijamii",
      profile: "DataHub kwenye {network}",
      pending: "{network}: kiungo kinakuja hivi karibuni",
    },
    whatsapp: {
      label: "Ongea nasi",
      name: "Ongea nasi kwenye WhatsApp",
      region: "Gumzo la WhatsApp",
    },
  },
});
