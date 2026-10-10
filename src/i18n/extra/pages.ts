import "server-only";
import { defineDict } from "../dict";

/**
 * Strings the service pages need that the main dictionary does not carry.
 * The home page numbers Contact "08 — …" of 8; on a service page it is the
 * sixth section, so it needs its own numbered eyebrow (spec §3.4: every number
 * carries information).
 */
export const pagesExtra = defineDict({
  en: {
    servicePage: {
      contactEyebrow: "06 — Contact",
    },
  },
  sw: {
    servicePage: {
      contactEyebrow: "06 — Mawasiliano",
    },
  },
});
