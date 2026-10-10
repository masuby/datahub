import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { LOCALES, LANG_TAG, OG_LOCALE, hasLocale } from "@/i18n/config";
import { ThemeScript } from "@/components/system/ThemeScript";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.datahub.co.tz";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : "en";
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "DataHub — Data Analytics & Dashboards in Tanzania",
      template: "%s · DataHub",
    },
    applicationName: "DataHub",
    publisher: "DataHub",
    openGraph: { type: "website", siteName: "DataHub", locale: OG_LOCALE[locale] },
    twitter: { card: "summary_large_image" },
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript nonce={nonce} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
