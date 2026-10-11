import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { notFound } from "next/navigation";
import { hasLocale, LANG_TAG, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { CONTACT_EMAIL } from "@/lib/contact-info";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Grid } from "@/components/ui/Grid";
import { Reveal } from "@/components/ui/Reveal";
import { Rule } from "@/components/ui/Rule";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ActionRail } from "@/components/site/ActionRail";
import { LangHint } from "@/components/system/LangHint";

/**
 * Privacy notice (/privacy, /sw/privacy) — spec §12.
 *
 * Facts only, in the page's language: what the form collects, the hashed IP
 * used for rate limiting, why, no sale or sharing, how to ask for deletion,
 * written with Tanzania's Personal Data Protection Act, 2022 in mind. No
 * retention period, storage location or named officer until the owner
 * supplies them. Sections are separated by R2 rules; no boxes.
 */

// Dynamic like every other page, so the per-request CSP nonce reaches the
// framework scripts (a prerendered page could not carry it).
export const dynamic = "force-dynamic";

/** The date this notice last changed. Update it whenever the copy changes. */
const UPDATED = "2026-10-11";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const t = dict.meta.privacy;
  return pageMetadata({
    lang,
    path: "/privacy",
    title: t.title,
    description: t.description,
    siteName: dict.meta.siteName,
    titleTemplate: dict.meta.titleTemplate,
    imageAlt: dict.alt.og,
  });
}

/** "10 October 2026" / "10 Oktoba 2026". Server-rendered only, so no hydration drift. */
function formatDate(iso: string, lang: Locale): string {
  try {
    return new Intl.DateTimeFormat(LANG_TAG[lang], {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Africa/Dar_es_Salaam",
    }).format(new Date(`${iso}T12:00:00+03:00`));
  } catch {
    return iso;
  }
}

/** Fills `{slot}` placeholders with nodes, so the email can be a link inside the sentence. */
function fillNode(
  template: string,
  slots: Record<string, ReactNode>,
): ReactNode[] {
  return template.split(/(\{\w+\})/g).map((part, i) => {
    const m = /^\{(\w+)\}$/.exec(part);
    return (
      <Fragment key={i}>{m && m[1] in slots ? slots[m[1]] : part}</Fragment>
    );
  });
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const p = t.privacy;

  const email = (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      className="link-thread font-semibold text-fg transition-colors duration-[160ms] hover:text-accent"
    >
      {CONTACT_EMAIL}
    </a>
  );
  const updated = formatDate(UPDATED, lang);

  return (
    <>
      <Header lang={lang} />
      <LangHint lang={lang} />
      <main id="main" className="flex-1">
        <article
          aria-labelledby="privacy-title"
          style={{ paddingBlock: "var(--section-y)" }}
        >
          <Container>
            <Reveal>
              <Rule variant="section" animate />
              <Grid className="mt-8 lg:mt-12">
                <div className="col-span-4 sm:col-span-8 lg:col-span-9">
                  <h1
                    id="privacy-title"
                    className="t-h1-page a-rise"
                    style={{ animationDelay: "120ms" }}
                  >
                    {p.title}
                  </h1>
                  <p
                    className="t-data mt-6 a-fade"
                    style={{ animationDelay: "180ms" }}
                  >
                    <time dateTime={UPDATED}>
                      {p.updated.replace("{date}", updated)}
                    </time>
                  </p>
                  <p
                    className="t-lead mt-8 a-rise"
                    style={{ animationDelay: "240ms" }}
                  >
                    {p.intro}
                  </p>
                </div>
              </Grid>
            </Reveal>

            <div className="mt-[clamp(3rem,2rem+4vw,6rem)]">
              {p.sections.map((section, i) => {
                const headingId = `privacy-${i + 1}`;
                return (
                  <Reveal key={i}>
                    <section
                      aria-labelledby={headingId}
                      className="pb-10 lg:pb-14"
                    >
                      <Rule variant="section" animate />
                      <Grid className="mt-5 lg:mt-6">
                        <p
                          aria-hidden="true"
                          className="t-eyebrow col-span-4 sm:col-span-2 lg:col-span-1 lg:pt-[0.55em]"
                        >
                          {String(i + 1).padStart(2, "0")}
                        </p>
                        <h2
                          id={headingId}
                          className="t-title col-span-4 mt-2 sm:col-span-6 sm:mt-0 lg:col-span-3"
                        >
                          {section.title}
                        </h2>
                        <p className="t-body col-span-4 mt-4 text-muted sm:col-span-6 sm:col-start-3 lg:col-span-7 lg:col-start-6 lg:mt-0 lg:pt-[0.2em]">
                          {fillNode(section.body, { email })}
                        </p>
                      </Grid>
                    </section>
                  </Reveal>
                );
              })}
              <Rule variant="section" />
            </div>
          </Container>
        </article>
      </main>
      <Footer lang={lang} />
      <ActionRail lang={lang} />
    </>
  );
}
