import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { offersExtra } from "@/i18n/extra/offers";
import { LangHint } from "@/components/system/LangHint";
import { Header } from "@/components/site/Header";
import { Packages } from "@/components/site/Packages";
import { Footer } from "@/components/site/Footer";
import { ActionRail } from "@/components/site/ActionRail";
import { pageMetadata } from "@/lib/seo";

/**
 * Packages and prices (/packages, /sw/packages): the four fixed-price
 * packages and the training in brief. Its section title is the page's h1.
 */

// Dynamic so the per-request CSP nonce reaches the framework scripts (see
// src/app/[lang]/page.tsx).
export const dynamic = "force-dynamic";

const PATH = "/packages";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const m = offersExtra[lang].meta.packages;
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

export default async function PackagesPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <>
      <Header lang={lang} />
      <LangHint lang={lang} />
      <main id="main" className="flex-1">
        <Packages lang={lang} />
      </main>
      <Footer lang={lang} />
      <ActionRail lang={lang} />
    </>
  );
}
