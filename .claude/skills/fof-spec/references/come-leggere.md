# Come leggere le fonti

## Codice (`components/ui/<slug>.tsx`)

- **Varianti**: il blocco `variants` dentro `cva(...)`. Ogni chiave al primo livello è una
  proprietà (`variant`, `size`), le chiavi dentro sono i valori. `defaultVariants` dà i default.
  Se il file non usa `cva`, `variants.code` è `{}`.
- **Props**: quelle nella firma della funzione (`asChild`, `className`…) più gli attributi HTML
  rilevanti per la documentazione (`disabled`, `type`). Non elencare tutti gli attributi HTML.
- **Parti**: ogni `data-slot="..."` è una parte. Per i componenti composti (Card, Alert) ogni
  funzione esportata è una parte.
- **Stati**: classi con prefisso `hover:`, `focus-visible:`, `disabled:`, `aria-invalid:`,
  `data-[state=checked]:`.
- **Colori**: classi `bg-<nome>`, `text-<nome>`, `border-<nome>`, `ring-<nome>`. `<nome>` è la
  variabile. `bg-primary/90` vuol dire primary al 90% di opacità: la variabile resta `primary`.
- **Snippet** (sezione `code`): l'import viene dalle funzioni esportate (`export { Button, … }`)
  con il percorso `@/components/ui/<slug>`. Negli esempi usa solo props e valori che esistono
  davvero nel file (le chiavi di `cva`, `asChild`, gli attributi HTML elencati sopra). Niente
  librerie che il progetto non ha: se `package.json` non contiene `lucide-react`, niente icone
  importate da lì. Uno snippet per idea (uso base, varianti, composizione), poche righe ciascuno.

## Registry shadcn (MCP `shadcn`)

Cerca il componente per nome. Ti serve per la descrizione e per l'uso previsto.
Se il componente locale è diverso dall'originale (classi diverse, varianti in più o in meno),
**non è un errore**: è una scelta del tema del corso. Puoi citarla nelle note, non in `mismatches`
(che riguarda solo codice ↔ Figma).

## Figma (MCP `figma`)

1. Trova il component set: se la spec ha già `source.figma.nodeId` usa quello, altrimenti cerca
   per nome con `get_metadata` sulla pagina dei componenti.
2. `get_metadata` sul component set → variant properties (nomi e valori) e nomi dei layer.
3. `get_design_context` su una variante → struttura e auto layout.
4. `get_variable_defs` → quali variabili sono collegate e dove. Con la code syntax impostata,
   i nomi tornano come `var(--primary)`: è lo stesso nome di `globals.css`.
5. Scrivi `source.figma.fileKey` e `nodeId` nella spec.

Le variant property che in codice sono stati CSS (es. `state=hover`) vanno in `variants.figma`
così come sono, e la differenza va in `mismatches` con `severity: "info"`.

Un colore **non collegato a una variabile** in Figma è sempre una differenza da segnalare
(`severity: "warning"`).

## Contrasto

`node scripts/fof-tokens.mjs --json` restituisce i rapporti per tutte le coppie del tema.
Nella sezione `a11y` riporta solo le coppie che il componente usa davvero.
