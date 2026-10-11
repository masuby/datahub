import { Poppins, Lato, Geist_Mono } from "next/font/google";

/**
 * Poppins carries every heading and the UI labels (geometric, single-storey
 * "a", like the DataHub wordmark): 500 for labels, 600 for headings, 700 for
 * the wordmark. Lato sets the body; it has no 500 or 600, so body text is 400
 * or 700. Geist Mono sets the labels and figures. The owner's pairing
 * (iteration-5 §F). All self-hosted by next/font, so the CSP keeps
 * font-src 'self'.
 *
 * Neither family is variable on Google Fonts: each weight is a file, so only
 * the weights the type scale uses are loaded.
 *
 * Shared by the root layout and the global 404, which renders its own <html>.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-lato", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap", preload: false });

/** Class names that define the three font variables; put on <html>. */
export const fontVariables = `${poppins.variable} ${lato.variable} ${mono.variable}`;
