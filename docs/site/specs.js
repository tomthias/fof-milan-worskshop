// Generato da scripts/fof-site.mjs il 11 novembre 2026. Non modificare a mano.
window.FOF_GENERATED = "11 novembre 2026";
window.FOF_SPECS = [
  {
    "name": "Badge",
    "slug": "badge",
    "description": "Etichetta breve che segnala lo stato o la categoria di un elemento. Non è interattiva, a meno che non la usi come link.",
    "sections": [
      "overview",
      "variants",
      "mismatches",
      "anatomy",
      "usage",
      "tokens"
    ],
    "source": {
      "code": "components/ui/badge.tsx",
      "figma": {
        "fileKey": "bDIlvCt3yrApyG1qcxHc7B",
        "nodeId": "2:344",
        "name": "Badge"
      }
    },
    "props": [
      {
        "name": "variant",
        "type": "\"default\" | \"secondary\" | \"destructive\" | \"outline\"",
        "default": "default",
        "description": "Colore e peso visivo del badge.",
        "in": [
          "code",
          "figma"
        ]
      },
      {
        "name": "asChild",
        "type": "boolean",
        "default": false,
        "description": "Passa lo stile all'elemento figlio, per esempio un link.",
        "in": [
          "code"
        ]
      },
      {
        "name": "className",
        "type": "string",
        "description": "Classi in più da aggiungere a quelle del badge.",
        "in": [
          "code"
        ]
      }
    ],
    "variants": {
      "code": {
        "variant": [
          "default",
          "secondary",
          "destructive",
          "outline"
        ]
      },
      "figma": {
        "variant": [
          "default",
          "secondary",
          "destructive",
          "outline",
          "success"
        ]
      },
      "defaults": {
        "variant": "default"
      }
    },
    "mismatches": [
      {
        "what": "Variante success",
        "code": "Non esiste: le varianti sono default, secondary, destructive, outline.",
        "figma": "Esiste variant=success.",
        "severity": "warning"
      },
      {
        "what": "Colori di success non collegati a variabili",
        "code": "—",
        "figma": "Sfondo #16A34A e testo #FFFFFF scritti a mano; il contrasto è 3,30:1, sotto 4,5:1.",
        "severity": "warning"
      },
      {
        "what": "Altezza delle varianti piene",
        "code": "Tutte le varianti hanno un bordo da 1px (trasparente su default, secondary, destructive): 22px di altezza.",
        "figma": "default, secondary, destructive e success non hanno bordo: 20px; solo outline è 22px.",
        "severity": "info"
      },
      {
        "what": "Icona",
        "code": "Accetta un'icona SVG a 12px con 4px di spazio dal testo.",
        "figma": "Nessun layer o proprietà per l'icona.",
        "severity": "info"
      },
      {
        "what": "Hover e focus",
        "code": "Hover solo se il badge è un link (bg al 90%); focus-visible con ring da 3px.",
        "figma": "Nessuna variante di stato.",
        "severity": "info"
      }
    ],
    "anatomy": [
      {
        "n": 1,
        "part": "Contenitore",
        "layer": "variant=default",
        "slot": "badge",
        "description": "Sfondo, bordo e angoli da 8px; si adatta alla larghezza del testo."
      },
      {
        "n": 2,
        "part": "Etichetta",
        "layer": "Label",
        "description": "Testo da 12px, peso medium, su una riga sola."
      },
      {
        "n": 3,
        "part": "Icona",
        "description": "SVG da 12px prima o dopo il testo; c'è solo nel codice.",
        "optional": true
      }
    ],
    "usage": [
      {
        "type": "do",
        "rule": "Scrivi etichette di una o due parole che descrivono uno stato.",
        "mode": "generated",
        "scene": [
          {
            "component": "badge",
            "props": {
              "variant": "secondary"
            },
            "text": "In revisione"
          }
        ],
        "source": "inferenza",
        "approved": false
      },
      {
        "type": "do",
        "rule": "Usa default per l'informazione più importante e outline per quelle secondarie.",
        "mode": "generated",
        "scene": [
          {
            "component": "badge",
            "props": {
              "variant": "default"
            },
            "text": "Nuovo"
          },
          {
            "component": "badge",
            "props": {
              "variant": "outline"
            },
            "text": "Design"
          }
        ],
        "source": "inferenza",
        "approved": false
      },
      {
        "type": "dont",
        "rule": "Non usare destructive per stati neutri: riservalo a errori o azioni irreversibili.",
        "mode": "generated",
        "scene": [
          {
            "component": "badge",
            "props": {
              "variant": "destructive"
            },
            "text": "Bozza"
          }
        ],
        "source": "inferenza",
        "approved": false
      },
      {
        "type": "dont",
        "rule": "Non usare il badge come pulsante: per un'azione usa Button.",
        "mode": "generated",
        "scene": [
          {
            "component": "badge",
            "props": {
              "variant": "default"
            },
            "text": "Salva"
          }
        ],
        "source": "inferenza",
        "approved": false
      }
    ],
    "tokens": [
      {
        "part": "Contenitore",
        "variant": "variant=default",
        "property": "fill",
        "variable": "primary"
      },
      {
        "part": "Etichetta",
        "variant": "variant=default",
        "property": "text",
        "variable": "primary-foreground"
      },
      {
        "part": "Contenitore",
        "variant": "variant=secondary",
        "property": "fill",
        "variable": "secondary"
      },
      {
        "part": "Etichetta",
        "variant": "variant=secondary",
        "property": "text",
        "variable": "secondary-foreground"
      },
      {
        "part": "Contenitore",
        "variant": "variant=destructive",
        "property": "fill",
        "variable": "destructive"
      },
      {
        "part": "Etichetta",
        "variant": "variant=destructive",
        "property": "text",
        "variable": "destructive-foreground"
      },
      {
        "part": "Contenitore",
        "variant": "variant=outline",
        "property": "stroke",
        "variable": "border"
      },
      {
        "part": "Etichetta",
        "variant": "variant=outline",
        "property": "text",
        "variable": "foreground"
      },
      {
        "part": "Contenitore",
        "variant": "",
        "property": "ring",
        "variable": "ring"
      }
    ],
    "provenance": {
      "sources": [
        "codice",
        "globals.css",
        "shadcn-registry",
        "figma",
        "inferenza"
      ],
      "date": "2026-11-10",
      "verified": false
    }
  }
];
