# Design system e AI — workshop Friends of Figma Milan

Benvenuto. In questa cartella c'è tutto quello che serve per il workshop: una piccola libreria
di componenti shadcn, il tema fof-milano, le regole per l'agente AI e due skill che documentano
i componenti leggendo il codice e Figma e scrivendo la documentazione in Figma.

**Prima del workshop** segui [SETUP.md](SETUP.md): bastano 15 minuti e alla fine c'è un test
di 2 minuti che ti dice se è tutto a posto.

---

## Cosa c'è

```
fof-milano/
├── README.md              ← sei qui
├── SETUP.md               ← cosa installare prima del workshop
├── LAB.md                 ← i tre esercizi della parte pratica
├── GLOSSARIO.md           ← MCP, skill, spec, instance… in parole semplici
├── AGENTS.md              ← le regole che l'agente segue in questa cartella
│
├── components/ui/         ← 6 componenti shadcn: button, badge, input, switch, card, alert
├── app/globals.css        ← il tema in codice (variabili Light e Dark)
├── tokens/fof-theme.json  ← lo stesso tema come variabili Figma
│
├── docs/
│   ├── VARIABILI.md       ← come funziona il tema, in Figma e in codice
│   ├── site/              ← la documentazione HTML: apri index.html
│   └── specs/             ← le spec di documentazione (una per componente)
│       ├── _schema.json   ← il formato
│       ├── button.json    ← esempio completo, da usare come riferimento
│       └── badge.json     ← esempio minimo
│
├── scripts/
│   ├── fof-tokens.mjs     ← controlla tema e contrasti
│   ├── check-spec.mjs     ← controlla una spec prima di costruire il frame
│   └── fof-site.mjs       ← aggiorna la documentazione HTML
│
└── .claude/skills/
    ├── fof-spec/          ← /fof-spec: legge un componente e ne scrive la spec
    ├── fof-figma-doc/     ← /fof-figma-doc: dalla spec al frame in Figma
    └── fof-site/          ← /fof-site: dalla spec alla pagina HTML
```

Insieme a questa cartella ricevi il **file Figma del corso**: stessi componenti, stesse
variabili, una pagina `📄 Docs` con il Button già documentato.

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
| Button | completo, con tutte le sezioni: è il riferimento |
| Badge | minimo, solo le sezioni obbligatorie |
| Input, Switch, Card, Alert | da documentare: sono il materiale dei lab |
