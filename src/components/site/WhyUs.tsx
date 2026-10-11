import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pagesExtra } from "@/i18n/extra/pages";
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

/**
 * The space before parts 2 and 3: space alone sets them apart — no rule
 * above a heading (iteration-5 §A).
 */
const PART_GAP = "mt-[clamp(3.5rem,2.4rem+4vw,6rem)]";

/**
 * 04 — Security: the /security page (`headingLevel` 1 there, where its
 * title is the page's h1 and the parts' headings are h2). It opens
 * on what the nav item, the page title and the home page's "Security first"
 * promise:
 *
 * 1. "Your data stays yours" — the statement as the section title, its
 *    paragraph as the lead, then the practices as a definition list of short
 *    centred items (three across from 1024px, two from 640px).
 * 2. "Proof on this page" — a centred heading and lead, then claims a visitor
 *    can verify about this site in a centred reading column (left-aligned:
 *    they run to several lines), the exact Content-Security-Policy from
 *    src/lib/csp.ts (production policy, the per-request nonce redacted — the
 *    live nonce is never rendered), and a link to check the headers
 *    independently.
 * 3. Ledger — "Today" struck through beside "With DataHub", under its own
 *    centred heading, each item centred in its half. The strike is drawn,
 *    not marked up as <del>, so screen readers hear each item plainly after
 *    a "Today:" / "With DataHub:" prefix. Below 640px that prefix is a
 *    visible eyebrow above each item (the column header row is hidden
 *    there); from 640px it is sr-only and the aria-hidden header row labels
 *    the columns.
 */
export async function WhyUs({ lang, headingLevel = 2 }: { lang: Locale; headingLevel?: 1 | 2 }) {
  const dict = await getDictionary(lang);
  const t = dict.security;
  const titleId = "security-title";
  const PartHeading = headingLevel === 1 ? "h2" : "h3";
  const policy = describeCsp().join(";\n");

  return (
    <Section id="security" labelledBy={titleId}>
      <Container>
        <SectionHeader
          index="04"
          eyebrow={pagesExtra[lang].security.eyebrow}
          title={t.data.title}
          titleId={titleId}
          lead={t.data.body}
          headingLevel={headingLevel}
        />

        {/* 1 · Your data stays yours: the practices, under the title */}
        <Reveal>
          <dl className={styles.practices}>
            {t.data.items.map((item, i) => (
              <div
                key={item.term}
                className={cn(styles.practice, "a-rise")}
                style={{ animationDelay: `${Math.min(i, MAX_STAGGER) * 60}ms` }}
              >
                <dt className="t-title text-fg">{item.term}</dt>
                <dd className="t-body mt-2 max-w-[30ch] text-muted">{item.definition}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* 2 · Proof on this page: centred heading and lead, then a centred
            reading column. */}
        <Reveal className={PART_GAP}>
          <div className="text-center">
            <PartHeading className="t-eyebrow">{t.proof.title}</PartHeading>
            <p className="t-lead mx-auto mt-5">{t.proof.lead}</p>
          </div>

          <div className="mx-auto mt-8 max-w-[44rem]">
            <ul className="list-none">
              {t.proof.lines.map((line) => {
                const [label, rest] = splitLabel(line);
                return (
                  <li key={line} className={cn(styles.rowRule, "t-body py-4 text-muted")}>
                    {label && <strong className="font-bold text-fg">{label}</strong>}
                    {rest}
                  </li>
                );
              })}
            </ul>

            <details className="group mt-6">
              <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 font-display text-sm font-semibold tracking-[0.01em] text-fg transition-colors duration-[160ms] hover:text-accent [&::-webkit-details-marker]:hidden">
                <span>{t.proof.showPolicy}</span>
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
        </Reveal>

        {/* 3 · Ledger: each item centred in its half */}
        <Reveal className={PART_GAP}>
          <PartHeading className="t-h3 mx-auto max-w-[26ch] text-center">{t.title}</PartHeading>
          <div className="relative mt-10 lg:mt-14">
            <span aria-hidden="true" className={styles.divider} />

            <div aria-hidden="true" className="hidden pb-4 text-center sm:block">
              <Grid>
                <p className="t-eyebrow col-span-4 lg:col-span-6">{t.ledger.todayHeading}</p>
                <p className="t-eyebrow col-span-4 lg:col-span-6">{t.ledger.withHeading}</p>
              </Grid>
            </div>

            <ul className="list-none">
              {t.ledger.rows.map((row, i) => (
                <li key={row.with}>
                  <Rule variant="hair" />
                  <Grid className="py-5 text-center lg:py-6">
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
                      <p className="t-body flex justify-center gap-3 text-fg">
                        <span aria-hidden="true" className="shrink-0 font-bold text-ok">
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
      </Container>
    </Section>
  );
}
