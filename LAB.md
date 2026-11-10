# Lab — parte pratica (60 minuti)

Tre esercizi, uno dopo l'altro. Ognuno parte da dove finisce il precedente.
Se resti indietro, nessun problema: alla fine c'è sempre il Button già documentato come riferimento.

---

## Prima di cominciare

Apri l'agente (Claude Code: `claude` nella cartella `fof-milan`; Claude in chat: una chat nel Progetto
`fof-milan`; Cursor: la chat) e incolla il link della **tua copia** del file Figma:

> Lavoriamo su questo file Figma: <link>

L'agente userà quel file per tutta la sessione. Se riapri l'agente, ridaglielo.

---

## Lab 1 — Istruisci l'agente (20')

**Obiettivo**: una skill `/fof-spec` che lavora come vuoi tu, e una spec approvata.

La `/fof-spec` che trovi nella cartella è una **versione base**: legge il componente e scrive una spec
valida, ma non sa niente di come vuoi lavorare. Il lavoro vero è insegnarglielo.

1. Scegli un componente fra **Input, Switch, Card, Alert**.
2. Lancia `/fof-spec <componente>` (per esempio `/fof-spec switch`) e guarda cosa fa.
   Leggi la spec che ha scritto in `docs/specs/<componente>.json`.
3. Chiediti cosa manca. Ti ha chiesto quali sezioni vuoi? Ti ha mostrato bene le differenze
   codice ↔ Figma? Se gli chiedi dei Do & Don't, come li propone?
4. Apri `.claude/skills/fof-spec/SKILL.md` nell'editor e, in fondo, nella sezione
   **"Le tue regole"**, scrivi una o due regole. Una frase ciascuna, concreta. Per esempio:
   *"Prima di scrivere mostra il menu delle sezioni (`references/menu-sezioni.md`) e chiedimi quali voglio."*

   **Con Claude in chat** non puoi modificare i file del Progetto: scrivi le tue regole nelle
   *Instructions* del Progetto, sotto "Le mie regole per /fof-spec", e apri una chat nuova per provarle.
5. Salva il file e **riapri l'agente**, poi rilancia `/fof-spec` sullo stesso componente.
   Riaprire serve: l'agente legge le skill quando parte, e nella stessa sessione può continuare a usare
   la versione vecchia. Claude Code: `/exit`, poi `claude`. Cursor e Claude in chat: chat nuova.
   È cambiato qualcosa? Se no, riscrivi la regola più precisa. È questo il ciclo:
   **prova → guarda → correggi la skill → riapri → riprova**.
6. Scegli 2 o 3 sezioni oltre alle obbligatorie (Overview, Varianti, Differenze codice ↔ Figma):

   | Sezione | Buona per |
   |---|---|
   | Anatomia | componenti con più parti (Card, Alert) |
   | Stati | componenti interattivi (Switch, Input) |
   | Do & Don't | regole d'uso — da approvare tu, una per una |
   | Colori e variabili | vedere quali variabili usa |
   | Accessibilità | contrasti, tastiera, area cliccabile |

7. Leggi le **differenze fra codice e Figma** trovate. Sono vere? Sono errori o scelte?
8. Quando la spec ti convince, chiedi all'agente di lanciare `check-spec`.

✅ **Fatto quando**: hai scritto almeno una regola che cambia davvero il comportamento della skill,
e `check-spec` dice "pronta per /fof-figma-doc".

---

## Lab 2 — Genera la documentazione in Figma (20')

**Obiettivo**: il frame `<Nome> — Documentation` nel tuo file Figma.

1. Scrivi `/fof-figma-doc <componente>`.
2. L'agente ti dice cosa sta per creare: conferma.
3. Guarda il frame comparire in Figma, sezione per sezione, nella pagina **📄 Docs**.
4. Confronta il risultato con **Button — Documentation**. Cosa manca? Cosa cambieresti?
5. Cambia una cosa **nella spec** (una regola, una descrizione, l'ordine delle sezioni) e rilancia.
   Il frame si aggiorna senza duplicarsi.

💡 Prova anche a cambiare un componente del kit nella pagina **🧩 Doc kit** (per esempio il colore
della pill "DO"): si aggiorna in tutte le documentazioni.

✅ **Fatto quando**: hai un frame di documentazione e l'hai rigenerato almeno una volta.

### ⚡ Bonus per chi finisce prima — la documentazione anche in HTML

(Solo con Claude Code o Cursor: serve la cartella sul computer.)

1. Scrivi `/fof-site`.
2. Apri `docs/site/index.html` (doppio clic).
3. Il tuo componente è nella lista a sinistra, accanto a Button e Badge. Le anteprime sono i
   componenti React veri: passa il mouse, premi Tab, accendi il tema Dark.
4. Confronta la pagina con il frame in Figma: dove dicono cose diverse? Perché?

Stessa spec, due uscite: Figma mostra la verità del design, la pagina quella del codice.

---

## Lab 3 — Crea la tua skill (20')

**Obiettivo**: aggiungere al menu una sezione che non esiste ancora.

Nel menu ci sono tre sezioni senza builder: **Spaziature**, **Contenuti** (regole per i testi)
ed **Esempio in contesto**. Scegline una, oppure inventane un'altra.

1. Chiedi all'agente: *"Usa skill-creator per creare una skill `fof-section-<nome>` che aggiunge
   la sezione <nome> alla documentazione."*
   (Se skill-creator non c'è, installalo: `npx skills add anthropics/skills --skill skill-creator`.)
2. Rispondi alle sue domande: cosa deve mostrare la sezione? Da dove legge? Cosa scrive nella spec?
3. Prova la skill sul componente del Lab 1.
4. Se funziona, aggiungi la sezione alla spec e rigenera il frame.

✅ **Fatto quando**: la tua skill gira e produce qualcosa di sensato, anche se non è perfetto.

---

## Domande da portarsi a casa

- Quali sezioni della documentazione potresti generare tu, e quali deve scrivere una persona?
- Le differenze codice ↔ Figma che hai trovato: chi le dovrebbe sistemare, design o sviluppo?
- Cosa succede alla documentazione quando il componente cambia?
