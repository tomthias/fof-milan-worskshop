// fof-milano — builder del frame di documentazione.
// Gira DENTRO Figma tramite lo strumento use_figma (Plugin API). Non si lancia da terminale.
//
// Come lo usa l'agente (una chiamata use_figma per sezione):
//   1. legge questo file così com'è
//   2. aggiunge in fondo:   return await fofBuild(<spec JSON>, "<sezione>");
//   3. manda il tutto a use_figma
// Restituisce { ok, section, nodeId, frameId, notes }. Le notes vanno lette sempre.
//
// Cosa costruisce:
//   - pagina "📄 Docs" (la crea se manca) con il frame "<Nome> — Documentation"
//   - dentro, un frame per sezione chiamato "section:<chiave>", ricostruito al suo posto
//     se esiste già (niente duplicati)
//   - pagina "🧩 Doc kit" con i componenti Doc/* (li crea la prima volta, poi li riusa):
//     modificali lì e tutte le documentazioni si aggiornano
// Colori: sempre variabili della collection "theme" (stessi nomi di globals.css).

async function fofBuild(SPEC, SECTION) {
  const notes = [];
  const W = 1440, PAD = 80, CONTENT = W - PAD * 2;
  const SECTION_TITLES = {
    overview: 'Overview', variants: 'Varianti e proprietà', mismatches: 'Differenze codice ↔ Figma',
    anatomy: 'Anatomia', states: 'Stati', usage: 'Do & Don\'t', tokens: 'Colori e variabili',
    a11y: 'Accessibilità', spacing: 'Spaziature', content: 'Contenuti', context: 'Esempio in contesto',
  };
  if (!SECTION_TITLES[SECTION]) throw new Error('Sezione sconosciuta: ' + SECTION);
  if (!SPEC.sections.includes(SECTION)) throw new Error('La sezione "' + SECTION + '" non è fra quelle scelte nella spec');
  if (['spacing', 'content', 'context'].includes(SECTION)) {
    throw new Error('La sezione "' + SECTION + '" non ha ancora un builder: è il compito del Lab 3');
  }

  await figma.loadAllPagesAsync();

  // ------------------------------------------------------------ font
  let FAMILY = 'Inter Tight';
  try {
    await Promise.all(['Regular', 'Medium', 'SemiBold'].map((s) => figma.loadFontAsync({ family: FAMILY, style: s })));
  } catch (e) {
    FAMILY = 'Inter';
    await Promise.all(['Regular', 'Medium', 'Semi Bold'].map((s) => figma.loadFontAsync({ family: FAMILY, style: s })));
    notes.push('Inter Tight non disponibile: uso Inter');
  }
  const STYLE = { 400: 'Regular', 500: 'Medium', 600: FAMILY === 'Inter' ? 'Semi Bold' : 'SemiBold' };

  // ------------------------------------------------------------ variabili
  const colorVars = await figma.variables.getLocalVariablesAsync('COLOR');
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const themeCol = collections.find((c) => c.name === 'theme');
  if (!themeCol) throw new Error('Collection "theme" non trovata: è aperto il file del corso?');
  const V = {};
  for (const v of colorVars) if (v.variableCollectionId === themeCol.id) V[v.name] = v;
  const paint = (name) => {
    const v = V[name];
    if (!v) { notes.push('variabile mancante: ' + name); return { type: 'SOLID', color: { r: 1, g: 0, b: 1 } }; }
    return figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', v);
  };
  const modeId = (name) => (themeCol.modes.find((m) => m.name === name) || {}).modeId;
  const toHex = (c) => '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
  async function resolve(name, mode) {
    let v = V[name];
    let val = v && v.valuesByMode[modeId(mode)];
    for (let i = 0; i < 5 && val && val.type === 'VARIABLE_ALIAS'; i++) {
      const target = await figma.variables.getVariableByIdAsync(val.id);
      val = target && Object.values(target.valuesByMode)[0];
    }
    return val && 'r' in val ? toHex(val) : '—';
  }

  // ------------------------------------------------------------ primitive grafiche
  function text(chars, size, weight, color, width) {
    const t = figma.createText();
    t.fontName = { family: FAMILY, style: STYLE[weight || 400] };
    t.fontSize = size;
    t.characters = String(chars);
    t.fills = [paint(color || 'foreground')];
    t.lineHeight = { value: Math.round(size * 1.35), unit: 'PIXELS' };
    if (width) { t.textAutoResize = 'HEIGHT'; t.resize(width, t.height); }
    return t;
  }
  function frame(name, dir, gap, pad, fill) {
    const f = figma.createFrame();
    f.name = name;
    f.layoutMode = dir === 'row' ? 'HORIZONTAL' : 'VERTICAL';
    f.itemSpacing = gap || 0;
    const p = Array.isArray(pad) ? pad : [pad || 0, pad || 0];
    f.paddingTop = f.paddingBottom = p[0];
    f.paddingLeft = f.paddingRight = p[1];
    f.primaryAxisSizingMode = 'AUTO';
    f.counterAxisSizingMode = 'AUTO';
    f.fills = fill ? [paint(fill)] : [];
    f.clipsContent = false;
    return f;
  }
  function fill(node) { node.layoutSizingHorizontal = 'FILL'; return node; }

  // ------------------------------------------------------------ Doc kit (componenti riusabili)
  let kitPage = figma.root.children.find((p) => p.name === '🧩 Doc kit');
  if (!kitPage) { kitPage = figma.createPage(); kitPage.name = '🧩 Doc kit'; }
  const kitFind = (name) => kitPage.findOne((n) => (n.type === 'COMPONENT' || n.type === 'COMPONENT_SET') && n.name === name);

  function textProp(comp, node, prop, def) {
    const id = comp.addComponentProperty(prop, 'TEXT', def);
    node.componentPropertyReferences = { characters: id };
  }
  function ensureSectionTitle() {
    let c = kitFind('Doc/Section title');
    if (c) return c;
    c = figma.createComponent();
    c.name = 'Doc/Section title';
    c.layoutMode = 'VERTICAL'; c.itemSpacing = 8; c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'AUTO';
    c.fills = [];
    const k = text('01', 14, 500, 'link'); k.name = 'kicker';
    const t = text('Titolo sezione', 40, 500, 'foreground'); t.name = 'title';
    c.appendChild(k); c.appendChild(t);
    textProp(c, k, 'kicker', '01'); textProp(c, t, 'title', 'Titolo sezione');
    kitPage.appendChild(c); c.x = 0; c.y = 0;
    return c;
  }
  function ensurePill() {
    let set = kitFind('Doc/Pill');
    if (set) return set;
    const tones = { do: ['primary', 'primary-foreground', 'DO'], dont: ['destructive', 'destructive-foreground', 'DON\'T'],
      pass: ['primary', 'primary-foreground', 'AA ✓'], fail: ['destructive', 'destructive-foreground', 'AA ✗'],
      info: ['secondary', 'secondary-foreground', 'INFO'], warning: ['accent', 'accent-foreground', 'ATTENZIONE'] };
    const comps = Object.entries(tones).map(([tone, [bg, fg, label]]) => {
      const c = figma.createComponent();
      c.name = 'tone=' + tone;
      c.layoutMode = 'HORIZONTAL'; c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'AUTO';
      c.paddingLeft = c.paddingRight = 10; c.paddingTop = c.paddingBottom = 4; c.cornerRadius = 999;
      c.fills = [paint(bg)];
      const t = text(label, 12, 600, fg); t.name = 'label';
      c.appendChild(t);
      return { c, t, label };
    });
    set = figma.combineAsVariants(comps.map((x) => x.c), kitPage);
    set.name = 'Doc/Pill';
    set.layoutMode = 'HORIZONTAL'; set.itemSpacing = 16; set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = 24;
    set.primaryAxisSizingMode = 'AUTO'; set.counterAxisSizingMode = 'AUTO';
    const id = set.addComponentProperty('label', 'TEXT', 'DO');
    for (const x of comps) x.t.componentPropertyReferences = { characters: id };
    set.x = 0; set.y = 160;
    return set;
  }
  function ensureMarker() {
    let c = kitFind('Doc/Marker');
    if (c) return c;
    c = figma.createComponent();
    c.name = 'Doc/Marker';
    c.resize(28, 28); c.cornerRadius = 14;
    c.layoutMode = 'HORIZONTAL'; c.primaryAxisAlignItems = 'CENTER'; c.counterAxisAlignItems = 'CENTER';
    c.primaryAxisSizingMode = 'FIXED'; c.counterAxisSizingMode = 'FIXED';
    c.fills = [paint('link')];
    const t = text('1', 13, 600, 'background'); t.name = 'n';
    c.appendChild(t);
    textProp(c, t, 'n', '1');
    kitPage.appendChild(c); c.x = 0; c.y = 320;
    return c;
  }
  const propKey = (inst, name) => Object.keys(inst.componentProperties).find((k) => k.split('#')[0] === name);
  function pill(tone, label) {
    const set = ensurePill();
    const variant = set.children.find((c) => c.name === 'tone=' + tone) || set.defaultVariant;
    const i = variant.createInstance();
    if (label) i.setProperties({ [propKey(i, 'label')]: label });
    return i;
  }
  function sectionTitle(index, title) {
    const i = ensureSectionTitle().createInstance();
    i.setProperties({ [propKey(i, 'kicker')]: String(index).padStart(2, '0'), [propKey(i, 'title')]: title });
    return i;
  }
  function marker(n) {
    const i = ensureMarker().createInstance();
    i.setProperties({ [propKey(i, 'n')]: String(n) });
    return i;
  }

  // ------------------------------------------------------------ componenti del corso
  const sets = figma.root.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] })
    .filter((n) => !n.name.startsWith('Doc/') && !(n.parent && n.parent.type === 'COMPONENT_SET'));
  const bySlug = (slug) => {
    const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return sets.find((s) => norm(s.name) === norm(slug));
  };
  let main = null;
  if (SPEC.source.figma && SPEC.source.figma.nodeId && SPEC.source.figma.nodeId !== 'DA-COMPILARE') {
    main = await figma.getNodeByIdAsync(SPEC.source.figma.nodeId);
  }
  if (!main) main = bySlug(SPEC.slug);
  if (!main) throw new Error('Componente "' + SPEC.name + '" non trovato nel file');

  async function instanceOf(compSet, props, label) {
    let comp = compSet;
    if (compSet.type === 'COMPONENT_SET') {
      const want = Object.assign({}, SPEC.variants && SPEC.variants.defaults, props || {});
      comp = compSet.children.find((c) => Object.entries(want).every(([k, v]) => !(k in c.variantProperties) || c.variantProperties[k] === v));
      if (!comp) { notes.push('variante non trovata in ' + compSet.name + ': ' + JSON.stringify(props)); comp = compSet.defaultVariant; }
    }
    const inst = comp.createInstance(); // finisce nella pagina attiva: verrà spostata con appendChild
    if (label != null) {
      const k = propKey(inst, 'label');
      if (k) inst.setProperties({ [k]: label });
      else {
        const t = inst.findOne((n) => n.type === 'TEXT');
        if (t) {
          await Promise.all(t.getRangeAllFontNames(0, t.characters.length).map((f) => figma.loadFontAsync(f)));
          t.characters = label;
        }
      }
    }
    return inst;
  }
  function placeholder(title, sub) {
    const f = frame('placeholder', 'col', 4, [12, 16]);
    f.strokes = [paint('input')]; f.dashPattern = [6, 4]; f.strokeWeight = 1; f.cornerRadius = 8;
    f.appendChild(text(title, 13, 500, 'muted-foreground'));
    if (sub) f.appendChild(text(sub, 12, 400, 'muted-foreground', 220));
    return f;
  }
  function caption(node, label) {
    const f = frame('cell', 'col', 12, 0);
    f.counterAxisAlignItems = 'MIN';
    f.appendChild(node);
    f.appendChild(text(label, 12, 400, 'muted-foreground'));
    return f;
  }

  // ------------------------------------------------------------ pagina e frame di documentazione
  let page = figma.root.children.find((p) => p.name === '📄 Docs');
  if (!page) { page = figma.createPage(); page.name = '📄 Docs'; }
  const DOC_NAME = SPEC.name + ' — Documentation';
  let doc = page.findChild((n) => n.type === 'FRAME' && n.name === DOC_NAME);
  if (!doc) {
    doc = frame(DOC_NAME, 'col', 96, [PAD, PAD], 'background');
    doc.primaryAxisSizingMode = 'AUTO'; doc.counterAxisSizingMode = 'FIXED';
    doc.resize(W, 400);
    const right = page.children.reduce((m, n) => Math.max(m, n.x + n.width), 0);
    page.appendChild(doc); doc.x = page.children.length > 1 ? right + 200 : 0; doc.y = 0;
    doc.setExplicitVariableModeForCollection(themeCol, modeId('Light'));
  }

  const key = 'section:' + SECTION;
  let sec = doc.findChild((n) => n.name === key);
  if (sec) for (const c of [...sec.children]) c.remove();
  else { sec = frame(key, 'col', 32, 0); doc.appendChild(sec); fill(sec); }
  const index = SPEC.sections.indexOf(SECTION) + 1;
  if (SECTION !== 'overview') sec.appendChild(sectionTitle(index, SECTION_TITLES[SECTION]));

  // ------------------------------------------------------------ sezioni
  const B = {};

  B.overview = async () => {
    sec.itemSpacing = 24;
    sec.appendChild(text('Componente', 14, 500, 'link'));
    sec.appendChild(text(SPEC.name, 72, 500, 'foreground'));
    sec.appendChild(text(SPEC.description, 22, 400, 'muted-foreground', 900));
    const row = frame('preview', 'row', 24, 0);
    for (const mode of ['Light', 'Dark']) {
      const stage = frame('preview ' + mode, 'col', 16, [48, 48], 'background');
      stage.cornerRadius = 16; stage.strokes = [paint('border')]; stage.strokeWeight = 1;
      stage.setExplicitVariableModeForCollection(themeCol, modeId(mode));
      stage.counterAxisAlignItems = 'CENTER'; stage.primaryAxisAlignItems = 'CENTER';
      stage.appendChild(await instanceOf(main, {}));
      stage.appendChild(text(mode, 12, 400, 'muted-foreground'));
      row.appendChild(stage); stage.layoutSizingHorizontal = 'FILL';
    }
    sec.appendChild(row); fill(row);
    const src = frame('sources', 'row', 8, 0);
    src.appendChild(text('Fonti:', 13, 400, 'muted-foreground'));
    for (const s of SPEC.provenance.sources) src.appendChild(pill(s === 'inferenza' ? 'warning' : 'info', s));
    if (!SPEC.provenance.verified) src.appendChild(pill('warning', 'DA VERIFICARE'));
    sec.appendChild(src);
  };

  B.variants = async () => {
    const code = SPEC.variants.code || {};
    const fig = (SPEC.variants.figma) || {};
    const propsList = [...new Set([...Object.keys(code), ...Object.keys(fig)])].filter((p) => p !== 'state');
    if (!propsList.length) {
      sec.appendChild(text('Nessuna variante: il componente ha una sola forma. Le parti facoltative sono in Anatomia.', 18, 400, 'muted-foreground', 900));
      return;
    }
    for (const p of propsList) {
      const block = frame('prop:' + p, 'col', 16, 0);
      block.appendChild(text(p, 18, 500, 'foreground'));
      const row = frame('values', 'row', 32, [32, 32], 'muted');
      row.cornerRadius = 12; row.counterAxisAlignItems = 'MAX';
      const values = [...new Set([...(code[p] || []), ...(fig[p] || [])])];
      for (const v of values) {
        const inCode = (code[p] || []).includes(v), inFig = (fig[p] || []).includes(v);
        let node;
        if (inFig) node = await instanceOf(main, { [p]: v });
        else node = placeholder('solo nel codice', p + '=' + v);
        const cell = caption(node, v);
        if (!inCode) cell.appendChild(pill('warning', 'solo Figma'));
        row.appendChild(cell);
      }
      row.layoutWrap = 'WRAP'; row.counterAxisSpacing = 24;
      block.appendChild(row); fill(row);
      sec.appendChild(block); fill(block);
    }
  };

  B.mismatches = async () => {
    const list = SPEC.mismatches || [];
    if (!list.length) { sec.appendChild(text('Nessuna differenza: codice e Figma dicono la stessa cosa.', 18, 400, 'muted-foreground')); return; }
    const box = frame('mismatches', 'col', 0, 0, 'card');
    box.cornerRadius = 12; box.strokes = [paint('border')]; box.strokeWeight = 1;
    const head = frame('head', 'row', 24, [14, 24], 'muted');
    for (const [label, w] of [['Cosa', 260], ['Codice', 440], ['Figma', 440], ['', 120]]) {
      const t = text(label, 13, 500, 'muted-foreground', w); head.appendChild(t);
    }
    box.appendChild(head); fill(head);
    for (const m of list) {
      const r = frame('row', 'row', 24, [16, 24]);
      r.strokes = [paint('border')]; r.strokeTopWeight = 1; r.strokeBottomWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0;
      r.appendChild(text(m.what, 15, 500, 'foreground', 260));
      r.appendChild(text(m.code, 15, 400, 'foreground', 440));
      r.appendChild(text(m.figma, 15, 400, 'foreground', 440));
      r.appendChild(pill(m.severity === 'warning' ? 'warning' : 'info', m.severity === 'warning' ? 'ATTENZIONE' : 'INFO'));
      box.appendChild(r); fill(r);
    }
    sec.appendChild(box); fill(box);
  };

  B.anatomy = async () => {
    const row = frame('anatomy', 'row', 64, 0);
    const stage = frame('stage', 'col', 0, [64, 64], 'muted');
    stage.cornerRadius = 12;
    const holder = figma.createFrame(); holder.name = 'holder'; holder.fills = []; holder.clipsContent = false;
    const inst = await instanceOf(main, {});
    inst.rescale(2);
    holder.resize(inst.width, inst.height); holder.appendChild(inst); inst.x = 0; inst.y = 0;
    stage.appendChild(holder);
    const legend = frame('legend', 'col', 16, 0);
    for (const a of SPEC.anatomy || []) {
      const target = a.layer === inst.name || a.layer === main.name ? inst : inst.findOne((n) => n.name === a.layer);
      if (target && target.visible) {
        const m = marker(a.n);
        holder.appendChild(m);
        const bx = target.absoluteTransform[0][2] - holder.absoluteTransform[0][2];
        const by = target.absoluteTransform[1][2] - holder.absoluteTransform[1][2];
        m.x = target === inst ? bx - 14 : bx + target.width / 2 - 14;
        m.y = by - 34;
      } else notes.push('anatomia: layer "' + a.layer + '" non trovato o nascosto (parte ' + a.n + ')');
      const item = frame('item', 'row', 12, 0);
      item.appendChild(marker(a.n));
      const col = frame('txt', 'col', 2, 0);
      col.appendChild(text(a.part + (a.optional ? ' (opzionale)' : ''), 16, 500, 'foreground'));
      if (a.description) col.appendChild(text(a.description, 14, 400, 'muted-foreground', 520));
      item.appendChild(col);
      legend.appendChild(item);
    }
    row.appendChild(stage); row.appendChild(legend);
    sec.appendChild(row);
  };

  B.states = async () => {
    const row = frame('states', 'row', 32, [32, 32], 'muted');
    row.cornerRadius = 12; row.layoutWrap = 'WRAP'; row.counterAxisSpacing = 24; row.counterAxisAlignItems = 'MAX';
    for (const s of SPEC.states || []) {
      let node;
      if (s.figma) {
        const [k, v] = s.figma.split('=');
        node = await instanceOf(main, { [k]: v });
      } else node = placeholder('solo nel codice', s.code);
      const cell = caption(node, s.state);
      if (s.note) cell.appendChild(text(s.note, 12, 400, 'muted-foreground', 220));
      row.appendChild(cell);
    }
    sec.appendChild(row); fill(row);
  };

  B.usage = async () => {
    const approved = (SPEC.usage || []).filter((u) => u.approved);
    const skipped = (SPEC.usage || []).length - approved.length;
    if (skipped) notes.push(skipped + ' regole non approvate: saltate');
    const grid = frame('grid', 'row', 32, 0);
    grid.layoutWrap = 'WRAP'; grid.counterAxisSpacing = 32;
    for (const u of approved) {
      const card = frame(u.type + ': ' + u.rule.slice(0, 30), 'col', 0, 0, 'card');
      card.cornerRadius = 12; card.strokes = [paint(u.type === 'do' ? 'primary' : 'destructive')]; card.strokeWeight = 2;
      card.counterAxisSizingMode = 'FIXED'; card.resize((CONTENT - 32) / 2, 100);
      const scene = frame('scene', 'row', 12, [48, 32], 'muted');
      scene.primaryAxisAlignItems = 'CENTER'; scene.counterAxisAlignItems = 'CENTER';
      if (u.mode === 'selection' && u.selectionId) {
        const src = await figma.getNodeByIdAsync(u.selectionId);
        if (src) scene.appendChild(src.clone()); else notes.push('selezione non trovata: ' + u.selectionId);
      } else {
        for (const s of u.scene || []) {
          const set = s.component === SPEC.slug ? main : bySlug(s.component);
          if (!set) { notes.push('scena: componente "' + s.component + '" non trovato'); continue; }
          scene.appendChild(await instanceOf(set, s.props, s.text));
        }
      }
      card.appendChild(scene); fill(scene);
      const foot = frame('rule', 'col', 10, [20, 24]);
      foot.appendChild(pill(u.type, u.type === 'do' ? 'DO' : 'DON\'T'));
      foot.appendChild(text(u.rule, 16, 400, 'foreground', (CONTENT - 32) / 2 - 48));
      if (u.source === 'inferenza') foot.appendChild(text('Fonte: inferenza, approvata da una persona', 12, 400, 'muted-foreground'));
      card.appendChild(foot); fill(foot);
      grid.appendChild(card);
    }
    sec.appendChild(grid); fill(grid);
  };

  B.tokens = async () => {
    const box = frame('tokens', 'col', 0, 0, 'card');
    box.cornerRadius = 12; box.strokes = [paint('border')]; box.strokeWeight = 1;
    const cols = [['Parte', 200], ['Variante', 280], ['Proprietà', 120], ['Variabile', 300], ['Light', 140], ['Dark', 140]];
    const head = frame('head', 'row', 24, [14, 24], 'muted');
    for (const [l, w] of cols) head.appendChild(text(l, 13, 500, 'muted-foreground', w));
    box.appendChild(head); fill(head);
    for (const t of SPEC.tokens || []) {
      const r = frame('row', 'row', 24, [12, 24]);
      r.counterAxisAlignItems = 'CENTER';
      r.strokes = [paint('border')]; r.strokeTopWeight = 1; r.strokeBottomWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0;
      r.appendChild(text(t.part, 14, 500, 'foreground', 200));
      r.appendChild(text(t.variant || 'tutte', 14, 400, 'muted-foreground', 280));
      r.appendChild(text(t.property, 14, 400, 'foreground', 120));
      const vcell = frame('var', 'row', 10, 0); vcell.counterAxisAlignItems = 'CENTER';
      const sw = figma.createRectangle(); sw.resize(20, 20); sw.cornerRadius = 4; sw.fills = [paint(t.variable)];
      sw.strokes = [paint('border')]; sw.strokeWeight = 1;
      vcell.appendChild(sw); vcell.appendChild(text(t.variable, 14, 500, 'foreground'));
      vcell.counterAxisSizingMode = 'AUTO'; vcell.resize(300, vcell.height); vcell.primaryAxisSizingMode = 'FIXED';
      r.appendChild(vcell);
      r.appendChild(text(await resolve(t.variable, 'Light'), 14, 400, 'muted-foreground', 140));
      r.appendChild(text(await resolve(t.variable, 'Dark'), 14, 400, 'muted-foreground', 140));
      box.appendChild(r); fill(r);
    }
    sec.appendChild(box); fill(box);
  };

  B.a11y = async () => {
    const a = SPEC.a11y || {};
    const row = frame('a11y', 'row', 48, 0);
    const left = frame('contrast', 'col', 0, 0, 'card');
    left.cornerRadius = 12; left.strokes = [paint('border')]; left.strokeWeight = 1;
    const head = frame('head', 'row', 16, [14, 20], 'muted');
    head.appendChild(text('Contrasto (testo / sfondo)', 13, 500, 'muted-foreground', 420));
    left.appendChild(head); fill(head);
    for (const c of a.contrast || []) {
      const r = frame('row', 'row', 16, [12, 20]); r.counterAxisAlignItems = 'CENTER';
      r.strokes = [paint('border')]; r.strokeTopWeight = 1; r.strokeBottomWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0;
      const [fg, bg] = c.pair.split('/').map((s) => s.trim());
      const chip = frame('chip', 'row', 0, [6, 10], bg); chip.cornerRadius = 6;
      chip.setExplicitVariableModeForCollection(themeCol, modeId(c.mode));
      chip.appendChild(text('Aa', 14, 600, fg));
      r.appendChild(chip);
      r.appendChild(text(c.pair, 14, 400, 'foreground', 300));
      r.appendChild(text(c.mode, 13, 400, 'muted-foreground', 50));
      r.appendChild(text(c.ratio.toFixed(2) + ':1', 14, 500, 'foreground', 70));
      r.appendChild(pill(c.pass ? 'pass' : 'fail', (c.pass ? '✓ ' : '✗ ') + 'min ' + c.min));
      left.appendChild(r); fill(r);
    }
    const right = frame('notes', 'col', 20, 0);
    const block = (title, lines) => {
      if (!lines || !lines.length) return;
      const b = frame(title, 'col', 8, 0);
      b.appendChild(text(title, 16, 500, 'foreground'));
      for (const l of lines) b.appendChild(text('• ' + l, 14, 400, 'muted-foreground', 520));
      right.appendChild(b);
    };
    block('Ruolo', a.role ? [a.role] : []);
    block('Tastiera', a.keyboard);
    block('Area cliccabile', a.targetSize ? [a.targetSize] : []);
    block('Note', a.notes);
    row.appendChild(left); row.appendChild(right);
    sec.appendChild(row);
  };

  await B[SECTION]();

  // ------------------------------------------------------------ ordine delle sezioni come nella spec
  const order = SPEC.sections.map((s) => 'section:' + s);
  const present = doc.children.filter((c) => order.includes(c.name)).sort((x, y) => order.indexOf(x.name) - order.indexOf(y.name));
  present.forEach((n, i) => doc.insertChild(i, n));

  return { ok: true, section: SECTION, nodeId: sec.id, frameId: doc.id, notes };
}
