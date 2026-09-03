import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://datahub.co.tz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    // Kept under ~60 characters so it is not truncated in results, and carries
    // the location, because the queries worth winning are local ones.
    default: "DataHub — Data Analytics & Dashboards in Tanzania",
    template: "%s · DataHub",
  },
  description:
    "Custom dashboards, automated reporting and business intelligence for organisations in Tanzania. Built in Dar es Salaam by data engineer Daniel Clement Masubi.",
  keywords: [
    "data analytics",
    "business dashboards",
    "automation",
    "reporting automation",
    "business intelligence",
    "custom software",
    "software company Tanzania",
    "dashboard developer Dar es Salaam",
    "Tanzania",
  ],
  applicationName: "DataHub",
  authors: [{ name: "Daniel Clement Masubi" }],
  creator: "Daniel Clement Masubi",
  publisher: "DataHub",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "DataHub — Data Analytics & Dashboards in Tanzania",
    description:
      "Custom dashboards, automated reporting and business intelligence for organisations in Tanzania.",
    siteName: "DataHub",
    locale: "en_TZ",
  },
  twitter: {
    card: "summary_large_image",
    title: "DataHub — Data Analytics & Dashboards in Tanzania",
    description:
      "Custom dashboards, automated reporting and business intelligence for organisations in Tanzania.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-TZ"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
