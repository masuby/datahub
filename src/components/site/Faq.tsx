import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  CONTACT_EMAIL,
  WHATSAPP_HREF,
  WHATSAPP_NUMBER,
} from "@/lib/contact-info";
import { Container } from "@/components/ui/Container";
import { Grid } from "@/components/ui/Grid";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { Reveal } from "@/components/ui/Reveal";
import { Rule } from "@/components/ui/Rule";
import { Section } from "@/components/ui/Section";
import styles from "./Faq.module.css";

/**
 * 07 — Questions.
 *
 * Desktop: the section header (eyebrow, H2 and the "not answered here?" aside)
 * stays in view in columns 1–4 while the questions scroll past in columns
 * 5–12. Each question is a native <details> between an R2 above the list and
 * an R2 below it, with R1 hairlines between rows: no boxes, no JavaScript, and
 * find-in-page opens the matching answer. The `+` is two 1.5px lines; the
 * vertical one turns flat when the row opens.
 *
 * The FAQPage JSON-LD is emitted by the page from this same dictionary array
 * (`t.faq.items`), so the markup can never describe questions not shown here.
 */
export async function Faq({ lang }: { lang: Locale }) {
  const t = await getDictionary(lang);
  const f = t.faq;

  return (
    <Section id="faq" labelledBy="faq-title">
      <Container>
        <Grid>
          {/* Sticky header column. Sticky sits on the grid item (not inside
              Reveal) so it has the whole row height to travel in. */}
          <div
            className="col-span-4 sm:col-span-8 lg:sticky lg:col-span-4 lg:self-start"
            style={{ top: "calc(var(--header-h) + 32px)" }}
          >
            <Reveal>
              <Rule variant="section" animate />
              <div className="mt-5 flex items-baseline justify-between gap-4 lg:mt-6">
                <p
                  className="t-eyebrow a-rise"
                  style={{ animationDelay: "120ms" }}
                >
                  {f.eyebrow}
                </p>
                <p
                  aria-hidden="true"
                  className="t-eyebrow a-fade"
                  style={{ animationDelay: "120ms" }}
                >
                  07 / 08
                </p>
              </div>
              <h2
                id="faq-title"
                className="t-h2 mt-4 a-rise lg:mt-8"
                style={{ animationDelay: "180ms" }}
              >
                {f.title}
              </h2>
              <div
                className="mt-6 a-rise lg:mt-10"
                style={{ animationDelay: "240ms" }}
              >
                <p className="t-body text-muted">{f.aside}</p>
                <div className="mt-1 flex flex-wrap gap-x-8">
                  {WHATSAPP_NUMBER && (
                    <LinkArrow
                      href={WHATSAPP_HREF}
                      external
                      arrow="↗"
                      newTabLabel={t.a11y.opensNewTab}
                    >
                      {f.asideWhatsapp}
                    </LinkArrow>
                  )}
                  <LinkArrow href={`mailto:${CONTACT_EMAIL}`} arrow="→">
                    {f.asideEmail}
                  </LinkArrow>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="col-span-4 mt-12 sm:col-span-8 sm:mt-16 lg:col-span-8 lg:col-start-5 lg:mt-0">
            <Reveal>
              <Rule variant="section" animate />
              <ul role="list" className="list-none p-0">
                {f.items.map((item, i) => (
                  <li
                    key={i}
                    className="a-rise"
                    style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}
                  >
                    {i > 0 && <Rule />}
                    <details className={`group ${styles.item}`}>
                      <summary
                        className={`${styles.summary} flex min-h-12 cursor-pointer items-start gap-6 py-6 text-fg lg:py-7`}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="t-eyebrow block transition-colors duration-[160ms] group-open:text-accent">
                            {f.indexPrefix} 07.{i + 1}
                          </span>
                          <span className="t-title mt-2 block transition-colors duration-[160ms] group-hover:text-accent">
                            {item.q}
                          </span>
                        </span>
                        {/* The "+": two 1.5px lines, the vertical one rotates flat on open. */}
                        <span
                          aria-hidden="true"
                          className="relative mt-[2.1rem] size-4 shrink-0 lg:mt-[2.3rem]"
                        >
                          <span className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-fg" />
                          <span className="absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 bg-fg transition-transform duration-[280ms] ease-[var(--ease-thread)] group-open:rotate-90" />
                        </span>
                      </summary>
                      <div className="pb-6 pr-10 lg:pb-8">
                        <p className="t-body text-muted">{item.a}</p>
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
              <Rule variant="section" />
            </Reveal>
          </div>
        </Grid>
      </Container>
    </Section>
  );
}
