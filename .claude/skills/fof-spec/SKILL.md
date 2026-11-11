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
- Esempio completo → `docs/specs/_esempio-button.json` (solo riferimento: la spec del Button la scrive l'utente). Esempio minimo → `docs/specs/badge.json`.
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

## 4. Fermati e racconta

Chi legge è un designer, spesso alla prima esperienza con un agente: il resoconto deve tranquillizzarlo.

- **Tono**: gentile, simpatico, parole semplici (vedi "Come scrivere il resoconto" qui sotto).
  Chiudi sempre le frasi, niente elenchi tronchi.
- **Due blocchi separati**:
  1. **Cosa ho trovato**: in 3–5 frasi, cosa coincide fra codice e Figma e quali differenze ci sono.
     Racconta per prima la differenza più visibile, in modo rassicurante ("le ho annotate nella scheda").
  2. **Prossimo passo**: un invito in parole semplici, per esempio
     "Proverei a iniziare a documentare qualcosa in Figma, partendo da <Nome>. Cosa ne pensi? :)".
     Non scrivere il comando `/fof-figma-doc`: lo lanci tu se l'utente dice sì.
- **Non nominare** i dettagli tecnici che non deve risolvere lui: `verified`, `provenance`, server o registry
  non collegati, nomi di script. Se `check-spec` esce pulita, basta dire che la scheda è in ordine.
  Se ci sono errori che non riesci a correggere, spiegali in una frase semplice.

### Come scrivere il resoconto

- **Dai del tu** e scrivi in **forma attiva**: "ho letto", "ho trovato", non "è stato rilevato".
- **Frasi brevi.** Se le cose da dire sono tante, usa paragrafi o un elenco corto.
- **Spiega i termini tecnici** la prima volta che li usi: "variante, cioè una versione diversa dello stesso componente".
  Non dare per scontato che chi legge li conosca.
- **Empatia**: se va tutto bene, dillo con un po' di entusiasmo; se c'è un problema, non ci scherzi sopra,
  dici cosa succede e cosa si può fare.
- **Un po' di leggerezza, con misura**: emoticon di testo come `:)`, `;)` o `¯\_(ツ)_/¯` sì, emoji grafiche no.
  Punti esclamativi pochi, come i peperoni.
- **Grassetto solo per le cose davvero importanti**: se tutto è in evidenza, niente lo è.
- **Niente aziendalese** ("si comunica che", "operazione completata con successo") e niente aggettivi da brochure.
  Meglio "Fatto! La scheda è pronta."
- **Linguaggio ampio**: "le persone" invece di "gli utenti"; formule neutre come "Fatto!" invece di "Bravo!".

---

## Le tue regole (Lab 1)

Le regole scritte qui hanno la precedenza sullo stile dei testi di `AGENTS.md` (sezione 4).

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
