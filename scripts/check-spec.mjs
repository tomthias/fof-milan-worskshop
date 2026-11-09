#!/usr/bin/env node
// check-spec — controlla una spec prima di costruire il frame in Figma.
//
//   node scripts/check-spec.mjs button
//   node scripts/check-spec.mjs button --json
//
// Errori (bloccano /fof-figma-doc):
//   - campi obbligatori mancanti, sezioni sconosciute o senza contenuto
//   - varianti "code" diverse da quelle scritte nel cva del sorgente
//   - variabili che non esistono in app/globals.css
//   - contrasti scritti a mano che non tornano con i colori veri
// Avvisi (non bloccano, ma vanno letti):
//   - differenze codice ↔ Figma non riportate in "mismatches"
//   - Do & Don't non approvati (non finiranno nel frame)
//   - regole da inferenza senza "inferenza" fra le fonti
// Nessuna dipendenza: basta Node 18+.

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2];
const asJson = process.argv.includes('--json');
if (!slug) { console.error('Uso: node scripts/check-spec.mjs <slug>'); process.exit(2); }

const specPath = join(ROOT, 'docs/specs', `${slug}.json`);
if (!existsSync(specPath)) { console.error(`Spec non trovata: docs/specs/${slug}.json`); process.exit(2); }
const spec = JSON.parse(readFileSync(specPath, 'utf8'));

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

// ---------------------------------------------------------------- struttura
const SECTIONS = ['overview', 'variants', 'mismatches', 'anatomy', 'states', 'usage', 'tokens', 'a11y', 'code', 'spacing', 'content', 'context'];
const MANDATORY = ['overview', 'variants', 'mismatches'];
for (const k of ['name', 'slug', 'description', 'sections', 'source', 'variants', 'mismatches', 'provenance']) {
  if (spec[k] === undefined) err(`manca il campo "${k}"`);
}
if (spec.slug && spec.slug !== slug) err(`slug "${spec.slug}" diverso dal nome file "${slug}"`);
if (spec.description && spec.description.length > 280) err(`description troppo lunga (${spec.description.length}/280)`);
for (const s of spec.sections || []) if (!SECTIONS.includes(s)) err(`sezione sconosciuta "${s}"`);
for (const s of MANDATORY) if (!(spec.sections || []).includes(s)) err(`manca la sezione obbligatoria "${s}"`);

const sectionData = {
  anatomy: spec.anatomy, states: spec.states, usage: spec.usage, tokens: spec.tokens,
  a11y: spec.a11y, code: spec.code, spacing: spec.spacing, content: spec.content, context: spec.context,
};
for (const s of spec.sections || []) {
  if (!(s in sectionData)) continue;
  const d = sectionData[s];
  const empty = d == null || (Array.isArray(d) && !d.length) || (typeof d === 'object' && !Array.isArray(d) && !Object.keys(d).length);
  if (empty) err(`la sezione "${s}" è scelta ma non ha contenuto`);
}

