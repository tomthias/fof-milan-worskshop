# Lab — parte pratica (60 minuti)

Tre esercizi, uno dopo l'altro. Ognuno parte da dove finisce il precedente.
Se resti indietro, nessun problema: in `docs/specs/` trovi due esempi già pronti:
`_esempio-button.json` (completo) e `badge.json` (minimo).

---

## Prima di cominciare

Apri l'agente (Claude Code: `claude` nella cartella `fof-milan`; Claude in chat: una chat nel Progetto
`fof-milan`; Cursor: la chat) e incolla il link della **tua copia** del file Figma:

> Lavoriamo su questo file Figma: <link>

L'agente userà quel file per tutta la sessione. Se riapri l'agente, ridaglielo.

---

## Lab 1 — Istruisci l'agente (30')

**Obiettivo**: una skill `/fof-spec` che lavora come vuoi tu, e una spec controllata.

La `/fof-spec` che trovi nella cartella è una **versione base**: scrive una spec valida, ma non sa
come vuoi lavorare. Nel lab glielo insegni.

1. **Scegli** un componente fra **Button, Input, Switch, Card, Alert**.
   Vuoi qualcosa di più ricco? **Checkbox, Radio Group, Tabs, Select** hanno più parti e più stati.

2. **Prova la versione base.** Scrivi `/fof-spec <componente>` (per esempio `/fof-spec switch`).
   Apri la spec che ha scritto: `docs/specs/<componente>.json`.

3. **Annota cosa non ti piace.** Scrivi in chat (o su un foglio) **due cose** che vorresti diverse.
   Per esempio: "non mi ha chiesto quali sezioni volevo", "la descrizione è troppo tecnica".

4. **Scrivi le tue regole.** Apri `.claude/skills/fof-spec/SKILL.md` e, in fondo, sotto
   **"Le tue regole"**, trasforma le due cose del passo 3 in regole. Una frase ciascuna, concreta.
   Per esempio:
   *"Prima di scrivere mostrami il menu delle sezioni e chiedimi quali voglio."*

   Le tue regole valgono più delle regole del corso: se scrivi "usa l'inglese", l'agente userà
   l'inglese anche se `AGENTS.md` dice italiano.

   **Con Claude in chat** scrivile nelle *Instructions* del Progetto, sotto "Le mie regole per /fof-spec".

5. **Riprova.**
   - Salva il file (con Claude in chat: salva le Instructions).
   - Apri una sessione nuova, perché l'agente rilegge la skill solo quando riparte:
     Claude Code → `/exit`, poi `claude`. Cursor e Claude in chat → chat nuova.
   - Rilancia `/fof-spec` sullo stesso componente.
   - Il comportamento è cambiato? Se no, riscrivi la regola più precisa e riprova.

   Il ciclo è: **prova → guarda → correggi la regola → riapri → riprova**.

6. **Aggiungi 2 o 3 sezioni** oltre alle obbligatorie (Overview, Varianti, Differenze codice ↔ Figma).
   Chiedile all'agente, per esempio: *"Aggiungi Anatomia e Do & Don't"*.

   | Sezione | Buona per |
   |---|---|
   | Anatomia | componenti con più parti (Card, Alert) |
   | Stati | componenti interattivi (Switch, Input) |
   | Do & Don't | regole d'uso |
   | Colori e variabili | vedere quali variabili usa |
   | Accessibilità | contrasti, tastiera, area cliccabile |

   **Do & Don't va approvato da te.** Le regole le propone l'agente, poi te le elenca: rispondi quali
   tenere (per esempio "tieni la 1 e la 3" o "tutte"). Quelle che non approvi **non compaiono** nel frame.

7. **Controlla le differenze fra codice e Figma.** Il confronto lo fa l'agente. Tu chiedigli:
   *"Elencami le differenze fra codice e Figma"*. Per ognuna rispondi in chat:
   - **scelta**: è voluta (per esempio, in Figma gli stati hover e focus sono varianti, nel codice no);
   - **errore**: da correggere (per esempio, un colore in Figma non collegato a una variabile).

   Non correggere niente: per ora basta decidere.

