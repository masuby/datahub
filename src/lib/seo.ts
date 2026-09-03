import { CONTACT_EMAIL, WHATSAPP_DISPLAY } from "@/lib/contact-info";

/**
 * Structured data (JSON-LD).
 *
 * Search engines do not infer "a data analytics company operating in Tanzania"
 * from prose. Schema.org states it explicitly: what the business is, where it
 * operates, who runs it, and what it sells. That is what feeds knowledge panels
 * and the local pack, which sit above organic results for commercial queries.
 *
 * Keep these objects factual. Marking up claims the page does not actually make
 * is a structured-data violation and can earn a manual penalty.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.datahub.co.tz";

const FOUNDER = "Daniel Clement Masubi";

/** The organisation itself — the anchor entity every other node points at. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#organization`,
    name: "DataHub",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    image: `${SITE_URL}/opengraph-image`,
    description:
      "DataHub builds custom dashboards, automated reporting and business intelligence software for organisations in Tanzania.",
    email: CONTACT_EMAIL,
    ...(WHATSAPP_DISPLAY ? { telephone: WHATSAPP_DISPLAY } : {}),
    founder: {
      "@type": "Person",
      name: FOUNDER,
      jobTitle: "Data Engineer",
      image: `${SITE_URL}/daniel-masubi.png`,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dar es Salaam",
      addressCountry: "TZ",
    },
    areaServed: [
      { "@type": "Country", name: "Tanzania" },
      { "@type": "City", name: "Dar es Salaam" },
    ],
    knowsAbout: [
      "Data analytics",
      "Business intelligence",
      "Dashboard development",
      "Reporting automation",
      "Data engineering",
      "Custom software development",
      "AI agents",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Reporting Platform",
            description:
              "Live dashboards and scheduled reports built around the metrics an organisation actually decides on.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Automation",
            description:
              "Replacing repetitive spreadsheet and reporting work with pipelines that run unattended.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "AI Agent Design",
            description:
              "Agents that read operational data, summarise what changed, and act on it.",
          },
        },
      ],
    },
  };
}

/** Lets Google associate the domain with the brand name in search results. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "DataHub",
    inLanguage: "en-TZ",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/**
 * FAQ markup. Only ever generated from questions genuinely rendered on the
 * page — marking up invisible content is against Google's guidelines.
 */
export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