// ---------------------------------------------------------------- varianti dal sorgente (cva)
function matchBrace(src, open) {
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (!depth) return i; }
  }
  return -1;
}
function topKeys(body) {
  // chiavi al primo livello di un oggetto letterale: { a: ..., "b": ..., c: {...} }
  const keys = [];
  let depth = 0, i = 0;
  while (i < body.length) {
    const ch = body[i];
    if (ch === '{' || ch === '[' || ch === '(') depth++;
    else if (ch === '}' || ch === ']' || ch === ')') depth--;
    else if (ch === '"' || ch === "'" || ch === '`') {
      const end = body.indexOf(ch, i + 1);
      if (depth === 0) {
        const after = body.slice(end + 1).match(/^\s*:/);
        if (after) keys.push(body.slice(i + 1, end));
      }
      i = end + 1; continue;
    } else if (depth === 0) {
      const m = body.slice(i).match(/^([A-Za-z_$][\w$]*)\s*:/);
      if (m && (i === 0 || /[\s,{]/.test(body[i - 1]))) { keys.push(m[1]); i += m[0].length; continue; }
    }
    i++;
  }
  return keys;
}
function cvaVariants(src) {
  const out = {};
  const at = src.indexOf('variants:');
  if (at < 0) return out;
  const open = src.indexOf('{', at);
  const close = matchBrace(src, open);
  const body = src.slice(open + 1, close);
  for (const name of topKeys(body)) {
    const re = new RegExp(`(^|[\\s,{])${name}\\s*:\\s*\\{`);
    const m = re.exec(body);
    const o = body.indexOf('{', m.index + m[0].length - 1);
    const c = matchBrace(body, o);
    out[name] = topKeys(body.slice(o + 1, c));
  }
  return out;
}

const codePath = join(ROOT, spec.source?.code || '');
let src = '';
if (!spec.source?.code || !existsSync(codePath)) err(`file sorgente non trovato: ${spec.source?.code}`);
else src = readFileSync(codePath, 'utf8');

const realVariants = src ? cvaVariants(src) : {};
const specCode = spec.variants?.code || {};
const same = (a = [], b = []) => a.length === b.length && a.every((x) => b.includes(x));
for (const k of new Set([...Object.keys(realVariants), ...Object.keys(specCode)])) {
  if (!realVariants[k]) err(`variants.code.${k} non esiste nel cva del sorgente`);
  else if (!specCode[k]) err(`variants.code non riporta "${k}" (nel sorgente: ${realVariants[k].join(', ')})`);
  else if (!same(realVariants[k], specCode[k])) err(`variants.code.${k} = [${specCode[k]}] ma nel sorgente è [${realVariants[k]}]`);
}

// ---------------------------------------------------------------- codice ↔ Figma
const figmaV = spec.variants?.figma;
if (!figmaV) warn('variants.figma vuoto: la lettura da Figma non è stata fatta (va bene solo se Figma non era collegato)');
else {
  const mm = JSON.stringify(spec.mismatches || []).toLowerCase();
  for (const k of new Set([...Object.keys(specCode), ...Object.keys(figmaV)])) {
    const c = specCode[k] || [], f = figmaV[k] || [];
    const diff = [...c.filter((x) => !f.includes(x)), ...f.filter((x) => !c.includes(x))];
    if (!c.length || !f.length) { if (!mm.includes(k.toLowerCase())) warn(`la proprietà "${k}" c'è da una parte sola ma non è in mismatches`); continue; }
    for (const v of diff) if (!mm.includes(v.toLowerCase())) warn(`"${k}=${v}" c'è da una parte sola ma non è in mismatches`);
  }
}

// ---------------------------------------------------------------- token
const css = readFileSync(join(ROOT, 'app/globals.css'), 'utf8');
const block = (sel) => {
  const m = css.match(new RegExp(sel.replace('.', '\\.') + '\\s*\\{([^}]*)\\}'));
  return Object.fromEntries([...m[1].matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)].map(([, k, v]) => [k, v.trim().toLowerCase()]));
};
const theme = { Light: block(':root'), Dark: block('.dark') };
for (const t of spec.tokens || []) {
  if (!theme.Light[t.variable]) err(`token "${t.variable}" (${t.part}) non esiste in app/globals.css`);
  else if (src && !new RegExp(`(bg|text|border|ring|outline|fill|stroke)-${t.variable}(?![\\w-])`).test(src)) {
    warn(`token "${t.variable}" non compare come classe nel sorgente: verificare (${t.part})`);
  }
}

// ---------------------------------------------------------------- contrasto
const lum = (hex) => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    .reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0);
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
for (const c of spec.a11y?.contrast || []) {
  const [fg, bg] = c.pair.split('/').map((s) => s.trim());
  const a = theme[c.mode]?.[fg], b = theme[c.mode]?.[bg];
  if (!a || !b) { err(`contrasto "${c.pair}" (${c.mode}): variabile non trovata`); continue; }
  const r = Math.round(ratio(a, b) * 100) / 100;
  if (Math.abs(r - c.ratio) > 0.05) err(`contrasto "${c.pair}" (${c.mode}): scritto ${c.ratio}, calcolato ${r}`);
  if ((r >= c.min) !== c.pass) err(`contrasto "${c.pair}" (${c.mode}): pass=${c.pass} ma ${r} vs min ${c.min}`);
}

