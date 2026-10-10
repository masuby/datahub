import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { SERVICES, getService } from "@/lib/services";
import { hasLocale, localePath, LANG_TAG } from "@/i18n/config";
import { JsonLd } from "@/components/system/JsonLd";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Contact } from "@/components/site/Contact";
import { ActionRail } from "@/components/site/ActionRail";
import { serviceSchema, breadcrumbSchema, faqSchema, absoluteUrl } from "@/lib/seo";

/**
 * STUB — replaced by the pages build slice (spec §7). Keeps routing, metadata,
 * hreflang and JSON-LD working while the redesigned page is built.
 */
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const service = getService(slug, lang);
  if (!service) return {};
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: {
      canonical: localePath(lang, `/services/${service.slug}`),
      languages: {
        [LANG_TAG.en]: `/services/${service.slug}`,
        [LANG_TAG.sw]: `/sw/services/${service.slug}`,
        "x-default": `/services/${service.slug}`,
      },
    },
    openGraph: { type: "article", url: absoluteUrl(lang, `/services/${service.slug}`), title: service.metaTitle, description: service.metaDescription },
  };
}

export default async function ServicePage({ params }: PageProps<"/[lang]/services/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const service = getService(slug, lang);
  if (!service) notFound();
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <JsonLd
        nonce={nonce}
        data={[
          serviceSchema(service, lang),
          breadcrumbSchema([
            { name: "DataHub", url: absoluteUrl(lang) },
            { name: service.navLabel, url: absoluteUrl(lang, `/services/${service.slug}`) },
          ]),
          faqSchema(service.faq, `${absoluteUrl(lang, `/services/${service.slug}`)}#faq`),
        ]}
      />
      <Header lang={lang} />
      <main id="main" className="flex-1">
        <h1>{service.title}</h1>
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
      <ActionRail lang={lang} />
    </>
  );
}
