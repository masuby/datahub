import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const steps = [
  {
    n: "01",
    title: "Discover",
    desc: "We sit with your team to understand the real workflow — the reports you depend on, the KPIs that matter, and where the manual pain is.",
  },
  {
    n: "02",
    title: "Design",
    desc: "We map a tailored solution: the dashboards, the automations, and the data flow. No two organisations get the same blueprint.",
  },
  {
    n: "03",
    title: "Build",
    desc: "We write high-quality, secure code and ship a working platform — dashboards, exports, and automated delivery that fit how you already work.",
  },
  {
    n: "04",
    title: "Support",
    desc: "We train your team, align on standards, and keep improving — new reports, data sources, and KPIs as your needs grow.",
  },
];

export function Process() {
  return (
    <section id="process" className="scroll-mt-20 border-t border-border py-24">
      <Container>
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            How we work
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            A tailored solution, built end to end
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            The solution we deliver depends entirely on your needs — it can look
            completely different from one organisation to the next. The process
            of getting there stays clear and collaborative.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              {/* line separator on top of each step, no box */}
              <div className="h-full border-t border-border pt-5">
                <span className="text-gradient font-mono text-2xl font-semibold">
                  {s.n}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
