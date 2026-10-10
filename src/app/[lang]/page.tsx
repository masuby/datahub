import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { JsonLd } from "@/components/system/JsonLd";
import { LangHint } from "@/components/system/LangHint";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Footer } from "@/components/site/Footer";
import { ActionRail } from "@/components/site/ActionRail";
import { HomeServices } from "@/components/site/home/HomeServices";
import { HomeDashboards } from "@/components/site/home/HomeDashboards";
import { HomeReasons } from "@/components/site/home/HomeReasons";
import { CtaBand } from "@/components/site/home/CtaBand";
import { LegacyHash } from "@/components/site/home/LegacyHash";
import { organizationSchema, websiteSchema, alternatesFor, shareCard } from "@/lib/seo";

/**
 * The home page, short (about three screens on a phone): the hero, then one
 * teaser per idea, each pointing at the page that holds the rest —
 *
 *   hero · 01 what we do → /services · 02 a sample dashboard → /dashboards ·
 *   three reasons → /process, /security, /team · start a conversation → /contact
 *
 * Organization and WebSite JSON-LD live here; the FAQPage markup moved to
 * /faq with the questions it describes.
 */

// Render dynamically so the per-request CSP nonce (set in proxy.ts) is stamped
// onto the framework scripts. A statically prerendered page could not carry it,
// and 'strict-dynamic' would then block every script in production.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const t = dict.meta.home;
  return {
    // `absolute` so the home title is exactly the brand line, untemplated.
    title: { absolute: t.title },
    description: t.description,
    alternates: alternatesFor(lang, "/"),
    ...shareCard({
      lang,
      title: t.ogTitle,
      description: t.ogDescription,
      siteName: dict.meta.siteName,
      imageAlt: dict.alt.og,
    }),
  };
}

export default async function Home({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  // The same nonce proxy.ts put in the CSP header, for the JSON-LD blocks.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <JsonLd nonce={nonce} data={[organizationSchema(lang, t.meta.home.description), websiteSchema(lang)]} />
      <Header lang={lang} />
      <LangHint lang={lang} />
      <main id="main" className="flex-1">
        <Hero lang={lang} />
        <HomeServices lang={lang} />
        <HomeDashboards lang={lang} />
        <HomeReasons lang={lang} />
        <CtaBand lang={lang} />
      </main>
      <Footer lang={lang} />
      <ActionRail lang={lang} />
      <LegacyHash lang={lang} />
    </>
  );
}
