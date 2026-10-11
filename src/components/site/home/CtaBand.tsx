import { Fragment, type ReactNode } from "react";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pagesExtra } from "@/i18n/extra/pages";
import { CONTACT_EMAIL, WHATSAPP_DISPLAY, WHATSAPP_NUMBER, whatsappHref } from "@/lib/contact-info";
import { ButtonPrimary } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Grid } from "@/components/ui/Grid";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/** Fills `{slot}` placeholders with nodes, so a link can sit inside a translated sentence. */
function fillNode(template: string, slots: Record<string, ReactNode>): ReactNode[] {
  return template.split(/(\{\w+\})/g).map((part, i) => {
    const m = /^\{(\w+)\}$/.exec(part);
    return <Fragment key={i}>{m && m[1] in slots ? slots[m[1]] : part}</Fragment>;
  });
}

const INLINE_LINK = "link-thread font-semibold text-fg transition-colors duration-[160ms] hover:text-accent";

/**
 * The closing call to action of the home page, the service pages and the
 * other standalone pages: an R2 opener, one line, "Start a conversation" →
 * /contact, and the WhatsApp line (the email line when no number is
 * configured). The contact page itself carries the full form instead.
 *
 * Desktop: the line in cols 1–7, the action in cols 9–12 on its baseline.
 * Phones: stacked.
 */
export async function CtaBand({ lang }: { lang: Locale }) {
  const t = await getDictionary(lang);
  const title = pagesExtra[lang].cta.title;

  const alt = WHATSAPP_NUMBER
    ? fillNode(t.form.whatsappAlt, {
        number: (
          <a href={whatsappHref(lang)} target="_blank" rel="noopener noreferrer" className={INLINE_LINK}>
            <span className="tnum whitespace-nowrap">{WHATSAPP_DISPLAY}</span>
            <span className="sr-only"> {t.a11y.opensNewTab}</span>
          </a>
        ),
      })
    : fillNode(t.form.whatsappAltNoNumber, {
        email: (
          <a href={`mailto:${CONTACT_EMAIL}`} className={INLINE_LINK}>
            {CONTACT_EMAIL}
          </a>
        ),
      });

  return (
    <Section id="start" labelledBy="start-title" compact>
      <Container>
        <Reveal>
          {/* The short brand thread that opens every home section (iteration-3
              §C: no full-width horizontal rules after the hero). */}
          <span aria-hidden="true" className="thread a-draw-x block w-8" />
          <Grid className="mt-8 items-end gap-y-8 lg:mt-12">
            <h2
              id="start-title"
              className="t-h2 col-span-4 a-rise sm:col-span-8 lg:col-span-7"
              style={{ animationDelay: "120ms" }}
            >
              {title}
            </h2>
            <div
              className="col-span-4 flex flex-col items-start gap-4 a-rise sm:col-span-8 lg:col-span-4 lg:col-start-9"
              style={{ animationDelay: "180ms" }}
            >
              <ButtonPrimary href={localePath(lang, "/contact")}>{t.header.cta}</ButtonPrimary>
              <p className="t-small text-muted">{alt}</p>
            </div>
          </Grid>
        </Reveal>
      </Container>
    </Section>
  );
}
