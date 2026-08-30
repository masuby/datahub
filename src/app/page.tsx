import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { Process } from "@/components/site/Process";
import { WhyUs } from "@/components/site/WhyUs";
import { Founder } from "@/components/site/Founder";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

// Render dynamically so the per-request CSP nonce (set in proxy.ts) is stamped
// onto the framework scripts. Without this the page would be statically
// prerendered and 'strict-dynamic' would block all scripts in production.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <Process />
        <WhyUs />
        <Founder />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
