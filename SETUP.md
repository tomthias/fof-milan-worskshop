# Setup — da fare prima del workshop

Tempo: **30-40 minuti** in tutto, test finale compreso. Se alla fine il test passa, sei pronto.
Se qualcosa non va, scrivici prima del workshop: in aula non c'è tempo per sistemare le installazioni.

Non serve saper programmare. Ti chiediamo solo di installare due o tre cose e di scrivere qualche
frase in una chat.

---

## Cosa ti serve

- [ ] **Un account Figma**, anche gratuito. Ti invitiamo noi nello spazio del workshop, che ha già
      il piano giusto per far scrivere l'agente in Figma. Accetta l'invito che ti arriva per mail.
- [ ] **Un agente AI che sappia collegarsi a Figma.** Va bene quello che usi già. Le tre strade
      descritte qui sotto:
      - **Claude Code** — con un abbonamento Claude (Pro o Max): lavora sui file della cartella;
      - **Claude in chat** (claude.ai o app Claude) — con un abbonamento Claude: niente da installare,
        ma niente cartella sul computer, quindi qualche passaggio è più manuale;
      - **Cursor** — con un account Cursor e un piano che copra circa un'ora di agente.

      Ne basta **uno**. Usi un altro agente (Codex, Windsurf, Copilot…)? Va bene se legge `AGENTS.md`
      e si collega al server MCP di Figma: segui la strada che gli somiglia di più.
- [ ] **Node.js 18 o più recente: consigliato.** Claude Code **non** ne ha bisogno per funzionare.
      Node serve agli script del workshop: il controllo della spec (`check-spec`), la pagina HTML
      (`/fof-site`) e l'installazione di skill-creator nel Lab 3. Senza Node l'agente fa i controlli
      leggendo i file: funziona, ma consuma più quota ed è meno preciso, e il bonus HTML non c'è.
      Si scarica da **nodejs.org** (versione LTS).

---

## 1. Installa un editor di codice (non serve per Claude in chat)

Anche se non scriverai codice, ti serve un programma per **aprire la cartella del workshop e vedere i
file**: le spec, le skill, i componenti.

- Se userai **Cursor**: Cursor è già un editor, installa quello (cursor.com).
- Se userai **Claude Code**: installa **Visual Studio Code** da https://code.visualstudio.com/ (gratuito).
- Se userai **Claude in chat**: salta questo passo.

> ⚠️ **Visual Studio Code e Visual Studio sono due programmi diversi.** Visual Studio (icona viola,
> per .NET) non va bene. Serve Visual Studio **Code**: icona azzurra, si scarica dal link qui sopra.

## 2. Scarica la cartella del workshop

La cartella sta su GitHub: **https://github.com/tomthias/fof-milan**.
Con Claude Code o Cursor va scaricata sul tuo computer: l'agente lavora sui file che hai in locale.
Con Claude in chat ti serve solo se non puoi collegare GitHub al Progetto (Strada B, punto 3).

**Il modo più semplice (senza account GitHub):**
1. Apri il link, premi il bottone verde **Code** → **Download ZIP**.
2. Scompatta lo zip (doppio clic).
3. Rinomina la cartella in **`fof-milan`** (GitHub la chiama `fof-milan-main`) e spostala dove
   la ritrovi, per esempio in Documenti.

**Se usi già git:** `git clone https://github.com/tomthias/fof-milan.git fof-milan`

Con Claude Code o Cursor, apri la cartella nell'editor: **File → Open Folder** (in italiano *Apri cartella*) → scegli `fof-milan`.
A sinistra devi vedere `README.md`, `SETUP.md`, `components`, `docs`…

## 3. Duplica il file Figma del corso

Apri il link al file Figma che ti abbiamo mandato e fai **Duplicate**: lavorerai sulla tua copia.
Dalla tua copia, **copia il link** (menu Share → Copy link, oppure la barra degli indirizzi): lo
darai all'agente nel test e all'inizio dei lab. Tienilo a portata di mano.

---

## 4. Collega l'agente — scegli UNA strada

| | Strada A — Claude Code | Strada B — Claude in chat | Strada C — Cursor |
|---|---|---|---|
| Cosa installi | Claude Code + un editor | niente | Cursor |
| Dove stanno i file | sul tuo computer | nel Progetto Claude | sul tuo computer |
| Le spec | l'agente le scrive nella cartella | l'agente te le dà da scaricare | l'agente le scrive nella cartella |
| Bonus HTML (`/fof-site`) | sì | no | sì |

