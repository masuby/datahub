import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { AnimatedDots } from "@/components/ui/AnimatedDots";

const stats = [
  { value: "Hours → seconds", label: "Report turnaround" },
  { value: "One source", label: "of truth, any browser" },
  { value: "Zero", label: "manual copy-paste" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* backdrop */}
      <AnimatedDots className="absolute inset-0 -z-10 h-full w-full" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[480px] w-[680px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />

      <Container className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <h1
            className="reveal text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "0.05s" }}
          >
            We turn your data into{" "}
            <span className="text-gradient">dashboards, insights,</span> and
            automation.
          </h1>

          <p
            className="reveal mt-6 max-w-xl text-lg leading-relaxed text-muted"
            style={{ animationDelay: "0.12s" }}
          >
            DataHub designs and builds custom dashboards, automated reporting,
            and high-quality software that streamlines your operations end to
            end — replacing slow, repetitive manual work with systems tailored
            to exactly how your business runs.
          </p>

          <div
            className="reveal mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "0.19s" }}
          >
            <a
              href="#contact"
              className="rounded-full accent-gradient px-6 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.03]"
            >
              Start a conversation
            </a>
            <a
              href="#services"
              className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent/50"
            >
              See what we do
            </a>
          </div>

          <dl
            className="reveal mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8"
            style={{ animationDelay: "0.3s" }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-base font-semibold text-foreground sm:text-lg">
                  {s.value}
                </dt>
                <dd className="mt-1 text-xs text-muted-2">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroDashboard />
      </Container>
    </section>
  );
}

/** Decorative dashboard mock. */
function HeroDashboard() {
  const bars = [42, 68, 55, 88, 73, 96, 61];
  return (
    <div className="reveal relative" style={{ animationDelay: "0.2s" }}>
      <div className="rounded-2xl border border-border bg-surface/80 p-6 shadow-2xl backdrop-blur">
        {/* header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-2">Performance overview</div>
            <div className="text-sm font-semibold">Monthly KPIs · live</div>
          </div>
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-accent/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent-2/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-2/40" />
          </div>
        </div>

        {/* gradient (two-colour) separator */}
        <div className="mt-5 h-px w-full accent-gradient opacity-50" />

        {/* two metrics — no boxes, split by a vertical divider */}
        <div className="mt-5 grid grid-cols-2 divide-x divide-border">
          <div className="pr-5">
            <div className="text-xs text-muted-2">Target achieved</div>
            <div className="mt-1 text-3xl font-semibold text-accent-2">92%</div>
          </div>
          <div className="pl-5">
            <div className="text-xs text-muted-2">Active growth</div>
            <div className="mt-1 text-3xl font-semibold text-accent">+18%</div>
          </div>
        </div>

        {/* plain line separator */}
        <div className="mt-5 h-px w-full bg-border" />

        {/* chart — no box; circular "Delivered" badge centered over it */}
        <div className="relative mt-5">
          <div className="flex h-36 items-end justify-between gap-2">
            {bars.map((h, i) => (
              <div
                key={i}
                className="grow-bar w-full rounded-t-md accent-gradient"
                style={{
                  height: `${h}%`,
                  opacity: 0.5 + (h / 100) * 0.45,
                  animationDelay: `${0.4 + i * 0.08}s`,
                }}
              />
            ))}
          </div>

          {/* centered circular badge */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="reveal rounded-full accent-gradient p-[2px] shadow-2xl" style={{ animationDelay: "0.9s" }}>
              <div className="flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-full bg-surface/90 text-center backdrop-blur">
                <span className="grid h-9 w-9 place-items-center rounded-full accent-gradient">
                  <Check className="h-5 w-5 text-background" strokeWidth={3} />
                </span>
                <div className="mt-1 text-sm font-semibold text-foreground">Delivered</div>
                <div className="text-[10px] uppercase tracking-wide text-muted-2">
                  auto-emailed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
