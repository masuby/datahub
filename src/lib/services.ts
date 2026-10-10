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
  intro: string[];
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
      "Custom dashboards and business intelligence for Tanzanian organisations. Live KPIs, branch and department views, built around how your team actually decides. Dar es Salaam.",
    tagline: "One place your team decides from",
    intro: [
      "Most organisations in Tanzania have the data, but no single view of it that everyone trusts.",
      "Today a simple question means three people checking three files. A dashboard answers it on a phone, before the meeting starts.",
    ],
    signals: [
      "The same question gets two different numbers",
      "The management report is stale by the time it lands",
      "Decisions wait on a spreadsheet only one person can update",
    ],
    deliverables: [
      {
        title: "Executive and departmental views",
        desc: "An overview for leadership, and the detail for the people who act on it.",
      },
      {
        title: "KPIs graded automatically",
        desc: "Targets, actuals and the gap, colour-coded so problems stand out.",
      },
      {
        title: "Drill-down to the record",
        desc: "From the total down to the branch, the officer and the transaction.",
      },
      {
        title: "One engine, one answer",
        desc: "Every view uses the same logic, so finance and operations see the same figure.",
      },
    ],
    faq: [
      {
        q: "Do you build custom dashboards or use Power BI?",
        a: "Both. Power BI suits clean data and standard questions; when your reporting logic or branch structure is your own, a custom dashboard is cheaper to live with.",
      },
      {
        q: "Where does the data come from?",
        a: "Wherever it lives now: your core banking or ERP system, a database or spreadsheets. We build the pipeline that brings it together.",
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
      "Automate the Excel and PowerPoint reports your team rebuilds every week. Scheduled, formatted and delivered automatically. Built in Dar es Salaam for organisations across Tanzania.",
    tagline: "Hours of manual work, done in seconds",
    intro: [
      "Every week someone copies the same numbers into the same slides and emails them out. It takes hours, and mistakes creep in.",
      "We turn that into a system that builds the report and sends it on schedule, even when nobody is in the office.",
    ],
    signals: [
      "Reports are late when one person is away",
      "One figure is typed into several files, and they disagree",
      "Month-end means late nights rebuilding the same workbook",
    ],
    deliverables: [
      {
        title: "Scheduled and on-demand generation",
        desc: "On a timetable, or the moment someone asks.",
      },
      {
        title: "Excel and PowerPoint exports",
        desc: "Formatted output in the files your organisation already circulates.",
      },
      {
        title: "Automatic delivery",
        desc: "Each recipient gets the version their role should see.",
      },
      {
        title: "Consistent every time",
        desc: "The same logic on every run, so the numbers can be reproduced.",
      },
    ],
    faq: [
      {
        q: "Can you automate reports we already build in Excel?",
        a: "Yes. We work out the logic inside your workbook and rebuild it as a system, keeping the format people already know.",
      },
      {
        q: "Will our team lose control of the report?",
        a: "No. Automation removes the typing, not the judgement: your team still sets the targets, thresholds and recipients.",
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
      "Practical AI agents for Tanzanian organisations — reading operational data, summarising what changed, drafting reports and chasing follow-ups. Built in Dar es Salaam.",
    tagline: "Software that reads, then drafts the next step",
    intro: [
      "Most AI projects start with the technology and stall. An agent is worth building when someone’s job is to read data and act on it.",
      "Ours watch your operational data, notice what changed and take the next step, such as flagging an exception or drafting a follow-up.",
    ],
    signals: [
      "Someone scans the same data every morning for exceptions",
      "Follow-ups slip because chasing them is nobody’s job",
      "Someone writes the same weekly summary from the same numbers",
    ],
    deliverables: [
      {
        title: "Agents scoped to a real task",
        desc: "We start from work someone does today, not a demo. If it does not justify an agent, we say so.",
      },
      {
        title: "Grounded in your own data",
        desc: "They work from your own systems, so every output can be checked at the source.",
      },
      {
        title: "A human in the loop where it matters",
        desc: "Anything consequential is drafted for approval. You decide where that line sits.",
      },
      {
        title: "Built on the same secure foundation",
        desc: "Agents follow the same access rules as your staff.",
      },
    ],
    faq: [
      {
        q: "Is this useful for a Tanzanian business, or only large companies?",
        a: "It depends on the task, not the size of the company. An hour a day spent reading data and reacting to it is worth automating.",
      },
      {
        q: "Will an AI agent make decisions without us?",
        a: "Only where you decide it should. Most of our agents draft and a person approves; full automation is kept for low-risk steps.",
      },
      {
        q: "What does an agent actually cost to run?",
        a: "There is the build, then a running cost that depends on the data it processes. We size both before you commit.",
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
