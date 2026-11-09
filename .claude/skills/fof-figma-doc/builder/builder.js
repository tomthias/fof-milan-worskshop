// fof-milano — builder del frame di documentazione.
// Gira DENTRO Figma tramite lo strumento use_figma (Plugin API). Non si lancia da terminale.
//
// Come lo usa l'agente (una chiamata use_figma per sezione):
//   1. legge questo file così com'è
//   2. aggiunge in fondo:   return await fofBuild(<spec JSON>, "<sezione>");
//   3. manda il tutto a use_figma
// Restituisce { ok, section, nodeId, frameId, notes }. Le notes vanno lette sempre.
// Se qualcosa va storto NON lancia errori: restituisce { ok: false, section, error, notes } e lascia
// il file com'era (la versione precedente della sezione resta, i nodi a metà vengono tolti).
//
// Cosa costruisce:
//   - pagina "📄 Docs" (la crea se manca) con il frame "<Nome> — Documentation"
//   - dentro, un frame per sezione chiamato "section:<chiave>", ricostruito al suo posto
//     se esiste già (niente duplicati)
//   - pagina "🧩 Doc kit" con i componenti Doc/* (li crea la prima volta, poi li riusa):
//     modificali lì e tutte le documentazioni si aggiornano
// Colori: sempre variabili della collection "theme" (stessi nomi di globals.css).
// Lavora sempre con 📄 Docs come pagina attiva: niente finisce nelle altre pagine, nemmeno per un attimo.

async function fofBuild(SPEC, SECTION) {
  const notes = [];
  const fail = (error, extra) => Object.assign({ ok: false, section: SECTION, error, notes }, extra || {});
  const W = 1440, PAD = 80, CONTENT = W - PAD * 2;
  const SECTION_TITLES = {
    overview: 'Overview', variants: 'Varianti e proprietà', mismatches: 'Differenze codice ↔ Figma',
    anatomy: 'Anatomia', states: 'Stati', usage: 'Do & Don\'t', tokens: 'Colori e variabili',
    a11y: 'Accessibilità', code: 'Codice', spacing: 'Spaziature', content: 'Contenuti', context: 'Esempio in contesto',
  };
  if (!SPEC || typeof SPEC !== 'object') return fail('Spec mancante: passa il JSON completo di docs/specs/<slug>.json');
  if (!SECTION_TITLES[SECTION]) return fail('Sezione sconosciuta: ' + SECTION + '. Valide: ' + Object.keys(SECTION_TITLES).join(', '));
  if (!(SPEC.sections || []).includes(SECTION)) return fail('La sezione "' + SECTION + '" non è fra quelle scelte nella spec');
  if (['spacing', 'content', 'context'].includes(SECTION)) {
    return fail('La sezione "' + SECTION + '" non ha ancora un builder: è il compito del Lab 3', { skipped: true });
  }

  // use_figma non supporta figma.loadAllPagesAsync(): si caricano le pagine una per una
  for (const p of figma.root.children) await p.loadAsync();
  // createFrame/createInstance mettono i nodi nella pagina attiva: che sia sempre 📄 Docs
  let page = figma.root.children.find((p) => p.name === '📄 Docs');
  if (!page) { page = figma.createPage(); page.name = '📄 Docs'; }
  await figma.setCurrentPageAsync(page);

  try {
    return await fofBuildSection(SPEC, SECTION, page, notes, SECTION_TITLES, W, PAD, CONTENT);
  } catch (e) {
    return fail(String((e && e.message) || e));
  }
}

