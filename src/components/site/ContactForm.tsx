"use client";

import { MARK_D_SPINE } from "@/components/brand/mark-paths";
import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import {
  CONTACT_EMAIL,
  WHATSAPP_DISPLAY,
  WHATSAPP_HREF,
  WHATSAPP_NUMBER,
} from "@/lib/contact-info";
import { formatNumber } from "@/lib/format";
import { readRef } from "@/components/system/RefKeeper";
import { ButtonPrimary, ButtonText } from "@/components/ui/Button";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { Rule } from "@/components/ui/Rule";
import { cn } from "@/lib/utils";
import styles from "./ContactForm.module.css";

/**
 * The contact form (client island).
 *
 * THE LEAD PIPELINE IS FIXED: POST /api/contact with JSON keys exactly
 * name, email, company, phone, service, message, source, website. The
 * honeypot input is named "hp" and its value travels as `website`. `source` is
 * the campaign tag (?ref / ?utm_source, else the sessionStorage copy kept by
 * RefKeeper). The zod schema in src/lib/validation.ts decides validity; the
 * checks below mirror its limits only to choose a localised message and to
 * spare a round trip (and a rate-limit slot) for an obviously empty field.
 *
 * Takes the hours estimator's sentence two ways: from
 * sessionStorage["dh-prefill"] on mount, where the estimator left it before
 * opening this page, and through a `dh:prefill` window event
 * ({ detail: { message } }) when both sit on one page. Either way it is
 * appended to the message, Name takes focus, and a line above the fields
 * (also announced politely) says so.
 */

export type FormStrings = Dictionary["form"];

const subscribeNothing = () => () => {};

/** Where the estimator leaves its sentence for this form. Same key in HoursEstimatorClient.tsx. */
const PREFILL_STORAGE_KEY = "dh-prefill";

/** The sentence the estimator left for this page, once: it is removed as it is read. */
function takePendingPrefill(): string {
  try {
    const text = sessionStorage.getItem(PREFILL_STORAGE_KEY) ?? "";
    sessionStorage.removeItem(PREFILL_STORAGE_KEY);
    return text.trim();
  } catch {
    return ""; // storage blocked: the estimator could not have left anything either
  }
}

const SERVICE_VALUES = [
  "dashboards",
  "automation",
  "custom-software",
  "other",
] as const;
type ServiceValue = (typeof SERVICE_VALUES)[number];
const SERVICE_LABEL_KEY = {
  dashboards: "dashboards",
  automation: "automation",
  "custom-software": "customSoftware",
  other: "other",
} as const satisfies Record<
  ServiceValue,
  keyof FormStrings["fields"]["service"]["options"]
>;

type FieldName = "name" | "phone" | "email" | "company" | "service" | "message";
/** DOM order: the first invalid field in this order receives focus. */
const ORDER: FieldName[] = [
  "name",
  "phone",
  "email",
  "company",
  "service",
  "message",
];

type Values = {
  name: string;
  phone: string;
  email: string;
  company: string;
  service: "" | ServiceValue;
  message: string;
};
type Errors = Partial<Record<FieldName, string>>;

const EMPTY: Values = {
  name: "",
  phone: "",
  email: "",
  company: "",
  service: "",
  message: "",
};

/** zod v4's email pattern, so the client never disagrees with the server about shape. */
const EMAIL_RE =
  /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+.-]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/;
const PHONE_RE = /^[0-9+()\s-]*$/;
const MESSAGE_MAX = 4000;

