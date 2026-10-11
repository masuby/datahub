import "server-only";
import { defineDict } from "../dict";

/**
 * Strings the pages need that the main dictionary does not carry:
 *
 * - `meta` — title and description of each page that used to be a section
 *   of the single home page (/services, /dashboards …). Titles run through
 *   the "%s · DataHub" template.
 * - `home` — the short home page's teaser sections: the link lines under
 *   them and the three reasons, each pointing at the page that proves it
 *   (keyed by that page; HomeReasons sets their order and chapter numbers).
 * - `security` — the eyebrow of /security, which opens on "Your data stays
 *   yours" (the dictionary's old "Why DataHub" eyebrow was removed).
 * - `cta` — the one line of the closing band that ends the home page, the
 *   service pages and the other standalone pages.
 *
 * Every statement here must stay true to the pages it summarises.
 */
export const pagesExtra = defineDict({
  en: {
    meta: {
      services: {
        title: "Dashboards, reporting automation and AI agents",
        description:
          "Dashboards, reports that build themselves and AI agents for organisations in Tanzania. Estimate the hours you could save.",
      },
      dashboards: {
        title: "Sample dashboards",
        description:
          "Four sample dashboards, built the way we build for clients. Every name and number is invented.",
      },
      process: {
        title: "How we work",
        description: "Discover, design, build, support: how a DataHub project runs.",
      },
      security: {
        title: "Security",
        description:
          "How DataHub keeps your data yours, and claims about this site you can check: no cookies, no trackers.",
      },
      team: {
        title: "Team",
        description: "The people you will work with at DataHub in Dar es Salaam: Daniel C. Masubi, Kanuda L. Sasi and Yohana K. Mussa.",
      },
      faq: {
        title: "Questions",
        description:
          "What organisations ask before working with DataHub: cost, timelines, where we work and data security.",
      },
      contact: {
        title: "Contact",
        description:
          "Tell us which report takes your team longest. The first conversation is free.",
      },
    },
    home: {
      servicesAll: "All services",
      dashboardsExplore: "Explore the sample dashboards",
      reasons: {
        title: "Why DataHub",
        items: {
          process: { title: "A clear process", body: "Four steps, from first call to support." },
          security: { title: "Security first", body: "Access by role, encrypted credentials." },
          team: { title: "A team in Dar es Salaam", body: "The people you meet build your system." },
        },
      },
    },
    security: {
      eyebrow: "05 — Security",
    },
    cta: {
      title: "Which report takes your team longest?",
    },
  },
  sw: {
    meta: {
      services: {
        title: "Dashibodi, otomatiki ya ripoti na mawakala wa AI",
        description:
          "Dashibodi, ripoti zinazojitengeneza zenyewe na mawakala wa AI kwa taasisi za Tanzania. Kadiria saa ambazo timu yako inaweza kuokoa.",
      },
      dashboards: {
        title: "Dashibodi za mfano",
        description:
          "Dashibodi nne za mfano, zilizojengwa kama tunavyojenga kwa wateja. Majina na namba zote ni za kubuni.",
      },
      process: {
        title: "Jinsi tunavyofanya kazi",
        description:
          "Kuchunguza, kusanifu, kujenga na kusaidia: jinsi mradi wa DataHub unavyoendeshwa.",
      },
      security: {
        title: "Usalama",
        description:
          "Jinsi DataHub inavyohakikisha data yako inabaki kuwa yako, na madai kuhusu tovuti hii unayoweza kuhakiki: hakuna vidakuzi, hakuna vifuatiliaji.",
      },
      team: {
        title: "Timu",
        description:
          "Watu utakaofanya nao kazi DataHub, Dar es Salaam: Daniel C. Masubi, Kanuda L. Sasi na Yohana K. Mussa.",
      },
      faq: {
        title: "Maswali",
        description:
          "Maswali ambayo taasisi huuliza kabla ya kufanya kazi na DataHub: gharama, muda, mahali tunapofanya kazi na usalama wa data.",
      },
      contact: {
        title: "Mawasiliano",
        description:
          "Tuambie ni ripoti gani inayochukua muda mwingi wa timu yako. Mazungumzo ya kwanza ni bure.",
      },
    },
    home: {
      servicesAll: "Huduma zote",
      dashboardsExplore: "Chunguza dashibodi za mfano",
      reasons: {
        title: "Kwa nini DataHub",
        items: {
          process: {
            title: "Mchakato ulio wazi",
            body: "Hatua nne, kuanzia mwanzo hadi msaada.",
          },
          security: {
            title: "Usalama kwanza",
            body: "Ufikiaji kwa nafasi ya kazi, taarifa za kuingia zilizosimbwa.",
          },
          team: { title: "Timu iliyopo Dar es Salaam", body: "Watu unaokutana nao ndio wanaojenga mfumo wako." },
        },
      },
    },
    security: {
      eyebrow: "05 — Usalama",
    },
    cta: {
      title: "Ripoti ipi inachukua muda mwingi zaidi?",
    },
  },
});
