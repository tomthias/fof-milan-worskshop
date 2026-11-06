# Lab — parte pratica (60 minuti)

Tre esercizi, uno dopo l'altro. Ognuno parte da dove finisce il precedente.
Se resti indietro, nessun problema: alla fine c'è sempre il Button già documentato come riferimento.

---

## Lab 1 — Scegli cosa documentare (20')

**Obiettivo**: una spec approvata per un componente.

1. Scegli un componente fra **Input, Switch, Card, Alert**.
2. Scrivi in chat: `/fof-spec <componente>` (per esempio `/fof-spec switch`).
3. L'agente ti mostra il **menu delle sezioni**. Oltre alle tre obbligatorie
   (Overview, Varianti, Differenze codice ↔ Figma) scegline **2 o 3**:

   | Sezione | Buona per |
   |---|---|
   | Anatomia | componenti con più parti (Card, Alert) |
   | Stati | componenti interattivi (Switch, Input) |
   | Do & Don't | regole d'uso |
   | Colori e variabili | vedere quali variabili usa |
   | Accessibilità | contrasti, tastiera, area cliccabile |

4. Leggi le **differenze fra codice e Figma** che l'agente ha trovato. Sono vere? Sono errori o scelte?
5. Se hai scelto Do & Don't: leggi le regole proposte e **approva, scarta o riscrivi**.
   Puoi anche comporre tu un esempio in Figma, selezionarlo e chiedere all'agente di usarlo.
6. Quando la spec ti convince, chiedi all'agente di lanciare `check-spec`.

✅ **Fatto quando**: `check-spec` dice "pronta per /fof-figma-doc".

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
