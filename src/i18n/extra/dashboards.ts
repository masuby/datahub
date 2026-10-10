import "server-only";
import { defineDict } from "../dict";

/**
 * Strings the sample dashboards need that the main dictionary does not carry:
 * table headers for the "View as table" disclosures, the agent's 07:02 row on
 * the Monday swimlane, and the median label on the run-time chart.
 */
export const dashExtra = defineDict({
  en: {
    columns: {
      branch: "Branch",
      bucket: "Days overdue",
      share: "Share of portfolio",
      product: "Product",
      amount: "TZS bn",
      run: "Run",
      seconds: "Seconds",
      time: "Time (EAT)",
      lane: "Lane",
      job: "Job",
      method: "Method",
      duration: "Time taken",
      status: "Status",
      region: "Region",
    },
    schedule: {
      agentDraft: "07:02 Follow-up note drafted → Head of Credit",
    },
    runs: {
      median: "Median {value}",
    },
  },
  sw: {
    columns: {
      branch: "Tawi",
      bucket: "Siku za kuchelewa",
      share: "Sehemu ya jalada",
      product: "Aina ya mkopo",
      amount: "TZS bilioni",
      run: "Mzunguko",
      seconds: "Sekunde",
      time: "Saa (EAT)",
      lane: "Kundi",
      job: "Kazi",
      method: "Njia",
      duration: "Muda uliotumika",
      status: "Hali",
      region: "Mkoa",
    },
    schedule: {
      agentDraft: "07:02 Rasimu ya ujumbe wa ufuatiliaji → Mkuu wa Mikopo",
    },
    runs: {
      median: "Wastani wa kati {value}",
    },
  },
});
