import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { servicesFor } from "@/lib/services";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Rule } from "@/components/ui/Rule";
import { ServiceGlyph, type GlyphKind } from "./ServiceGlyph";

/**
 * 01 — What we do.
 *
 * The three services as one ledger of links: rows between an R2 above and an
 * R2 below, R1 hairlines between them. Each row is a single <a> (the whole row
 * is the hit area) containing its <h3>; the link's name comes from its content,
 * so every screen reader hears the tagline, description and deliverables too.
 * The section reveal comes only from <Reveal> (§4.3: rows move on hover/focus
 * only). On hover/focus a thread draws over the row's top rule, the index
 * turns accent, the arrow moves 6px and the glyph strokes draw. No boxes: the
 * only lines are the horizontal rules, never more than one per row.
 *
 * Home-page summaries come from the dictionary; deliverable labels come from
 * the locale's service content (`servicesFor(lang)`), so both languages list
 * exactly what the service page promises.
 */

/** Service slug → dictionary item key. Slugs never change (SEO URLs). */
const ITEM_KEY = {
  dashboards: "dashboards",
  automation: "automation",
  "ai-agents": "aiAgents",
} as const satisfies Record<GlyphKind, string>;

const isGlyphKind = (slug: string): slug is GlyphKind => slug in ITEM_KEY;

const ARROW_MOVE =
  "inline-block transition-transform duration-[280ms] ease-[var(--ease-silk)] group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5";

export async function Services({ lang }: { lang: Locale }) {
  const t = await getDictionary(lang);
  const s = t.services;
  const rows = servicesFor(lang).filter((svc) => isGlyphKind(svc.slug));

  return (
    <Section id="services" labelledBy="services-title">
      <Container>
        <SectionHeader index="01" eyebrow={s.eyebrow} title={s.title} titleId="services-title" lead={s.lead} />

        <Reveal>
          <ol className="list-none p-0" role="list">
            {rows.map((svc, i) => {
              const kind = svc.slug as GlyphKind;
              const item = s.items[ITEM_KEY[kind]];
              const titleId = `service-${svc.slug}-title`;
              return (
                <li key={svc.slug}>
                  {/* Top rule of the row: R2 for the first row, R1 between rows. */}
                  <Rule variant={i === 0 ? "section" : "hair"} />
                  <Link
                    href={localePath(lang, `/services/${svc.slug}`)}
                    className="group relative grid grid-cols-4 py-8 text-fg sm:grid-cols-8 sm:py-10 lg:grid-cols-12"
                    style={{ columnGap: "var(--col-gap)" }}
                  >
                    {/* "You are here" thread: draws over the row's top rule. */}
                    <span
                      aria-hidden="true"
                      className="thread pointer-events-none absolute inset-x-0 top-[-1.5px] scale-x-0 transition-transform duration-[280ms] ease-[var(--ease-thread)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    />

                    {/* Index (+ arrow on phones) */}
                    <p className="col-span-4 flex items-baseline justify-between sm:col-span-2 sm:block sm:pt-2">
                      <span className="t-eyebrow transition-colors duration-[160ms] group-hover:text-accent group-focus-visible:text-accent">
                        {item.index}
                      </span>
                      <span aria-hidden="true" className={`${ARROW_MOVE} t-small font-semibold sm:hidden`}>
                        →
                      </span>
                    </p>

                    {/* Title */}
                    <h3
                      id={titleId}
                      className="t-h3 col-span-4 mt-4 sm:col-span-6 sm:mt-0 lg:col-span-4 lg:pr-6"
                    >
                      {item.title}
                    </h3>

                    {/* Tagline, description, deliverables */}
                    <div className="col-span-4 mt-6 sm:col-span-4 sm:col-start-3 sm:mt-6 lg:col-span-4 lg:col-start-7 lg:mt-2">
                      <p className="t-body font-semibold text-fg">
                        {item.tagline}
                      </p>
                      <p className="t-body mt-2 text-muted">{item.description}</p>
                      {svc.deliverables.length > 0 && (
                        <ul className="t-data mt-4 list-none p-0" role="list">
                          {svc.deliverables.map((d) => (
                            <li
                              key={d.title}
                              className="relative pl-[1.5ch] before:absolute before:left-0 before:content-['–'] sm:inline sm:pl-0 sm:before:content-none sm:[&:not(:last-child)]:after:content-['\00a0·_']"
                            >
                              {d.title}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Glyph above "Read more →" (tablet and up) */}
                    <div className="hidden sm:col-span-2 sm:col-start-7 sm:mt-6 sm:flex sm:flex-col sm:items-end sm:justify-between sm:gap-6 lg:col-span-2 lg:col-start-11 lg:mt-2">
                      <ServiceGlyph kind={kind} label={item.glyphLabel} />
                      <span aria-hidden="true" className="t-small inline-flex items-center gap-2 font-semibold whitespace-nowrap text-fg">
                        {s.readMore}
                        <span className={ARROW_MOVE}>→</span>
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
          <Rule variant="section" />
        </Reveal>
      </Container>
    </Section>
  );
}
