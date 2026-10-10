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
          "Dashboards your team decides from, reports that build themselves and AI agents a person approves, for organisations in Tanzania. Estimate the hours you could save.",
      },
      dashboards: {
        title: "Sample dashboards",
        description:
          "Four sample dashboards, built the way we build for clients: executive overview, loan portfolio, sales by region, automation and operations. Every name and number is invented.",
      },
      process: {
        title: "How we work",
        description: "Discover, design, build, support: how a DataHub project runs, and what you receive at each step.",
      },
      security: {
        title: "Security",
        description:
          "How DataHub keeps your data yours, and the claims about this website you can check yourself: no cookies, no trackers, a strict security policy.",
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
          "Tell DataHub which report or process costs your team the most time. The first conversation costs nothing.",
      },
    },
    home: {
      servicesAll: "All services",
      dashboardsExplore: "Explore the sample dashboards",
      reasons: {
        title: "Why DataHub",
        items: {
          process: { title: "A clear process", body: "Four steps, from the first conversation to support." },
          security: { title: "Security first", body: "Access by role and encrypted credentials, as standard." },
          team: { title: "A team in Dar es Salaam", body: "The people you meet build your system." },
        },
      },
    },
    security: {
      eyebrow: "05 — Security",
    },
    cta: {
      title: "Which report costs your team the most time?",
    },
  },
  sw: {
    meta: {
      services: {
        title: "Dashibodi, otomatiki ya ripoti na mawakala wa AI",
        description:
          "Dashibodi za kufanyia maamuzi, ripoti zinazojitengeneza zenyewe na mawakala wa AI ambao kazi yao huidhinishwa na mtu, kwa taasisi za Tanzania. Kadiria saa ambazo timu yako inaweza kuokoa.",
      },
      dashboards: {
        title: "Dashibodi za mfano",
        description:
          "Dashibodi nne za mfano, zilizojengwa kama tunavyojenga kwa wateja: muhtasari kwa uongozi, jalada la mikopo, mauzo kwa mkoa, otomatiki na uendeshaji. Majina na namba zote ni za kubuni.",
      },
      process: {
        title: "Jinsi tunavyofanya kazi",
        description:
          "Kuchunguza, kusanifu, kujenga na kusaidia: jinsi mradi wa DataHub unavyoendeshwa, na unachopokea katika kila hatua.",
      },
      security: {
        title: "Usalama",
        description:
          "Jinsi DataHub inavyohakikisha data yako inabaki kuwa yako, na madai kuhusu tovuti hii unayoweza kuhakiki mwenyewe: hakuna vidakuzi, hakuna vifuatiliaji, sera kali ya usalama.",
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
          "Iambie DataHub ni ripoti au mchakato gani unaogharimu timu yako muda mwingi zaidi. Mazungumzo ya kwanza ni bure.",
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
            body: "Hatua nne, kuanzia mazungumzo ya kwanza hadi msaada.",
          },
          security: {
            title: "Usalama kwanza",
            body: "Ufikiaji kwa nafasi ya kazi na taarifa za kuingia zilizosimbwa, kila mara.",
          },
          team: { title: "Timu iliyopo Dar es Salaam", body: "Watu unaokutana nao ndio wanaojenga mfumo wako." },
        },
      },
    },
    security: {
      eyebrow: "05 — Usalama",
    },
    cta: {
      title: "Ni ripoti gani inayogharimu timu yako muda mwingi zaidi?",
    },
  },
});
