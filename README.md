# Design system e AI — workshop Friends of Figma Milan

Benvenuto. In questa cartella c'è tutto quello che serve per il workshop: una piccola libreria
di componenti shadcn, il tema fof-milan, le regole per l'agente AI e tre skill che documentano
i componenti leggendo il codice e Figma e scrivendo la documentazione in Figma.

**Prima del workshop** segui [SETUP.md](SETUP.md): 30-40 minuti, e alla fine c'è un test
finale che ti dice se è tutto a posto.

---

## Dove sta cosa: design e codice

Il workshop lavora su due mondi che descrivono gli stessi componenti:

| | Dove sta | Cosa ci trovi |
|---|---|---|
| **Design** | il **file Figma del corso** (la tua copia) | component set, varianti, variabili |
| **Codice** | in questa cartella: `components/ui/*.tsx` e `app/globals.css` | i componenti React e il tema |
| **Spec** (il ponte) | in questa cartella: `docs/specs/*.json` | cosa dicono i due mondi, e dove non sono d'accordo |

L'agente legge i due mondi (il codice dai file, Figma tramite MCP), scrive la spec, e dalla spec
costruisce la documentazione in Figma. Non devi saper leggere il codice: lo legge l'agente per te.

---

## Cosa c'è

```
fof-milan/
├── README.md              ← sei qui
├── SETUP.md               ← cosa installare prima del workshop
├── LAB.md                 ← i tre esercizi della parte pratica
├── GLOSSARIO.md           ← MCP, skill, spec, instance… in parole semplici
├── AGENTS.md              ← le regole che l'agente segue in questa cartella
├── claude-chat/           ← solo per chi usa Claude in chat: istruzioni del Progetto e skill in .zip
│
├── components/ui/         ← 10 componenti shadcn: button, badge, input, switch, card, alert,
│                             checkbox, radio-group, tabs, select
├── app/globals.css        ← il tema in codice (variabili Light e Dark)
├── tokens/tokens.json  ← lo stesso tema come variabili Figma
│
├── docs/
│   ├── VARIABILI.md       ← come funziona il tema, in Figma e in codice
│   ├── site/              ← il visualizzatore HTML della documentazione (vedi sotto)
│   └── specs/             ← le spec di documentazione (una per componente)
│       ├── _schema.json   ← il formato
│       ├── _esempio-button.json ← esempio completo, solo da guardare: la spec del Button la scrivi tu
│       └── badge.json     ← esempio minimo
│
├── scripts/
│   ├── fof-tokens.mjs     ← controlla tema e contrasti
│   ├── check-spec.mjs     ← controlla una spec prima di costruire il frame
│   └── fof-site.mjs       ← aggiorna la documentazione HTML
│
└── .claude/skills/
    ├── fof-spec/          ← /fof-spec: legge un componente e ne scrive la spec (versione base, la completi nel Lab 1)
    ├── fof-figma-doc/     ← /fof-figma-doc: dalla spec al frame in Figma
    └── fof-site/          ← /fof-site: dalla spec alla pagina HTML
```

**`docs/site/` è già pronto, ed è giusto così.** È un visualizzatore: una pagina HTML che mostra le
spec con i componenti veri. Oggi contiene solo il Badge; i componenti che documenti tu compaiono
quando lanci `/fof-site` (bonus del Lab 2). `assets/app.css` e `app.js` sono file compilati: se
l'editor mostra avvisi su questi file, ignorali e non toccarli.

Insieme a questa cartella ricevi il **file Figma del corso**: stessi componenti, stesse
variabili, una pagina `📄 Docs` con **Button — Esempio**, una documentazione completa da usare come
riferimento. Lì l'agente costruisce anche la tua.

---

## Come funziona, in una riga per passo

1. **Leggi** — `/fof-spec button` legge il componente dal codice e da Figma e ti propone cosa documentare.
2. **Spec** — il risultato è un file `docs/specs/button.json`: lo leggi, lo correggi, approvi i Do & Don't.
3. **Scrivi** — `/fof-figma-doc button` costruisce il frame di documentazione nel tuo file Figma.
4. **Verifica** — guardi il frame. Se qualcosa non va, correggi la spec e rilanci.
5. **Bonus** — `/fof-site` mette la stessa documentazione in una pagina HTML, con i componenti veri.

La spec è l'unica fonte di verità: il frame si rigenera sempre da lì.

---

## Quali componenti sono già documentati

| Componente | Stato |
|---|---|
| Button | da documentare tu. Come riferimento c'è `docs/specs/_esempio-button.json` (completo, con tutte le sezioni) |
| Badge | minimo, solo le sezioni obbligatorie |
| Input, Switch, Card, Alert | da documentare: sono il materiale dei lab |
| Checkbox, Radio Group, Tabs, Select | da documentare, un po' più complessi: più parti e più stati |
