/**
 * Service page content.
 *
 * One page cannot rank for "dashboard developer Tanzania" and "automate Excel
 * reports" and "AI agents" at once — each query wants its own page, its own
 * title, and its own body of text. This is the source of truth for all three:
 * the route, the metadata, the rendered copy, and the structured data are all
 * generated from these objects, so they cannot drift apart.
 *
 * The copy is deliberately written the way a Tanzanian buyer would describe the
 * problem to a colleague, not the way a vendor would describe the product.
 * Keyword phrases appear because they are the natural words for the thing, not
 * because they were sprinkled in.
 */

import type { Locale } from "@/i18n/config";
import type { ServiceSlug } from "./service-slugs";
import { SERVICES_SW } from "./services.sw";

export type Service = {
  slug: ServiceSlug;
  /** <h1> on the page. */
  title: string;
  /** <title> tag — kept under ~60 chars including the " · DataHub" suffix. */
  metaTitle: string;
  metaDescription: string;
  /** Short label used in navigation and breadcrumbs. */
  navLabel: string;
  tagline: string;
  /** The one lead sentence under the <h1>. */
  intro: string;
  /** "Signs you need this" — written as the symptoms people actually search. */
  signals: string[];
  deliverables: { title: string; desc: string }[];
  faq: { q: string; a: string }[];
};

export const SERVICES: Service[] = [
  {
    slug: "dashboards",
    navLabel: "Dashboards",
    title: "Dashboards & Business Intelligence in Tanzania",
    metaTitle: "Dashboards & Business Intelligence in Tanzania",
    metaDescription:
      "Custom dashboards and business intelligence for Tanzanian organisations: live KPIs by branch and department, built around how your team decides. Dar es Salaam.",
    tagline: "One place your team decides from",
    intro: "Instead of three people checking three files, one dashboard everyone trusts answers the question on a phone, before the meeting starts.",
    signals: [
      "The same question gets two different numbers",
      "The management report is stale when it lands",
      "Decisions wait on one person’s spreadsheet",
    ],
    deliverables: [
      {
        title: "Executive and departmental views",
        desc: "An overview for leaders, and the detail for those who act.",
      },
      {
        title: "KPIs graded automatically",
        desc: "Target, actual and gap, colour-coded.",
      },
      {
        title: "Drill-down to the record",
        desc: "From the total to the branch, officer and transaction.",
      },
      {
        title: "One engine, one answer",
        desc: "Same logic everywhere, so finance and operations see one figure.",
      },
    ],
    faq: [
      {
        q: "Do you build custom dashboards or use Power BI?",
        a: "Both. Power BI suits clean data and standard questions; a custom dashboard suits logic that is your own.",
      },
      {
        q: "Where does the data come from?",
        a: "Wherever it lives now: core banking, ERP, a database or spreadsheets. We bring it together.",
      },
      {
        q: "Can our team use it without training?",
        a: "Yes, and we train them anyway. If a chart needs explaining, we fix the chart.",
      },
    ],
  },
  {
    slug: "automation",
    navLabel: "Automation",
    title: "Reporting Automation for Tanzanian Businesses",
    metaTitle: "Reporting Automation in Tanzania",
    metaDescription:
      "Automate the Excel and PowerPoint reports your team rebuilds every week: scheduled, formatted and delivered. Dar es Salaam, Tanzania.",
    tagline: "Hours of manual work, done in seconds",
    intro: "The report someone rebuilds by hand every week becomes a system that builds and sends it on schedule.",
    signals: [
      "Reports are late when one person is away",
      "The same figure differs from file to file",
      "Month-end means late nights rebuilding the same workbook",
    ],
    deliverables: [
      {
        title: "Scheduled and on-demand generation",
        desc: "On a timetable, or the moment someone asks.",
      },
      {
        title: "Excel and PowerPoint exports",
        desc: "Formatted, in the files you already circulate.",
      },
      {
        title: "Automatic delivery",
        desc: "Each recipient gets the version for their role.",
      },
      {
        title: "Consistent every time",
        desc: "The same logic every run, so numbers can be reproduced.",
      },
    ],
    faq: [
      {
        q: "Can you automate reports we already build in Excel?",
        a: "Yes. We rebuild your workbook’s logic as a system and keep the format people know.",
      },
      {
        q: "Will our team lose control of the report?",
        a: "No. It removes the typing, not the judgement: your team still sets targets, thresholds and recipients.",
      },
      {
        q: "What happens when we need a new report?",
        a: "Once the pipeline exists, a new report is a small job, not a new project.",
      },
    ],
  },
  {
    slug: "ai-agents",
    navLabel: "AI Agents",
    title: "AI Agent Design & Automation in Tanzania",
    metaTitle: "AI Agents for Business in Tanzania",
    metaDescription:
      "AI agents for Tanzanian organisations that read operational data, summarise what changed and draft reports and follow-ups. Dar es Salaam.",
    tagline: "Reads your data, drafts the next step",
    intro: "An agent is worth building where someone’s job is reading data and acting on it: flagging exceptions, drafting follow-ups.",
    signals: [
      "Someone scans the same data every morning for exceptions",
      "Follow-ups slip because chasing them is nobody’s job",
      "Someone writes the same weekly summary by hand",
    ],
    deliverables: [
      {
        title: "Agents scoped to a real task",
        desc: "Built from work someone does today. If it needs no agent, we say so.",
      },
      {
        title: "Grounded in your own data",
        desc: "Every output can be checked against your own systems.",
      },
      {
        title: "A human in the loop where it matters",
        desc: "Anything consequential waits for approval; you decide where that line sits.",
      },
      {
        title: "Built on the same secure foundation",
        desc: "Agents follow the same access rules as your staff.",
      },
    ],
    faq: [
      {
        q: "Is this useful for a Tanzanian business, or only large companies?",
        a: "It depends on the task, not company size: an hour a day spent reading data and reacting is worth automating.",
      },
      {
        q: "Will an AI agent make decisions without us?",
        a: "Only where you decide. Most of our agents draft and a person approves; full automation is for low-risk steps.",
      },
      {
        q: "What does an agent actually cost to run?",
        a: "A build cost, then a running cost that depends on the data it processes. We size both before you commit.",
      },
    ],
  },
];

/** The service list in a locale — same slugs and order in every language. */
export function servicesFor(lang: Locale): Service[] {
  return lang === "sw" ? SERVICES_SW : SERVICES;
}

export function getService(slug: string, lang: Locale = "en"): Service | undefined {
  return servicesFor(lang).find((s) => s.slug === slug);
}
