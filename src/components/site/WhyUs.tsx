import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Container } from "@/components/ui/Container";
import { Grid } from "@/components/ui/Grid";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { Reveal } from "@/components/ui/Reveal";
import { Rule } from "@/components/ui/Rule";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { describeCsp } from "@/lib/csp";
import { cn } from "@/lib/utils";
import styles from "./WhyUs.module.css";

/** Plain outbound link: securityheaders.com grades the live site's headers. */
const SECURITY_HEADERS_URL = "https://securityheaders.com/?q=datahub.co.tz&followRedirects=on";

/** Most staggered steps a reveal uses (6 × 60ms = 360ms), per the motion rules. */
const MAX_STAGGER = 6;

/**
 * "Scripts: only our own. …" → ["Scripts:", " only our own. …"], so the
 * subject of each colophon line can be set in the stronger weight. Lines
 * without a short leading label render whole.
 */
function splitLabel(line: string): [string | null, string] {
  const i = line.indexOf(":");
  return i > 0 && i <= 40 ? [line.slice(0, i + 1), line.slice(i + 1)] : [null, line];
}

/** R2 between the three parts: the section rule without its thread. */
function SubRule() {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className="my-[clamp(3.5rem,2.4rem+4vw,6rem)] block h-px w-full bg-rule-strong"
    />
  );
}

/**
 * 05 — Why DataHub and security. Three parts under one header:
 *
 * 1. Ledger — "Today" struck through beside "With DataHub". The strike is
 *    drawn, not marked up as <del>, so screen readers hear each item plainly
 *    after a "Today:" / "With DataHub:" prefix. Below 640px that prefix is a
 *    visible eyebrow above each item (the column header row is hidden there);
 *    from 640px it is sr-only and the aria-hidden header row labels the columns.
 * 2. "Your data stays yours" — statement plus a definition list of practices.
 * 3. "Proof on this page" — claims a visitor can verify about this site, the
 *    exact Content-Security-Policy from src/lib/csp.ts (production policy, the
 *    per-request nonce redacted — the live nonce is never rendered), and a
 *    link to check the headers independently.
 */
export async function WhyUs({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  const t = dict.security;
  const titleId = "security-title";
  const policy = describeCsp().join(";\n");

  return (
    <Section id="security" labelledBy={titleId}>
      <Container>
        <SectionHeader index="05" eyebrow={t.eyebrow} title={t.title} titleId={titleId} lead={t.lead} />

        {/* 1 · Ledger */}
        <Reveal>
          <div className="relative">
            <span aria-hidden="true" className={styles.divider} />

            <div aria-hidden="true" className="hidden pb-4 sm:block">
              <Grid>
                <p className="t-eyebrow col-span-4 lg:col-span-6">{t.ledger.todayHeading}</p>
                <p className="t-eyebrow col-span-4 lg:col-span-6">{t.ledger.withHeading}</p>
              </Grid>
            </div>

            <ul className="list-none">
              {t.ledger.rows.map((row, i) => (
                <li key={row.with}>
                  <Rule variant="hair" />
                  <Grid className="py-5 lg:py-6">
                    <div className="col-span-4 lg:col-span-6 sm:pr-4">
                      {/* Visible label on phones (the column header row is
                          hidden below 640px); sr-only from 640px up. */}
                      <span className="t-eyebrow mb-2 block sm:sr-only">
                        {t.ledger.todayHeading}
                        <span className="sr-only">: </span>
                      </span>
                      <p className="t-body">
                        <span
                          className={styles.struck}
                          style={{ animationDelay: `${Math.min(i, MAX_STAGGER) * 60}ms` }}
                        >
                          {row.today}
                        </span>
                      </p>
                    </div>
                    <div className="col-span-4 mt-4 sm:mt-0 lg:col-span-6">
                      <span className="t-eyebrow mb-2 block sm:sr-only">
                        {t.ledger.withHeading}
                        <span className="sr-only">: </span>
                      </span>
                      <p className="t-body flex gap-3 text-fg">
                        <span aria-hidden="true" className="shrink-0 font-semibold text-ok">
                          ✓
                        </span>
                        <span>{row.with}</span>
                      </p>
                    </div>
                  </Grid>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <SubRule />

        {/* 2 · Your data stays yours */}
        <Reveal>
          <Grid>
            <div className="col-span-4 sm:col-span-8 lg:col-span-5">
              <h3 className="t-h3 lg:pr-6">{t.data.title}</h3>
              <p className="t-body mt-5 text-muted lg:pr-6">{t.data.body}</p>
            </div>

            <dl className="col-span-4 mt-10 sm:col-span-8 lg:col-span-7 lg:col-start-6 lg:mt-0">
              {t.data.items.map((item) => (
                <div
                  key={item.term}
                  className={cn(
                    styles.rowRule,
                    "grid grid-cols-4 py-4 sm:grid-cols-8 lg:grid-cols-7 lg:py-5",
                  )}
                  style={{ columnGap: "var(--col-gap)" }}
                >
                  <dt className="t-small col-span-4 font-semibold text-fg sm:col-span-3 lg:col-span-3 lg:pt-[0.15em]">
                    {item.term}
                  </dt>
                  <dd className="t-body col-span-4 mt-1 text-muted sm:col-span-5 sm:mt-0 lg:col-span-4">
                    {item.definition}
                  </dd>
                </div>
              ))}
            </dl>
          </Grid>
        </Reveal>

        <SubRule />

        {/* 3 · Proof on this page */}
        <Reveal>
          <Grid>
            <div className="col-span-4 sm:col-span-8 lg:col-span-3">
              <h3 className="t-eyebrow">{t.proof.title}</h3>
            </div>

            <div className="col-span-4 mt-5 sm:col-span-8 lg:col-span-8 lg:col-start-4 lg:mt-0">
              <p className="t-lead">{t.proof.lead}</p>

              <ul className="mt-8 list-none">
                {t.proof.lines.map((line) => {
                  const [label, rest] = splitLabel(line);
                  return (
                    <li key={line} className={cn(styles.rowRule, "t-body py-4 text-muted")}>
                      {label && <strong className="font-semibold text-fg">{label}</strong>}
                      {rest}
                    </li>
                  );
                })}
              </ul>

              <details className="group mt-6">
                <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 font-sans text-[0.9375rem] font-semibold text-fg transition-colors duration-[160ms] hover:text-accent [&::-webkit-details-marker]:hidden">
                  <span className="link-thread pb-0.5 group-open:[background-size:100%_2px]">
                    {t.proof.showPolicy}
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-[280ms] ease-[var(--ease-silk)] group-open:rotate-180"
                  >
                    ↓
                  </span>
                </summary>
                <div className={cn(styles.policyBlock, "mt-4")}>
                  <p className="t-small text-muted">{t.proof.policyNote}</p>
                  <pre className={cn(styles.policy, "t-mono mt-4 text-fg")}>
                    <code>{policy}</code>
                  </pre>
                </div>
              </details>

              <LinkArrow
                href={SECURITY_HEADERS_URL}
                external
                arrow="↗"
                newTabLabel={dict.a11y.opensNewTab}
                className="mt-4"
              >
                {t.proof.check}
              </LinkArrow>
            </div>
          </Grid>
        </Reveal>
      </Container>
    </Section>
  );
}
