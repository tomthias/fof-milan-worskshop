# Glossario

**Agente** — un modello AI che non si limita a rispondere ma fa delle cose: legge file, usa
strumenti, scrive. In questo workshop va bene quello che preferisci: Claude Code, Claude in chat, Cursor…

**MCP (Model Context Protocol)** — un modo standard per collegare un agente a un'app. Ogni app
espone un "server MCP" con degli strumenti: Figma ne ha per leggere un file e per scriverci dentro.
Pensalo come una presa: l'agente si collega, e l'app decide cosa gli permette di fare.

*MCP in 30 secondi, con un esempio.* Scrivi all'agente "elencami le pagine di questo file Figma".
L'agente da solo non vede Figma: allora chiama lo strumento `get_metadata` del server Figma, con il
link del file. Figma risponde con la lista delle pagine, e l'agente te la riscrive in chat. Tutto il
workshop è fatto di questi scambi: domande a Figma (lettura) e, quando confermi tu, modifiche (scrittura).

**Strumento (tool)** — una singola azione che un server MCP mette a disposizione.
Es. `get_metadata` (leggi la struttura di un nodo), `use_figma` (esegui modifiche nel file).

**Lettura / scrittura** — gli strumenti di lettura guardano e basta. Quelli di scrittura cambiano
qualcosa (un file, un canvas). In questo workshop la scrittura parte sempre su tua conferma.

**Skill** — una cartella con istruzioni (e a volte file di supporto) che insegna all'agente a fare
un lavoro preciso, sempre allo stesso modo. Si richiama con `/nome-skill`.

**AGENTS.md** — il file di regole che l'agente legge appena apre la cartella. È il "come si lavora
qui" di questo progetto.

**Spec** — il file JSON che descrive un componente: varianti, parti, regole d'uso, colori,
differenze fra codice e Figma. È l'unica fonte da cui nasce la documentazione.

**Inferenza** — una cosa che l'agente propone senza averla letta da nessuna parte (es. una regola
d'uso). Va sempre approvata da una persona.

**Component set / variante** — in Figma, l'insieme delle varianti di un componente
(es. Button con `variant=default`, `variant=outline`…).

**Instance** — una copia di un componente che resta collegata all'originale. Se cambi il componente,
cambiano tutte le instance. La documentazione usa solo instance, mai disegni copiati.

**Variabile** — un valore con un nome (es. `primary`) che si usa al posto del colore scritto a mano.
Può avere più **modi** (Light, Dark).

**Code syntax** — l'impostazione che dice a Figma come si chiama una variabile nel codice
(es. `var(--primary)`). Così Figma e codice parlano con gli stessi nomi.

**cva (class-variance-authority)** — la libreria con cui i componenti shadcn definiscono le
varianti nel codice. È l'equivalente delle variant properties di Figma.

**shadcn/ui** — una raccolta di componenti React che si copiano nel proprio progetto invece di
installarli come libreria. Per questo ognuno può modificarli.

**Contrasto (WCAG)** — il rapporto di luminosità fra testo e sfondo. 4,5:1 è il minimo per il testo
normale (livello AA), 3:1 per bordi, icone e anelli di focus.

---

## Gli attrezzi

**Editor di codice** — un programma per aprire una cartella e vedere e modificare i suoi file di testo.
Nel workshop: Visual Studio Code o Cursor. Lo usi soprattutto per leggere spec e skill.

**Terminale** — una finestra dove dai comandi scrivendo invece di cliccare. Negli editor c'è un
terminale integrato (menu Terminal → New Terminal) che si apre già nella cartella giusta.

**Claude Code** — l'agente di Anthropic che gira nel terminale. Si avvia scrivendo `claude` e poi si usa
come una chat. `/mcp` mostra i server collegati, `/` mostra le skill, Esc lo ferma.

**Cursor** — un editor di codice con un agente AI integrato nella chat laterale.

**Repo (repository) / GitHub** — una cartella di progetto con la sua storia, pubblicata su GitHub.
Per lavorarci la scarichi sul tuo computer: con "Download ZIP" oppure con `git clone` (clonare = scaricare
una copia collegata all'originale).
