#!/usr/bin/env node
// fof-tokens — controlla che codice e Figma usino gli stessi colori, e che siano accessibili.
//
//   node scripts/fof-tokens.mjs            tabella leggibile
//   node scripts/fof-tokens.mjs --json     output per l'agente
//
// Legge:  app/globals.css     (:root = Light, .dark = Dark)
//         tokens/tokens.json  (sintassi Luckino: collection "theme", alias risolti su "primitives")
// Controlla:
//   1. stessi nomi da tutte e due le parti
//   2. stesso valore per ogni modo
//   3. contrasto WCAG delle coppie che si usano insieme
// Esce con codice 1 se qualcosa non va. Nessuna dipendenza: basta Node 18+.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const asJson = process.argv.includes('--json');

// ---------------------------------------------------------------- lettura codice
function readCss() {
  const css = readFileSync(join(ROOT, 'app/globals.css'), 'utf8');
  const block = (sel) => {
    const m = css.match(new RegExp(sel.replace('.', '\\.') + '\\s*\\{([^}]*)\\}'));
    if (!m) throw new Error(`Blocco ${sel} non trovato in app/globals.css`);
    const vars = {};
    for (const [, k, v] of m[1].matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) vars[k] = v.trim().toLowerCase();
    return vars;
  };
  return { Light: block(':root'), Dark: block('.dark') };
}

// ---------------------------------------------------------------- lettura Figma
function readFigma() {
  const data = JSON.parse(readFileSync(join(ROOT, 'tokens/tokens.json'), 'utf8'));
  // token = oggetto con $value; i nodi intermedi sono gruppi; le chiavi con $ sono metadati
  const flat = (node, path = []) => Object.entries(node).flatMap(([k, v]) =>
    k.startsWith('$') ? [] : v && '$value' in v ? [[[...path, k].join('.'), v]] : flat(v, [...path, k]));
  const pmap = Object.fromEntries(flat(data.primitives).map(([n, t]) => [n, t.$value]));
  const out = { Light: {}, Dark: {} };
  for (const [name, t] of flat(data.theme)) {
    if (t.$type !== 'color') continue;
    for (const mode of ['Light', 'Dark']) {
      let val = t.$value[mode];
      const alias = /^\{primitives\.(.+)\}$/.exec(val);
      if (alias) val = pmap[alias[1]];
      if (!val) throw new Error(`Alias non risolto: ${name} (${mode}) → ${t.$value[mode]}`);
      out[mode][name] = val.toLowerCase();
    }
  }
  return out;
}

// ---------------------------------------------------------------- contrasto WCAG
const lum = (hex) => {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

// Coppie che nei componenti stanno davvero una sopra l'altra.
// min 4.5 = testo normale (AA) · min 3 = componenti UI e focus (WCAG 1.4.11)
const PAIRS = [
  ['foreground', 'background', 4.5],
  ['card-foreground', 'card', 4.5],
  ['popover-foreground', 'popover', 4.5],
  ['primary-foreground', 'primary', 4.5],
  ['secondary-foreground', 'secondary', 4.5],
  ['accent-foreground', 'accent', 4.5],
  ['destructive-foreground', 'destructive', 4.5],
  ['muted-foreground', 'muted', 4.5],
  ['muted-foreground', 'background', 4.5],
  ['muted-foreground', 'card', 4.5],
  ['destructive', 'card', 4.5],
  ['link', 'background', 4.5],
  ['input', 'background', 3],
  ['ring', 'background', 3],
];

// ---------------------------------------------------------------- confronto
const code = readCss();
const figma = readFigma();
const issues = [];
const rows = [];

for (const mode of ['Light', 'Dark']) {
  const names = new Set([...Object.keys(code[mode]), ...Object.keys(figma[mode])]);
  names.delete('radius');
  for (const n of [...names].sort()) {
    const c = code[mode][n], f = figma[mode][n];
    if (!c) issues.push({ type: 'solo-figma', mode, name: n, figma: f });
    else if (!f) issues.push({ type: 'solo-codice', mode, name: n, code: c });
    else if (c !== f) issues.push({ type: 'valore-diverso', mode, name: n, code: c, figma: f });
  }
  for (const [fg, bg, min] of PAIRS) {
    const a = code[mode][fg], b = code[mode][bg];
    if (!a || !b) continue;
    const r = ratio(a, b);
    const pass = r >= min;
    rows.push({ mode, pair: `${fg} / ${bg}`, ratio: Math.round(r * 100) / 100, min, pass });
    if (!pass) issues.push({ type: 'contrasto', mode, name: `${fg} / ${bg}`, ratio: Math.round(r * 100) / 100, min });
  }
}

if (asJson) {
  console.log(JSON.stringify({ ok: issues.length === 0, contrast: rows, issues }, null, 2));
} else {
  console.log('\nContrasto (WCAG 2.1)\n');
  for (const r of rows) {
    console.log(`  ${r.pass ? '✓' : '✗'} ${r.mode.padEnd(5)} ${r.pair.padEnd(40)} ${r.ratio.toFixed(2).padStart(5)}:1  (min ${r.min})`);
  }
  console.log('\nCodice ↔ Figma\n');
  const sync = issues.filter((i) => i.type !== 'contrasto');
  if (!sync.length) console.log('  ✓ stessi nomi e stessi valori in Light e Dark');
  for (const i of sync) {
    if (i.type === 'solo-figma') console.log(`  ✗ ${i.mode} ${i.name}: c'è solo in Figma (${i.figma})`);
    if (i.type === 'solo-codice') console.log(`  ✗ ${i.mode} ${i.name}: c'è solo nel codice (${i.code})`);
    if (i.type === 'valore-diverso') console.log(`  ✗ ${i.mode} ${i.name}: codice ${i.code} · Figma ${i.figma}`);
  }
  console.log(issues.length ? `\n${issues.length} problemi.\n` : '\nTutto a posto.\n');
}
process.exit(issues.length ? 1 : 0);
