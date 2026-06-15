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
    default: "DataHub — Data Analytics, Dashboards & Automation",
    template: "%s · DataHub",
  },
  description:
    "DataHub builds custom dashboards, automated reporting, and high-quality software that streamlines your operations end to end — turning scattered data into clear, actionable insight.",
  keywords: [
    "data analytics",
    "business dashboards",
    "automation",
    "reporting automation",
    "business intelligence",
    "custom software",
    "Tanzania",
  ],
  authors: [{ name: "DataHub" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "DataHub — Data Analytics, Dashboards & Automation",
    description:
      "Custom dashboards, automated reporting, and high-quality software that streamlines your operations end to end.",
    siteName: "DataHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "DataHub — Data Analytics, Dashboards & Automation",
    description:
      "Custom dashboards, automated reporting, and high-quality software that streamlines your operations end to end.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
