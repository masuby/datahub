import { Check, X, ShieldCheck, Gauge, Layers, Headset } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const comparison = [
  ["Reports take hours or days to prepare", "Reports generated in seconds"],
  ["Inconsistent numbers across people", "One engine, consistent results"],
  ["Files scattered across emails & folders", "Everything in one place, any browser"],
  ["Manual emailing and formatting", "One-click, professionally formatted delivery"],
  ["No real-time performance overview", "Live executive dashboard at a glance"],
];

const reasons = [
  {
    icon: ShieldCheck,
    title: "Security first",
    desc: "Encrypted credentials, role-based access, validated inputs, and hardened endpoints. Your data is treated as the priority it is.",
  },
  {
    icon: Gauge,
    title: "Built for speed",
    desc: "What took hours of manual work happens instantly — accurate and repeatable every time.",
  },
  {
    icon: Layers,
    title: "Tailored, not templated",
    desc: "We build around your actual workflow and reporting logic, department by department.",
  },
  {
    icon: Headset,
    title: "Ongoing partnership",
    desc: "Training, support, and continuous improvement so the system evolves with your business.",
  },
];

export function WhyUs() {
  return (
    <section id="why" className="scroll-mt-20 border-t border-border py-24">
      <Container>
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              Why DataHub
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              From manual and scattered to automated and clear
            </h2>
            <p className="mt-4 text-muted">
              We replace slow, error-prone manual processes with one unified
              platform — so your team spends time on decisions, not spreadsheets.
            </p>

            <div className="mt-8 divide-y divide-border border-t border-border">
              {comparison.map(([before, after]) => (
                <div
                  key={after}
                  className="grid grid-cols-1 gap-2 py-3.5 sm:grid-cols-2"
                >
                  <div className="flex items-start gap-2 text-sm text-muted-2">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400/70" strokeWidth={2} />
                    <span className="line-through decoration-muted-2/40">{before}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-2" strokeWidth={2.5} />
                    {after}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
            {reasons.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.08}>
                {/* gradient accent bar on the left instead of a bordered card */}
                <div className="relative h-full pl-5">
                  <span className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-[3px] rounded-full accent-gradient" />
                  <r.icon className="h-6 w-6 text-accent-2" strokeWidth={1.5} />
                  <h3 className="mt-3 font-semibold">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{r.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
