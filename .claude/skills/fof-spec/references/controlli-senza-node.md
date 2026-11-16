# Controlli senza Node

Si usano **solo se `node -v` non risponde**. Sono gli stessi controlli di `scripts/check-spec.mjs`
e `scripts/fof-tokens.mjs`, fatti leggendo i file. Prima di iniziare avvisa una volta:

> Node non è installato: faccio i controlli leggendo i file io. Funziona, ma consuma più token
> ed è meno preciso degli script.

Nel resoconto finale scrivi sempre **"controlli fatti senza Node"**.

## Controllo della spec (al posto di check-spec)

Leggi `docs/specs/<slug>.json` e `components/ui/<slug>.tsx`, poi verifica, in ordine.

**Errori (bloccano `/fof-figma-doc`):**
1. Ci sono `name`, `slug`, `description`, `sections`, `source`, `variants`, `mismatches`, `provenance`.
2. `slug` è uguale al nome del file. `description` ha al massimo 280 caratteri.
3. `sections` contiene `overview`, `variants`, `mismatches`, e solo chiavi del menu (`menu-sezioni.md`).
4. Ogni sezione scelta (tranne overview, variants, mismatches) ha il suo campo non vuoto.
5. `variants.code` è identico al blocco `variants` del `cva(...)` nel sorgente: stesse proprietà, stessi valori.
   Se il file non usa `cva`, `variants.code` è `{}`.
6. Ogni `tokens[].variable` esiste in `app/globals.css` (blocco `:root`).
7. Ogni contrasto in `a11y.contrast` torna con il calcolo qui sotto (tolleranza 0,05) e `pass` è coerente con `min`.
8. Ogni `usage[].scene[].component` esiste in `components/ui/`. Le regole `mode: "selection"` hanno `selectionId`.

**Avvisi (si riportano, non bloccano):**
- Ogni valore che sta solo in `variants.code` o solo in `variants.figma` compare in `mismatches`.
- Ogni variabile in `tokens` compare come classe nel sorgente (`bg-`, `text-`, `border-`, `ring-`).
- Regole con `approved: false` (non finiranno nel frame).
- Regole con `source: "inferenza"` ma `"inferenza"` manca in `provenance.sources`.

## Controllo del tema (al posto di fof-tokens)

Leggi `app/globals.css` (`:root` = Light, `.dark` = Dark) e `tokens/tokens.json`
(collection `theme`, alias risolti su `primitives`). Verifica:
1. stessi nomi da tutte e due le parti (esclusa `radius`);
2. stesso valore esadecimale per ogni modo.

## Calcolo del contrasto (WCAG 2.1)

Per ogni colore esadecimale `#RRGGBB`:
1. dividi R, G e B per 255;
2. per ogni canale c: se c ≤ 0,03928 allora c / 12,92, altrimenti ((c + 0,055) / 1,055)^2,4;
3. luminanza L = 0,2126·R + 0,7152·G + 0,0722·B.

Rapporto = (L chiara + 0,05) / (L scura + 0,05). Arrotonda a due decimali.
Minimo: **4,5** per il testo, **3** per bordi dei campi, focus ring e componenti UI.

Per non sbagliare i conti, valori già calcolati del tema (Light · Dark):
foreground/background 16,67 · 11,37 —
primary-foreground/primary 11,25 · 11,25 —
secondary-foreground/secondary 5,57 · 5,57 —
accent-foreground/accent 11,25 · 6,59 —
destructive-foreground/destructive 6,57 · 5,43 —
muted-foreground/muted 6,18 · 6,36 —
muted-foreground/background 6,74 · 7,76 —
muted-foreground/card 6,74 · 9,07 —
card-foreground/card 16,67 · 13,29 —
destructive/card 6,57 · 6,35 —
link/background 6,51 · 4,90 —
input/background 3,71 · 5,57 —
ring/background 12,40 · 4,90 —
primary/background 12,40 · 11,25.
Valgono finché `globals.css` non cambia: se è cambiato, ricalcola.
