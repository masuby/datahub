import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Outfit, Manrope, Geist_Mono } from "next/font/google";
import "../globals.css";
import { LOCALES, LANG_TAG, OG_LOCALE, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { ThemeScript } from "@/components/system/ThemeScript";
import { RefKeeper } from "@/components/system/RefKeeper";

/**
 * Outfit is the closest Google face to the DataHub wordmark (heavy geometric,
 * single-storey "a") and carries every heading. Manrope's double-storey "a"
 * keeps a-dense Kiswahili readable at body size. Geist Mono sets the labels
 * and figures. All self-hosted by next/font, so the CSP keeps font-src 'self'.
 */
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap", preload: false });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.datahub.co.tz";

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
  const t = (await getDictionary(locale)).meta;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.home.title, template: t.titleTemplate },
    description: t.home.description,
    keywords: [...t.keywords],
    applicationName: t.siteName,
    publisher: t.siteName,
    authors: [{ name: "DataHub" }],
    openGraph: {
      type: "website",
      siteName: t.siteName,
      locale: OG_LOCALE[locale],
      title: t.home.ogTitle,
      description: t.home.ogDescription,
    },
    twitter: { card: "summary_large_image", title: t.home.ogTitle, description: t.home.ogDescription },
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
      className={`${outfit.variable} ${manrope.variable} ${mono.variable}`}
    >
      <head>
        <ThemeScript nonce={nonce} />
      </head>
      <body className="flex min-h-svh flex-col">
        <RefKeeper />
        {children}
      </body>
    </html>
  );
}
