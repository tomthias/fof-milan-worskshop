# Menu delle sezioni

Ogni sezione è un blocco del frame di documentazione in Figma. Nel frame compaiono solo quelle
scelte, nell'ordine in cui sono scritte in `sections`.

| Chiave | Nome nel frame | Cosa produce in Figma | Da dove legge | Campo della spec |
|---|---|---|---|---|
| `overview` | Overview | titolo, descrizione, anteprima Light e Dark, fonti usate | codice, registry | `name`, `description`, `provenance` |
| `variants` | Varianti e proprietà | una riga di instance per ogni proprietà, segnando cosa c'è da una parte sola | cva + component set | `variants` |
| `mismatches` | Differenze codice ↔ Figma | tabella delle differenze con livello info / attenzione | entrambi | `mismatches` |
| `anatomy` | Anatomia | instance ingrandita con marker numerati e legenda | layer Figma + `data-slot` | `anatomy` |
| `states` | Stati | instance per stato, segnaposto per gli stati che esistono solo nel codice | classi `hover:` `focus-visible:` `disabled:` + variant `state` | `states` |
| `usage` | Do & Don't | card verdi e rosse con una scena di instance e la regola | inferenza, codice o registry; li approva una persona | `usage` |
| `tokens` | Colori e variabili | tabella parte → variabile → valore Light e Dark, con campione | classi colore + variabili collegate in Figma | `tokens` |
| `a11y` | Accessibilità | contrasti con esito AA, ruolo, tastiera, area cliccabile, note | `fof-tokens.mjs`, Radix, misure | `a11y` |
| `code` | Codice | blocchi di codice in stile editor (barra con titolo e linguaggio, numeri di riga, colori della sintassi) | il sorgente del componente: export, props e valori di `cva` | `code` |
| `spacing` | Spaziature | *(da costruire nel Lab 3)* | auto layout Figma, classi `p-` `gap-` | `spacing` |
| `content` | Contenuti | *(da costruire nel Lab 3)* | inferenza, da approvare | `content` |
| `context` | Esempio in contesto | *(da costruire nel Lab 3)* | più componenti insieme | `context` |

**Sempre presenti**: `overview`, `variants`, `mismatches`.