8. **Controlla la spec.** Scrivi all'agente: *"Lancia check-spec"*.
   Deve rispondere **"pronta per /fof-figma-doc"**. Gli avvisi con `!` si possono lasciare.
   (Senza Node, o con Claude in chat, l'agente fa lo stesso controllo leggendo i file.)

✅ **Fatto quando**: almeno una tua regola ha cambiato il comportamento della skill, e `check-spec`
dice "pronta per /fof-figma-doc".

---

## Lab 2 — Genera la documentazione in Figma (15')

**Obiettivo**: il frame `<Nome> — Documentation` nel tuo file Figma.

1. Scrivi `/fof-figma-doc <componente>`.
2. L'agente ti dice cosa sta per creare: rispondi "sì".
3. Guarda il frame comparire in Figma, nella pagina **📄 Docs**.
4. Confrontalo con **Button — Esempio**, nella stessa pagina. Scrivi in chat una cosa che manca o che cambieresti.
5. Cambia una cosa **nella spec** (una regola, una descrizione, l'ordine delle sezioni) e rilancia
   `/fof-figma-doc`. Il frame si aggiorna senza duplicarsi.

💡 Prova anche a cambiare un componente del kit nella pagina **🧩 Doc kit** (per esempio il colore
della pill "DO"): si aggiorna in tutte le documentazioni.

✅ **Fatto quando**: hai un frame di documentazione e l'hai rigenerato almeno una volta.

### ⚡ Bonus per chi finisce prima — la documentazione anche in HTML

(Solo con Claude Code o Cursor, e serve Node.)

1. Scrivi `/fof-site`.
2. Apri `docs/site/index.html` (doppio clic).
3. Il tuo componente è nella lista a sinistra, accanto al Badge. Le anteprime sono i
   componenti React veri: passa il mouse, premi Tab, accendi il tema Dark.
4. Confronta la pagina con il frame in Figma: dove dicono cose diverse? Perché?

Stessa spec, due uscite: Figma mostra la verità del design, la pagina quella del codice.

---

## Lab 3 — Crea la tua skill (15')

**Obiettivo**: inventare una sezione di documentazione nuova e farla disegnare in Figma.

Nel Lab 1 hai visto il **menu delle sezioni** (è il file `.claude/skills/fof-spec/references/menu-sezioni.md`).
Tre sezioni del menu non hanno ancora niente che le disegni in Figma: **Spaziature**, **Contenuti**
(regole per i testi) ed **Esempio in contesto**. Scegline una, oppure inventane un'altra
(per esempio "Area cliccabile").

1. Scrivi all'agente: *"Usa skill-creator per creare una skill `fof-section-<nome>` che aggiunge
   la sezione <nome> alla documentazione."*
   (Se skill-creator non c'è: `npx skills add anthropics/skills --skill skill-creator`. Serve Node.)
2. Rispondi alle sue domande: cosa deve mostrare la sezione? Da dove prende i dati?
3. Provala sul componente del Lab 1 e guarda il risultato in Figma.

**Nella pagina HTML la tua sezione compare solo come dati grezzi**, senza anteprima: è normale.
La pagina sa disegnare solo le sezioni previste dal corso. Il risultato da guardare è quello in Figma.

✅ **Fatto quando**: la tua skill gira e in Figma produce qualcosa di sensato, anche se non è perfetto.

### Se finisci prima

Prova un'altra sezione:
- **Tipografia**: dimensioni e pesi dei testi del componente, da `app/globals.css`.
- **Tema scuro**: come cambiano i colori in Dark, dalle variabili in `docs/VARIABILI.md`.
- **Motion**: durate e curve delle transizioni, dalle classi del componente.

---

## Domande da portarsi a casa

- Quali sezioni della documentazione può generare l'AI, e quali deve scrivere una persona?
- Le differenze codice ↔ Figma che hai trovato: chi le dovrebbe sistemare, design o sviluppo?
- Cosa succede alla documentazione quando il componente cambia?
