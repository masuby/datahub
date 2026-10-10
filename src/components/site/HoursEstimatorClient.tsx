"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { fill } from "@/i18n/fill";
import { formatNumber } from "@/lib/format";
import { ButtonText } from "@/components/ui/Button";
import { Grid } from "@/components/ui/Grid";
import { scrollToSection } from "@/lib/scroll-to-section";

/**
 * "Where do the hours go?" — the fill-in-the-sentence estimator (spec §10.2).
 *
 * Nothing leaves the device: the only output is the optional "Add this to my
 * message", which hands a sentence to the contact form through the
 * `dh:prefill` window event ({ detail: { message } }).
 */
export type EstimatorStrings = Omit<Dictionary["estimator"], "eyebrow" | "title" | "lead">;

type Field = "count" | "people" | "hours";
type Period = "day" | "week" | "month";

/** [min, max, step] */
const LIMITS: Record<Field, [number, number, number]> = {
  count: [1, 100, 1],
  people: [1, 20, 1],
  hours: [0.5, 40, 0.5],
};
/** 240 working days, 48 working weeks (leave and public holidays excluded). */
const PER_YEAR: Record<Period, number> = { day: 240, week: 48, month: 12 };
const SALARY_MAX = 50_000_000;
const SLOT = /^\{(count|period|people|hours)\}$/;

/** Template with React nodes in its slots, so word order stays the translator's. */
const slots = (t: string, v: Record<string, ReactNode>) =>
  t.split(/\{(\w+)\}/).map((part, i) => (i % 2 ? <span key={i}>{v[part]}</span> : part));

const clamp = (f: Field, n: number) => {
  const [min, max, step] = LIMITS[f];
  return Math.min(max, Math.max(min, Math.round(n / step) * step));
};
const fmt = (n: number) => formatNumber(n, n % 1 ? 1 : 0);

