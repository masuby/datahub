#!/usr/bin/env node
/**
 * Unit checks for the contact form's "Interested in" list: the `service` key
 * of POST /api/contact, now any number of choices as one comma-separated
 * string.
 *
 * Usage: node scripts/check-contact-schema.mjs
 *
 * Imports src/lib/validation.ts itself (Node 22.18+ and 24 run TypeScript by
 * stripping the types; the "module type not specified" warning is harmless),
 * so it tests exactly the schema the route runs. No server, no database.
 * Exits non-zero on any failure. scripts/check-claims.mjs checks the same
 * rules over HTTP against a running build.
 */

const { contactSchema, serviceLabels } = await import(
  new URL("../src/lib/validation.ts", import.meta.url).href
);

const BASE = {
  name: "Asha Mushi",
  email: "asha@example.co.tz",
  message: "Our weekly branch report takes two days.",
};

let failures = 0;
const fail = (where, msg) => {
  failures++;
  console.log(`  FAIL  ${where}: ${msg}`);
};
const pass = (where, msg) => console.log(`  ok    ${where}: ${msg}`);

/** `expected` is the stored value (undefined: key absent), or REJECT. */
const REJECT = Symbol("reject");
const ABSENT = Symbol("absent");

const CASES = [
  // Older pages (radio buttons) and "nothing ticked" keep working.
  ["absent (no choice, old and new form)", ABSENT, undefined],
  ["empty string", "", ""],
  ["valid single: dashboards", "dashboards", "dashboards"],
  ["valid single: automation", "automation", "automation"],
  ["valid single: custom-software", "custom-software", "custom-software"],
  ["valid single: other", "other", "other"],
  // Several choices: stored in the order the form lists them.
  ["valid multiple", "dashboards,automation", "dashboards,automation"],
  ["valid multiple, ticked out of order", "other,dashboards", "dashboards,other"],
  ["all four, reversed, with spaces", " other , custom-software,automation , dashboards ", "dashboards,automation,custom-software,other"],
  // Duplicates collapse.
  ["duplicates", "dashboards,dashboards", "dashboards"],
  ["duplicates among others", "automation,other,automation", "automation,other"],
  // Anything else is refused.
  ["unknown value", "teleport", REJECT],
  ["unknown value among valid ones", "dashboards,teleport", REJECT],
  ["wrong case", "Dashboards", REJECT],
  ["label instead of value", "Reporting automation", REJECT],
  ["blank entry (trailing comma)", "dashboards,", REJECT],
  ["blank entry (double comma)", "dashboards,,automation", REJECT],
  ["only commas", ",", REJECT],
  ["more entries than options", "dashboards,automation,custom-software,other,other", REJECT],
  ["too long (81 characters)", "x".repeat(81), REJECT],
  ["too long (valid values repeated)", "dashboards,".repeat(8) + "dashboards", REJECT],
  ["array instead of a string", ["dashboards"], REJECT],
  ["null", null, REJECT],
  ["number", 1, REJECT],
];

for (const [label, input, expected] of CASES) {
  const body = input === ABSENT ? { ...BASE } : { ...BASE, service: input };
  const r = contactSchema.safeParse(body);
  if (expected === REJECT) {
    if (r.success) fail(label, `accepted as ${JSON.stringify(r.data.service)}`);
    else {
      // The client maps 422 issues by top-level key: the rejection must land
      // on `service` and nowhere else.
      const keys = Object.keys(r.error.flatten().fieldErrors);
      if (keys.join() !== "service") fail(label, `rejected under ${JSON.stringify(keys)}, expected ["service"]`);
      else pass(label, "rejected (service)");
    }
    continue;
  }
  if (!r.success) {
    fail(label, `rejected: ${JSON.stringify(r.error.flatten().fieldErrors)}`);
    continue;
  }
  if (r.data.service !== expected) fail(label, `stored ${JSON.stringify(r.data.service)}, expected ${JSON.stringify(expected)}`);
  else pass(label, `stored ${JSON.stringify(r.data.service)}`);
}

// The notification email shows labels, in stored order; an unknown entry in
// an old row is shown as it is, not dropped.
for (const [input, expected] of [
  [undefined, []],
  ["", []],
  ["automation", ["Reporting automation"]],
  ["dashboards,custom-software,other", ["Dashboards & business intelligence", "AI agents & custom software", "Not sure yet"]],
  ["dashboards,legacy", ["Dashboards & business intelligence", "legacy"]],
]) {
  const got = serviceLabels(input);
  const where = `labels for ${JSON.stringify(input)}`;
  if (JSON.stringify(got) !== JSON.stringify(expected)) fail(where, `${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`);
  else pass(where, JSON.stringify(got));
}

console.log(failures ? `\n${failures} check(s) failed.` : "\nAll schema checks hold.");
process.exit(failures ? 1 : 0);
