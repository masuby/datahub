import { CONTACT_EMAIL, WHATSAPP_DISPLAY } from "@/lib/contact-info";
import { servicesFor, type Service } from "@/lib/services";
import { LANG_TAG, localePath, type Locale } from "@/i18n/config";

/**
 * Structured data (JSON-LD).
 *
 * Search engines do not infer "a data analytics company operating in Tanzania"
 * from prose. Schema.org states it explicitly: what the business is, where it
 * operates, who runs it, and what it sells. That is what feeds knowledge panels
 * and the local pack, which sit above organic results for commercial queries.
 *
 * Keep these objects factual. Marking up claims the page does not actually make
 * is a structured-data violation and can earn a manual penalty. Every page
 * emits its own language's markup: /sw describes itself in Kiswahili.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.datahub.co.tz";

/** Absolute URL of a page in a locale. */
export const absoluteUrl = (lang: Locale, path = "/") => {
  const p = localePath(lang, path);
  return p === "/" ? SITE_URL : `${SITE_URL}${p}`;
};

type TeamMember = { name: string; alternateName?: string; jobTitle: string; image: string };

/** The people named on the site. Titles exactly as the owner gave them. */
export const TEAM: TeamMember[] = [
  {
    name: "Daniel C. Masubi",
    alternateName: "Daniel Clement Masubi",
    jobTitle: "Chief Technology Officer",
    image: "/team/daniel-masubi.png",
  },
  { name: "Kanuda L. Sasi", jobTitle: "Head of Operations", image: "/team/kanuda-sasi.png" },
  { name: "Yohana K. Mussa", jobTitle: "Head of Marketing", image: "/team/yohana-mussa.png" },
];

const person = (m: TeamMember) => ({
  "@type": "Person",
  name: m.name,
  ...(m.alternateName ? { alternateName: m.alternateName } : {}),
  jobTitle: m.jobTitle,
  image: `${SITE_URL}${m.image}`,
  worksFor: { "@id": `${SITE_URL}/#organization` },
});

/** The organisation itself — the anchor entity every other node points at. */
export function organizationSchema(lang: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#organization`,
    name: "DataHub",
    slogan: lang === "sw" ? "Kutoka Data hadi Maamuzi" : "From Data to Decisions",
    url: absoluteUrl(lang),
    logo: `${SITE_URL}/brand/logo-512.png`,
    image: `${SITE_URL}/opengraph-image`,
    description,
    email: CONTACT_EMAIL,
    ...(WHATSAPP_DISPLAY ? { telephone: WHATSAPP_DISPLAY } : {}),
    founder: person(TEAM[0]),
    employee: TEAM.map(person),
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
      name: lang === "sw" ? "Huduma" : "Services",
      itemListElement: servicesFor(lang).map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.navLabel,
          description: s.metaDescription,
          url: absoluteUrl(lang, `/services/${s.slug}`),
        },
      })),
    },
  };
}

/** Lets Google associate the domain with the brand name in search results. */
export function websiteSchema(lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "DataHub",
    inLanguage: LANG_TAG[lang],
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/**
 * FAQ markup. Only ever generated from questions genuinely rendered on the
 * page — marking up invisible content is against Google's guidelines.
 */
export function faqSchema(items: readonly { q: string; a: string }[], id: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": id,
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/** A single service page, tied back to the organisation as its provider. */
export function serviceSchema(service: Service, lang: Locale) {
  const url = absoluteUrl(lang, `/services/${service.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.title,
    description: service.metaDescription,
    url,
    inLanguage: LANG_TAG[lang],
    serviceType: service.navLabel,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: [
      { "@type": "Country", name: "Tanzania" },
      { "@type": "City", name: "Dar es Salaam" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: service.title,
      itemListElement: service.deliverables.map((d) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: d.title, description: d.desc },
      })),
    },
  };
}

/** Renders the Home / Service trail Google shows in place of a bare URL. */
export function breadcrumbSchema(trail: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
