// Generato da scripts/fof-site.mjs il 9 novembre 2026. Non modificare a mano.
window.FOF_GENERATED = "9 novembre 2026";
window.FOF_SPECS = [
  {
    "name": "Badge",
    "slug": "badge",
    "description": "Etichetta breve che dà uno stato o una categoria a un elemento. Non è cliccabile, a meno che non avvolga un link.",
    "sections": [
      "overview",
      "variants",
      "mismatches"
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
        "description": "Colore e peso dell'etichetta.",
        "in": [
          "code",
          "figma"
        ]
      },
      {
        "name": "asChild",
        "type": "boolean",
        "default": false,
        "description": "Applica lo stile al figlio, per esempio un link.",
        "in": [
          "code"
        ]
      },
      {
        "name": "label",
        "type": "text",
        "description": "Testo dell'etichetta.",
        "in": [
          "figma"
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
        "what": "variant=success",
        "code": "non esiste: nel tema non c'è un colore success",
        "figma": "variante presente, con un verde non collegato a variabili",
        "severity": "warning"
      }
    ],
    "provenance": {
      "sources": [
        "codice",
        "figma"
      ],
      "date": "2026-11-01",
      "verified": true
    },
    "figmaDoc": {
      "frameId": "17:89",
      "sections": {
        "overview": "17:90",
        "variants": "17:109",
        "mismatches": "17:138"
      },
      "builtAt": "2026-11-09"
    }
  },
  {
    "name": "Button",
    "slug": "button",
    "description": "Avvia un'azione: inviare un form, aprire un dialog, confermare una scelta. Usa la variante per dire quanto pesa l'azione, non per decorare.",
    "sections": [
      "overview",
      "variants",
      "mismatches",
      "anatomy",
      "states",
      "usage",
      "tokens",
      "a11y",
      "code"
    ],
    "source": {
      "code": "components/ui/button.tsx",
      "figma": {
        "fileKey": "bDIlvCt3yrApyG1qcxHc7B",
        "nodeId": "2:331",
        "name": "Button"
      }
    },
    "props": [
      {
        "name": "variant",
        "type": "\"default\" | \"destructive\" | \"outline\" | \"secondary\" | \"ghost\" | \"link\"",
        "default": "default",
        "description": "Peso visivo dell'azione.",
        "in": [
          "code",
          "figma"
        ]
      },
      {
        "name": "size",
        "type": "\"default\" | \"sm\" | \"lg\" | \"icon\"",
        "default": "default",
        "description": "Altezza e padding. icon è quadrato, solo per un'icona.",
        "in": [
          "code",
          "figma"
        ]
      },
      {
        "name": "asChild",
        "type": "boolean",
        "default": false,
        "description": "Applica lo stile al figlio (es. un link) invece di creare un <button>.",
        "in": [
          "code"
        ]
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": false,
        "description": "Blocca il click e abbassa l'opacità al 50%.",
        "in": [
          "code"
        ]
      },
      {
        "name": "label",
        "type": "text",
        "description": "Testo del bottone. In Figma è una text property.",
        "in": [
          "figma"
        ]
      }
    ],
    "variants": {
      "code": {
        "variant": [
          "default",
          "destructive",
          "outline",
          "secondary",
          "ghost",
          "link"
        ],
        "size": [
          "default",
          "sm",
          "lg",
          "icon"
        ]
      },
      "figma": {
        "variant": [
          "default",
          "destructive",
          "outline",
          "secondary",
          "ghost",
          "link"
        ],
        "size": [
          "default",
          "sm",
          "lg"
        ],
        "state": [
          "default",
          "hover",
          "focus",
          "disabled"
        ]
      },
      "defaults": {
        "variant": "default",
        "size": "default"
      }
    },
    "mismatches": [
      {
        "what": "size=icon",
        "code": "esiste (size-9, quadrato)",
        "figma": "manca nel component set",
        "severity": "warning"
      },
      {
        "what": "state",
        "code": "non è una prop: hover, focus e disabled sono classi CSS (hover:, focus-visible:, disabled:)",
        "figma": "variant property con 4 valori",
        "severity": "info"
      },
      {
        "what": "disabled",
        "code": "attributo HTML disabled",
        "figma": "state=disabled",
        "severity": "info"
      }
    ],
    "anatomy": [
      {
        "n": 1,
        "part": "Contenitore",
        "layer": "Button",
        "slot": "button",
        "description": "Sfondo, raggio e padding. Il colore dipende da variant."
      },
      {
        "n": 2,
        "part": "Icona iniziale",
        "layer": "Icon",
        "description": "16 px, segue il colore del testo.",
        "optional": true
      },
      {
        "n": 3,
        "part": "Label",
        "layer": "Label",
        "description": "Testo dell'azione, 14 px medium."
      }
    ],
    "states": [
      {
        "state": "default",
        "code": "—",
        "figma": "state=default"
      },
      {
        "state": "hover",
        "code": "hover:bg-primary/90 (cambia per variant)",
        "figma": "state=hover"
      },
      {
        "state": "focus-visible",
        "code": "focus-visible:ring-[3px] focus-visible:ring-ring",
        "figma": "state=focus",
        "note": "Anello pieno, non trasparente: con /50 il contrasto scende sotto 3:1."
      },
      {
        "state": "disabled",
        "code": "disabled:opacity-50 disabled:pointer-events-none",
        "figma": "state=disabled"
      },
      {
        "state": "invalid",
        "code": "aria-invalid:ring-destructive aria-invalid:border-destructive",
        "figma": null,
        "note": "Solo nel codice: in Figma non c'è una variante."
      }
    ],
    "usage": [
      {
        "type": "do",
        "rule": "Un solo bottone default per area: è l'azione principale. Le altre vanno su secondary, outline o ghost.",
        "mode": "generated",
        "scene": [
          {
            "component": "button",
            "props": {
              "variant": "default"
            },
            "text": "Salva"
          },
          {
            "component": "button",
            "props": {
              "variant": "outline"
            },
            "text": "Annulla"
          }
        ],
        "source": "shadcn-registry",
        "approved": true
      },
      {
        "type": "dont",
        "rule": "Non affiancare due bottoni default: chi guarda non capisce quale sia l'azione principale.",
        "mode": "generated",
        "scene": [
          {
            "component": "button",
            "props": {
              "variant": "default"
            },
            "text": "Salva"
          },
          {
            "component": "button",
            "props": {
              "variant": "default"
            },
            "text": "Annulla"
          }
        ],
        "source": "inferenza",
        "approved": true
      },
      {
        "type": "do",
        "rule": "Label con un verbo che dice cosa succede: \"Elimina progetto\", non \"OK\".",
        "mode": "generated",
        "scene": [
          {
            "component": "button",
            "props": {
              "variant": "destructive"
            },
            "text": "Elimina progetto"
          }
        ],
        "source": "inferenza",
        "approved": true
      },
      {
        "type": "dont",
        "rule": "Non usare destructive per azioni che si annullano facilmente: il rosso va tenuto per quelle irreversibili.",
        "mode": "generated",
        "scene": [
          {
            "component": "button",
            "props": {
              "variant": "destructive"
            },
            "text": "Chiudi"
          }
        ],
        "source": "inferenza",
        "approved": true
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
        "part": "Label",
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
        "part": "Label",
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
        "part": "Label",
        "variant": "variant=destructive",
        "property": "text",
        "variable": "destructive-foreground"
      },
      {
        "part": "Contenitore",
        "variant": "variant=outline",
        "property": "stroke",
        "variable": "input"
      },
      {
        "part": "Contenitore",
        "variant": "variant=outline / ghost, hover",
        "property": "fill",
        "variable": "accent"
      },
      {
        "part": "Label",
        "variant": "variant=outline / ghost, hover",
        "property": "text",
        "variable": "accent-foreground"
      },
      {
        "part": "Label",
        "variant": "variant=link",
        "property": "text",
        "variable": "link"
      },
      {
        "part": "Anello di focus",
        "variant": "",
        "property": "ring",
        "variable": "ring"
      }
    ],
    "a11y": {
      "contrast": [
        {
          "pair": "primary-foreground / primary",
          "mode": "Light",
          "ratio": 10.96,
          "min": 4.5,
          "pass": true
        },
        {
          "pair": "primary-foreground / primary",
          "mode": "Dark",
          "ratio": 10.96,
          "min": 4.5,
          "pass": true
        },
        {
          "pair": "secondary-foreground / secondary",
          "mode": "Light",
          "ratio": 5.32,
          "min": 4.5,
          "pass": true
        },
        {
          "pair": "destructive-foreground / destructive",
          "mode": "Light",
          "ratio": 6.57,
          "min": 4.5,
          "pass": true
        },
        {
          "pair": "destructive-foreground / destructive",
          "mode": "Dark",
          "ratio": 5.39,
          "min": 4.5,
          "pass": true
        },
        {
          "pair": "accent-foreground / accent",
          "mode": "Dark",
          "ratio": 6.94,
          "min": 4.5,
          "pass": true
        },
        {
          "pair": "link / background",
          "mode": "Light",
          "ratio": 6.51,
          "min": 4.5,
          "pass": true
        },
        {
          "pair": "link / background",
          "mode": "Dark",
          "ratio": 4.52,
          "min": 4.5,
          "pass": true
        },
        {
          "pair": "input / background",
          "mode": "Light",
          "ratio": 3.71,
          "min": 3,
          "pass": true
        },
        {
          "pair": "ring / background",
          "mode": "Light",
          "ratio": 12.3,
          "min": 3,
          "pass": true
        },
        {
          "pair": "ring / background",
          "mode": "Dark",
          "ratio": 4.52,
          "min": 3,
          "pass": true
        }
      ],
      "role": "button (nativo). Con asChild prende il ruolo del figlio: un <a> resta un link.",
      "keyboard": [
        "Tab: porta il focus",
        "Invio / Spazio: attiva"
      ],
      "targetSize": "36 px (default), 32 px (sm): sopra il minimo di 24 px di WCAG 2.2",
      "notes": [
        "size=icon non ha testo: serve aria-label.",
        "Da disabled il bottone esce dall'ordine di tab: se l'utente deve capire perché è bloccato, spiegalo vicino."
      ]
    },
    "code": [
      {
        "title": "Uso base",
        "lang": "tsx",
        "snippet": "import { Button } from \"@/components/ui/button\"\n\nexport function Salva() {\n  return <Button>Salva</Button>\n}"
      },
      {
        "title": "Varianti e dimensioni",
        "lang": "tsx",
        "snippet": "<Button variant=\"outline\">Annulla</Button>\n<Button variant=\"destructive\">Elimina progetto</Button>\n<Button variant=\"ghost\" size=\"sm\">Altro</Button>\n<Button size=\"lg\">Continua</Button>"
      },
      {
        "title": "Come link",
        "lang": "tsx",
        "snippet": "// asChild: lo stile va al figlio, che resta un <a>\n<Button asChild variant=\"link\">\n  <a href=\"/accedi\">Accedi</a>\n</Button>"
      },
      {
        "title": "Disabilitato",
        "lang": "tsx",
        "snippet": "<Button disabled>Invio in corso…</Button>"
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
      "date": "2026-11-01",
      "verified": true
    },
    "figmaDoc": {
      "frameId": "3:6",
      "sections": {
        "overview": "3:667",
        "variants": "3:696",
        "mismatches": "3:765",
        "anatomy": "3:793",
        "states": "3:829",
        "usage": "3:865",
        "tokens": "3:1277",
        "a11y": "3:1032",
        "code": "3:1228"
      },
      "builtAt": "2026-11-06"
    }
  }
];
