---
name: fof-setup
description: Controlla passo per passo che il setup del workshop funzioni (cartella giusta, Node, collegamento a Figma, possibilità di scrivere nel file, skill) e dice come risolvere ciò che manca. Usala con /fof-setup, oppure quando l'utente scrive "facciamo il setup", "non funziona Figma", "sono pronto?" o simili.
---

# fof-setup — il setup del workshop, controllato dall'agente

Chi la usa è quasi sempre un **designer** alla prima esperienza con un agente. Lo scopo è arrivare a
"Sei pronto ✓" senza fargli leggere `SETUP.md` per intero.

## Come parlare

- Una cosa per volta. Ogni controllo si chiude con **✓** o **✗** e una riga in parole semplici.
- I controlli li fai **tu**: non chiedere all'utente di lanciare comandi che puoi lanciare da solo.
- Quando c'è un ✗: dai **l'istruzione esatta** per risolvere (cosa scrivere, dove cliccare), aspetta che
  l'utente dica "fatto", poi **ricontrolla** quel punto. Al secondo ✗ sullo stesso punto, usa la tabella
  "Se qualcosa non va" in fondo a `SETUP.md`.
- Niente gergo: se devi nominare MCP, terminale o skill, spiega in mezza frase (vedi `GLOSSARIO.md`).
- Non modificare file e non scrivere in Figma: questa skill **legge e basta**.

## 0. Capire su quale strada sei

- Hai una cartella con `AGENTS.md` e puoi lanciare comandi → **Claude Code** o **Cursor** (strada A o C).
- Non hai una cartella, i file sono nel Progetto → **Claude in chat** (strada B): salta i controlli 1 e 2
  e dillo all'utente.

## 1. La cartella giusta

Controlla che nella cartella di lavoro ci siano `AGENTS.md`, `SETUP.md`, `components/ui/`, `docs/specs/` e
`.claude/skills/fof-spec/`.

- ✗ se manca qualcosa: probabilmente è aperta la cartella che *contiene* `fof-milan`, o una *dentro*.
  Istruzione: "Esci (`/exit`), apri in VS Code proprio la cartella `fof-milan` (File → Open Folder),
  apri un nuovo terminale e scrivi di nuovo `claude`." (In Cursor: File → Open Folder → `fof-milan`.)

## 2. Node

Lancia `node -v`.

- ✓ se la versione è 18 o più recente. Poi lancia `node scripts/fof-tokens.mjs`: deve finire con
  "Tutto a posto." Se segnala errori, **non sono un problema del setup**: dillo in una riga e vai avanti.
- ✗ se manca o è più vecchio: **non blocca**. Spiega che i lab funzionano lo stesso ma l'agente consuma più
  quota ed è meno preciso; se vuole, installi Node LTS da nodejs.org e riavvii l'editor.

## 3. Collegamento a Figma

Guarda se hai strumenti Figma a disposizione (per esempio `get_metadata`, `get_screenshot`, `use_figma`),
da qualunque server: quello della cartella (`.mcp.json`), il plugin di Cursor o il connettore di claude.ai.

- ✗ se non ce ne sono, o il server risulta "needs authentication":
  - Claude Code: "Scrivi `/mcp`, scegli **figma**, premi **Authenticate** e accedi nel browser. Torna qui e
    scrivi *fatto*."
  - Cursor: "Settings → Tools & MCP → **Connect** sul server Figma, poi accedi nel browser."
  - Claude in chat: "Settings → Connectors → Figma → **Connect**. Poi, nel menu strumenti sotto il campo di
    testo, controlla che Figma sia attivo."

## 4. Può scrivere?

Controlla che fra gli strumenti Figma ci sia **`use_figma`** (è quello che scrive nel file).

- ✗ se manca: quasi sempre dipende dal piano Figma. La scrittura serve un piano Professional, Organization,
  Enterprise o Education: non quello gratuito.

## 5. Il file Figma dell'utente

Chiedi il link **una volta sola**, spiegando dove trovarlo:
"Incollami il link della **tua copia** del file Figma del corso (in Figma: Share → Copy link, oppure la
barra degli indirizzi). Se non l'hai ancora fatta: apri il file che ti abbiamo mandato e premi Duplicate."

Poi leggi il file ed elenca le pagine.

- ✓ se ci sono `📄 Docs` e `🧩 Doc kit`.
- ✗ se il file non si apre: controlla che il link sia della copia e che l'account Figma collegato sia lo
  stesso che possiede la copia.
- ✗ se mancano le due pagine: probabilmente è il file sbagliato (non è il file del corso). Chiedi di
  ricontrollare il link.

Ricorda il link: lo userai per tutta la sessione (AGENTS.md, regola 6).

## 6. Le skill

Controlla che `/fof-spec` sia disponibile (in Claude Code e Cursor: c'è `.claude/skills/fof-spec/SKILL.md`
e compare scrivendo `/`). In Claude in chat: controlla di poter leggere la skill dai file del Progetto.

- ✗ in Claude in chat: "Apri una chat **dentro** il Progetto `fof-milan`."

Non lanciare `/fof-spec` da qui: lo proponi alla fine.

## 7. Verdetto

Chiudi con **al massimo 5 righe**:

- Se è tutto ✓ (Node può mancare): **"Sei pronto ✓"**, poi il messaggio da mandare agli organizzatori,
  già pronto da copiare, per esempio:
  > Setup ok — strada A (Claude Code), Node 22, Figma collegato con scrittura, file con 📄 Docs e 🧩 Doc kit.
- Se c'è un ✗ non risolto: **"Manca solo questo:"** e il punto, con l'istruzione per risolverlo. Ricorda che
  si può scrivere agli organizzatori prima del workshop, e che in aula si lavora in coppia.
- Prossimo passo suggerito: `/fof-spec card`.
