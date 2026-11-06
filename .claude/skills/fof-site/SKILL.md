---
name: fof-site
description: Aggiorna la documentazione HTML del corso (docs/site) con le spec in docs/specs, con anteprime fatte dai componenti React veri. Usala quando si vuole vedere o pubblicare la documentazione fuori da Figma. Comando /fof-site.
---

# fof-site — la documentazione anche in HTML

La stessa spec che costruisce il frame in Figma diventa una pagina web. Le anteprime non sono
immagini: sono i componenti React della repo, già compilati in `docs/site/assets/`.
Hover, focus e tema scuro si provano dal vivo.

```
docs/specs/*.json ──► docs/site/specs.js ──► docs/site/index.html
```

## Cosa fare

1. **Controlla Node**: `node -v`.
   - **C'è** → lancia `node scripts/fof-site.mjs`. Riporta quali spec ha incluso e quali ha saltato.
   - **Non c'è** → avvisa una volta:
     > Node non è installato: scrivo io il file della documentazione. Funziona, ma consuma più token.

     Poi scrivi `docs/site/specs.js` così, con tutte le spec di `docs/specs/` tranne `_schema.json`,
     ordinate per nome file, ognuna copiata **esattamente** com'è:
     ```js
     // Generato da /fof-site il <data>. Non modificare a mano.
     window.FOF_GENERATED = "<data, es. 16 novembre 2026>";
     window.FOF_SPECS = [ <spec 1>, <spec 2>, … ];
     ```
2. **Di' all'utente di aprire** `docs/site/index.html` con un doppio clic (o trascinandolo nel browser).
3. Se l'utente ha creato una sezione nuova nel Lab 3, nella pagina compare da sola con i suoi dati
   grezzi: è normale, la vista dedicata non esiste ancora.

## Cosa non fare

- Non modificare `docs/site/index.html` né `docs/site/assets/`: sono compilati.
- Non correggere la documentazione nella pagina: si corregge la spec e si rilancia `/fof-site`.
- Se una spec ha un componente che il visualizzatore non conosce (un componente nuovo), la pagina
  lo segnala: serve ricompilare il visualizzatore, lo fa chi tiene il corso.
