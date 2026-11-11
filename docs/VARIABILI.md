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
| `navy/800` | `#122F76` | il blu del brand (Dark-Blue) |
| `lime/300` | `#E4FF97` | Lime |
| `lilac/300` | `#CB9FD2` | Dusty-Violet |
| `pink/400` | `#FF6FC1` | Pink |
| `pink/700` | `#B0107F` | rosa scuro, per il testo su chiaro |
| `gray/50` · `gray/200` · `gray/950` | `#F5F5F5` · `#E2E2E2` · `#1E1E1E` | Off-White · Light-Gray · Black |
| `brown/500` · `sage/300` · `tan/200` | `#877A7A` · `#95B9AC` · `#FADCA2` | Brown · Sage · Tan (palette Core, non usati dal tema) |
| `green/500` · `yellow/400` | `#24CB71` · `#F9DC1F` | Kelly-Green · Yellow (palette Chapter, non usati dal tema) |
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

Perché: su bianco il lime fa 1,1:1, il rosa 2,5:1, il lilla 2,2:1. Su navy invece il lime fa
11,25:1 e il rosa 4,90:1.

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
