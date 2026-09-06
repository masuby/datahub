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
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
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

        {/* The pipeline line draws itself left→right once the section is in
            view, and the step nodes sit on it. */}
        <Reveal className="relative mt-16">
          <svg
            className="pointer-events-none absolute left-0 top-[14px] hidden h-[2px] w-full lg:block"
            viewBox="0 0 1000 2"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line x1="0" y1="1" x2="1000" y2="1" stroke="#1e293b" strokeWidth="2" />
            <line
              x1="0"
              y1="1"
              x2="1000"
              y2="1"
              stroke="url(#pipeGrad)"
              strokeWidth="2"
              className="draw-path draw-on-reveal"
              style={{ ["--len" as string]: 1000, ["--draw-delay" as string]: "0.2s" }}
            />
            <defs>
              <linearGradient id="pipeGrad" x1="0" x2="1">
                <stop offset="0" stopColor="#22d3ee" />
                <stop offset="1" stopColor="#34d399" />
              </linearGradient>
            </defs>
          </svg>

          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={0.15 + i * 0.12}>
                <div className="relative h-full">
                  {/* node on the line */}
                  <span className="relative z-10 grid h-8 w-8 place-items-center rounded-full border border-accent/50 bg-background font-mono text-[11px] font-semibold text-accent shadow-[0_0_0_6px_rgba(34,211,238,0.08)]">
                    {s.n}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
