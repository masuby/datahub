import "server-only";
import { defineDict } from "../dict";

/**
 * Strings the service pages' sample figures need that the main dictionary
 * does not carry: table headers for the "View as table" disclosures, the
 * agent's 07:02 row on the Monday swimlane, and the median label on the
 * run-time chart.
 */
export const dashExtra = defineDict({
  en: {
    columns: {
      branch: "Branch",
      run: "Run",
      seconds: "Seconds",
      time: "Time (EAT)",
      lane: "Lane",
      job: "Job",
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
      run: "Mzunguko",
      seconds: "Sekunde",
      time: "Saa (EAT)",
      lane: "Kundi",
      job: "Kazi",
    },
    schedule: {
      agentDraft: "07:02 Rasimu ya ujumbe wa ufuatiliaji → Mkuu wa Mikopo",
    },
    runs: {
      median: "Wastani wa kati {value}",
    },
  },
});
