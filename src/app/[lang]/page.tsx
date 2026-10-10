import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { hasLocale, localePath, LANG_TAG } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { JsonLd } from "@/components/system/JsonLd";
import { LangHint } from "@/components/system/LangHint";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { Dashboards } from "@/components/site/Dashboards";
import { HoursEstimator } from "@/components/site/HoursEstimator";
import { Process } from "@/components/site/Process";
import { WhyUs } from "@/components/site/WhyUs";
import { Team } from "@/components/site/Team";
import { Faq } from "@/components/site/Faq";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { ActionRail } from "@/components/site/ActionRail";
import { organizationSchema, websiteSchema, faqSchema, absoluteUrl, shareCard } from "@/lib/seo";

// Render dynamically so the per-request CSP nonce (set in proxy.ts) is stamped
// onto the framework scripts. A statically prerendered page could not carry it,
// and 'strict-dynamic' would then block every script in production.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const t = dict.meta.home;
  return {
    // `absolute` so the home title is exactly the brand line, untemplated.
    title: { absolute: t.title },
    description: t.description,
    alternates: {
      canonical: localePath(lang, "/"),
      languages: { [LANG_TAG.en]: "/", [LANG_TAG.sw]: "/sw", "x-default": "/" },
    },
    ...shareCard({
      lang,
      title: t.ogTitle,
      description: t.ogDescription,
      siteName: dict.meta.siteName,
      imageAlt: dict.alt.og,
    }),
  };
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  // The same nonce proxy.ts put in the CSP header, for the JSON-LD blocks.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <JsonLd
        nonce={nonce}
        data={[
          organizationSchema(lang, t.meta.home.description),
          websiteSchema(lang),
          // Built from the same dictionary array the FAQ section renders, so
          // the markup can never describe questions the page does not show.
          faqSchema(t.faq.items, `${absoluteUrl(lang)}#faq`),
        ]}
      />
      <Header lang={lang} />
      <LangHint lang={lang} />
      <main id="main" className="flex-1">
        <Hero lang={lang} />
        <Services lang={lang} />
        <Dashboards lang={lang} />
        <HoursEstimator lang={lang} />
        <Process lang={lang} />
        <WhyUs lang={lang} />
        <Team lang={lang} />
        <Faq lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
      <ActionRail lang={lang} />
    </>
  );
}