### Strada A — Claude Code

Claude Code è l'agente di Anthropic. Funziona **nel terminale**: una finestra dove scrivi testo
invece di cliccare. Non ti spaventare: lo userai come una chat.

**Installalo** (una volta sola):
1. Apri VS Code con la cartella `fof-milan`.
2. Apri il terminale **integrato**: menu **Terminal → New Terminal** (*Terminale → Nuovo terminale*).
   In basso si apre un pannello: il terminale è già "dentro" la cartella del workshop, ed è quello che
   serve.
3. Incolla questo comando e premi Invio:
   - **Mac:** `curl -fsSL https://claude.ai/install.sh | bash`
   - **Windows (PowerShell):** `irm https://claude.ai/install.ps1 | iex`
4. Quando ha finito, chiudi e riapri il terminale e scrivi `claude --version`. Se risponde con un
   numero, è installato.
   **Su Mac, se risponde `command not found`:** incolla questa riga, premi Invio e riprova
   `claude --version`:
   `echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc`

**Avvialo** (ogni volta):
1. Nel terminale integrato scrivi `claude` e premi Invio.
2. La prima volta ti chiede di accedere: scegli il tuo account Claude e segui il browser.
3. Ti chiede se ti fidi della cartella: rispondi di sì.
4. Ti chiede di approvare i **server MCP** della cartella (`figma` e `shadcn`): approvali.
   Sono le "prese" che permettono all'agente di parlare con Figma (vedi GLOSSARIO).
5. Scrivi `/mcp` e premi Invio. Seleziona **figma** → **Authenticate**: si apre il browser, accedi a
   Figma e accetta. Torna al terminale: accanto a figma deve comparire **connected**.

**Come si usa, in cinque righe:**
- Scrivi in italiano, come in una chat, e premi **Invio**.
- I comandi che cominciano con `/` sono le **skill** del workshop: scrivi `/` per vederle (`/fof-spec`…).
- Prima di modificare file o scrivere in Figma, l'agente **chiede il permesso**: leggi e rispondi
  (con le frecce e Invio). Nel dubbio, rispondi "no" e chiedigli cosa voleva fare.
- **Esc** ferma l'agente se sta andando nella direzione sbagliata.
- Per uscire scrivi `/exit` (o premi due volte Ctrl+C). Per ricominciare: `claude`.

Claude Code **non usa** il plugin Figma di Cursor, anche se lo apri dal terminale di Cursor: ha la sua
configurazione nel file `.mcp.json` della cartella. Puoi saltare le altre strade.

### Strada B — Claude in chat (claude.ai o app Claude)

Niente da installare: lavori nel browser o nell'app Claude. Al posto della cartella usi un **Progetto**.

1. **Collega Figma.** In Claude apri **Settings → Connectors**, cerca **Figma**, premi **Connect** e
   accedi a Figma.
2. **Crea un Progetto** e chiamalo `fof-milan`.
3. **Metti la cartella nel Progetto.** Nei file del Progetto scegli **Add content → GitHub** e collega
   il repo `tomthias/fof-milan` (selezionalo tutto). Se l'opzione GitHub non c'è, carica a mano
   i file dalla cartella scaricata al passo 2: `AGENTS.md`, `components/ui/`, `app/globals.css`,
   `docs/specs/`, `tokens/tokens.json` e tutta `.claude/skills/`.
4. **Istruzioni del Progetto.** Apri `claude-chat/ISTRUZIONI-PROGETTO.md`, copia il testo indicato e
   incollalo nelle *Instructions* del Progetto.
5. **Le skill.** In **Settings → Capabilities** (o *Skills*) carica `claude-chat/fof-spec.zip` e
   `claude-chat/fof-figma-doc.zip`. Se non trovi dove caricarle non è un problema: le istruzioni del
   Progetto dicono a Claude di leggere le skill dai file.
6. Apri una chat **dentro il Progetto**: è lì che fai il test e i lab.

Cosa cambia rispetto alle altre strade: le spec non finiscono in una cartella, Claude te le dà come
file da scaricare. Gli script di controllo li esegue Claude nel suo ambiente, oppure fa i controlli
leggendo i file. Il bonus HTML non c'è.

