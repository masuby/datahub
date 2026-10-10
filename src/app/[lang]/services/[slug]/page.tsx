import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { SERVICES, getService, servicesFor } from "@/lib/services";
import type { ServiceSlug } from "@/lib/service-slugs";
import { hasLocale, localePath, LANG_TAG, type Locale } from "@/i18n/config";
import { getDictionary, fill, type Dictionary } from "@/i18n/get-dictionary";
import { JsonLd } from "@/components/system/JsonLd";
import { LangHint } from "@/components/system/LangHint";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Contact } from "@/components/site/Contact";
import { ActionRail } from "@/components/site/ActionRail";
import { SampleBand } from "@/components/dash/SampleBand";
import { pagesExtra } from "@/i18n/extra/pages";
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
import { serviceSchema, breadcrumbSchema, faqSchema, absoluteUrl, shareCard } from "@/lib/seo";
import { cn } from "@/lib/utils";
import styles from "./service.module.css";

/**
 * Service page (spec §7): the home page's language, shorter.
 *
 *   hero (static silk, no canvas) · 01 signs · 02 what you get ·
 *   03 sample band (ink) · 04 questions · 05 also from DataHub · contact
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

/** 01 signs · 02 what you get · 03 sample · 04 questions · 05 also · 06 contact. */
const TOTAL = 6;
const SILK = PRESETS.service;

const ITEM_KEY: Record<ServiceSlug, keyof Dictionary["services"]["items"]> = {
  dashboards: "dashboards",
  automation: "automation",
  "ai-agents": "aiAgents",
};

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const service = getService(slug, lang);
  if (!service) return {};
  const t = await getDictionary(lang);
  const path = `/services/${service.slug}`;
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: {
      canonical: localePath(lang, path),
      languages: {
        [LANG_TAG.en]: localePath("en", path),
        [LANG_TAG.sw]: localePath("sw", path),
        "x-default": localePath("en", path),
      },
    },
    ...shareCard({
      lang,
      path,
      type: "article",
      title: service.metaTitle,
      description: service.metaDescription,
      siteName: t.meta.siteName,
      imageAlt: t.alt.og,
    }),
  };
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

          <Container className="flex flex-col justify-center pt-[clamp(3rem,8vh,6rem)] pb-[clamp(3.5rem,9vh,6rem)] lg:min-h-[520px]">
            <Grid>
              <div className="col-span-4 sm:col-span-8 lg:col-span-8">
                <nav aria-label={p.breadcrumbLabel} className="a-fade">
                  <ol className="t-data flex flex-wrap items-center gap-x-2">
                    <li>
                      <Link href={localePath(lang, "/")} className="link-thread transition-colors duration-[160ms] hover:text-fg">
                        {p.home}
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

                <div className="mt-8 flex max-w-[60ch] flex-col gap-5">
                  {service.intro.map((para, i) => (
                    <p key={i} className="t-lead">
                      {para}
                    </p>
                  ))}
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <ButtonPrimary href="#contact" data-hash-link>
                    {p.cta}
                  </ButtonPrimary>
                  <LinkArrow href={`${localePath(lang, "/")}#services`}>{p.allServices}</LinkArrow>
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
            <Reveal>
              <Grid>
                <ol className="col-span-4 sm:col-span-8 lg:col-span-9 lg:col-start-4">
                  {service.signals.map((signal, i) => (
                    <li key={i} className="a-rise" style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}>
                      <Rule />
                      <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 py-6 sm:grid-cols-[5rem_minmax(0,1fr)] lg:py-7">
                        <span className="t-eyebrow pt-[0.45em]">01.{i + 1}</span>
                        <p className="t-title">{signal}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <Rule className="col-span-4 sm:col-span-8 lg:col-span-9 lg:col-start-4" />
              </Grid>
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
            <Reveal>
              <Rule className="bg-rule-strong" />
              <ol>
                {service.deliverables.map((d, i) => (
                  <li key={d.title} className="a-rise" style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}>
                    {i > 0 && <Rule />}
                    <Grid className="gap-y-3 py-8 lg:py-10">
                      <span className="t-eyebrow col-span-4 sm:col-span-8 lg:col-span-2 lg:pt-[0.5em]">02.{i + 1}</span>
                      <h3 className="t-title col-span-4 sm:col-span-8 lg:col-span-4 lg:col-start-3">{d.title}</h3>
                      <p className="t-body col-span-4 text-muted sm:col-span-8 lg:col-span-6 lg:col-start-7">{d.desc}</p>
                    </Grid>
                  </li>
                ))}
              </ol>
              <Rule className="bg-rule-strong" />
            </Reveal>
          </Container>
        </Section>

        {/* ── 03 See it in a sample (ink band, owned by the dashboards kit) ── */}
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
            <Reveal>
              <Grid>
                <div className="col-span-4 sm:col-span-8 lg:col-span-9 lg:col-start-4">
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
              </Grid>
            </Reveal>
          </Container>
        </Section>

        {/* ── 05 Also from DataHub ─────────────────────────────── */}
        <Section id="more-services" labelledBy="others-title">
          <Container>
            <SectionHeader index="05" total={TOTAL} eyebrow={p.others.eyebrow} title={p.others.title} titleId="others-title" />
            <Reveal>
              <ul>
                {others.map((s, i) => (
                  <OtherServiceRow key={s.slug} lang={lang} t={t} slug={s.slug} index={`05.${i + 1}`} first={i === 0} delay={i * 60} />
                ))}
              </ul>
              <Rule className="bg-rule-strong" />
            </Reveal>
          </Container>
        </Section>

        <Contact lang={lang} index="06" total={TOTAL} eyebrow={pagesExtra[lang].servicePage.contactEyebrow} />
      </main>
      <Footer lang={lang} />
      <ActionRail lang={lang} />
    </>
  );
}

