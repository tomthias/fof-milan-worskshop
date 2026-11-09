---
name: fof-figma-doc
description: Costruisce in Figma il frame "<Nome> — Documentation" di un componente, sezione per sezione, a partire dalla sua spec in docs/specs. Si usa solo quando l'utente scrive /fof-figma-doc <componente>.
disable-model-invocation: true
---

# fof-figma-doc — dalla spec al frame in Figma

Questa skill **scrive** nel file Figma del corso. Per questo parte solo a comando:
`/fof-figma-doc <slug>` (es. `/fof-figma-doc button`).

Non inventa niente: tutto quello che finisce nel frame è già scritto nella spec
`docs/specs/<slug>.json`. Se c'è da correggere qualcosa, si corregge la spec e si rilancia.

## Prima di iniziare

1. **La spec esiste ed è pulita.** Controlla `node -v`.
   - Con Node: lancia `node scripts/check-spec.mjs <slug>`. Se esce con errori, fermati: mostra gli
     errori e suggerisci `/fof-spec <slug>` per sistemarli. Gli avvisi (`!`) non bloccano, ma riportali.
   - Senza Node: avvisa che fai il controllo leggendo i file e che consuma più token, poi segui la lista
     di `../fof-spec/references/controlli-senza-node.md`. Se trovi un errore, fermati come sopra.
2. **Figma è collegato e può scrivere.** Deve esserci lo strumento `use_figma`.
   Se manca: di' che il server Figma non è collegato o non ha la scrittura (vedi SETUP.md) e fermati.
3. **Se c'è la skill `figma-use`** (arriva con il plugin Figma di Cursor) seguila per il modo corretto di
   chiamare `use_figma`. Se non c'è (per esempio in Claude Code), vai avanti lo stesso: il builder
   gestisce già le cose delicate.
4. **Chiedi conferma** in una riga, poi aspetta:
   > Creo "Button — Documentation" nella pagina 📄 Docs del file <nome file>, sezioni: overview, varianti, … Procedo?

## Come costruire

Il codice da eseguire in Figma sta in `builder/builder.js` (in questa cartella). Non riscriverlo e
non riassumerlo: usalo così com'è.

Per **ogni sezione** in `spec.sections`, nell'ordine, fai **una** chiamata `use_figma` con:

```
<contenuto di builder/builder.js>
return await fofBuild(<spec JSON completa>, "<sezione>");
```

- Una sezione per chiamata. Se una fallisce, rifai solo quella: il builder ricostruisce la
  sezione al suo posto senza duplicati.
- Il builder non lancia errori: se qualcosa va storto risponde `{ ok: false, error, notes }` e lascia
  il file com'era (la versione precedente della sezione resta, i nodi a metà vengono tolti).
  Riporta `error` con parole semplici, correggi la causa (di solito nella spec) e rilancia solo quella
  sezione. Non provare a riparare a mano in Figma.
- Leggi sempre `notes` nel risultato e riportale (layer non trovati, varianti mancanti, regole saltate).
- Gli id delle sezioni cambiano a ogni ricostruzione: aggiorna `figmaDoc` con quelli dell'ultimo giro.
- Le sezioni `spacing`, `content`, `context` non hanno ancora un builder: se sono nella spec,
  saltale e di' che sono il compito del Lab 3.

## Dopo

1. **Guarda il risultato prima di dire che è finito.** Fai uno screenshot del frame
   (`get_screenshot` sul `frameId`) e controlla: testi tagliati, instance fuori posto, marker
   dell'anatomia lontani dalla parte giusta, sezioni vuote. Se qualcosa non va, dillo.
2. **Aggiorna la spec** con gli id restituiti, nel campo `figmaDoc`:
   `{ "frameId": "...", "sections": { "overview": "...", ... }, "builtAt": "<data>" }`.
   È l'unico campo della spec che questa skill può modificare.
3. **Resoconto** in una tabella breve: sezioni costruite, note del builder, cosa controllare a occhio.

## Cosa non fare

- Non scrivere fuori dalle pagine `📄 Docs` e `🧩 Doc kit`.
- Non toccare i componenti del corso (Button, Badge, …) né le variabili.
- Non modificare i componenti `Doc/*` del kit: li cura chi tiene il corso. Se servono cambi, proponili.
- Non includere Do & Don't con `approved: false`: il builder li salta, e va bene così.

## Cose che vanno storte (e perché)

- **`createInstance()` mette l'istanza nella pagina attiva**, non nel frame: il builder la sposta
  subito con `appendChild`. Se scrivi codice tuo, fai lo stesso.
- **Le istanze nella doc contano come utilizzi del componente.** Non è un errore, ma tienilo presente
  se qualcuno guarda le statistiche della libreria.
- **Gli id scadono.** Se un componente viene ricreato o spostato in un altro file, il `nodeId` nella
  spec non vale più: il builder cerca allora il componente per nome e lo scrive nelle note.
- **Font.** Il builder usa Inter, che è incluso in Figma: non serve installare niente. Per gli snippet cerca un monospace (JetBrains Mono, Roboto Mono…) e se non lo trova usa Inter, segnalandolo.
