# Do & Don't

Ogni regola è una piccola **scena**: un'affermazione e le instance che la mostrano.
Nel frame, la scena viene costruita con **instance vere** dei componenti del file, con le
proprietà e i testi indicati. Niente disegni da zero.

```json
{
  "type": "dont",
  "rule": "Non affiancare due bottoni default: chi guarda non capisce quale sia l'azione principale.",
  "mode": "generated",
  "scene": [
    { "component": "button", "props": { "variant": "default" }, "text": "Salva" },
    { "component": "button", "props": { "variant": "default" }, "text": "Annulla" }
  ],
  "source": "inferenza",
  "approved": false
}
```

## Due modi

**`generated`** — la scena la propone l'agente.
- Proponi da 2 a 4 regole in tutto, metà Do e metà Don't.
- Ogni scena usa solo componenti che esistono in `components/ui/` e solo valori di proprietà che
  esistono in Figma (altrimenti l'instance non si può creare).
- Testi realistici e in italiano ("Salva", "Elimina progetto"), mai "Button" o "Lorem ipsum".
- Ogni Don't deve mostrare l'errore, non descriverlo soltanto.

**`selection`** — la scena la compone il designer in Figma.
- Il designer seleziona un frame e chiede di usarlo come Do o Don't.
- Leggi la selezione via MCP, scrivi `selectionId` con l'id del nodo e lascia `scene` vuoto.
- Scrivi tu la regola in base a quello che vedi, poi chiedi conferma.

## Da dove vengono le regole

| `source` | Quando |
|---|---|
| `shadcn-registry` | l'uso è indicato nella documentazione shadcn |
| `codice` | la regola discende da come è scritto il componente (es. `size=icon` non ha testo → serve aria-label) |
| `inferenza` | è una buona pratica che proponi tu |
| `designer` | l'ha scritta o riscritta l'utente |

## Approvazione

- Le regole proposte da te nascono **sempre** con `"approved": false`.
- Solo l'utente può approvarle. Nel frame finiscono solo quelle approvate.
- Se l'utente riscrive una regola, aggiorna `rule` e metti `"source": "designer"`.
