# Setup — da fare prima del workshop

Tempo: circa 15 minuti. Alla fine c'è un **test di 2 minuti**: se passa, sei pronto.
Se qualcosa non va, scrivici prima del workshop: in aula non c'è tempo per sistemare le installazioni.

---

## Cosa ti serve

- [ ] **Un account Figma con piano Professional, Organization o Enterprise** (va bene anche Education).
      La scrittura sul canvas tramite AI è in beta e non è disponibile sul piano gratuito.
- [ ] **Cursor** installato, con un account attivo e un piano che copra circa un'ora di uso dell'agente.
- [ ] **Node.js 18 o più recente — consigliato, non obbligatorio.** Serve ai due script di controllo e al
      server shadcn. Per sapere se ce l'hai, apri il terminale di Cursor e scrivi `node -v`.
      Senza Node i lab funzionano lo stesso: l'agente fa i controlli leggendo i file, ma consuma più
      token (quindi più quota del tuo piano Cursor) ed è meno preciso. Se puoi, installalo: nodejs.org, versione LTS.

---

## 1. Apri la cartella in Cursor

File → Open Folder → scegli la cartella `fof-milano` che ti abbiamo mandato.

## 2. Installa il plugin Figma

1. Vai su **cursor.com/marketplace** e cerca **Figma**.
2. Clicca **Add to Cursor**.
3. In Cursor apri **Settings → Tools & MCP** e premi **Connect** sul server Figma.
4. Si apre il browser: accedi a Figma e accetta.

## 3. Collega shadcn (solo se hai Node)

Il server shadcn è già configurato nella cartella (`.cursor/mcp.json`). In **Settings → Tools & MCP**
controlla che compaia **shadcn** e che sia attivo. Se ti chiede di abilitarlo, abilitalo.
Senza Node resta spento: non è un problema.

## 4. Duplica il file Figma del corso

Apri il link che ti abbiamo mandato e fai **Duplicate**: lavorerai sulla tua copia.
Tienilo aperto.

---

## Test di 2 minuti

Apri la chat dell'agente in Cursor e prova, uno alla volta:

1. **"Elenca gli strumenti Figma che hai a disposizione."**
   Devono comparire strumenti come `get_metadata`, `get_design_context` e **`use_figma`**.
2. **`/fof-spec badge`**
   L'agente deve leggere il Badge e dirti cosa ha trovato.
   Se ti chiede quali sezioni vuoi, rispondi pure "lascia così".

Se tutte e due le prove vanno, sei pronto.

---

## Se qualcosa non va

| Problema | Cosa fare |
|---|---|
| Figma risulta "Connected" ma l'agente non vede strumenti Figma | In Settings → Tools & MCP attiva Figma anche per questa cartella. Se non basta: disinstalla il plugin, chiudi Cursor, reinstallalo. |
| Manca `use_figma` | Il tuo piano Figma non permette la scrittura, oppure non sei collegato al server remoto. Controlla il piano. |
| `/fof-spec` non compare | Controlla di aver aperto la cartella `fof-milano` (non una cartella dentro). Riavvia Cursor. |
| `node -v` non risponde | Puoi andare avanti così: l'agente ti avviserà che consuma più token. Per i controlli veri, installa Node.js da nodejs.org (versione LTS) e riavvia Cursor. |

Se dopo questi passaggi non funziona, non preoccuparti: in aula lavorerai in coppia con chi ha
il setup pronto.

---

## Usi Claude Code invece di Cursor?

Funziona lo stesso: skill (`.claude/skills/`) e regole (`AGENTS.md`) sono condivise.
Attenzione: Claude Code **non usa il plugin Figma di Cursor**, anche se lo lanci dal terminale di Cursor.
Ha la sua configurazione in `.mcp.json`: al primo avvio approva i server della cartella, poi con `/mcp`
fai il login a Figma. Alla fine `/mcp` deve mostrare **figma** (e **shadcn**, se hai Node) come `Connected`.