async function fofBuildSection(SPEC, SECTION, page, notes, SECTION_TITLES, W, PAD, CONTENT) {

  // ------------------------------------------------------------ font
  // Inter è incluso in Figma: c'è sempre, anche su Figma nel browser e senza font installati
  const FAMILY = 'Inter';
  const STYLE = { 400: 'Regular', 500: 'Medium', 600: 'Semi Bold' };
  await Promise.all(Object.values(STYLE).map((s) => figma.loadFontAsync({ family: FAMILY, style: s })));

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
  // Light/Dark espliciti su un frame: su alcuni piani Figma non si può. Non è un motivo per fermarsi.
  let modeWarned = false;
  const setMode = (node, mode) => {
    const id = modeId(mode);
    try { if (id) node.setExplicitVariableModeForCollection(themeCol, id); else throw new Error('modo ' + mode + ' assente'); }
    catch (e) { if (!modeWarned) { notes.push('modo esplicito non applicato (' + mode + '): ' + e.message + '. Le anteprime usano il modo della pagina'); modeWarned = true; } }
  };
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
      kitPage.appendChild(c); // createComponent la mette nella pagina attiva: combineAsVariants vuole tutto nella pagina del kit
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
  // Se nel kit qualcuno ha rinominato o tolto una property, si annota e si va avanti
  function setProp(inst, name, value) {
    const k = propKey(inst, name);
    if (k) { inst.setProperties({ [k]: value }); return; }
    const msg = 'Doc kit: ' + (inst.mainComponent ? inst.mainComponent.name : inst.name) + ' non ha la property "' + name + '"';
    if (!notes.includes(msg)) notes.push(msg);
  }
  function pill(tone, label) {
    const set = ensurePill();
    const variant = set.children.find((c) => c.name === 'tone=' + tone) || set.defaultVariant;
    const i = variant.createInstance();
    if (label) setProp(i, 'label', String(label));
    return i;
  }
  function sectionTitle(index, title) {
    const i = ensureSectionTitle().createInstance();
    setProp(i, 'kicker', String(index).padStart(2, '0'));
    setProp(i, 'title', title);
    return i;
  }
  function marker(n) {
    const i = ensureMarker().createInstance();
    setProp(i, 'n', String(n));
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
  // Tutto quello che esiste adesso su 📄 Docs e 🧩 Doc kit è "di prima": se la sezione fallisce,
  // ciò che è nato dopo si toglie e il file torna com'era.
  const before = new Set([...page.children, ...kitPage.children].map((n) => n.id));
  const DOC_NAME = SPEC.name + ' — Documentation';
  let doc = page.findChild((n) => n.type === 'FRAME' && n.name === DOC_NAME);
  const key = 'section:' + SECTION;
  const old = doc ? doc.findChild((n) => n.name === key) : null;
  let sec = null;
  const rollback = () => {
    try { if (sec && !sec.removed) sec.remove(); } catch (e) { /* già tolto */ }
    for (const n of [...page.children, ...kitPage.children]) {
      if (!before.has(n.id) && n !== doc) { try { n.remove(); } catch (e) { /* già tolto */ } }
    }
    if (doc && !doc.removed && !before.has(doc.id) && doc.children.length === 0) doc.remove();
  };

  try {
    if (!doc) {
      doc = frame(DOC_NAME, 'col', 96, [PAD, PAD], 'background');
      doc.resize(W, 400); // resize() fissa anche l'altezza: subito dopo si torna a "hug"
      doc.primaryAxisSizingMode = 'AUTO'; doc.counterAxisSizingMode = 'FIXED';
      const right = page.children.filter((n) => n !== doc).reduce((m, n) => Math.max(m, n.x + n.width), 0);
      page.appendChild(doc); doc.x = page.children.length > 1 ? right + 200 : 0; doc.y = 0;
      setMode(doc, 'Light');
    }
    // la nuova sezione nasce accanto alla vecchia; la vecchia si toglie solo a lavoro finito
    sec = frame(key, 'col', 32, 0);
    if (old) doc.insertChild(doc.children.indexOf(old) + 1, sec); else doc.appendChild(sec);
    fill(sec);
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
      setMode(stage, mode);
      stage.counterAxisAlignItems = 'CENTER'; stage.primaryAxisAlignItems = 'CENTER';
      stage.appendChild(await instanceOf(main, {}));
      stage.appendChild(text(mode, 12, 400, 'muted-foreground'));
      row.appendChild(stage); stage.layoutSizingHorizontal = 'FILL';
    }
    sec.appendChild(row); fill(row);
    const src = frame('sources', 'row', 8, 0);
    src.appendChild(text('Fonti:', 13, 400, 'muted-foreground'));
    const prov = SPEC.provenance || { sources: [], verified: false };
    for (const s of prov.sources || []) src.appendChild(pill(s === 'inferenza' ? 'warning' : 'info', s));
    if (!prov.verified) src.appendChild(pill('warning', 'DA VERIFICARE'));
    sec.appendChild(src);
  };

  B.variants = async () => {
    const code = (SPEC.variants && SPEC.variants.code) || {};
    const fig = (SPEC.variants && SPEC.variants.figma) || {};
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
    for (const [label, w] of [['Cosa', 260], ['Codice', 400], ['Figma', 360], ['', 120]]) {
      const t = text(label, 13, 500, 'muted-foreground', w); head.appendChild(t);
    }
    box.appendChild(head); fill(head);
    for (const m of list) {
      const r = frame('row', 'row', 24, [16, 24]);
      r.strokes = [paint('border')]; r.strokeTopWeight = 1; r.strokeBottomWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0;
      r.appendChild(text(m.what, 15, 500, 'foreground', 260));
      r.appendChild(text(m.code, 15, 400, 'foreground', 400));
      r.appendChild(text(m.figma, 15, 400, 'foreground', 360));
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
        const [k, v] = String(s.figma).split('=');
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
      const [fg, bg] = String(c.pair || '').split('/').map((s) => s.trim());
      if (!fg || !bg) { notes.push('contrasto saltato: coppia non valida "' + c.pair + '"'); continue; }
      const chip = frame('chip', 'row', 0, [6, 10], bg); chip.cornerRadius = 6;
      setMode(chip, c.mode);
      chip.appendChild(text('Aa', 14, 600, fg));
      r.appendChild(chip);
      r.appendChild(text(c.pair, 14, 400, 'foreground', 300));
      r.appendChild(text(c.mode, 13, 400, 'muted-foreground', 50));
      r.appendChild(text((Number.isFinite(Number(c.ratio)) ? Number(c.ratio).toFixed(2) : '?') + ':1', 14, 500, 'foreground', 70));
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

  // Snippet in stile editor: blocco nel modo Dark del tema, barra con titolo e linguaggio,
  // numeri di riga, font monospace e colori della sintassi presi dalle variabili.
  B.code = async () => {
    const list = Array.isArray(SPEC.code) ? SPEC.code.filter((c) => c && typeof c.snippet === 'string' && c.snippet.trim()) : [];
    if (!list.length) { sec.appendChild(text('Nessuno snippet nella spec: aggiungili nel campo "code".', 18, 400, 'muted-foreground', 900)); return; }

    let MONO = null;
    for (const family of ['JetBrains Mono', 'Roboto Mono', 'Source Code Pro', 'Menlo', 'Courier New']) {
      try { await figma.loadFontAsync({ family, style: 'Regular' }); MONO = { family, style: 'Regular' }; break; } catch (e) { /* prossimo */ }
    }
    if (!MONO) { MONO = { family: FAMILY, style: STYLE[400] }; notes.push('nessun font monospace disponibile: uso ' + FAMILY); }
    const mono = (chars, size, color) => {
      const t = figma.createText();
      t.fontName = MONO; t.fontSize = size; t.lineHeight = { value: Math.round(size * 1.6), unit: 'PIXELS' };
      t.characters = chars; t.fills = [paint(color)];
      return t;
    };

    // colori della sintassi (nel modo Dark: commenti navy chiaro, stringhe lime, parole chiave rosa,
    // tag lilla, attributi rosso chiaro). Gruppi: 1 commento · 2 stringa · 3 parola chiave · 4-5 tag · 6 attributo
    const TOKEN = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|\x60(?:[^\x60\\]|\\.)*\x60)|\b(import|from|export|default|function|return|const|let|type|interface|as|if|else)\b|(<\/?)([A-Za-z][\w.]*)|\b([A-Za-z_][\w-]*)(?==)/g;
    const highlight = (t, src) => {
      TOKEN.lastIndex = 0;
      let m;
      while ((m = TOKEN.exec(src))) {
        let start = m.index, end = m.index + m[0].length, color = null;
        if (m[1]) color = 'muted-foreground';
        else if (m[2]) color = 'primary';
        else if (m[3]) color = 'link';
        else if (m[5]) { start += m[4].length; color = 'secondary'; }
        else if (m[6]) color = 'destructive';
        if (color && end > start) t.setRangeFills(start, end, [paint(color)]);
      }
    };

    const HALF = (CONTENT - 32) / 2;
    const grid = frame('snippets', 'row', 32, 0);
    grid.layoutWrap = 'WRAP'; grid.counterAxisSpacing = 32;
    for (const c of list) {
      const src = c.snippet.replace(/\t/g, '  ').replace(/\s+$/, '');
      const lines = src.split('\n');

      const block = frame('snippet: ' + (c.title || 'codice'), 'col', 0, 0, 'card');
      block.cornerRadius = 12; block.strokes = [paint('border')]; block.strokeWeight = 1; block.clipsContent = true;
      setMode(block, 'Dark');

      const bar = frame('bar', 'row', 12, [12, 16], 'muted');
      bar.primaryAxisAlignItems = 'SPACE_BETWEEN'; bar.counterAxisAlignItems = 'CENTER';
      const dots = frame('dots', 'row', 6, 0);
      for (const col of ['destructive', 'primary', 'secondary']) {
        const d = figma.createEllipse(); d.resize(10, 10); d.fills = [paint(col)]; dots.appendChild(d);
      }
      bar.appendChild(dots);
      bar.appendChild(text(c.title || '', 13, 500, 'foreground'));
      bar.appendChild(mono(c.lang || 'tsx', 12, 'muted-foreground'));
      block.appendChild(bar);

      const body = frame('body', 'row', 16, [16, 20]);
      const gutter = mono(lines.map((_, i) => String(i + 1)).join('\n'), 14, 'muted-foreground');
      gutter.name = 'line numbers'; gutter.textAlignHorizontal = 'RIGHT'; gutter.opacity = 0.6;
      const code = mono(src, 14, 'foreground');
      code.name = 'code';
      highlight(code, src);
      body.appendChild(gutter); body.appendChild(code);
      block.appendChild(body);

      // mezza larghezza se ci sta, altrimenti tutta la riga
      const need = code.width + gutter.width + 16 + 40;
      block.counterAxisSizingMode = 'FIXED';
      block.resize(need <= HALF ? HALF : CONTENT, block.height);
      block.primaryAxisSizingMode = 'AUTO';
      if (need > CONTENT) notes.push('snippet "' + (c.title || '') + '": righe più larghe del frame, il blocco le taglia');
      grid.appendChild(block);
      fill(bar); fill(body);
    }
    sec.appendChild(grid); fill(grid);
  };

  await B[SECTION]();

  // ------------------------------------------------------------ pulizia: niente deve restare fuori dal frame
  for (const n of [...page.children]) {
    if (!before.has(n.id) && n !== doc) { notes.push('nodo fuori posto tolto: ' + n.name); n.remove(); }
  }
  if (old && !old.removed) old.remove();

  // ------------------------------------------------------------ ordine delle sezioni come nella spec
  const order = SPEC.sections.map((s) => 'section:' + s);
  const present = doc.children.filter((c) => order.includes(c.name)).sort((x, y) => order.indexOf(x.name) - order.indexOf(y.name));
  present.forEach((n, i) => doc.insertChild(i, n));
  // il frame cresce con le sezioni (vale anche per i frame costruiti con la versione precedente del builder)
  doc.primaryAxisSizingMode = 'AUTO';

  return { ok: true, section: SECTION, nodeId: sec.id, frameId: doc.id, notes };
  } catch (e) {
    rollback();
    notes.push('niente è cambiato: ' + (old ? 'la versione precedente della sezione è rimasta com\'era' : 'la sezione non è stata creata'));
    throw e;
  }
}
