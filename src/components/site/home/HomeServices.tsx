import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pagesExtra } from "@/i18n/extra/pages";
import { servicesFor } from "@/lib/services";
import { Container } from "@/components/ui/Container";
import { Grid } from "@/components/ui/Grid";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { Reveal } from "@/components/ui/Reveal";
import { Rule } from "@/components/ui/Rule";
import { Section } from "@/components/ui/Section";
import { SERVICE_ITEM_KEY } from "../Services";

/** The row arrow's 6px move; each arrow sets its own display (one shows on phones, one from 1024px). */
const ARROW_MOVE =
  "transition-transform duration-[280ms] ease-[var(--ease-silk)] group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5";

/**
 * Home · 01 — What we do, short: an R2 opener and a small heading (the
 * eyebrow, as in the reasons row: the section title, "Three ways we turn
 * data into decisions", stays on /services rather than repeating the hero
 * line right under it), the three services as one ledger of links, one line
 * each (the tagline), then "All services →" to /services, where each one is
 * described in full.
 *
 * Each row opens on its own R1 and a closing R1 ends the ledger; each row is
 * one link (the whole row is the hit area) holding its <h3>. On hover/focus
 * a thread draws over the row's top rule, the index turns accent and the
 * arrow moves 6px. Desktop: index in cols 1–3 under the heading, title in
 * cols 4–7, tagline in cols 8–11, arrow in col 12. Tablets: index and arrow
 * on one line, then title and tagline side by side. Phones, where the home
 * page must stay short: index, title and arrow on one line (the
 * index-and-arrow wrapper steps aside with `display: contents`), the tagline
 * under the title.
 */
export async function HomeServices({ lang }: { lang: Locale }) {
  const t = await getDictionary(lang);
  const s = t.services;
  const x = pagesExtra[lang].home;
  const rows = servicesFor(lang);

  return (
    <Section id="services" labelledBy="services-title" compact>
      <Container>
        <Reveal>
          <Rule variant="section" animate />
          <h2 id="services-title" className="t-eyebrow mt-5 a-rise lg:mt-6" style={{ animationDelay: "120ms" }}>
            {s.eyebrow}
          </h2>
          <ol role="list" className="mt-4 list-none p-0 lg:mt-8">
            {rows.map((svc) => {
              const item = s.items[SERVICE_ITEM_KEY[svc.slug]];
              return (
                <li key={svc.slug}>
                  {/* The row's top rule, which its thread draws over. */}
                  <Rule />
                  <Link
                    href={localePath(lang, `/services/${svc.slug}`)}
                    className="group relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-baseline py-3.5 text-fg sm:grid-cols-8 sm:py-5 lg:grid-cols-12 lg:py-6"
                    style={{ columnGap: "var(--col-gap)" }}
                  >
                    <span
                      aria-hidden="true"
                      className="thread pointer-events-none absolute inset-x-0 top-[-1.5px] scale-x-0 transition-transform duration-[280ms] ease-[var(--ease-thread)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    />
                    <span className="contents sm:col-span-8 sm:flex sm:items-baseline sm:justify-between lg:col-span-3 lg:block">
                      <span className="t-eyebrow col-start-1 row-start-1 transition-colors duration-[160ms] group-hover:text-accent group-focus-visible:text-accent">
                        {item.index}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`${ARROW_MOVE} t-small col-start-3 row-start-1 inline-block font-semibold lg:hidden`}
                      >
                        →
                      </span>
                    </span>
                    <h3 className="t-title col-start-2 row-start-1 sm:col-span-4 sm:col-start-auto sm:row-start-auto sm:mt-2 lg:col-span-4 lg:col-start-4 lg:mt-0">
                      {item.title}
                    </h3>
                    <span className="t-body col-span-2 col-start-2 row-start-2 mt-1 text-muted sm:col-span-4 sm:col-start-auto sm:row-start-auto sm:mt-2 lg:col-span-4 lg:col-start-8 lg:mt-0">
                      {item.tagline}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`${ARROW_MOVE} hidden text-right font-sans text-xl lg:col-start-12 lg:block`}
                    >
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
          <Rule />
          <Grid className="mt-4">
            <div className="col-span-4 sm:col-span-8 lg:col-span-9 lg:col-start-4">
              <LinkArrow href={localePath(lang, "/services")}>{x.servicesAll}</LinkArrow>
            </div>
          </Grid>
        </Reveal>
      </Container>
    </Section>
  );
}
