import "server-only";
import { defineDict } from "../dict";

/**
 * The words on the home page's live dashboard (iteration-5 §H,
 * site/home/showcase): the screen's accessible name, its "Sample data"
 * stamp and the labels drawn inside it. The numbers are made up in the
 * browser (showcase/series.ts); the towns in its charts and feed are names,
 * the same in both languages.
 *
 * `money` frames an amount in millions: "TZS 412.6 mn", or as the
 * Kiswahili press writes it, "TZS 412.6 milioni".
 */
export const showcaseExtra = defineDict({
  en: {
    label: "Sample dashboard, live demo",
    stamp: "Sample data",
    live: "Live",
    app: "Collections",
    entity: "Sample lender",
    money: { prefix: "TZS", suffix: "mn" },
    kpis: {
      collected: "Collected today",
      borrowers: "Active borrowers",
      rate: "Repayment rate",
      loans: "New loans today",
    },
    line: { title: "Collections per minute" },
    bars: { title: "Disbursed by region" },
    donut: {
      title: "Repayment channels",
      channels: ["Mobile money", "Bank", "Cash"],
      centre: "mobile",
    },
    feed: { title: "Repayments" },
  },
  sw: {
    label: "Dashibodi ya mfano, onyesho la moja kwa moja",
    stamp: "Data ya mfano",
    live: "Mubashara",
    app: "Makusanyo",
    entity: "Mkopeshaji wa mfano",
    money: { prefix: "TZS", suffix: "milioni" },
    kpis: {
      collected: "Makusanyo ya leo",
      borrowers: "Wakopaji hai",
      rate: "Kiwango cha marejesho",
      loans: "Mikopo mipya leo",
    },
    line: { title: "Makusanyo kwa dakika" },
    bars: { title: "Mikopo iliyotolewa kwa mkoa" },
    donut: {
      title: "Njia za marejesho",
      channels: ["Pesa kwa simu", "Benki", "Taslimu"],
      centre: "kwa simu",
    },
    feed: { title: "Marejesho" },
  },
});
