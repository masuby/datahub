import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pagesExtra } from "@/i18n/extra/pages";
import { JsonLd } from "@/components/system/JsonLd";
import { LangHint } from "@/components/system/LangHint";
import { Header } from "@/components/site/Header";
import { Faq } from "@/components/site/Faq";
import { CtaBand } from "@/components/site/home/CtaBand";
import { Footer } from "@/components/site/Footer";
import { ActionRail } from "@/components/site/ActionRail";
import { absoluteUrl, faqSchema, pageMetadata } from "@/lib/seo";

/**
 * Questions (/faq, /sw/faq). Its section title is the page's h1; the closing
 * band leads to /contact. The FAQPage JSON-LD lives here, built from the
 * same dictionary array the section renders, so the markup can never
 * describe questions the page does not show.
 */

// Dynamic so the per-request CSP nonce reaches the framework scripts and the
// JSON-LD block (see src/app/[lang]/page.tsx).
export const dynamic = "force-dynamic";

const PATH = "/faq";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const m = pagesExtra[lang].meta.faq;
  return pageMetadata({
    lang,
    path: PATH,
    title: m.title,
    description: m.description,
    siteName: dict.meta.siteName,
    titleTemplate: dict.meta.titleTemplate,
    imageAlt: dict.alt.og,
  });
}

export default async function FaqPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <JsonLd nonce={nonce} data={faqSchema(t.faq.items, `${absoluteUrl(lang, PATH)}#faq`)} />
      <Header lang={lang} />
      <LangHint lang={lang} />
      <main id="main" className="flex-1">
        <Faq lang={lang} headingLevel={1} />
        <CtaBand lang={lang} />
      </main>
      <Footer lang={lang} />
      <ActionRail lang={lang} />
    </>
  );
}