/** One full-row link to another service, styled like the home index rows (§6.2). */
function OtherServiceRow({
  lang,
  t,
  slug,
  index,
  first,
  delay,
}: {
  lang: Locale;
  t: Dictionary;
  slug: ServiceSlug;
  index: string;
  /** The first row opens on the strong rule; the rest are separated by hairlines. */
  first: boolean;
  delay: number;
}) {
  const item = t.services.items[ITEM_KEY[slug]];
  return (
    <li className="a-rise" style={{ animationDelay: `${delay}ms` }}>
      <Link
        href={localePath(lang, `/services/${slug}`)}
        className="group relative block focus-visible:outline-offset-[-2px]"
      >
        <Rule className={first ? "bg-rule-strong" : undefined} />
        <span
          aria-hidden="true"
          className="thread absolute inset-x-0 top-[-0.5px] scale-x-0 transition-transform duration-[280ms] ease-[var(--ease-thread)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
        <Grid className="items-start gap-y-3 py-8 lg:py-10">
          <span className="t-eyebrow col-span-3 transition-colors duration-[160ms] group-hover:text-accent group-focus-visible:text-accent sm:col-span-7 lg:col-span-2 lg:pt-[0.6em]">
            {index}
          </span>
          <span
            aria-hidden="true"
            className="col-span-1 text-right font-sans text-xl text-fg transition-transform duration-[280ms] ease-[var(--ease-silk)] group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5 sm:col-span-1 lg:order-last lg:col-span-1 lg:col-start-12"
          >
            →
          </span>
          <h3 className="t-h3 col-span-4 sm:col-span-8 lg:col-span-4 lg:col-start-3">{item.title}</h3>
          <span className="col-span-4 sm:col-span-8 lg:col-span-5 lg:col-start-7">
            <span className="t-body block font-semibold text-fg">{item.tagline}</span>
            <span className="t-body mt-2 block text-muted">{item.description}</span>
            <span className="t-data mt-4 block text-accent">{t.services.readMore}</span>
          </span>
        </Grid>
      </Link>
    </li>
  );
}
