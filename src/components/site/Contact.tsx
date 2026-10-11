import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { formExtra } from "@/i18n/extra/form";
import {
  CONTACT_EMAIL,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
  whatsappHref,
} from "@/lib/contact-info";
import { Container } from "@/components/ui/Container";
import { Grid } from "@/components/ui/Grid";
import { Reveal } from "@/components/ui/Reveal";
import { Rule } from "@/components/ui/Rule";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ContactForm } from "./ContactForm";

/**
 * 08 — Contact: the /contact page (`headingLevel` 1 there, where its title
 * is the page's h1 and the headings under it step up to h2).
 *
 * Desktop: direct lines in columns 1–5 (WhatsApp, email, location as R1 rows,
 * then "what happens next"), the form in columns 7–12. Mobile is one column in
 * the order a phone visitor needs it: the WhatsApp row, the form, then email,
 * location and next steps. Grid placement does the reordering, so the DOM
 * (and the tab order) matches the mobile reading order.
 */

const ARROW_MOVE =
  "inline-block transition-transform duration-[280ms] ease-[var(--ease-silk)] group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5";

/** "You are here" thread over a row's top hairline, on hover/focus only. */
const ROW_THREAD =
  "thread pointer-events-none absolute inset-x-0 top-[-1.5px] scale-x-0 transition-transform duration-[280ms] ease-[var(--ease-thread)] group-hover:scale-x-100 group-focus-visible:scale-x-100";

/** Chapter 08 (spec §3.4): the eyebrow's number, and the prefix of the next steps (08.1, 08.2…). */
const INDEX = "08";

export async function Contact({
  lang,
  headingLevel = 2,
}: {
  lang: Locale;
  /** 1 on /contact, where this section is the page. */
  headingLevel?: 1 | 2;
}) {
  const t = await getDictionary(lang);
  const c = t.contact;
  const hasWhatsapp = Boolean(WHATSAPP_NUMBER);
  const SubHeading = headingLevel === 1 ? "h2" : "h3";

  const whatsapp = whatsappHref(lang);
  const whatsappRow = hasWhatsapp && (
    <a
      href={whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center justify-between gap-6 py-6 text-fg"
    >
      <span aria-hidden="true" className={ROW_THREAD} />
      <span className="min-w-0">
        <span className="t-eyebrow block transition-colors duration-[160ms] group-hover:text-accent group-focus-visible:text-accent">
          {c.lines.whatsapp.label}
        </span>
        <span className="t-title tnum mt-2 block whitespace-nowrap">
          {WHATSAPP_DISPLAY}
        </span>
        <span className="t-small mt-1 block text-muted">
          {c.lines.whatsapp.action}
        </span>
        <span className="sr-only"> {t.a11y.opensNewTab}</span>
      </span>
      <span
        aria-hidden="true"
        className={`${ARROW_MOVE} font-sans text-lg leading-none`}
      >
        ↗
      </span>
    </a>
  );

  return (
    <Section id="contact" labelledBy="contact-title">
      <Container>
        <SectionHeader
          index={INDEX}
          eyebrow={c.eyebrow}
          title={c.title}
          titleId="contact-title"
          lead={c.lead}
          headingLevel={headingLevel}
        />

        <Grid className="lg:grid-rows-[auto_1fr]">
          {/* A — WhatsApp first, on every screen size. */}
          {whatsappRow && (
            <div className="col-span-4 sm:col-span-8 lg:col-span-5 lg:row-start-1">
              <Reveal>
                <Rule />
                {whatsappRow}
              </Reveal>
            </div>
          )}

          {/* F — the form: second on phones, columns 7–12 on desktop. */}
          <div
            className={
              "col-span-4 sm:col-span-8 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 " +
              (hasWhatsapp ? "mt-12 lg:mt-0" : "")
            }
          >
            <Reveal>
              <ContactForm
                strings={t.form}
                extra={formExtra[lang]}
                successHeading={SubHeading}
                prefillAnnouncement={t.estimator.added}
                newTabLabel={t.a11y.opensNewTab}
                whatsappHref={whatsapp}
                privacy={{
                  text: c.privacy,
                  linkLabel: c.privacyLink,
                  href: localePath(lang, "/privacy"),
                }}
              />
            </Reveal>
          </div>

          {/* B — email, location, what happens next. */}
          <div className="col-span-4 mt-16 self-start sm:col-span-8 lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:mt-0">
            <Reveal>
              <ul role="list" className="list-none p-0">
                <li>
                  <Rule />
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="group relative flex items-center justify-between gap-6 py-6 text-fg"
                  >
                    <span aria-hidden="true" className={ROW_THREAD} />
                    <span className="min-w-0">
                      <span className="t-eyebrow block transition-colors duration-[160ms] group-hover:text-accent group-focus-visible:text-accent">
                        {c.lines.email.label}
                      </span>
                      <span className="t-title mt-2 block break-words">
                        {CONTACT_EMAIL}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`${ARROW_MOVE} font-sans text-lg leading-none`}
                    >
                      →
                    </span>
                  </a>
                </li>
                <li>
                  <Rule />
                  <div className="py-6">
                    <p className="t-eyebrow">{c.lines.location.label}</p>
                    <p className="t-title mt-2">{c.lines.location.value}</p>
                    <p className="t-small mt-1 text-muted">
                      {c.lines.location.note}
                    </p>
                  </div>
                </li>
              </ul>
              <Rule />

              <SubHeading className="t-eyebrow mt-12 lg:mt-16">{c.next.title}</SubHeading>
              <ol role="list" className="mt-4 list-none p-0">
                {c.next.steps.map((step, i) => (
                  <li
                    key={i}
                    className="a-rise"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {i > 0 && <Rule />}
                    <div className="flex gap-5 py-4">
                      <span
                        className="t-data shrink-0 pt-[0.3em]"
                        aria-hidden="true"
                      >
                        {INDEX}.{i + 1}
                      </span>
                      <p className="t-body text-fg">{step}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </Grid>
      </Container>
    </Section>
  );
}