/** Mirrors contactSchema (trimmed lengths) to pick the right localised message. */
function check(
  field: FieldName,
  v: Values,
  e: FormStrings["errors"],
): string | undefined {
  switch (field) {
    case "name": {
      const s = v.name.trim();
      if (!s) return e.name.required;
      if (s.length < 2) return e.name.tooShort;
      if (s.length > 100) return e.name.tooLong;
      return undefined;
    }
    case "email": {
      const s = v.email.trim().toLowerCase();
      if (!s) return e.email.required;
      if (s.length > 160) return e.email.tooLong;
      if (s.length < 5 || !EMAIL_RE.test(s)) return e.email.invalid;
      return undefined;
    }
    case "phone": {
      const s = v.phone.trim();
      if (s.length > 30) return e.phone.tooLong;
      if (!PHONE_RE.test(s)) return e.phone.invalid;
      return undefined;
    }
    case "company":
      return v.company.trim().length > 140 ? e.company.tooLong : undefined;
    case "service":
      return v.service && !SERVICE_VALUES.includes(v.service)
        ? e.service.invalid
        : undefined;
    case "message": {
      const s = v.message.trim();
      if (!s) return e.message.required;
      if (s.length < 10) return e.message.tooShort;
      if (s.length > MESSAGE_MAX) return e.message.tooLong;
      return undefined;
    }
  }
}

/** When the server rejects a field the client thought fine, say the most likely thing. */
function fallback(field: FieldName, e: FormStrings["errors"]): string {
  switch (field) {
    case "name":
      return e.name.tooShort;
    case "email":
      return e.email.invalid;
    case "phone":
      return e.phone.invalid;
    case "company":
      return e.company.tooLong;
    case "service":
      return e.service.invalid;
    case "message":
      return e.message.tooShort;
  }
}

function validateAll(v: Values, e: FormStrings["errors"]): Errors {
  const out: Errors = {};
  for (const f of ORDER) {
    const msg = check(f, v, e);
    if (msg) out[f] = msg;
  }
  return out;
}

const isRecord = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null;

/** Fills `{slot}` placeholders with nodes, so a link can sit inside a translated sentence. */
function fillNode(
  template: string,
  slots: Record<string, ReactNode>,
): ReactNode[] {
  return template.split(/(\{\w+\})/g).map((part, i) => {
    const m = /^\{(\w+)\}$/.exec(part);
    return (
      <Fragment key={i}>{m && m[1] in slots ? slots[m[1]] : part}</Fragment>
    );
  });
}


const INPUT =
  "peer block w-full rounded-none border-0 border-b border-rule-input bg-transparent px-0 font-sans text-lg text-fg " +
  "placeholder:text-subtle focus:outline-none focus-visible:outline-none";

