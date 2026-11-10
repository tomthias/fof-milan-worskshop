---
name: fof-spec
description: Legge un componente shadcn dal codice, dal registry shadcn e da Figma, e scrive o aggiorna la sua spec di documentazione in docs/specs/<slug>.json. Usala quando si vuole documentare un componente o confrontare codice e Figma. Comando /fof-spec <componente>.
---

# fof-spec — leggere un componente e scriverne la spec

> **Versione base.** Questa skill fa il minimo: legge e scrive una spec valida.
> Nel Lab 1 la completi tu, nella sezione "Le tue regole" in fondo.

La spec (`docs/specs/<slug>.json`) è **l'unica fonte di verità** della documentazione.
Il frame in Figma lo costruisce un'altra skill (`/fof-figma-doc`), sempre a partire dalla spec.

- Formato della spec → `docs/specs/_schema.json`.
- Esempio completo → `docs/specs/button.json`. Esempio minimo → `docs/specs/badge.json`.
- Sezioni possibili e cosa contengono → `references/menu-sezioni.md`.

## 0. Prima di iniziare

- **Node**: controlla `node -v`. Se non c'è, avvisa una volta che fai i controlli leggendo i file
  (consuma più quota, è meno preciso) e usa `references/controlli-senza-node.md` al posto degli script.
- **File Figma**: serve il link della copia dell'utente (vedi AGENTS.md, regola 6). Se non l'ha dato in
  questa sessione, chiedilo. Se Figma non è collegato, vai avanti senza e dillo.

## 1. Leggere

Come leggere ogni fonte → `references/come-leggere.md`.

| Fonte | Strumento | Cosa prendi |
|---|---|---|
| Codice `components/ui/<slug>.tsx` | lettura file | varianti cva, props, `data-slot`, classi di stato e di colore |
| `app/globals.css` | lettura file | valori delle variabili in Light e Dark |
| Registry shadcn | MCP `shadcn` (senza Node: sito ui.shadcn.com) | descrizione e uso previsto |
| Figma | MCP `figma` (`get_metadata`, `get_design_context`, `get_variable_defs`) | variant properties, layer, variabili collegate |
| Contrasto | `node scripts/fof-tokens.mjs --json` | rapporti già calcolati |

## 2. Scrivere la spec

- Se l'utente non dice quali sezioni, metti solo le tre obbligatorie: `overview`, `variants`, `mismatches`.
- Se la spec esiste già, parti da quella: non riscrivere la prosa che l'utente ha già sistemato.
- **Il codice vince sui fatti.** Props, varianti, default e stati si prendono dal sorgente.
- **Non scegliere fra codice e Figma.** Se dicono cose diverse, scrivi la differenza in `mismatches`.
- `provenance.verified` resta `false` finché l'utente non dice che la spec va bene.

## 3. Controllare

Lancia `node scripts/check-spec.mjs <slug>` e correggi gli errori finché esce pulita.
Gli avvisi (`!`) non vanno corretti per forza.

## 4. Fermati

Di' in poche righe cosa hai scritto e l'esito di `check-spec`. Prossimo passo: `/fof-figma-doc <slug>`.

---

## Le tue regole (Lab 1)

<!--
Qui scrivi tu come vuoi che l'agente lavori. Ogni regola: una frase, concreta.
Dopo ogni modifica rilancia /fof-spec sullo stesso componente e guarda cosa cambia.

Qualche idea per cominciare (scegline una o due, o inventane altre):
- Sezioni: prima di scrivere, mostra il menu delle sezioni e chiedi quali voglio (2 o 3 oltre alle obbligatorie).
- Do & Don't: quante regole proporre, con che tono, con quali testi d'esempio,
  e cosa mi chiedi prima di considerarle approvate.
- Differenze codice ↔ Figma: in che ordine me le mostri, e cosa mi chiedi per ognuna.
- Resoconto: cosa voglio vedere alla fine, e in che forma.
-->
