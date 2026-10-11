import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { notFound } from "next/navigation";
import { hasLocale, LANG_TAG, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { CONTACT_EMAIL } from "@/lib/contact-info";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
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
 * supplies them.
 *
 * The title, date and intro centre like every page header (iteration-5 §B);
 * the notice itself is reading text, so it stays left-aligned in one centred
 * column, its sections separated by R2 rules; no boxes. The email address is
 * a link inside a sentence: it carries the quiet static underline.
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
      className="link-inline font-bold text-fg hover:text-accent"
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
          // Close under the header, like every page's first section (Section).
          style={{ paddingTop: "var(--section-y-first)", paddingBottom: "var(--section-y)" }}
        >
          <Container>
            <Reveal className="mx-auto max-w-[40rem] text-center">
              <h1
                id="privacy-title"
                className="t-h1-page a-rise"
                style={{ animationDelay: "120ms" }}
              >
                {p.title}
              </h1>
              <p
                className="t-data mt-5 a-fade"
                style={{ animationDelay: "180ms" }}
              >
                <time dateTime={UPDATED}>
                  {p.updated.replace("{date}", updated)}
                </time>
              </p>
              <p
                className="t-lead mx-auto mt-6 a-rise"
                style={{ animationDelay: "240ms" }}
              >
                {p.intro}
              </p>
            </Reveal>

            <div className="mx-auto mt-[clamp(2.5rem,1.8rem+3vw,4.5rem)] max-w-[44rem]">
              {p.sections.map((section, i) => {
                const headingId = `privacy-${i + 1}`;
                return (
                  <Reveal key={i}>
                    <section
                      aria-labelledby={headingId}
                      className="pb-10 lg:pb-14"
                    >
                      <Rule variant="section" animate />
                      <p aria-hidden="true" className="t-eyebrow mt-5 lg:mt-6">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h2 id={headingId} className="t-title mt-2">
                        {section.title}
                      </h2>
                      <p className="t-body mt-3 text-muted">
                        {fillNode(section.body, { email })}
                      </p>
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
