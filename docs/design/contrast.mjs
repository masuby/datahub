// WCAG 2.x contrast check for every text/UI-on-background pair in the DataHub tokens.
// Run: node contrast.mjs   (prints a markdown table + a FAILS count)
const hex = (h) => { h = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const cr = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const mix = (a, b, t) => '#' + hex(a).map((v, i) => Math.round(v * (1 - t) + hex(b)[i] * t).toString(16).padStart(2, '0')).join('');

export const light = {
  bg: '#F6F9FE', 'bg-elev': '#FFFFFF', 'bg-sunk': '#EAF1FC',
  fg: '#061433', 'fg-muted': '#3B4B6B', 'fg-subtle': '#55668A',
  rule: '#D9E2F1', 'rule-strong': '#B7C6DF', 'rule-input': '#7486A8',
  accent: '#0257D6', 'accent-display': '#036BFB',
  action: '#036BFB', 'action-hover': '#022970', 'on-action': '#FFFFFF', 'on-action-hover': '#FFFFFF',
  focus: '#036BFB', error: '#B42335', warn: '#9A5700', ok: '#0257D6',
  s1: '#036BFB', s2: '#022970', s3: '#0B7FBF', 's-ref': '#55668A',
  ramp1: '#5B8FE0', ramp2: '#2F74E6', ramp3: '#036BFB', ramp4: '#0A4DB8', ramp5: '#022970',
};
export const dark = {
  bg: '#030A1C', 'bg-elev': '#071430', 'bg-sunk': '#0B1D42', 'bg-ink': '#040C21',
  fg: '#EAF1FF', 'fg-muted': '#A7B6D3', 'fg-subtle': '#8292B4',
  rule: '#14254A', 'rule-strong': '#23396A', 'rule-input': '#5B6E96',
  accent: '#68D4FB', 'accent-display': '#68D4FB',
  action: '#036BFB', 'action-hover': '#68D4FB', 'on-action': '#FFFFFF', 'on-action-hover': '#030A1C',
  focus: '#68D4FB', error: '#FF8B8B', warn: '#FFC266', ok: '#68D4FB',
  s1: '#68D4FB', s2: '#3D8BFF', s3: '#B8C7E6', 's-ref': '#8292B4',
  ramp1: '#2E6FD8', ramp2: '#3D8BFF', ramp3: '#4FB4F8', ramp4: '#8FDDFC', ramp5: '#D5F3FF',
};

// Derived worst-case backgrounds
const WASH_DARK = mix(dark.bg, '#022970', 0.55); // navy radial wash peak (hero, ink band)
const SAFE_DARK = mix(mix(dark.bg, '#022970', 0.30), '#68D4FB', 0.22); // hero text zone worst case
const SAFE_LIGHT = mix(mix(light.bg, '#CFE0FB', 0.4), '#036BFB', 0.12); // day-silk text zone worst case
const ELEV_94_DARK = mix(dark.bg, dark['bg-elev'], 0.94);

const rows = [];
function check(theme, t, fgKey, bgName, bgHex, min, use) {
  const f = t[fgKey] ?? fgKey;
  const v = cr(f, bgHex);
  rows.push({ theme, pair: `${fgKey} on ${bgName}`, fg: f, bg: bgHex, ratio: v.toFixed(2), min, pass: v >= min ? 'PASS' : 'FAIL', use });
}
function raw(theme, pair, f, b, min, use) {
  const v = cr(f, b);
  rows.push({ theme, pair, fg: f, bg: b, ratio: v.toFixed(2), min, pass: v >= min ? 'PASS' : 'FAIL', use });
}

for (const [name, t, bgs] of [
  ['light', light, [['bg', light.bg], ['bg-elev', light['bg-elev']], ['bg-sunk', light['bg-sunk']]]],
  ['dark+ink', dark, [['bg', dark.bg], ['bg-elev', dark['bg-elev']], ['bg-sunk', dark['bg-sunk']], ['bg-ink', dark['bg-ink']], ['wash-peak', WASH_DARK]]],
]) {
  for (const [bn, bh] of bgs) {
    check(name, t, 'fg', bn, bh, 4.5, 'body text');
    check(name, t, 'fg-muted', bn, bh, 4.5, 'secondary text');
    check(name, t, 'fg-subtle', bn, bh, 4.5, 'captions, mono labels, axes');
    check(name, t, 'accent', bn, bh, 4.5, 'links, small accent text');
    check(name, t, 'error', bn, bh, 4.5, 'error text');
    check(name, t, 'warn', bn, bh, 4.5, 'watch text in charts');
  }
  const b = t.bg;
  check(name, t, 'accent-display', 'bg', b, 3, 'large text (>=24px, or >=19px bold), accent rules');
  check(name, t, 'rule-input', 'bg', b, 3, 'input underline, slider track (UI)');
  check(name, t, 'rule-input', 'bg-elev', t['bg-elev'], 3, 'input underline on elev (UI)');
  check(name, t, 'focus', 'bg', b, 3, 'focus outline (UI)');
  check(name, t, 'focus', 'bg-elev', t['bg-elev'], 3, 'focus outline on elev (UI)');
  for (const s of ['s1', 's2', 's3', 's-ref', 'ramp1', 'ramp2', 'ramp3', 'ramp4', 'ramp5']) check(name, t, s, 'bg', b, 3, 'chart mark (graphic)');
  for (const s of ['s1', 's2', 's3', 'ramp1', 'ramp5']) check(name, t, s, 'bg-elev', t['bg-elev'], 3, 'chart mark on elev');
  raw(name, 'on-action on action', t['on-action'], t.action, 4.5, 'primary button label');
  raw(name, 'on-action-hover on action-hover', t['on-action-hover'], t['action-hover'], 4.5, 'primary button hover label');
  raw(name, 'action on bg', t.action, b, 3, 'button shape vs page (UI)');
}
if (true) {
  // ink band inside light theme uses the dark set, measured on bg-ink
  for (const k of ['s1', 's2', 's3', 'ramp1', 'ramp2']) check('dark+ink', dark, k, 'bg-ink', dark['bg-ink'], 3, 'chart mark in ink band');
}
check('dark+ink', dark, 'fg', 'hero-safe-worst', SAFE_DARK, 4.5, 'H1 / lead over night silk');
check('dark+ink', dark, 'fg-muted', 'hero-safe-worst', SAFE_DARK, 4.5, 'lead over night silk');
check('dark+ink', dark, 'accent', 'hero-safe-worst', SAFE_DARK, 4.5, 'eyebrow / link over night silk');
check('dark+ink', dark, 'accent-display', 'hero-safe-worst', SAFE_DARK, 3, 'accent word (display) over night silk');
check('light', light, 'fg', 'hero-safe-worst', SAFE_LIGHT, 4.5, 'H1 / lead over day silk');
check('light', light, 'fg-muted', 'hero-safe-worst', SAFE_LIGHT, 4.5, 'lead over day silk');
check('light', light, 'accent', 'hero-safe-worst', SAFE_LIGHT, 4.5, 'eyebrow / link over day silk');
check('light', light, 'accent-display', 'hero-safe-worst', SAFE_LIGHT, 3, 'accent word (display) over day silk');
check('dark+ink', dark, 'fg-subtle', 'header-94%', ELEV_94_DARK, 4.5, 'header mono text');

for (const [n, t] of [['light', light], ['dark+ink', dark]]) for (const k of ['rule', 'rule-strong']) rows.push({ theme: n, pair: `${k} on bg`, fg: t[k], bg: t.bg, ratio: cr(t[k], t.bg).toFixed(2), min: 'n/a', pass: 'DECOR', use: 'hairline; never the only carrier of meaning' });
rows.push({ theme: 'light', pair: 'brand sky on bg (reference)', fg: '#68D4FB', bg: light.bg, ratio: cr('#68D4FB', light.bg).toFixed(2), min: 'n/a', pass: 'NEVER TEXT', use: 'fills / glow only in light' });
rows.push({ theme: 'light', pair: 'wordmark-hub on bg (logo)', fg: '#1FA2E0', bg: light.bg, ratio: cr('#1FA2E0', light.bg).toFixed(2), min: 'n/a', pass: 'EXEMPT', use: 'logotype (WCAG exempt)' });
rows.push({ theme: 'dark+ink', pair: 'brand navy on bg (reference)', fg: '#022970', bg: dark.bg, ratio: cr('#022970', dark.bg).toFixed(2), min: 'n/a', pass: 'NEVER INK', use: 'wash fill only in dark' });

const fails = rows.filter((r) => r.pass === 'FAIL');
console.log('| Theme | Pair | FG | BG | Ratio | Min | Result | Use |\n|---|---|---|---|---|---|---|---|');
for (const r of rows) console.log(`| ${r.theme} | ${r.pair} | \`${r.fg}\` | \`${r.bg}\` | ${r.ratio} | ${r.min} | ${r.pass} | ${r.use} |`);
console.log(`\nDerived: WASH_DARK=${WASH_DARK} SAFE_DARK=${SAFE_DARK} SAFE_LIGHT=${SAFE_LIGHT} HEADER94=${ELEV_94_DARK}`);
console.log(`FAILS: ${fails.length}`);
for (const f of fails) console.log('  FAIL', f.theme, f.pair, f.ratio);
