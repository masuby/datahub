import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  CONTACT_EMAIL,
  WHATSAPP_NUMBER,
  whatsappHref,
} from "@/lib/contact-info";
import { Container } from "@/components/ui/Container";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { Reveal } from "@/components/ui/Reveal";
import { Rule } from "@/components/ui/Rule";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import styles from "./Faq.module.css";

/**
 * 06 — Questions: the /faq page (`headingLevel` 1 there, where its title is
 * the page's h1). A page of its own, so the eyebrow keeps its chapter number
 * and no "06 / 07" counter.
 *
 * The section header centres (iteration-5 §B); the questions follow in one
 * centred reading column, left-aligned (answers are reading text), and the
 * "not answered here?" line closes the column, centred, with WhatsApp and
 * email. Each question is a native <details> between an R2 above the list
 * and an R2 below it, with R1 hairlines between rows: no boxes, no
 * JavaScript, and find-in-page opens the matching answer. The `+` is two
 * 1.5px lines; the vertical one turns flat when the row opens.
 *
 * The FAQPage JSON-LD is emitted by the page from this same dictionary array
 * (`t.faq.items`), so the markup can never describe questions not shown here.
 */
export async function Faq({ lang, headingLevel = 2 }: { lang: Locale; headingLevel?: 1 | 2 }) {
  const t = await getDictionary(lang);
  const f = t.faq;

  return (
    <Section id="faq" labelledBy="faq-title">
      <Container>
        <SectionHeader index="06" eyebrow={f.eyebrow} title={f.title} titleId="faq-title" headingLevel={headingLevel} />

        <div className="mx-auto max-w-[48rem]">
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
                          {f.indexPrefix} 06.{i + 1}
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

          {/* Not answered here? — centred under the list. */}
          <Reveal className="mt-10 text-center lg:mt-12">
            <p className="t-body text-muted">{f.aside}</p>
            <div className="mt-1 flex flex-wrap justify-center gap-x-8">
              {WHATSAPP_NUMBER && (
                <LinkArrow
                  href={whatsappHref(lang)}
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
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
