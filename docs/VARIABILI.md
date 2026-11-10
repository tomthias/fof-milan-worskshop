# Il tema fof-milan: un nome, due mondi

Il tema usa i colori di Friends of Figma Milan con i **nomi delle variabili shadcn**.
Lo stesso nome esiste in tre posti:

| Dove | Come si chiama |
|---|---|
| Figma, collection `theme` | `primary` |
| Figma, code syntax della variabile | `var(--primary)` |
| `app/globals.css` | `--primary` → classe Tailwind `bg-primary` |

Per questo l'agente può confrontare Figma e codice senza tabelle di traduzione.

---

## Le collection in Figma

**`primitives`** — la palette, un solo modo. È nascosta dalla pubblicazione e non compare nei
picker: i componenti non la usano mai direttamente.

| Nome | Valore | |
|---|---|---|
| `navy/800` | `#142F78` | il blu del brand |
| `lime/300` | `#E2FD94` | |
| `lilac/300` | `#C99BD0` | |
| `pink/400` | `#FF5FC8` | |
| `pink/700` | `#B0107F` | rosa scuro, per il testo su chiaro |
| `gray/50` · `gray/950` | `#F5F5F5` · `#111111` | |
| … | | navy 100–900, gray, red: vedi `tokens/tokens.json` |

**`theme`** — le variabili che si usano davvero, con due modi: **Light** e **Dark**.
Ognuna è un alias di una primitiva.

| Variabile | Light | Dark |
|---|---|---|
| `background` / `foreground` | bianco / ink | navy / off-white |
| `primary` / `primary-foreground` | navy / lime | lime / navy |
| `secondary` / `secondary-foreground` | lilla / navy | lilla / navy |
| `accent` / `accent-foreground` | lime / navy | rosa / ink |
| `muted` / `muted-foreground` | off-white / grigio | navy chiaro / navy 100 |
| `destructive` / `destructive-foreground` | rosso / bianco | rosso chiaro / navy |
| `link` | rosa scuro | rosa |
| `border` · `input` · `ring` | grigio · grigio scuro · navy | navy · lilla · rosa |

Ogni variabile ha gli **scope** impostati: i `*-foreground` compaiono solo per testo e icone,
`border` e `input` solo per i bordi, le superfici solo per i riempimenti.

---

## Le regole del colore

1. **Il lime va solo su navy**, oppure come sfondo con testo navy o ink.
2. **Rosa e lilla su chiaro sono solo sfondi o decorazioni**, mai testo o bordi.
3. **Il focus ring è sempre pieno**, mai trasparente.
4. **Ogni coppia `X` / `X-foreground` passa 4,5:1** in tutti e due i modi.

Perché: su bianco il lime fa 1,1:1, il rosa 2,7:1, il lilla 2,3:1. Su navy invece il lime fa
10,96:1 e il rosa 4,52:1.

---

## Due differenze fra Figma e codice

- **Formato dei colori**: shadcn di solito usa `oklch()`, Figma lavora in RGB. In questo tema
  abbiamo scritto tutti i colori in esadecimale, così il numero è identico da tutte e due le parti.
- **Raggi**: in codice `--radius-sm` e gli altri sono calcolati (`calc(var(--radius) - 4px)`),
  in Figma esiste solo `radius` (10 px).

---

## Controllo

```bash
node scripts/fof-tokens.mjs
```

Controlla che `globals.css` e `tokens/tokens.json` abbiano gli stessi nomi e gli stessi
valori, e calcola il contrasto delle coppie che si usano insieme.
