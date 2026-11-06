#!/usr/bin/env node
// fof-site — aggiorna la documentazione HTML (docs/site) con le spec di docs/specs.
//
//   node scripts/fof-site.mjs
//
// Scrive docs/site/specs.js, che il visualizzatore legge. Poi apri docs/site/index.html nel browser.
// Le anteprime sono i componenti React veri, già compilati in docs/site/assets.
// Nessuna dipendenza: basta Node 18+.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(ROOT, 'docs/specs');
const specs = [];
const skipped = [];
for (const f of readdirSync(dir).filter((f) => f.endsWith('.json') && !f.startsWith('_')).sort()) {
  try {
    const s = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    if (!s.slug || !Array.isArray(s.sections)) { skipped.push(`${f} (manca slug o sections)`); continue; }
    specs.push(s);
  } catch (e) {
    skipped.push(`${f} (JSON non valido: ${e.message})`);
  }
}
const date = new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
const out = `// Generato da scripts/fof-site.mjs il ${date}. Non modificare a mano.\n`
  + `window.FOF_GENERATED = ${JSON.stringify(date)};\n`
  + `window.FOF_SPECS = ${JSON.stringify(specs, null, 2)};\n`;
writeFileSync(join(ROOT, 'docs/site/specs.js'), out);

console.log(`\nfof-site: ${specs.length} componenti → docs/site/specs.js`);
for (const s of specs) console.log(`  ✓ ${s.name} (${s.sections.join(', ')})`);
for (const s of skipped) console.log(`  ✗ saltato: ${s}`);
console.log('\nApri docs/site/index.html nel browser.\n');
