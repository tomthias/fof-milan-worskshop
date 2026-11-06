---
name: fof-spec
description: Legge un componente shadcn dal codice, dal registry shadcn e da Figma, e scrive o aggiorna la sua spec di documentazione in docs/specs/<slug>.json. Usala quando si vuole documentare un componente, scegliere le sezioni della documentazione, confrontare codice e Figma o proporre Do & Don't. Comando /fof-spec <componente>.
---

# fof-spec — leggere un componente e scriverne la spec

La spec (`docs/specs/<slug>.json`) è **l'unica fonte di verità** della documentazione.
Questa skill la scrive. Il frame in Figma lo costruisce un'altra skill (`/fof-figma-doc`),
sempre e solo a partire dalla spec.

Formato della spec → `docs/specs/_schema.json`.
Esempio completo da imitare (tono, lunghezza, livello di dettaglio) → `docs/specs/button.json`.
Esempio minimo → `docs/specs/badge.json`.

## Node: con o senza

All'inizio controlla se c'è Node: `node -v`.

- **C'è (versione 18 o più)** → usa gli script, come scritto sotto.
- **Non c'è** → avvisa l'utente con questa frase, una volta sola, e vai avanti:
  > Node non è installato: faccio i controlli leggendo i file io. Funziona, ma consuma più token
  > ed è meno preciso degli script. Se vuoi, installalo da nodejs.org (versione LTS) e riavvia Cursor.

  Poi fai a mano gli stessi controlli dello script (→ `references/controlli-senza-node.md`)
  e nel resoconto scrivi "controlli fatti senza Node".

## 1. Scegliere le sezioni

Se l'utente non le ha già indicate, mostra il menu e chiedi quali vuole.
Il menu, con cosa produce ogni sezione e da dove legge → `references/menu-sezioni.md`.

- `overview`, `variants`, `mismatches` ci sono sempre.
- Proponi 2 o 3 sezioni a scelta, non tutte: in aula c'è poco tempo.
- Se la spec esiste già, parti da quella: aggiungi o togli sezioni, non riscrivere la prosa
  che l'utente ha già sistemato.

## 2. Leggere

Leggi da **tutte** le fonti disponibili. Come leggere ognuna → `references/come-leggere.md`.

| Fonte | Strumento | Cosa prendi |
|---|---|---|
| Codice `components/ui/<slug>.tsx` | lettura file | varianti cva, props, `data-slot`, classi di stato, classi colore |
| `app/globals.css` | lettura file | valori delle variabili in Light e Dark |
| Registry shadcn | MCP `shadcn` (serve Node; senza, cerca "shadcn <componente>" sul sito ui.shadcn.com) | descrizione e uso previsto del componente originale |
| Figma | MCP `figma` (`get_metadata`, `get_design_context`, `get_variable_defs`) | variant properties, nomi dei layer, variabili collegate |
| Contrasto | `node scripts/fof-tokens.mjs --json` (senza Node: calcolo a mano, vedi controlli-senza-node.md) | rapporti già calcolati per le coppie del tema |

Se Figma non è collegato, vai avanti senza: lascia `variants.figma` vuoto e dillo nel resoconto.

## 3. Scrivere la spec

Regole che valgono sempre:

- **Il codice vince sui fatti.** Props, varianti, default e stati si prendono dal sorgente.
  Se una cosa non c'è nel sorgente, non c'è.
- **Non scegliere fra codice e Figma.** Se dicono cose diverse, scrivi la differenza in `mismatches`.
- **Contrasti: con Node non calcolarli a mano**, copiali dall'output di `fof-tokens.mjs`. Senza Node,
  calcolali con la formula di `references/controlli-senza-node.md` e arrotonda a due decimali.
- **Do & Don't** → `references/do-dont.md`. Quelli che proponi tu nascono con
  `"source": "inferenza"` e `"approved": false`. Li approva l'utente, non tu.
- **Lingua**: italiano. Nomi di prop, varianti e variabili restano come nel codice.
- **Lunghezze**: descrizione del componente al massimo 2 frasi. Regole e note: una frase.
- `provenance.verified` resta `false` finché l'utente non dice che la spec va bene.

## 4. Controllare

Con Node: lancia `node scripts/check-spec.mjs <slug>` e correggi gli errori finché esce pulita.
Gli avvisi (`!`) non vanno corretti per forza: riportali.

Senza Node: fai la lista di controlli di `references/controlli-senza-node.md`, punto per punto.

## 5. Resoconto

Breve, in questo ordine:

1. sezioni scelte;
2. differenze codice ↔ Figma trovate (le più interessanti per prime);
3. Do & Don't proposti, numerati, con la domanda: **"Quali approvi? Puoi anche riscriverli."**;
4. esito di `check-spec`;
5. prossimo passo: `/fof-figma-doc <slug>` quando la spec è approvata.

Quando l'utente approva o riscrive delle regole, aggiorna `approved` (e `rule` se l'ha riscritta,
mettendo `"source": "designer"`), poi rilancia `check-spec`.
