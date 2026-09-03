/**
 * Poster copy for the social campaign.
 *
 * Every entry maps to a folder under `marketing/posts/` or `marketing/status/`
 * that already holds the matching caption, so a poster and its caption cannot
 * drift apart. `npm run posters` renders these and writes each PNG next to its
 * caption.
 *
 * A poster is read at arm's length while scrolling, so each one carries exactly
 * one idea: a hook, one supporting line, and the address. Anything longer
 * belongs in the caption.
 */

export type PosterKind = "post" | "status";

/**
 * Layout. Ten structurally identical text cards in a feed read as noise, so
 * each poster picks the shape that fits its idea:
 *   default  — eyebrow, headline, supporting line
 *   stat     — one number carries the message
 *   bars     — a chart motif, for anything about reporting speed or volume
 *   contrast — the wrong way beside the right way
 *   portrait — the founder photo, for the personal post
 */
export type PosterVariant = "default" | "stat" | "bars" | "contrast" | "portrait";

export type Poster = {
  kind: PosterKind;
  /** Folder name under marketing/{posts,status}/ */
  slug: string;
  /** Small label above the headline. */
  eyebrow?: string;
  headline: string;
  sub: string;
  variant?: PosterVariant;
  /** variant "stat" only. */
  stat?: { value: string; label: string };
  /** variant "contrast" only. */
  contrast?: { bad: string; good: string };
};

/** Feed posts — Instagram and Facebook, 1080x1350 (4:5). */
const POSTS: Poster[] = [
  {
    kind: "post",
    slug: "01-hours-to-seconds",
    variant: "bars",
    eyebrow: "MASAA → SEKUNDE",
    headline: "Hours of reporting, done in seconds.",
    sub: "Tell us which report is eating your week.",
  },
  {
    kind: "post",
    slug: "02-one-source-of-truth",
    variant: "contrast",
    contrast: { bad: "412,000,000", good: "One engine. One answer." },
    eyebrow: "ONE SOURCE OF TRUTH",
    headline: "One number. One answer.",
    sub: "When finance and operations disagree, it is a systems problem — not a people problem.",
  },
  {
    kind: "post",
    slug: "03-excel-full-time-job",
    eyebrow: "AUTOMATION",
    headline: "Your spreadsheet has a full-time job.",
    sub: "You did not mean to hire it.",
  },
  {
    kind: "post",
    slug: "04-executive-dashboard",
    variant: "bars",
    eyebrow: "DASHBOARDS",
    headline: "The dashboard your manager actually opens.",
    sub: "Ten seconds to know whether things are fine.",
  },
  {
    kind: "post",
    slug: "05-built-in-tanzania",
    eyebrow: "IMEJENGWA TANZANIA",
    headline: "Built here, for how business actually runs here.",
    sub: "Same engineering standard as anywhere. In your timezone.",
  },
  {
    kind: "post",
    slug: "06-security-first",
    eyebrow: "SECURITY FIRST",
    headline: "Your data is not a side concern.",
    sub: "Encrypted credentials. Access by role. Never shared, never resold.",
  },
  {
    kind: "post",
    slug: "07-loan-portfolio",
    variant: "bars",
    eyebrow: "FOR LENDERS",
    headline: "PAR by branch. By officer. Today.",
    sub: "Not last month, when you can no longer prevent it.",
  },
  {
    kind: "post",
    slug: "08-tailored-not-templated",
    variant: "contrast",
    contrast: { bad: "A rigid template", good: "Built around your workflow" },
    eyebrow: "HOW WE BUILD",
    headline: "Tailored, not templated.",
    sub: "The system fits how you work — not the other way around.",
  },
  {
    kind: "post",
    slug: "09-what-does-it-cost",
    variant: "stat",
    stat: { value: "TSh 0", label: "the first conversation" },
    eyebrow: "PRICING",
    headline: "What does it cost?",
    sub: "It depends on what you need — and the first conversation costs nothing.",
  },
  {
    kind: "post",
    slug: "10-who-builds-it",
    variant: "portrait",
    eyebrow: "WHO BUILDS IT",
    headline: "Daniel Clement Masubi",
    sub: "Data Engineer. You deal with the engineer directly, not an account manager.",
  },
];