// ---------------------------------------------------------------- Do & Don't
const usage = spec.usage || [];
const pending = usage.filter((u) => !u.approved);
if (pending.length) warn(`${pending.length} Do/Don't non approvati: non finiranno nel frame`);
for (const u of usage) {
  for (const s of u.scene || []) {
    if (!existsSync(join(ROOT, 'components/ui', `${s.component}.tsx`))) err(`scena "${u.rule.slice(0, 40)}…": componente "${s.component}" non esiste`);
  }
  if (u.mode === 'selection' && !u.selectionId) err(`regola "${u.rule.slice(0, 40)}…": mode selection senza selectionId`);
}
if (usage.some((u) => u.source === 'inferenza') && !(spec.provenance?.sources || []).includes('inferenza')) {
  warn('ci sono regole da inferenza ma "inferenza" non è fra le fonti di provenance');
}
if (spec.provenance?.verified === true && pending.length) warn('verified: true ma ci sono regole non approvate');

// ---------------------------------------------------------------- snippet di codice
// Uno snippet non deve promettere cose che il componente non fa: import, props e valori veri.
const snippets = spec.code || [];
if (spec.code !== undefined && !Array.isArray(spec.code)) err('"code" deve essere una lista di snippet');
const exported = src ? [...src.matchAll(/export\s*\{([^}]*)\}/g)].flatMap((m) => m[1].split(',').map((s) => s.trim()).filter(Boolean)) : [];
const pkg = existsSync(join(ROOT, 'package.json')) ? JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) : {};
const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
for (const [i, c] of (Array.isArray(snippets) ? snippets : []).entries()) {
  const name = `snippet ${i + 1}${c && c.title ? ` "${c.title}"` : ''}`;
  if (!c || typeof c.snippet !== 'string' || !c.snippet.trim()) { err(`${name}: manca il codice (campo "snippet")`); continue; }
  if (!c.title) warn(`${name}: manca il titolo`);
  for (const m of c.snippet.matchAll(/import\s*\{([^}]*)\}\s*from\s*["']([^"']+)["']/g)) {
    const from = m[2];
    if (from.startsWith('@/components/ui/')) {
      const file = from.replace('@/components/ui/', '');
      if (!existsSync(join(ROOT, 'components/ui', `${file}.tsx`))) err(`${name}: importa da "${from}", che non esiste`);
      else if (file === slug) for (const n of m[1].split(',').map((s) => s.trim()).filter(Boolean)) {
        if (exported.length && !exported.includes(n)) err(`${name}: "${n}" non è esportato da ${spec.source.code}`);
      }
    } else if (!from.startsWith('@/') && !from.startsWith('.') && !deps[from] && from !== 'react') {
      err(`${name}: usa "${from}", che non è fra le dipendenze del progetto`);
    }
  }
  for (const [prop, values] of Object.entries(realVariants)) {
    for (const m of c.snippet.matchAll(new RegExp(`\\b${prop}="([^"]*)"`, 'g'))) {
      if (!values.includes(m[1])) err(`${name}: ${prop}="${m[1]}" non esiste (valori: ${values.join(', ')})`);
    }
  }
  const long = c.snippet.split('\n').filter((l) => l.length > 100).length;
  if (long) warn(`${name}: ${long} righe oltre 100 caratteri, nel frame si leggono male`);
}

// ---------------------------------------------------------------- resoconto
const ok = errors.length === 0;
if (asJson) console.log(JSON.stringify({ ok, errors, warnings }, null, 2));
else {
  console.log(`\ncheck-spec ${slug}: ${ok ? '✓ pronta per /fof-figma-doc' : '✗ da correggere'}\n`);
  for (const e of errors) console.log(`  ✗ ${e}`);
  for (const w of warnings) console.log(`  ! ${w}`);
  console.log('');
}
process.exit(ok ? 0 : 1);
