import Link from "next/link";
import { BarChart3, Workflow, Code2, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const services = [
  {
    icon: BarChart3,
    href: "/services/dashboards",
    title: "Dashboards & Insights",
    desc: "Live, interactive dashboards that pull your scattered spreadsheets into one place — color-coded KPIs, gap analysis, and executive summaries available at a glance, in any browser.",
    points: ["Executive & departmental views", "Automated KPI grading", "Drill-down charts & tables"],
  },
  {
    icon: Workflow,
    href: "/services/automation",
    title: "Automation",
    desc: "We remove the repetitive, error-prone manual work. Reports that took hours of Excel and PowerPoint are generated instantly and emailed automatically — consistent every single time.",
    points: ["One-click Excel & PowerPoint exports", "Scheduled & on-demand reports", "Personalised email delivery"],
  },
  {
    icon: Code2,
    href: "/services/ai-agents",
    title: "Custom Software",
    desc: "High-quality code that streamlines your process end to end. We build the platform around exactly how your business runs — not a rigid template you have to bend to fit.",
    points: ["Tailored to your workflow", "Secure, role-based access", "Built to grow with you"],
  },
];

export function Services() {
  return (
    <section id="services" className="scroll-mt-20 border-t border-border py-24">
      <Container>
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            What we do
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Three ways we turn data into decisions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Every engagement is tailored — but the value always comes from the
            same three capabilities, combined to fit your organisation.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="flex h-full flex-col">
                <s.icon className="h-8 w-8 text-accent" strokeWidth={1.5} />
                <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.desc}</p>
                <ul className="mt-5 space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-sm text-muted">
                      <ArrowRight className="h-4 w-4 shrink-0 text-accent-2" strokeWidth={2} />
                      {p}
                    </li>
                  ))}
                </ul>
                <Link
                  href={s.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-2"
                >
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