/** WhatsApp Status and Instagram Story — 1080x1920 (9:16). */
const STATUS: Poster[] = [
  {
    kind: "status",
    slug: "01-still-doing-manually",
    eyebrow: "BADO KWA MKONO?",
    headline: "Still building that report by hand?",
    sub: "It can be done in seconds instead.",
  },
  {
    kind: "status",
    slug: "02-monday-report",
    variant: "stat",
    stat: { value: "2 hrs", label: "every single Monday" },
    eyebrow: "JUMATATU",
    headline: "The same report. The same two hours.",
    sub: "What if it was already waiting in your inbox?",
  },
  {
    kind: "status",
    slug: "03-two-versions",
    variant: "contrast",
    contrast: { bad: "Two answers", good: "One answer" },
    eyebrow: "ONE SOURCE OF TRUTH",
    headline: "Two people. Two answers.",
    sub: "That is a systems problem, not a people problem.",
  },
  {
    kind: "status",
    slug: "04-one-click-excel",
    eyebrow: "AUTOMATION",
    headline: "One click to Excel.",
    sub: "Formatted correctly, every single time.",
  },
  {
    kind: "status",
    slug: "05-any-browser",
    eyebrow: "ANYWHERE",
    headline: "Your numbers, on your phone.",
    sub: "Any browser. Nothing to install.",
  },
  {
    kind: "status",
    slug: "06-automatic-email",
    variant: "stat",
    stat: { value: "07:00", label: "sent, without anyone remembering" },
    eyebrow: "SCHEDULED",
    headline: "Reports that send themselves.",
    sub: "Every Monday at 07:00. Nobody has to remember.",
  },
  {
    kind: "status",
    slug: "07-what-is-a-dashboard",
    variant: "bars",
    eyebrow: "WHAT IS A DASHBOARD?",
    headline: "A dashboard is not decoration.",
    sub: "It is the panel in your car. At a glance — are we fine?",
  },
  {
    kind: "status",
    slug: "08-free-consultation",
    variant: "stat",
    stat: { value: "TSh 0", label: "for the first conversation" },
    eyebrow: "MAZUNGUMZO YA KWANZA NI BURE",
    headline: "The first conversation costs nothing.",
    sub: "Tell me which report wastes the most time.",
  },
  {
    kind: "status",
    slug: "09-no-more-copy-paste",
    eyebrow: "AUTOMATION",
    headline: "Copy. Paste. Check. Fix. Repeat.",
    sub: "Every hour spent this way is thinking your business did not get.",
  },
  {
    kind: "status",
    slug: "10-your-data-is-safe",
    eyebrow: "SECURITY",
    headline: "Your data stays yours.",
    sub: "That is a design decision, not a promise.",
  },
  {
    kind: "status",
    slug: "11-question-to-ask",
    eyebrow: "ASK YOUR TEAM TODAY",
    headline: "Which report takes you longest, and why?",
    sub: "Their answer is usually what to automate first.",
  },
  {
    kind: "status",
    slug: "12-message-me",
    eyebrow: "WHATSAPP",
    headline: "Message me directly.",
    sub: "Describe the problem in one paragraph. I will tell you if I can help.",
  },
  {
    kind: "status",
    slug: "13-small-business-too",
    eyebrow: "NOT JUST FOR BANKS",
    headline: "Small business? Still yes.",
    sub: "If you keep records in Excel and you are tired of it, this is for you.",
  },
  {
    kind: "status",
    slug: "14-what-we-built",
    variant: "bars",
    eyebrow: "ALREADY RUNNING",
    headline: "Not theory. Working systems.",
    sub: "Reporting platforms, automated data pipelines, multi-agency bulletins.",
  },
];

export const POSTERS: Poster[] = [...POSTS, ...STATUS];

export function getPoster(kind: string, slug: string): Poster | undefined {
  return POSTERS.find((p) => p.kind === kind && p.slug === slug);
}

/** Instagram/Facebook feed is 4:5; Status and Stories are 9:16. */
export function posterSize(kind: PosterKind) {
  return kind === "post"
    ? { width: 1080, height: 1350 }
    : { width: 1080, height: 1920 };
}
