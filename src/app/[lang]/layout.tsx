import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import "../globals.css";
import { fontVariables } from "../fonts";
import { LOCALES, LANG_TAG, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { SITE_URL, shareCard } from "@/lib/seo";
import { InputWatch } from "@/components/system/InputWatch";
import { ThemeScript } from "@/components/system/ThemeScript";
import { MarkSprite } from "@/components/brand/MarkSprite";
import { RefKeeper } from "@/components/system/RefKeeper";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F9FE" },
    { media: "(prefers-color-scheme: dark)", color: "#030A1C" },
  ],
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : "en";
  const dict = await getDictionary(locale);
  const t = dict.meta;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.home.title, template: t.titleTemplate },
    description: t.home.description,
    keywords: [...t.keywords],
    applicationName: t.siteName,
    publisher: t.siteName,
    authors: [{ name: "DataHub" }],
    // The default card; every page replaces it with its own full one.
    ...shareCard({
      lang: locale,
      title: t.home.ogTitle,
      description: t.home.ogDescription,
      siteName: t.siteName,
      imageAlt: dict.alt.og,
    }),
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  // Same nonce src/proxy.ts put in the CSP header; the theme bootstrap is an
  // inline script, so without it a strict script-src would refuse to run it.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang={LANG_TAG[lang]}
      // The theme script sets class and color-scheme before React hydrates.
      suppressHydrationWarning
      className={fontVariables}
    >
      <head>
        <ThemeScript nonce={nonce} />
        <InputWatch nonce={nonce} />
      </head>
      <body className="flex min-h-svh flex-col">
        <RefKeeper />
        <MarkSprite />
        {children}
      </body>
    </html>
  );
}
