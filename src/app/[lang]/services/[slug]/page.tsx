import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { SERVICES, getService, servicesFor } from "@/lib/services";
import type { ServiceSlug } from "@/lib/service-slugs";
import { hasLocale, localePath, type Locale } from "@/i18n/config";
import { getDictionary, fill, type Dictionary } from "@/i18n/get-dictionary";
import { JsonLd } from "@/components/system/JsonLd";
import { LangHint } from "@/components/system/LangHint";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ActionRail } from "@/components/site/ActionRail";
import { SERVICE_ITEM_KEY } from "@/components/site/Services";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { LegacyHash } from "@/components/site/home/LegacyHash";
import { SampleBand } from "@/components/dash/SampleBand";
import { SilkField } from "@/components/silk/SilkField";
import { PRESETS } from "@/lib/silk";
import { BrandMark } from "@/components/brand/BrandMark";
import { Container } from "@/components/ui/Container";
import { Grid } from "@/components/ui/Grid";
import { Rule } from "@/components/ui/Rule";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonPrimary } from "@/components/ui/Button";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { serviceSchema, breadcrumbSchema, faqSchema, absoluteUrl, pageMetadata } from "@/lib/seo";
import { bindAmpersands, cn } from "@/lib/utils";
import styles from "./service.module.css";

/**
 * Service page (spec §7): the home page's language, shorter.
 *
 *   hero (static silk, no canvas) · 01 signs · 02 what you get ·
 *   03 sample band · 04 questions · 05 also from DataHub
 *
 * No closing band and no form (iteration-5 §G): the hero's button, the
 * header's button and the mobile action rail open the contact page, as
 * every "Start a conversation" on the site does, and a `#contact` link from
 * before (LegacyHash) is sent there too.
 * The breadcrumb runs Home / Services / this service.
 *
 * Body copy comes from services.ts / services.sw.ts (both reviewed), chrome
 * from the dictionary. Both locales are indexable with a full hreflang pair.
 */

// Dynamic so the per-request CSP nonce reaches the framework scripts and the
// JSON-LD blocks (see src/app/[lang]/page.tsx).
export const dynamic = "force-dynamic";
// Only the three real slugs render here. src/proxy.ts sends any other slug to
// a path that matches no route, so it gets the server-rendered global 404
// (a notFound() thrown in this route would be drawn only in the browser).
export const dynamicParams = false;

/** 01 signs · 02 what you get · 03 sample · 04 questions · 05 also. */
const TOTAL = 5;
const SILK = PRESETS.service;

/** These pages used to end with the contact form: `#contact` links shared then open /contact. */
const MOVED = { contact: "/contact" };

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const service = getService(slug, lang);
  if (!service) return {};
  const t = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: `/services/${service.slug}`,
    type: "article",
    title: service.metaTitle,
    description: service.metaDescription,
    siteName: t.meta.siteName,
    titleTemplate: t.meta.titleTemplate,
    imageAlt: t.alt.og,
  });
}

