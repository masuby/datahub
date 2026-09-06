import { Check, ArrowRight, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { AnimatedDots } from "@/components/ui/AnimatedDots";
import { Decode } from "@/components/ui/Decode";
import { Tilt } from "@/components/ui/Tilt";
import { CountUp } from "@/components/ui/CountUp";

const stats = [
  { value: "Hours → seconds", label: "Report turnaround" },
  { value: "One source", label: "of truth, any browser" },
  { value: "Zero", label: "manual copy-paste" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      {/* Backdrop: grid → dot field → aurora, back to front. */}
      <div className="bg-grid-fade pointer-events-none absolute inset-0 -z-30" />
      <AnimatedDots className="absolute inset-0 -z-20 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="aurora -top-40 left-[8%] h-[520px] w-[520px]"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.35), transparent 60%)" }}
        />
        <div
          className="aurora aurora-2 -right-32 top-24 h-[600px] w-[600px]"
          style={{ background: "radial-gradient(circle, rgba(52,211,153,0.28), transparent 60%)" }}
        />
      </div>

      <Container className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div
            className="reveal inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/70 py-1.5 pl-2 pr-4 font-mono text-[10px] uppercase tracking-[0.12em] text-muted backdrop-blur sm:text-[11px] sm:tracking-[0.18em]"
            style={{ animationDelay: "0s" }}
          >
            <span className="live-dot h-2 w-2 rounded-full bg-accent-2" />
            Data systems for Tanzanian organisations
          </div>

          <h1
            className="reveal mt-6 text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.03em] sm:text-6xl lg:text-[4.2rem]"
            style={{ animationDelay: "0.05s" }}
          >
            We help turn your data into{" "}
            <span className="block">
              <Decode
                className="text-gradient-animate"
                srText="dashboards, insights, and automation."
                words={["dashboards.", "insights.", "automation.", "decisions."]}
              />
            </span>
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
              className="btn-shine glow-ring inline-flex items-center gap-2 rounded-full accent-gradient px-6 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.03]"
            >
              Start a conversation
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#services"
              className="glass inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:text-accent"
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
                <dt className="text-gradient text-base font-semibold sm:text-lg">
                  {s.value}
                </dt>
                <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-2 sm:text-[11px]">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroDashboard />
      </Container>
    </section>
  );
}

/** Decorative dashboard mock. Numbers are illustrative, not claims. */
function HeroDashboard() {
  const bars = [42, 68, 55, 88, 73, 96, 61];
  // Sparkline path, drawn in over ~1.6s (see .draw-path). Length measured once.
  const spark = "M0 44 L28 38 L56 41 L84 30 L112 33 L140 22 L168 26 L196 14 L224 18 L252 8 L280 12";
  const sparkLen = 300;

  return (
    <div className="reveal relative" style={{ animationDelay: "0.2s" }}>
      <Tilt>
        <div className="glass glow-ring rounded-3xl p-6">
          {/* header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-2">
                Performance overview
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm font-semibold">
                Monthly KPIs
                <span className="flex items-center gap-1.5 rounded-full bg-accent-2/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent-2">
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-accent-2" />
                  live
                </span>
              </div>
            </div>
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-accent/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent-2/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted-2/40" />
            </div>
          </div>

          <div className="mt-5 h-px w-full accent-gradient opacity-50" />

          {/* metrics */}
          <div className="mt-5 grid grid-cols-2 divide-x divide-border">
            <div className="pr-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-2">
                Target achieved
              </div>
              <div className="mt-1 text-3xl font-semibold text-accent-2">
                <CountUp to={92} suffix="%" delay={500} />
              </div>
            </div>
            <div className="pl-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-2">
                Active growth
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-3xl font-semibold text-accent">
                <CountUp to={18} prefix="+" suffix="%" delay={650} />
                <TrendingUp className="h-5 w-5" strokeWidth={2.2} />
              </div>
            </div>
          </div>

          {/* sparkline */}
          <div className="mt-5 rounded-xl border border-border/70 bg-background/40 p-3">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-muted-2">
              <span>Trend · 30d</span>
              <span className="text-accent-2">↑ steady</span>
            </div>
            <svg viewBox="0 0 280 52" className="mt-2 h-14 w-full" aria-hidden="true">
              <defs>
                <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="sparkStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
              <path d={`${spark} L280 52 L0 52 Z`} fill="url(#sparkFill)" />
              <path
                d={spark}
                fill="none"
                stroke="url(#sparkStroke)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="draw-path"
                style={{ ["--len" as string]: sparkLen, ["--draw-delay" as string]: "0.6s" }}
              />
            </svg>
          </div>

          {/* bars + badge */}
          <div className="relative mt-5">
            <div className="flex h-32 items-end justify-between gap-2">
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
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="reveal float rounded-full accent-gradient p-[2px] shadow-2xl" style={{ animationDelay: "0.9s" }}>
                <div className="grid h-28 w-28 place-items-center rounded-full bg-surface/90 backdrop-blur">
                  <span className="grid h-14 w-14 place-items-center rounded-full accent-gradient">
                    <Check className="h-8 w-8 text-background" strokeWidth={3} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Tilt>
    </div>
  );
}
