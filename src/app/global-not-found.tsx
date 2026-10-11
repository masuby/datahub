import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { fontVariables } from "./fonts";
import { DEFAULT_LOCALE, LANG_TAG, hasLocale, localePath, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/get-dictionary";
import { MarkSprite } from "@/components/brand/MarkSprite";
import { SocialSprite } from "@/components/brand/SocialSprite";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { SilkField } from "@/components/silk/SilkField";
import { HardLinks } from "@/components/system/HardLinks";
import { RefKeeper } from "@/components/system/RefKeeper";
import { RefScript } from "@/components/system/RefScript";
import { ThemeScript } from "@/components/system/ThemeScript";
import { Container } from "@/components/ui/Container";
import { Grid } from "@/components/ui/Grid";
import { ButtonPrimary } from "@/components/ui/Button";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { SITE_URL } from "@/lib/seo";
import { PRESETS } from "@/lib/silk";
import { cn } from "@/lib/utils";
import styles from "./global-not-found.module.css";

/**
 * The 404, in the visitor's language, for every URL that matches no page —
 * including an unknown service slug or a stray file name like /index.html,
 * which src/proxy.ts sends to a path no route matches.
 *
 * Why a global not-found and not app/[lang]/not-found.tsx: the root layout
 * lives under the [lang] segment, and in Next 16 a notFound() thrown under it
 * on a dynamic page is answered with an empty HTML shell that only draws the
 * 404 in the browser — nothing for crawlers or visitors without JavaScript.
 * This file is rendered on the server at the routing level instead (and, as a
 * bonus, no longer rides along in every page's React payload).
 *
 * It receives no params; src/proxy.ts sets `x-locale` (and the CSP nonce) on
 * every page request, so it knows the language and can run the theme script.
 * Its links are full page loads (see HardLinks): it has its own <html>, and
 * client-side navigation cannot cross into the site's root layout.
 */

const SILK = PRESETS.service;

async function request(): Promise<{ lang: Locale; nonce?: string }> {
  const h = await headers();
  const value = h.get("x-locale");
  return { lang: value && hasLocale(value) ? value : DEFAULT_LOCALE, nonce: h.get("x-nonce") ?? undefined };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F9FE" },
    { media: "(prefers-color-scheme: dark)", color: "#030A1C" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await request();
  const t = (await getDictionary(lang)).meta;
  return {
    metadataBase: new URL(SITE_URL),
    title: t.titleTemplate.replace("%s", t.notFound.title),
    robots: { index: false, follow: true },
  };
}

export default async function GlobalNotFound() {
  const { lang, nonce } = await request();
  const t = await getDictionary(lang);

  return (
    <html lang={LANG_TAG[lang]} suppressHydrationWarning className={fontVariables}>
      <head>
        <ThemeScript nonce={nonce} />
        {/* A dead link from a poster or QR code still carries ?ref=: keep it. */}
        <RefScript nonce={nonce} />
        <HardLinks nonce={nonce} />
      </head>
      <body className="flex min-h-svh flex-col">
        <RefKeeper />
        <MarkSprite />
        <SocialSprite />
        <Header lang={lang} />
        <main id="main" className="flex-1">
          <div className={cn("relative isolate overflow-hidden", styles.hero)}>
            <div
              aria-hidden="true"
              className={cn("silk-layer pointer-events-none absolute inset-0 -z-10 hidden lg:block", styles.silk)}
            >
              {/* Stretched, not sliced: the sink stays on-canvas at any hero height. */}
              <svg viewBox={`0 0 ${SILK.W} ${SILK.H}`} preserveAspectRatio="none" className="block size-full" focusable="false">
                <SilkField preset="service" />
              </svg>
            </div>
            <Container className="flex min-h-[min(calc(100svh-var(--header-h)),760px)] flex-col justify-center py-[clamp(4rem,12vh,8rem)]">
              <Grid>
                <div className="col-span-4 sm:col-span-8 lg:col-span-8">
                  <NotFoundCopy lang={lang} t={t} />
                </div>
              </Grid>
            </Container>
            <div aria-hidden="true" className="silk-layer pointer-events-none relative h-36 sm:h-48 lg:hidden">
              <SilkField preset="service" className="h-full w-full" />
            </div>
          </div>
        </main>
        <Footer lang={lang} />
        <FloatingWhatsApp lang={lang} />
      </body>
    </html>
  );
}

/**
 * The 404's words, like a service page's hero: no rule above the eyebrow
 * (iteration-5 §A), centred on phones and tablets and left of the silk from
 * 1024px (§B).
 */
function NotFoundCopy({ lang, t }: { lang: Locale; t: Dictionary }) {
  const nf = t.notFound;
  const home = localePath(lang, "/");
  return (
    <section aria-labelledby="not-found-title" className="text-center lg:text-left">
      <p className="t-eyebrow a-rise" style={{ animationDelay: "120ms" }}>
        {nf.eyebrow}
      </p>
      <h1 id="not-found-title" className="t-h1-page mt-6 a-rise" style={{ animationDelay: "180ms" }}>
        {nf.title}
      </h1>
      <p className="t-lead mx-auto mt-6 a-rise lg:mx-0" style={{ animationDelay: "240ms" }}>
        {nf.body}
      </p>
      <div
        className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 a-rise lg:justify-start"
        style={{ animationDelay: "300ms" }}
      >
        <ButtonPrimary href={home}>{nf.home}</ButtonPrimary>
        <LinkArrow href={localePath(lang, "/contact")}>{nf.contact}</LinkArrow>
      </div>
    </section>
  );
}