/** The R3 underline and the focus thread that replaces it. */
function Underline({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block">
      {children}
      {/* A one-sided border, not a fill, so forced-colors mode keeps it. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-0 border-b border-rule-input peer-aria-invalid:border-error"
      />
      <span
        aria-hidden="true"
        className="thread absolute inset-x-0 -bottom-px scale-x-0 transition-transform duration-[280ms] ease-thread peer-focus:scale-x-100"
      />
    </span>
  );
}

const inputCls =
  "peer bg-transparent text-center text-accent tabular-nums focus:outline-hidden [appearance:textfield] " +
  "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

export function HoursEstimatorClient({ s }: { s: EstimatorStrings }) {
  const [vals, setVals] = useState<Record<Field, string>>({ count: "3", people: "1", hours: "2" });
  const [period, setPeriod] = useState<Period>("week");
  const [salary, setSalary] = useState("");
  const [touched, setTouched] = useState(false);
  const [added, setAdded] = useState(false);
  const [live, setLive] = useState("");

  const bad = (f: Field) => {
    const [min, max] = LIMITS[f];
    const n = parseFloat(vals[f]);
    return !(n >= min && n <= max);
  };
  const num = (f: Field) => {
    const n = parseFloat(vals[f]);
    return Number.isFinite(n) ? clamp(f, n) : LIMITS[f][0];
  };
  const edit = (f: Field, v: string) => {
    setVals((p) => ({ ...p, [f]: v }));
    setTouched(true);
    setAdded(false);
  };

  // ── Maths (§10.2) ──
  const count = num("count");
  const people = num("people");
  const hours = num("hours");
  const sal = Math.min(SALARY_MAX, Number(salary.replace(/\D/g, "")) || 0);
  const total = count * PER_YEAR[period] * people * hours;
  const days = total / 8;
  const hourly = sal / 176;
  // English inflects these by number ("1 report", "2 reports"); Kiswahili
  // gives the same word for both forms.
  const personWord = people === 1 ? s.personWord.one : s.personWord.other;
  const reportWord = count === 1 ? s.reportWord.one : s.reportWord.other;
  const hourWord = hours === 1 ? s.hourWord.one : s.hourWord.other;

  const totalText = formatNumber(Math.round(total));
  const daysLine = fill(s.result.days, { days: days < 10 ? formatNumber(days, 1) : formatNumber(Math.round(days)) });
  const costLine = sal > 0 ? fill(s.result.cost, { amount: formatNumber(Math.round((total * hourly) / 1e4) * 1e4) }) : "";
  const values = {
    count: fmt(count),
    people: fmt(people),
    hours: fmt(hours),
    personWord,
    reportWord,
    hourWord,
    period: s.periods[period],
    periods: String(PER_YEAR[period]),
    periodUnit: s.periodUnits[period],
    total: totalText,
    hoursPerYear: totalText,
  };
  const summary = [fill(s.result.hours, { hours: totalText }), daysLine, costLine].join(" ").trim();

  // Screen readers hear the result 300ms after the last edit, not per keystroke.
  useEffect(() => {
    if (!touched) return;
    const id = setTimeout(() => setLive(summary), 300);
    return () => clearTimeout(id);
  }, [summary, touched]);

  const addToMessage = () => {
    window.dispatchEvent(new CustomEvent("dh:prefill", { detail: { message: fill(s.messageTemplate, values) } }));
    setAdded(true);
    const contact = document.getElementById("contact");
    if (!contact) return;
    // Focus first (no scroll) so the form's own later focus() is a no-op.
    contact.querySelector<HTMLElement>('[name="name"]')?.focus({ preventScroll: true });
    scrollToSection(contact);
  };

  const field = (f: Field) => {
    const label = s.labels[f];
    const v = vals[f];
    const [min, max, step] = LIMITS[f];
    const stepper = (d: 1 | -1) => (
      <button
        type="button"
        aria-label={fill(d < 0 ? s.stepper.decrease : s.stepper.increase, { label })}
        onClick={() => edit(f, String(clamp(f, num(f) + d * step)))}
        className="inline-grid size-11 place-items-center align-middle text-muted transition-colors duration-[160ms] hover:text-accent lg:hidden"
      >
        <span aria-hidden="true">{d < 0 ? "−" : "+"}</span>
      </button>
    );
    return (
      <span className="inline-flex items-baseline whitespace-nowrap">
        {stepper(-1)}
        <Underline>
          <input
            id={`est-${f}`}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={v}
            aria-label={label}
            aria-invalid={bad(f) || undefined}
            aria-describedby={bad(f) ? `est-${f}-err` : undefined}
            onChange={(e) => edit(f, e.target.value)}
            onBlur={() => v !== "" && edit(f, String(clamp(f, parseFloat(v) || min)))}
            className={inputCls}
            style={{ width: `${Math.max(3, v.length + 1)}ch` }}
          />
        </Underline>
        {stepper(1)}
      </span>
    );
  };

  const errors = (["count", "people", "hours"] as const).filter(bad);

  return (
    <Grid className="items-start">
      {/* ── The sentence (cols 1–7) ── */}
      <div className="col-span-4 sm:col-span-8 lg:col-span-7">
        <p className="t-title max-w-[34ch] [text-wrap:pretty] lg:leading-[1.7]">
          {s.sentence.map((tok, i) => {
            const slot = SLOT.exec(tok)?.[1];
            if (slot === "period") {
              return (
                <Underline key={i}>
                  {/* Invisible mirror of the chosen label sizes the field to it, not to the longest option. */}
                  <span aria-hidden="true" className="invisible whitespace-nowrap pr-[1.1em]">
                    {s.periods[period]}
                  </span>
                  <select
                    id="est-period"
                    aria-label={s.labels.period}
                    value={period}
                    onChange={(e) => {
                      setPeriod(e.target.value as Period);
                      setTouched(true);
                      setAdded(false);
                    }}
                    className="peer absolute inset-0 w-full cursor-pointer appearance-none bg-transparent pr-[1.1em] text-accent focus:outline-hidden [&>option]:bg-bg [&>option]:text-fg"
                  >
                    {(["day", "week", "month"] as const).map((p) => (
                      <option key={p} value={p}>
                        {s.periods[p]}
                      </option>
                    ))}
                  </select>
                  <span aria-hidden="true" className="pointer-events-none absolute top-0 right-0 text-accent">
                    ▾
                  </span>
                </Underline>
              );
            }
            if (slot) return <span key={i}>{field(slot as Field)}</span>;
            return <span key={i}>{fill(tok, { personWord, reportWord, hourWord })}</span>;
          })}
        </p>

        {errors.map((f) => (
          <p key={f} id={`est-${f}-err`} className="t-small mt-3 text-error">
            <span aria-hidden="true" className="mr-2 font-mono font-medium">
              !
            </span>
            <span className="font-semibold">{s.labels[f]}</span>{" "}
            {fill(s.error.range, { min: fmt(LIMITS[f][0]), max: fmt(LIMITS[f][1]) })}
          </p>
        ))}

        {/* Optional salary */}
        <div className="mt-10 lg:mt-14">
          <label htmlFor="est-salary" className="t-small block text-muted">
            {s.salary.label}
          </label>
          <div className="mt-2 flex items-baseline gap-3">
            <span aria-hidden="true" className="t-mono text-subtle">
              {s.salary.unit}
            </span>
            <Underline>
              <input
                id="est-salary"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder={s.salary.placeholder}
                aria-describedby="est-salary-help"
                value={salary}
                onChange={(e) => {
                  setSalary(e.target.value.replace(/[^\d,]/g, ""));
                  setTouched(true);
                  setAdded(false);
                }}
                onBlur={() => setSalary(sal ? formatNumber(sal) : "")}
                className="peer t-title w-[13ch] bg-transparent py-1 tabular-nums text-accent placeholder:text-subtle focus:outline-hidden"
              />
            </Underline>
          </div>
          <p id="est-salary-help" className="t-small mt-2 text-subtle">
            {s.salary.help}
          </p>
        </div>
      </div>

      {/* ── The result (cols 8–12), a vertical R1 between the halves ── */}
      <div className="relative col-span-4 mt-12 sm:col-span-8 lg:col-span-5 lg:col-start-8 lg:mt-0 lg:pl-[clamp(1rem,2vw,2.5rem)]">
        <span aria-hidden="true" className="rule-hair mb-10 lg:hidden" />
        <span
          aria-hidden="true"
          className="rule-hair-v absolute inset-y-0 hidden lg:block"
          style={{ left: "calc(var(--col-gap) / -2)" }}
        />

        <p className="t-eyebrow">{s.result.label}</p>
        <p className="t-title mt-4">
          {slots(s.result.hours, {
            hours: (
              <span key={totalText} className={`t-result ${touched ? "a-fade" : ""}`} style={{ animationDuration: "200ms" }}>
                {totalText}
              </span>
            ),
          })}
        </p>
        <p className="t-title mt-3">{daysLine}</p>
        {costLine && <p className="t-title mt-2 text-muted">{costLine}</p>}

        <span aria-hidden="true" className="rule-hair my-6" />
        <p className="t-data">{fill(s.formula.hours, values)}</p>
        {sal > 0 && (
          <p className="t-data mt-1">
            {fill(s.formula.cost, { salary: formatNumber(sal), hourly: formatNumber(Math.round(hourly)) })}
          </p>
        )}
        <p className="t-data mt-1">{s.formula.assumptions}</p>
        <p className="t-small mt-6 text-muted">{s.note}</p>

        <ButtonText arrow="→" className="mt-4" onClick={addToMessage}>
          {s.addToMessage}
        </ButtonText>
        {/* Visible confirmation only: the contact form's live region announces it. */}
        <p className="t-small min-h-[1.5em] text-ok">
          {added && (
            <>
              <span aria-hidden="true" className="mr-2">
                ✓
              </span>
              {s.added}
            </>
          )}
        </p>
        <p aria-live="polite" className="sr-only">
          {live}
        </p>
      </div>
    </Grid>
  );
}
