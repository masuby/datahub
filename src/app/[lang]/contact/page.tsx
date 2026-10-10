import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pagesExtra } from "@/i18n/extra/pages";
import { LangHint } from "@/components/system/LangHint";
import { Header } from "@/components/site/Header";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { ActionRail } from "@/components/site/ActionRail";
import { pageMetadata } from "@/lib/seo";

/**
 * Contact (/contact, /sw/contact): the direct lines and the form — where
 * every "Start a conversation" on the site leads. Its section title is the
 * page's h1. A sentence from the hours estimator (/services) waits in
 * sessionStorage and the form adopts it on mount; ?ref= attribution reaches
 * the form from the URL or RefKeeper's sessionStorage copy, as before.
 */

// Dynamic so the per-request CSP nonce reaches the framework scripts (see
// src/app/[lang]/page.tsx).
export const dynamic = "force-dynamic";

const PATH = "/contact";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const m = pagesExtra[lang].meta.contact;
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

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <>
      <Header lang={lang} />
      <LangHint lang={lang} />
      <main id="main" className="flex-1">
        <Contact lang={lang} headingLevel={1} />
      </main>
      <Footer lang={lang} />
      <ActionRail lang={lang} />
    </>
  );
}
