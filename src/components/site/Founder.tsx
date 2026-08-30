import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedDots } from "@/components/ui/AnimatedDots";

/**
 * Founder / about block.
 *
 * A buyer in Dar es Salaam is deciding whether to trust an unfamiliar website
 * with their operational data. Naming the person behind it, and pointing at
 * systems that already run in production, does more for conversion than another
 * paragraph of capability copy.
 */

const proof = [
  {
    title: "Reporting platform in production",
    desc: "A full reporting and analytics platform built for a Tanzanian financial services company — in daily use by its operations team.",
  },
  {
    title: "Automated market data pipelines",
    desc: "Ongoing automated extraction and publishing of Tanzanian market data — treasury bills and bonds, forex, and commodities — running unattended every month.",
  },
  {
    title: "National-scale reporting systems",
    desc: "Multi-agency bulletin and reporting tooling with map generation, bilingual output, role-based access, and automated document delivery.",
  },
];

export function Founder() {
  return (
    <section
      id="about"
      className="relative overflow-hidden scroll-mt-20 border-t border-border py-24"
    >
      <AnimatedDots className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              Who builds it
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Built by{" "}
              <span className="text-gradient">Daniel Clement Masubi</span>
            </h2>
            <p className="mt-5 leading-relaxed text-muted">
              DataHub is led by Daniel Clement Masubi, a Tanzanian software and
              data engineer who builds the systems himself — dashboards,
              automated reporting pipelines, and secure custom platforms that
              organisations depend on every day.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              You deal with the engineer directly, not an account manager. That
              means scoping conversations that get to the real problem quickly,
              and a system shaped around how your organisation actually works.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6 text-sm">
              <div>
                <div className="font-semibold text-foreground">
                  Daniel Clement Masubi
                </div>
                <div className="mt-0.5 text-muted-2">Founder &amp; Lead Engineer</div>
              </div>
              <div>
                <div className="font-semibold text-foreground">Tanzania</div>
                <div className="mt-0.5 text-muted-2">
                  Working with teams everywhere
                </div>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-y-9">
            {proof.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="relative pl-5">
                  <span className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-[3px] rounded-full accent-gradient" />
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {p.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
