# AGENTS.md — fof-milan

Repo del workshop **Design system e AI** di Friends of Figma Milan.
Qui si documentano componenti shadcn/ui con un agente AI, leggendo da codice e Figma e
scrivendo la documentazione in Figma. Queste regole valgono per qualsiasi agente (Claude Code,
Claude in chat, Cursor, …). Leggile tutte prima di generare qualcosa.

Chi usa questa repo è quasi sempre un **designer**: spiega in parole semplici, senza gergo da
sviluppatore, e mostra cosa hai fatto più che come.

---

## La pipeline

```
LEGGI              ──►  SPEC                    ──►  SCRIVI                  ──►  VERIFICA
codice + Figma          docs/specs/<slug>.json       frame in Figma               check-spec
+ registry shadcn                                    "<Nome> — Documentation"     + occhi di una persona
/fof-spec                                            /fof-figma-doc
                                                     pagina HTML (bonus)
                                                     /fof-site
```

**La spec è l'unica fonte di verità.** Il frame in Figma e la pagina HTML sono derivati: se c'è da correggere
qualcosa, si corregge la spec e si rigenera. Mai il contrario.

---

## Skill

| Comando | Cosa fa | Scrive dove |
|---|---|---|
| `/fof-spec <componente>` | legge le fonti e scrive la spec (versione base: la completi tu nel Lab 1) | `docs/specs/` |
| `/fof-figma-doc <componente>` | costruisce il frame di documentazione dalla spec | Figma, pagine `📄 Docs` e `🧩 Doc kit` |
| `/fof-site` | aggiorna la documentazione HTML con tutte le spec | `docs/site/specs.js` |

Le skill stanno in `.claude/skills/`: le leggono sia Cursor sia Claude Code. `fof-figma-doc` parte solo a comando: l'agente non può
decidere da solo di scrivere in Figma.

---

## Regole per gli artefatti

### 1. Non inventare
- Props, varianti, default e stati si prendono dal codice sorgente. Se non ci sono, non esistono.
- Se codice e Figma non coincidono, **non scegliere**: scrivi la differenza in `mismatches`.
- I Do & Don't proposti dall'agente nascono con `"source": "inferenza"` e `"approved": false`.
  Li approva una persona.
- I contrasti non si stimano: si copiano dall'output di `node scripts/fof-tokens.mjs --json`, o senza
  Node si calcolano con la formula WCAG (mai a occhio).

### 2. Dove vanno le cose

| Artefatto | Dove | Chi lo scrive |
|---|---|---|
| Spec | `docs/specs/<slug>.json` (formato: `docs/specs/_schema.json`) | `/fof-spec` |
| Frame di documentazione | Figma, pagina `📄 Docs`, frame `<Nome> — Documentation` | `/fof-figma-doc` |
| Documentazione HTML | `docs/site/specs.js` (la pagina è `docs/site/index.html`) | `/fof-site` |
| Componenti del kit di documentazione | Figma, pagina `🧩 Doc kit` (`Doc/Section title`, `Doc/Pill`, `Doc/Marker`) | creati una volta da `/fof-figma-doc` |

`slug` = nome del file in `components/ui/`, senza estensione (`radio-group.tsx` → `radio-group`).

### 3. Cosa non si tocca
- `components/ui/*`, `app/globals.css`, `tokens/tokens.json`: si documentano, non si modificano.
  Se trovi un problema, segnalalo. (Anche perché il visualizzatore HTML in `docs/site/assets/` è
  compilato da questi file: se cambiano, va ricompilato da chi tiene il corso.)
- `docs/site/index.html` e `docs/site/assets/`: sono compilati, non si toccano.
- In Figma: componenti del corso e variabili. Si scrive solo in `📄 Docs` e `🧩 Doc kit`.

### 4. Stile dei testi
- Italiano. Nomi di prop, varianti e variabili restano come nel codice.
- Frasi brevi e concrete. Niente aggettivi da brochure ("potente", "flessibile", "elegante").
- Descrizione del componente: massimo 2 frasi. Regole, note, descrizioni di prop: 1 frase.
- Esempi di testo realistici ("Salva", "Elimina progetto"), mai "Lorem ipsum" o "Button".
- Ordine e nomi delle sezioni: quelli del menu (`.claude/skills/fof-spec/references/menu-sezioni.md`).

