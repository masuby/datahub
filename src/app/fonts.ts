import { Outfit, Manrope, Geist_Mono } from "next/font/google";

/**
 * Outfit is the closest Google face to the DataHub wordmark (heavy geometric,
 * single-storey "a") and carries every heading. Manrope's double-storey "a"
 * keeps a-dense Kiswahili readable at body size. Geist Mono sets the labels
 * and figures. All self-hosted by next/font, so the CSP keeps font-src 'self'.
 *
 * Shared by the root layout and the global 404, which renders its own <html>.
 */
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap", preload: false });

/** Class names that define the three font variables; put on <html>. */
export const fontVariables = `${outfit.variable} ${manrope.variable} ${mono.variable}`;
