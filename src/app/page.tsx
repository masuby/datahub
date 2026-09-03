import { headers } from "next/headers";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { Process } from "@/components/site/Process";
import { WhyUs } from "@/components/site/WhyUs";
import { Founder } from "@/components/site/Founder";
import { Faq, FAQ_ITEMS } from "@/components/site/Faq";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { organizationSchema, websiteSchema, faqSchema } from "@/lib/seo";

// Render dynamically so the per-request CSP nonce (set in proxy.ts) is stamped
// onto the framework scripts. Without this the page would be statically
// prerendered and 'strict-dynamic' would block all scripts in production.
export const dynamic = "force-dynamic";

export default async function Home() {
  // The same nonce proxy.ts put in the CSP header. Applied to the JSON-LD
  // blocks below so a strict script-src cannot drop our structured data.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  const schemas = [
    organizationSchema(),
    websiteSchema(),
    faqSchema(FAQ_ITEMS.map(({ q, a }) => ({ q, a }))),
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          nonce={nonce}
          // React deliberately does not serialise `nonce` to the client, so the
          // server HTML and the client tree always disagree on this attribute.
          // Without this the page logs a hydration mismatch on every load.
          suppressHydrationWarning
          // Serialised server-side from static objects in src/lib/seo.ts — no
          // user input reaches this, so there is nothing to sanitise.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <Process />
        <WhyUs />
        <Founder />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