### Strada C — Cursor

1. Apri la cartella `fof-milan` in Cursor (**File → Open Folder**).
2. Installa il plugin Figma: vai su **cursor.com/marketplace**, cerca **Figma**, premi **Add to Cursor**.
3. In Cursor apri **Settings → Tools & MCP** e premi **Connect** sul server Figma.
   Si apre il browser: accedi a Figma e accetta.
4. Solo se hai Node: in **Settings → Tools & MCP** controlla che **shadcn** sia attivo.
5. La chat dell'agente si apre con **Cmd+L** (Mac) o **Ctrl+L** (Windows). I comandi che cominciano
   con `/` sono le skill del workshop.

---

## Test finale (5-10 minuti)

Prima del test devi aver **accettato l'invito** allo spazio Figma del workshop e **duplicato il file**
(passo 3). Nella chat dell'agente (Claude Code, la chat del Progetto Claude o Cursor), prova **uno alla volta**:

1. **Leggi da Figma.** *"Leggi il file Figma `<incolla il link della tua copia>` ed elencami le pagine."*
   Deve risponderti con i nomi delle pagine del file (fra cui `📄 Docs` e `🧩 Doc kit`).
   È il primo uso di MCP: l'agente ha chiesto a Figma, Figma ha risposto.
2. **Può scrivere?** *"Elenca gli strumenti Figma che hai a disposizione."*
   Deve comparire **`use_figma`**: è lo strumento che scrive nel file.
3. **Una skill.** Scrivi `/fof-spec card`.
   L'agente legge la Card dal codice e da Figma e ti dice cosa ha trovato.
   Se ti fa domande, rispondi pure "lascia così". La spec che scrive puoi tenerla: in aula la rifai.

Se tutte e tre vanno, sei pronto. Il risultato del test mandacelo pure, anche solo "ok".

---

## Se qualcosa non va

| Problema | Cosa fare |
|---|---|
| Claude Code: `claude` non viene riconosciuto | Chiudi e riapri il terminale dopo l'installazione. Su Mac, se non basta, usa la riga `echo 'export PATH=…'` del passo 4 di "Installalo". Su Windows, riavvia VS Code. |
| La cartella non si apre / non vedi il menu Terminal | Probabilmente hai aperto Visual Studio invece di Visual Studio **Code**: sono due programmi diversi. Installa VS Code da https://code.visualstudio.com/. |
| Claude Code: `/mcp` non mostra figma | Sei nella cartella sbagliata: esci (`/exit`), controlla che il terminale sia aperto in `fof-milan` e rilancia `claude`. |
| Claude Code: figma resta "needs authentication" | `/mcp` → figma → Authenticate, e completa il login nel browser. |
| Cursor: Figma "Connected" ma l'agente non vede strumenti Figma | In Settings → Tools & MCP attiva Figma anche per questa cartella. Se non basta: disinstalla il plugin, chiudi Cursor, reinstallalo. |
| Manca `use_figma` | Stai usando un file fuori dallo spazio del workshop. Controlla di aver accettato l'invito e di aver duplicato il file **dentro** lo spazio, poi ridai all'agente il link della copia. |
| `/fof-spec` non compare | Hai aperto una cartella sbagliata (per esempio quella che contiene `fof-milan`, o una dentro). Riapri proprio `fof-milan`. |
| Claude in chat: non vede strumenti Figma | Settings → Connectors: Figma deve essere collegato. In chat, dal menu degli strumenti (icona sotto il campo di testo), controlla che Figma sia attivo. |
| Claude in chat: `/fof-spec` non fa niente di speciale | Scrivi "Segui la skill fof-spec per la Card": Claude la legge dai file del Progetto. Controlla di essere in una chat **dentro** il Progetto. |
| L'agente legge il file Figma sbagliato | Ridagli il link della tua copia: "Usa questo file Figma: <link>". |
| L'editor mostra avvisi su `docs/site/assets/app.css` | Ignorali: è un file compilato, non va toccato. |
| `node -v` non risponde | Puoi andare avanti così: l'agente ti avviserà che consuma più quota. Per i controlli veri, installa Node.js da nodejs.org (LTS) e riavvia l'editor. |

Se dopo questi passaggi non funziona, non preoccuparti: in aula lavorerai in coppia con chi ha
il setup pronto.