### 5. Un componente alla volta
Lavora su un componente per volta e fermati alla fine di ogni passaggio mostrando cosa hai
prodotto. Mai la libreria intera in un colpo, se non viene chiesto esplicitamente.

### 6. Il file Figma su cui lavori
Ogni partecipante lavora sulla **sua copia** del file del corso. Si legge e si scrive solo lì.
- Usa il link Figma che l'utente ha dato in chat in questa sessione. Se non l'ha dato, **chiedilo una
  volta** prima di leggere o scrivere in Figma ("Incollami il link della tua copia del file Figma"),
  poi riusalo per tutta la sessione.
- Il `fileKey` scritto nelle spec (`source.figma.fileKey`) è solo un riferimento: non usarlo per
  decidere dove leggere o scrivere. Quando aggiorni una spec, scrivici il `fileKey` del file dell'utente.
- Se un `nodeId` della spec non esiste nel file dell'utente, cerca il componente per nome.

### 7. Se non c'è una cartella (Claude in chat)
I file del workshop sono nel Progetto, in sola lettura. Quando una regola dice di scrivere un file,
crealo come file da scaricare e mostralo; gli script `node` eseguili nel tuo ambiente di codice se
puoi, altrimenti fai i controlli leggendo i file e dillo. Tutto il resto vale uguale.

### 8. Prima di scrivere in Figma
Di' in una riga cosa crei e dove (file, pagina, sezioni), poi aspetta conferma.
Dopo aver scritto, **guarda uno screenshot** del risultato prima di dire che è finito.

---

## Colori (tema fof-milan)

Il tema usa la palette di Friends of Figma Milan con i nomi delle variabili shadcn. Gli stessi
nomi esistono in `app/globals.css` e nella collection `theme` di Figma (modi Light e Dark), con
code syntax `var(--nome)`.

Regole d'uso, che valgono anche per qualsiasi cosa generi in Figma:

1. **Il lime (`#E2FD94`) va solo su navy**, oppure come sfondo con testo navy o ink. Mai come testo
   o bordo su chiaro: su bianco il contrasto è 1,1:1.
2. **Rosa e lilla su chiaro sono solo sfondi o decorazioni**, mai testo o bordi. Per il rosa come
   testo in Light c'è `link` (`#B0107F`, 6,5:1).
3. **Il focus ring è sempre pieno.** Niente `ring-ring/50`: con il 50% di opacità il contrasto
   scende sotto 3:1.
4. **Ogni coppia `X` / `X-foreground` deve passare 4,5:1** in Light e in Dark. Lo controlla
   `node scripts/fof-tokens.mjs`.
5. In Figma usa **sempre variabili**, mai colori scritti a mano.

---

## MCP

| Server | A cosa serve | Lettura / Scrittura |
|---|---|---|
| **figma** (plugin Figma o server remoto) | leggere il componente (`get_metadata`, `get_design_context`, `get_variable_defs`, `get_screenshot`) e costruire la doc (`use_figma`) | entrambe |
| **shadcn** | confrontare con il componente originale del registry | lettura |

Se Figma non è collegato, `/fof-spec` funziona lo stesso (senza la parte Figma) e lo dice.
`/fof-figma-doc` invece si ferma.

---

## Script

| Comando | Cosa controlla |
|---|---|
| `node scripts/fof-tokens.mjs` | che `globals.css` e le variabili Figma coincidano, e i contrasti del tema |
| `node scripts/check-spec.mjs <slug>` | che la spec sia completa e coerente col codice prima di costruire il frame |
| `node scripts/fof-site.mjs` | raccoglie le spec in `docs/site/specs.js` per la pagina HTML |

Nessuno dei tre ha bisogno di `npm install`: basta Node 18 o più recente.

**Senza Node** il lavoro si fa lo stesso: l'agente fa gli stessi controlli leggendo i file
(`.claude/skills/fof-spec/references/controlli-senza-node.md`) e **avvisa che consuma più token** ed è
meno preciso. Il server shadcn invece non parte: si salta, non è indispensabile.

---

## Resoconto finale

Alla fine di ogni comando: **al massimo 5 righe**. Cosa hai creato o modificato, cosa resta da
decidere all'utente, prossimo passo. Niente tabelle lunghe né riepiloghi di quello che hai letto:
se l'utente vuole i dettagli, li chiede.
