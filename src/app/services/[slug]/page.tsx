import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { Contact } from "@/components/site/Contact";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedDots } from "@/components/ui/AnimatedDots";
import { SERVICES, getService } from "@/lib/services";
import { SITE_URL, faqSchema, serviceSchema, breadcrumbSchema } from "@/lib/seo";

// Same reason as the homepage: the per-request CSP nonce from proxy.ts has to be
// stamped onto the framework scripts, which a prerendered page cannot receive.
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  const url = `${SITE_URL}/services/${service.slug}`;
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      type: "article",
      url,
      title: service.metaTitle,
      description: service.metaDescription,
      siteName: "DataHub",
      locale: "en_TZ",
    },
    twitter: {
      card: "summary_large_image",
      title: service.metaTitle,
      description: service.metaDescription,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const others = SERVICES.filter((s) => s.slug !== service.slug);

  const schemas = [
    serviceSchema(service),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: service.navLabel, url: `${SITE_URL}/services/${service.slug}` },
    ]),
    faqSchema(service.faq, `${SITE_URL}/services/${service.slug}#faq`),
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
          <AnimatedDots className="absolute inset-0 -z-10 h-full w-full" />
          <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
          <Container>
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-2">
              <Link href="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-muted">{service.navLabel}</span>
            </nav>

            <p className="reveal text-sm font-semibold uppercase tracking-wider text-accent">
              {service.tagline}
            </p>
            <h1
              className="reveal mt-3 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl"
              style={{ animationDelay: "0.05s" }}
            >
              {service.title}
            </h1>
            <div
              className="reveal mt-6 max-w-2xl space-y-4"
              style={{ animationDelay: "0.12s" }}
            >
              {service.intro.map((p) => (
                <p key={p} className="text-lg leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </div>
            <div
              className="reveal mt-8 flex flex-wrap gap-3"
              style={{ animationDelay: "0.19s" }}
            >
              <a
                href="#contact"
                className="rounded-full accent-gradient px-6 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.03]"
              >
                Start a conversation
              </a>
              <Link
                href="/#services"
                className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent/50"
              >
                See all services
              </Link>
            </div>
          </Container>
        </section>

        {/* Signals */}
        <section className="border-t border-border py-20">
          <Container>
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Signs you need this
              </h2>
            </Reveal>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {service.signals.map((s, i) => (
                <Reveal key={s} delay={i * 0.06}>
                  <li className="flex items-start gap-3 text-muted">
                    <Check
                      className="mt-1 h-4 w-4 shrink-0 text-accent-2"
                      strokeWidth={2.5}
                    />
                    <span>{s}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>

        {/* Deliverables */}
        <section className="border-t border-border py-20">
          <Container>
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                What you get
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2">
              {service.deliverables.map((d, i) => (
                <Reveal key={d.title} delay={i * 0.07}>
                  <div className="relative pl-5">
                    <span className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-[3px] rounded-full accent-gradient" />
                    <h3 className="font-semibold">{d.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {d.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 border-t border-border py-20">
          <Container>
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Questions about {service.navLabel.toLowerCase()}
              </h2>
            </Reveal>
            <div className="mt-8 max-w-3xl divide-y divide-border border-t border-border">
              {service.faq.map((item, i) => (
                <Reveal key={item.q} delay={i * 0.05}>
                  <details className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium marker:hidden [&::-webkit-details-marker]:hidden">
                      <h3 className="text-base sm:text-lg">{item.q}</h3>
                      <span
                        aria-hidden="true"
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border text-muted transition group-open:rotate-45 group-open:border-accent/50 group-open:text-accent"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                      {item.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* Internal links to the sibling services — spreads authority and gives
            crawlers a path between the pages. */}
        <section className="border-t border-border py-20">
          <Container>
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Also from DataHub
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {others.map((o, i) => (
                <Reveal key={o.slug} delay={i * 0.07}>
                  <Link
                    href={`/services/${o.slug}`}
                    className="group block rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/50"
                  >
                    <h3 className="flex items-center gap-2 font-semibold text-foreground group-hover:text-accent">
                      {o.title}
                      <ArrowRight className="h-4 w-4" />
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {o.tagline}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