export default async function ServicePage({ params }: PageProps<"/[lang]/services/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const service = getService(slug, lang);
  if (!service) notFound();
  const t = await getDictionary(lang);
  const p = t.servicePage;
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const pageUrl = absoluteUrl(lang, `/services/${service.slug}`);
  const others = servicesFor(lang).filter((s) => s.slug !== service.slug);

  return (
    <>
      <JsonLd
        nonce={nonce}
        data={[
          serviceSchema(service, lang),
          breadcrumbSchema([
            { name: p.home, url: absoluteUrl(lang) },
            { name: t.nav.services, url: absoluteUrl(lang, "/services") },
            { name: service.navLabel, url: pageUrl },
          ]),
          // Built from the same array the Questions section renders.
          faqSchema(service.faq, `${pageUrl}#faq`),
        ]}
      />
      <Header lang={lang} />
      <LangHint lang={lang} />
      <main id="main" className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section aria-labelledby="service-title" className={cn("relative isolate overflow-hidden", styles.hero)}>
          <div aria-hidden="true" className={cn("silk-layer pointer-events-none absolute inset-0 -z-10 hidden lg:block", styles.silk)}>
            {/* Stretched (not sliced) onto the layer, as in the home hero, so the
                sink always sits at 88% / 45% of the layer and the mark lands on
                it at every aspect ratio; strokes stay 1px (non-scaling-stroke). */}
            <svg viewBox={`0 0 ${SILK.W} ${SILK.H}`} preserveAspectRatio="none" className="block size-full" focusable="false">
              <SilkField preset="service" />
            </svg>
            <BrandMark className={styles.mark} />
          </div>

          <Container className="flex flex-col pt-[var(--section-y-first)] pb-[clamp(3.5rem,9vh,6rem)] lg:min-h-[520px]">
            <Grid>
              {/* Phones and tablets: the text block centres (iteration-5 §B);
                  from 1024px it sits left of the silk and the mark. */}
              <div className="col-span-4 text-center sm:col-span-8 lg:col-span-8 lg:text-left">
                <nav aria-label={p.breadcrumbLabel} className="a-fade">
                  <ol className="t-data flex flex-wrap items-center justify-center gap-x-2 lg:justify-start">
                    <li>
                      <Link href={localePath(lang, "/")} className="transition-colors duration-[160ms] hover:text-fg">
                        {p.home}
                      </Link>
                    </li>
                    <li aria-hidden="true">/</li>
                    <li>
                      <Link href={localePath(lang, "/services")} className="transition-colors duration-[160ms] hover:text-fg">
                        {t.nav.services}
                      </Link>
                    </li>
                    <li aria-hidden="true">/</li>
                    <li>
                      <span aria-current="page" className="text-muted">
                        {service.navLabel}
                      </span>
                    </li>
                  </ol>
                </nav>

                <p className="t-eyebrow mt-10 text-accent lg:mt-14">{service.tagline}</p>
                <h1 id="service-title" className="t-h1-page mt-5 hyphens-auto">
                  {service.title}
                </h1>

                <p className="t-lead mx-auto mt-8 lg:mx-0">{service.intro}</p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:justify-start">
                  <ButtonPrimary href={localePath(lang, "/contact")}>{p.cta}</ButtonPrimary>
                  <LinkArrow href={localePath(lang, "/services")}>{p.allServices}</LinkArrow>
                </div>
              </div>
            </Grid>
          </Container>

          {/* Mobile and tablet: the silk as a band under the text, never behind it. */}
          <div aria-hidden="true" className="silk-layer pointer-events-none relative h-40 sm:h-52 lg:hidden">
            <SilkField preset="service" className="h-full w-full" />
          </div>
        </section>

        {/* ── 01 Signs you need this ───────────────────────────── */}
        <Section id="signals" labelledBy="signals-title">
          <Container>
            <SectionHeader index="01" total={TOTAL} eyebrow={p.signals.eyebrow} title={p.signals.title} titleId="signals-title" />
            {/* Short lines, centred under the centred header; a fading
                hairline between them (styles.stack). */}
            <Reveal>
              <ol className={cn(styles.stack, "mx-auto max-w-[40rem] text-center")}>
                {service.signals.map((signal, i) => (
                  <li key={i} className="a-rise py-6 lg:py-7" style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}>
                    <span className="t-eyebrow block">01.{i + 1}</span>
                    <p className="t-title mt-2">{signal}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </Container>
        </Section>

        {/* ── 02 What you get ──────────────────────────────────── */}
        <Section id="deliverables" labelledBy="deliverables-title">
          <Container>
            <SectionHeader
              index="02"
              total={TOTAL}
              eyebrow={p.deliverables.eyebrow}
              title={p.deliverables.title}
              titleId="deliverables-title"
            />
            {/* Four centred cards: one column on phones, two on tablets,
                four from 1024px, divided by fading hairlines (styles.cards). */}
            <Reveal>
              <ol className={cn(styles.cards, styles.cards4)}>
                {service.deliverables.map((d, i) => (
                  <li key={d.title} className={cn(styles.cell, styles.card, "a-rise")} style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}>
                    <span className="t-eyebrow">02.{i + 1}</span>
                    <h3 className="t-title mt-3 max-w-[22ch]">{d.title}</h3>
                    <p className="t-body mt-2 max-w-[32ch] text-muted">{d.desc}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </Container>
        </Section>

        {/* ── 03 See it in a sample (owned by the dashboards kit) ── */}
        <SampleBand lang={lang} service={service.slug} total={TOTAL} />

        {/* ── 04 Questions ─────────────────────────────────────── */}
        <Section id="faq" labelledBy="faq-title">
          <Container>
            <SectionHeader
              index="04"
              total={TOTAL}
              eyebrow={p.faq.eyebrow}
              title={fill(p.faq.title, { service: service.navLabel })}
              titleId="faq-title"
            />
            {/* A centred reading column; questions and answers stay left-aligned. */}
            <Reveal>
              <div className="mx-auto max-w-[48rem]">
                <Rule className="bg-rule-strong" />
                {service.faq.map((item, i) => (
                  <div key={item.q}>
                    {i > 0 && <Rule />}
                    <details className={styles.faq}>
                      <summary className="flex items-start justify-between gap-6 py-6 lg:py-7">
                        <span className="block">
                          <span className="t-eyebrow block">
                            {t.faq.indexPrefix} 04.{i + 1}
                          </span>
                          <span className="t-title mt-2 block">{item.q}</span>
                        </span>
                        <span aria-hidden="true" className={styles.plus} />
                      </summary>
                      <p className="t-body pb-7 text-muted">{item.a}</p>
                    </details>
                  </div>
                ))}
                <Rule className="bg-rule-strong" />
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* ── 05 Also from DataHub ─────────────────────────────── */}
        <Section id="more-services" labelledBy="others-title">
          <Container>
            <SectionHeader index="05" total={TOTAL} eyebrow={p.others.eyebrow} title={p.others.title} titleId="others-title" />
            <Reveal>
              <ul className={cn(styles.cards, styles.cards2)}>
                {others.map((s, i) => (
                  <OtherServiceCard key={s.slug} lang={lang} t={t} slug={s.slug} index={`05.${i + 1}`} delay={i * 60} />
                ))}
              </ul>
            </Reveal>
          </Container>
        </Section>

      </main>
      <Footer lang={lang} />
      <ActionRail lang={lang} />
      <LegacyHash lang={lang} moved={MOVED} />
    </>
  );
}

/**
 * One centred card linking to another service, like the columns on
 * /services: its 3D icon, index, title and tagline, then "Read more →". The
 * whole card is the link; the icon and "Read more" are decorative, so its
 * name is the title and tagline. The longer description stays on
 * /services, so a service page does not restate the other two in full.
 * Hover/focus: the index and title turn accent and the arrow moves 6px.
 */
function OtherServiceCard({
  lang,
  t,
  slug,
  index,
  delay,
}: {
  lang: Locale;
  t: Dictionary;
  slug: ServiceSlug;
  index: string;
  delay: number;
}) {
  const item = t.services.items[SERVICE_ITEM_KEY[slug]];
  return (
    <li className={cn(styles.cell, "a-rise")} style={{ animationDelay: `${delay}ms` }}>
      <Link href={localePath(lang, `/services/${slug}`)} className={cn("group", styles.card)}>
        <span aria-hidden="true" className={styles.cardIcon}>
          <ServiceIcon slug={slug} size={80} className="w-full" />
        </span>
        <span className="t-eyebrow mt-5 transition-colors duration-[160ms] group-hover:text-accent group-focus-visible:text-accent">
          {index}
        </span>
        <h3 className="t-h3 mt-3 max-w-[18ch] transition-colors duration-[160ms] group-hover:text-accent group-focus-visible:text-accent">
          {bindAmpersands(item.title)}
        </h3>
        <span className="t-body mt-3 font-bold text-fg">{item.tagline}</span>
        <span aria-hidden="true" className={styles.more}>
          {t.services.readMore}
          <span className="inline-block transition-transform duration-[280ms] ease-[var(--ease-silk)] group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5">
            →
          </span>
        </span>
      </Link>
    </li>
  );
}
