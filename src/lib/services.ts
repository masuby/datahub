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

export type Service = {
  slug: string;
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
      "Most organisations in Tanzania are not short of data. They are short of one trustworthy place to look at it. The numbers exist — in a core system, in branch spreadsheets, in a report somebody exports every Monday — but nobody can answer a simple question without three people checking three files.",
      "We build the dashboard that ends that. Live figures, colour-coded against target, broken down by branch, department or officer, and readable on a phone in a corridor before a meeting starts.",
    ],
    signals: [
      "Two people answer the same question with two different numbers",
      "Your management report is assembled by hand and is already stale when it lands",
      "Nobody can see branch or departmental performance without asking someone to export it",
      "Decisions wait on a spreadsheet that only one person knows how to update",
    ],
    deliverables: [
      {
        title: "Executive and departmental views",
        desc: "A one-glance overview for leadership, and deeper views for the people who have to act on the detail.",
      },
      {
        title: "KPIs graded automatically",
        desc: "Targets, actuals and the gap between them, colour-coded so problems surface without anyone hunting for them.",
      },
      {
        title: "Drill-down to the record",
        desc: "Start at the total, click through to the branch, the officer, the transaction. No dead ends.",
      },
      {
        title: "One engine, one answer",
        desc: "Every view calculates from the same logic, so finance and operations stop disagreeing about which file is right.",
      },
    ],
    faq: [
      {
        q: "Do you build custom dashboards or use Power BI?",
        a: "Both, chosen to fit the problem. Power BI and similar tools are a good fit when the data is already clean and the questions are standard. When your reporting logic, approval chain or branch structure is specific to your organisation, a custom dashboard fits better and is cheaper to live with over time.",
      },
      {
        q: "Where does the data come from?",
        a: "Wherever it already lives — your core banking or ERP system, a SQL database, exported spreadsheets, or a mix of all three. Part of the work is building the pipeline that pulls it together reliably, so nobody has to assemble it by hand again.",
      },
      {
        q: "Can our team use it without training?",
        a: "The dashboard is designed to be readable without a manual, and we train your team on it as part of delivery. If someone needs a guide to understand a chart, the chart is wrong.",
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
      "Somebody in your office opens the same file every week, filters the same columns, copies the same numbers into the same slide, formats it, and emails it to the same people. It takes hours. It goes wrong occasionally. And it happens again next week.",
      "That entire process can be a system. The report generates itself, formatted correctly every time, and arrives in the right inboxes on schedule — whether anyone is in the office or not.",
    ],
    signals: [
      "A weekly or monthly report takes someone hours of copy-and-paste",
      "Reports go out late because the person who prepares them was away",
      "The same figure is typed into several files and they drift apart",
      "Month-end means late nights rebuilding the same workbook",
    ],
    deliverables: [
      {
        title: "Scheduled and on-demand generation",
        desc: "Reports run on a timetable, or the moment someone asks for one — no waiting on a person.",
      },
      {
        title: "Excel and PowerPoint exports",
        desc: "Properly formatted output in the formats your organisation already circulates, one click away.",
      },
      {
        title: "Automatic delivery",
        desc: "Personalised reports emailed to the right recipients, with each person seeing what their role should see.",
      },
      {
        title: "Consistent every single time",
        desc: "The same logic runs every run, so the numbers are reproducible and mistakes stop being a monthly event.",
      },
    ],
    faq: [
      {
        q: "Can you automate reports we already build in Excel?",
        a: "Yes, and it is the most common place we start. We take the workbook your team currently maintains, work out the logic inside it, and rebuild that as a system that produces the same output automatically. Your report keeps the format people already recognise.",
      },
      {
        q: "Will our team lose control of the report?",
        a: "The opposite. Automation removes the typing, not the judgement. Your team still decides what the report says and can change targets, thresholds and recipients themselves — they just stop rebuilding it by hand.",
      },
      {
        q: "What happens when we need a new report?",
        a: "Once the pipeline exists, adding a report is a small piece of work rather than a new project, because the data is already flowing and validated.",
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
    tagline: "Software that reads, decides and acts",
    intro: [
      "Most AI conversations in business go nowhere because they start with the technology instead of the task. An agent is only worth building when there is a specific job a person currently does by reading something and then doing something about it.",
      "That is the kind we build: agents that watch your operational data, notice what changed, summarise it in plain language, and take the next step — flagging exceptions, drafting the follow-up, or writing the report somebody currently types out.",
    ],
    signals: [
      "Someone reads through the same data every morning looking for exceptions",
      "Follow-ups get missed because chasing them is nobody's actual job",
      "A person writes the same summary every week from the same numbers",
      "You want to use AI but every proposal you have seen is vague about what it would actually do",
    ],
    deliverables: [
      {
        title: "Agents scoped to a real task",
        desc: "We start from a job somebody does today, not from a demo. If a task does not justify an agent, we say so.",
      },
      {
        title: "Grounded in your own data",
        desc: "Agents work from your systems and figures, not general knowledge, so their output is checkable against the source.",
      },
      {
        title: "A human in the loop where it matters",
        desc: "Anything consequential is drafted for approval rather than sent blind. You decide where that line sits.",
      },
      {
        title: "Built on the same secure foundation",
        desc: "Role-based access, validated inputs and encrypted credentials — an agent gets no more reach than the person it works for.",
      },
    ],
    faq: [
      {
        q: "Is this useful for a Tanzanian business, or only large companies?",
        a: "It depends on the task, not the size of the company. If someone spends an hour a day reading data and reacting to it, that is worth automating whether the organisation has fifteen staff or five hundred.",
      },
      {
        q: "Will an AI agent make decisions without us?",
        a: "Only where you decide it should. Most agents we build draft and recommend, and a person approves. Fully automatic actions are reserved for low-risk, well-defined steps.",
      },
      {
        q: "What does an agent actually cost to run?",
        a: "There is the build, and then a running cost that depends on how much data it processes. We size that honestly before you commit, because an agent that costs more than the work it replaces is not worth having.",
      },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
