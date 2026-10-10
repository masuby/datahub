import "server-only";
import { defineDict } from "../dict";

/**
 * The hero headline (iteration-2 §B): "From data to" and one word that writes
 * itself, then moves on — the words in the order they are written. `name` is
 * the H1's accessible name, constant while the visible word changes. `lead`
 * is the one line under it: what DataHub does and for whom (it replaces the
 * old sub-line and lead paragraph, which said the same twice).
 */
export const heroExtra = defineDict({
  en: {
    title: {
      line1: "From data to",
      words: ["decisions", "insights", "automations", "analytics"],
      name: "From data to decisions, insights, automations and analytics",
    },
    lead: "Dashboards, reporting automation and AI agents for banks, microfinance lenders, media houses and growing businesses in Tanzania.",
  },
  sw: {
    title: {
      line1: "Kutoka data hadi",
      words: ["maamuzi", "maarifa", "otomatiki", "uchambuzi"],
      name: "Kutoka data hadi maamuzi, maarifa, otomatiki na uchambuzi",
    },
    lead: "Dashibodi, otomatiki ya ripoti na mawakala wa AI kwa benki, taasisi za mikopo midogo, vyombo vya habari na biashara zinazokua nchini Tanzania.",
  },
});
