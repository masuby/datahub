import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pagesExtra } from "@/i18n/extra/pages";
import { LangHint } from "@/components/system/LangHint";
import { Header } from "@/components/site/Header";
import { Process } from "@/components/site/Process";
import { CtaBand } from "@/components/site/home/CtaBand";
import { Footer } from "@/components/site/Footer";
import { ActionRail } from "@/components/site/ActionRail";
import { pageMetadata } from "@/lib/seo";

/**
 * How we work (/process, /sw/process): the four steps, one page. Its section
 * title is the page's h1; the closing band leads to /contact.
 */

// Dynamic so the per-request CSP nonce reaches the framework scripts (see
// src/app/[lang]/page.tsx).
export const dynamic = "force-dynamic";

const PATH = "/process";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const m = pagesExtra[lang].meta.process;
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

export default async function ProcessPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <>
      <Header lang={lang} />
      <LangHint lang={lang} />
      <main id="main" className="flex-1">
        <Process lang={lang} headingLevel={1} />
        <CtaBand lang={lang} />
      </main>
      <Footer lang={lang} />
      <ActionRail lang={lang} />
    </>
  );
}