export function ContactForm({
  strings,
  prefillAnnouncement,
  privacy,
  newTabLabel,
  successHeading: SuccessHeading = "h3",
}: {
  strings: FormStrings;
  /** Shown and announced after the estimator adds a sentence (estimator.added). */
  prefillAnnouncement: string;
  privacy: { text: string; linkLabel: string; href: string };
  newTabLabel: string;
  /** One level below the heading of the section the form sits in. */
  successHeading?: "h2" | "h3";
}) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  const formRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const tick = useRef(0);

  // false on the server and while hydrating, true once the handlers run.
  const ready = useSyncExternalStore(subscribeNothing, () => true, () => false);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [phase, setPhase] = useState<"idle" | "sending" | "success">("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [polite, setPolite] = useState({ text: "", n: 0 });
  const [prefilled, setPrefilled] = useState(false);
  const [focusTarget, setFocusTarget] = useState<{
    field: FieldName;
    n: number;
  } | null>(null);

  const E = strings.errors;
  const F = strings.fields;
  const sending = phase === "sending";

  const requestFocus = (field: FieldName) => {
    tick.current += 1;
    setFocusTarget({ field, n: tick.current });
  };

  // Move focus after the render that shows the field (the form may have just
  // replaced the success state).
  useEffect(() => {
    if (!focusTarget) return;
    const form = formRef.current;
    if (!form) return;
    const el =
      focusTarget.field === "service"
        ? (form.querySelector<HTMLInputElement>(
            'input[name="service"]:checked',
          ) ?? form.querySelector<HTMLInputElement>('input[name="service"]'))
        : form.querySelector<HTMLElement>(`[name="${focusTarget.field}"]`);
    el?.focus();
  }, [focusTarget]);

  useEffect(() => {
    if (phase === "success") successRef.current?.focus();
  }, [phase]);

  // A visitor on a slow connection can start typing before the page has
  // hydrated. React hydrates inputs without reading them, so whatever is
  // already in the fields is adopted into state here — before the first
  // controlled render would write the empty state over it.
  useLayoutEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const read = (name: FieldName) => {
      const el = form.elements.namedItem(name);
      return el instanceof RadioNodeList || el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement
        ? el.value
        : "";
    };
    const typed: Partial<Values> = {};
    for (const key of ["name", "phone", "email", "company", "message"] as const) {
      const v = read(key);
      if (v) typed[key] = v;
    }
    const service = read("service");
    if (service in SERVICE_LABEL_KEY) typed.service = service as ServiceValue;
    // Syncing state from the DOM once, on mount: the external-system case.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (Object.keys(typed).length) setValues((prev) => ({ ...prev, ...typed }));
  }, []);

  // Auto-grow 5 → 12 lines where field-sizing: content is not supported.
  useLayoutEffect(() => {
    const el = messageRef.current;
    if (!el) return;
    if (typeof CSS !== "undefined" && CSS.supports("field-sizing", "content"))
      return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + (el.offsetHeight - el.clientHeight)}px`;
  }, [values.message, phase]);

  // The hours estimator's sentence: appended to the message, then Name.
  const adopt = useCallback(
    (text: string) => {
      setValues((v) => {
        const current = v.message.replace(/\s+$/, "");
        return { ...v, message: current ? `${current}\n\n${text}` : text };
      });
      setErrors((prev) =>
        prev.message ? { ...prev, message: undefined } : prev,
      );
      setPhase((p) => (p === "success" ? "idle" : p));
      setPolite((p) => ({ text: prefillAnnouncement, n: p.n + 1 }));
      setPrefilled(true);
      tick.current += 1;
      setFocusTarget({ field: "name", n: tick.current });
    },
    [prefillAnnouncement],
  );

  // Arriving from the estimator on another page: its sentence waits in
  // sessionStorage, read once on mount (the external-system case).
  useEffect(() => {
    const text = takePendingPrefill();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (text) adopt(text);
  }, [adopt]);

  // The estimator on the same page hands its sentence over through an event.
  useEffect(() => {
    const onPrefill = (ev: Event) => {
      const detail: unknown = (ev as CustomEvent<unknown>).detail;
      const text =
        isRecord(detail) && typeof detail.message === "string"
          ? detail.message.trim()
          : "";
      if (text) adopt(text);
    };
    window.addEventListener("dh:prefill", onPrefill);
    return () => window.removeEventListener("dh:prefill", onPrefill);
  }, [adopt]);

  const update =
    (field: Exclude<FieldName, "service">) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const next = { ...values, [field]: e.target.value };
      setValues(next);
      if (errors[field])
        setErrors((prev) => ({ ...prev, [field]: check(field, next, E) }));
    };

  const blur = (field: Exclude<FieldName, "service">) => () => {
    // Only speak up once the visitor has typed something or tried to send.
    if (!attempted && values[field].trim() === "") return;
    setErrors((prev) => ({ ...prev, [field]: check(field, values, E) }));
  };

  const chooseService = (value: ServiceValue) => {
    setValues((v) => ({ ...v, service: value }));
    setErrors((prev) =>
      prev.service ? { ...prev, service: undefined } : prev,
    );
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setAttempted(true);

    const local = validateAll(values, E);
    const firstLocal = ORDER.find((f) => local[f]);
    if (firstLocal) {
      setErrors(local);
      setStatusMsg(strings.status.checkFields);
      requestFocus(firstLocal);
      return;
    }

    const payload = {
      name: values.name,
      email: values.email,
      company: values.company,
      phone: values.phone,
      service: values.service || undefined,
      message: values.message,
      source: readRef(),
      // Honeypot: the input is named "hp" so autofill leaves it alone.
      website: String(new FormData(e.currentTarget).get("hp") ?? ""),
    };

    setErrors({});
    setStatusMsg("");
    setPhase("sending");

    let res: Response;
    try {
      res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      setPhase("idle");
      setStatusMsg(strings.status.network);
      return;
    }
    const data: unknown = await res.json().catch(() => null);

    if (res.status === 200 && isRecord(data) && data.ok === true) {
      setValues(EMPTY);
      setAttempted(false);
      setPrefilled(false);
      setPhase("success");
      return;
    }

    setPhase("idle");
    if (res.status === 422) {
      const issues = isRecord(data) && isRecord(data.issues) ? data.issues : {};
      const server: Errors = {};
      for (const f of ORDER)
        if (f in issues) server[f] = check(f, values, E) ?? fallback(f, E);
      const first = ORDER.find((f) => server[f]);
      if (first) {
        setErrors(server);
        setStatusMsg(strings.status.checkFields);
        requestFocus(first);
      } else {
        setStatusMsg(strings.status.invalid);
      }
    } else if (res.status === 429) {
      setStatusMsg(strings.status.rateLimited);
    } else if (res.status === 400 || res.status === 413 || res.status === 415) {
      setStatusMsg(strings.status.invalid);
    } else {
      setStatusMsg(strings.status.server);
    }
  }

  const again = () => {
    setStatusMsg("");
    setErrors({});
    setPhase("idle");
    requestFocus("name");
  };

  const politeRegion = (
    <p aria-live="polite" className="sr-only">
      {polite.text}
      {polite.n % 2 ? " " : ""}
    </p>
  );

  const numberLink = WHATSAPP_NUMBER ? (
    <a
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className="link-thread font-semibold text-fg transition-colors duration-[160ms] hover:text-accent"
    >
      <span className="tnum whitespace-nowrap">{WHATSAPP_DISPLAY}</span>
      <span className="sr-only"> {newTabLabel}</span>
    </a>
  ) : null;
  const emailLink = (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      className="link-thread font-semibold text-fg transition-colors duration-[160ms] hover:text-accent"
    >
      {CONTACT_EMAIL}
    </a>
  );
  const altLine = numberLink
    ? fillNode(strings.whatsappAlt, { number: numberLink })
    : fillNode(strings.whatsappAltNoNumber, { email: emailLink });
  // Shorter than the line it stands in for, in both languages, so the
  // shared cell below is never taller than the visible line.
  const loadingLine = numberLink
    ? fillNode(strings.status.loading, { number: numberLink })
    : fillNode(strings.status.loadingNoNumber, { email: emailLink });

  if (phase === "success") {
    // Same outer <div> + live region as the form branch, so the polite
    // region survives the switch between states and keeps announcing.
    return (
      <div>
        {politeRegion}
        <div>
          <Rule variant="section" animate />
          <SuccessHeading
            ref={successRef}
            tabIndex={-1}
            className="t-h2 mt-8 a-rise focus:outline-none"
          >
            <span aria-hidden="true" className="mr-3 text-accent-display">
              ✓
            </span>
            {strings.success.title}
          </SuccessHeading>
          <p
            className="t-body mt-6 text-muted a-rise"
            style={{ animationDelay: "60ms" }}
          >
            {strings.success.body}
          </p>
          <ButtonText arrow="→" onClick={again} className="mt-6">
            {strings.success.again}
          </ButtonText>
        </div>
      </div>
    );
  }

  const describedBy = (field: FieldName, ...extra: string[]) =>
    [errors[field] ? id(`${field}-error`) : "", ...extra]
      .filter(Boolean)
      .join(" ") || undefined;

  const fieldBox = (
    field: Exclude<FieldName, "service">,
    label: string,
    control: ReactNode,
    opts: { optional?: boolean; after?: ReactNode; className?: string } = {},
  ) => (
    <div className={cn("group", opts.className)}>
      <label
        htmlFor={id(field)}
        className="t-eyebrow block text-muted transition-colors duration-[160ms] group-focus-within:text-accent"
      >
        {label}
        {opts.optional && (
          <span className="ml-2 text-subtle">{strings.optional}</span>
        )}
      </label>
      <div className="relative mt-2">
        {control}
        {/* Focus: the thread draws from the left over the R3 underline. */}
        <span
          aria-hidden="true"
          className="thread pointer-events-none absolute inset-x-0 -bottom-px scale-x-0 transition-transform duration-[280ms] ease-[var(--ease-thread)] group-focus-within:scale-x-100"
        />
        {/* Error: a 2px --error underline in the R3 position. While the field
          has focus it steps 3px down so the focus thread above it stays fully
          visible (a failed submit always lands keyboard users here). */}
        {errors[field] && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -bottom-px h-[2px] bg-error group-focus-within:translate-y-[3px]"
          />
        )}
      </div>
      {errors[field] && (
        <p
          id={id(`${field}-error`)}
          className="t-small mt-2 flex gap-2 text-error"
        >
          <span aria-hidden="true">✕</span>
          <span>{errors[field]}</span>
        </p>
      )}
      {opts.after}
    </div>
  );

  const counterId = id("message-counter");

  return (
    <div>
      {politeRegion}
      {/* method="post": if a submit ever happens where the bundle cannot run,
        the fields go in the request body, never in the URL, history, access
        logs or Referer. The JS path below is the real pipeline (fetch POST
        /api/contact, JSON) and calls preventDefault. Until it is ready the
        send button is disabled (see `ready`), so nothing is lost on the way. */}
      <form
        ref={formRef}
        method="post"
        noValidate
        aria-label={strings.label}
        onSubmit={onSubmit}
        className="relative"
      >
        {/* Honeypot: off-screen, out of the tab order, ignored by password
          managers. A filled value makes the server drop the message silently. */}
        <div
          aria-hidden="true"
          className="absolute top-0 -left-[9999px] h-0 w-0 overflow-hidden"
        >
          <label htmlFor={id("hp")}>{strings.honeypot}</label>
          <input
            id={id("hp")}
            type="text"
            name="hp"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
            data-lpignore="true"
            data-1p-ignore="true"
            data-form-type="other"
          />
        </div>

        {/* The estimator's sentence is now in the message below. */}
        {prefilled && (
          <p className="t-small mb-8 flex gap-2 text-ok">
            <span aria-hidden="true">✓</span>
            <span>{prefillAnnouncement}</span>
          </p>
        )}

        <div
          className="grid gap-y-8 sm:grid-cols-2"
          style={{ columnGap: "var(--col-gap)" }}
        >
          {fieldBox(
            "name",
            F.name.label,
            <input
              id={id("name")}
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={100}
              placeholder={F.name.placeholder}
              value={values.name}
              onChange={update("name")}
              onBlur={blur("name")}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={describedBy("name")}
              className={cn(INPUT, "h-12")}
            />,
          )}
          {fieldBox(
            "phone",
            F.phone.label,
            <input
              id={id("phone")}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={30}
              placeholder={F.phone.placeholder}
              value={values.phone}
              onChange={update("phone")}
              onBlur={blur("phone")}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={describedBy("phone")}
              className={cn(INPUT, "h-12 tnum")}
            />,
            { optional: true },
          )}
          {fieldBox(
            "email",
            F.email.label,
            <input
              id={id("email")}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              maxLength={160}
              placeholder={F.email.placeholder}
              value={values.email}
              onChange={update("email")}
              onBlur={blur("email")}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={describedBy("email")}
              className={cn(INPUT, "h-12")}
            />,
          )}
          {fieldBox(
            "company",
            F.company.label,
            <input
              id={id("company")}
              name="company"
              type="text"
              autoComplete="organization"
              maxLength={140}
              placeholder={F.company.placeholder}
              value={values.company}
              onChange={update("company")}
              onBlur={blur("company")}
              aria-invalid={errors.company ? true : undefined}
              aria-describedby={describedBy("company")}
              className={cn(INPUT, "h-12")}
            />,
            { optional: true },
          )}
        </div>

        {/* Interested in: four native radios as R1 rows. */}
        <fieldset
          className="mt-10 min-w-0"
          aria-describedby={errors.service ? id("service-error") : undefined}
        >
          <legend className="t-eyebrow text-muted">
            {F.service.legend}
            <span className="ml-2 text-subtle">{strings.optional}</span>
          </legend>
          <div className="mt-3">
            {SERVICE_VALUES.map((value, i) => (
              <label
                key={value}
                className={cn(
                  "group flex min-h-12 cursor-pointer items-center gap-4 border-t border-rule py-3",
                  i === SERVICE_VALUES.length - 1 && "border-b",
                )}
              >
                <input
                  type="radio"
                  name="service"
                  value={value}
                  checked={values.service === value}
                  onChange={() => chooseService(value)}
                  className={cn(
                    "relative grid size-[18px] shrink-0 cursor-pointer appearance-none place-content-center rounded-full border border-rule-input bg-transparent",
                    "before:size-2.5 before:scale-0 before:rounded-full before:bg-action before:transition-transform before:duration-[160ms] before:content-['']",
                    "checked:border-action checked:before:scale-100 forced-colors:appearance-auto",
                  )}
                />
                <span
                  className={cn(
                    "font-sans text-base transition-colors duration-[160ms] group-hover:text-fg",
                    values.service === value
                      ? "font-semibold text-fg"
                      : "text-muted",
                  )}
                >
                  {F.service.options[SERVICE_LABEL_KEY[value]]}
                </span>
              </label>
            ))}
          </div>
          {errors.service && (
            <p
              id={id("service-error")}
              className="t-small mt-2 flex gap-2 text-error"
            >
              <span aria-hidden="true">✕</span>
              <span>{errors.service}</span>
            </p>
          )}
        </fieldset>

        {fieldBox(
          "message",
          F.message.label,
          <textarea
            ref={messageRef}
            id={id("message")}
            name="message"
            required
            rows={5}
            placeholder={F.message.placeholder}
            value={values.message}
            onChange={update("message")}
            onBlur={blur("message")}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describedBy("message", counterId)}
            className={cn(INPUT, styles.paper)}
          />,
          {
            className: "mt-10",
            after: (
              <p
                id={counterId}
                className={cn(
                  "t-data mt-2",
                  values.message.trim().length > MESSAGE_MAX && "text-error",
                )}
              >
                {strings.fields.message.counter.replace(
                  "{count}",
                  formatNumber(values.message.trim().length),
                )}
              </p>
            ),
          },
        )}

        {/* Error summary: assertive, glyph + word + colour. Always mounted so it announces. */}
        <p
          aria-live="assertive"
          className="t-small mt-8 flex min-h-[1.5em] gap-2 text-error"
        >
          {statusMsg && (
            <>
              <span aria-hidden="true">✕</span>
              <span>{statusMsg}</span>
            </>
          )}
        </p>

        {/* Before hydration a submit would post the page to itself and the
          message would be lost, so the button waits; the line under it says
          why and offers WhatsApp meanwhile. */}
        <ButtonPrimary
          type="submit"
          disabled={!ready}
          aria-busy={sending || undefined}
          className="mt-4 w-full sm:w-auto"
        >
          {sending && (
            <svg
              viewBox="0 0 100 100"
              aria-hidden="true"
              className="size-4 shrink-0 overflow-visible motion-reduce:hidden"
            >
              <path
                d={MARK_D_SPINE}
                pathLength={1}
                fill="none"
                stroke="currentColor"
                strokeWidth={12}
                strokeLinecap="round"
                strokeDasharray=".22 .78"
                className="animate-[dh-sending_1.1s_linear_infinite]"
              />
            </svg>
          )}
          {sending ? strings.sending : strings.submit}
        </ButtonPrimary>

        {/* Until the form can send, the line under the button says so. Both
          lines share one grid cell and only visibility swaps, so the slot is
          always as tall as the longer one and nothing below moves (CLS). The
          hidden one is out of the tab order and the accessibility tree. */}
        <p className="t-small mt-6 grid text-muted">
          <span className={cn("[grid-area:1/1]", !ready && "invisible")}>{altLine}</span>
          <span className={cn("[grid-area:1/1]", ready && "invisible")}>{loadingLine}</span>
        </p>
        <p className="t-small mt-2 text-muted">
          {privacy.text}{" "}
          <LinkArrow href={privacy.href} className="min-h-0 text-[0.875rem]">
            {privacy.linkLabel}
          </LinkArrow>
        </p>
      </form>
    </div>
  );
}
