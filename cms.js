/*
 * Loads the published "Startseite" from Sanity and builds the page from its blocks
 * (order, added, removed or duplicated sections). The HTML already contains the full
 * page, so if Sanity is unreachable or has no content yet, the page stays as it is.
 */
(function () {
  var PROJECT = 'emuhnqj1';
  var DATASET = 'production';
  var QUERY = '*[_id == "landingPage"][0]{settings, sections[]{..., ' +
    '_type == "hero" => {"portraitUrl": portrait.asset->url}, ' +
    '_type == "about" => {"photoUrl": photo.asset->url}, ' +
    '_type == "cases" => {items[]{..., "imageUrl": image.asset->url, "avatarUrl": avatar.asset->url}}, ' +
    '_type == "testimonials" => {items[]{..., "avatarUrl": avatar.asset->url}}}}';
  var URL = 'https://' + PROJECT + '.apicdn.sanity.io/v2024-01-01/data/query/' + DATASET +
    '?query=' + encodeURIComponent(QUERY);

  function get(obj, path) {
    return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
  }
  function has(v) { return v !== undefined && v !== null && v !== ''; }
  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c];
    });
  }
  // "Deine Website soll *Kunden bringen.*" -> marker highlight on the starred part
  function mark(str) { return esc(str).replace(/\*([^*]+)\*/g, '<span class="mark">$1</span>'); }
  function paragraphs(str) {
    return String(str || '').split(/\n\s*\n/).filter(function (p) { return p.trim(); })
      .map(function (p) { return '<p>' + esc(p.trim()).replace(/\n/g, '<br>') + '</p>'; }).join('');
  }
  function sized(url, w) { return url.indexOf('cdn.sanity.io') > -1 ? url + '?w=' + w + '&auto=format&fit=max' : url; }
  function setText(el, v) { if (has(v)) el.textContent = v; }
  function setImg(el, url, w) { if (el && url) { el.src = sized(url, w || 1200); el.style.visibility = ''; } }
  function all(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }

  // Rebuilds a list by cloning the existing children as templates (keeps icons and layout).
  function renderList(container, items, fill) {
    if (!container || !items || !items.length) return;
    var templates = Array.prototype.slice.call(container.children);
    if (!templates.length) return;
    var frag = document.createDocumentFragment();
    items.forEach(function (item, i) {
      var node = templates[i % templates.length].cloneNode(true);
      fill(node, item || {}, i);
      frag.appendChild(node);
    });
    container.innerHTML = '';
    container.appendChild(frag);
  }
  function fillFields(node, item, i) {
    all(node, '[data-f]').forEach(function (el) {
      var k = el.getAttribute('data-f');
      if (k === '#') el.textContent = i + 1; else setText(el, item[k]);
    });
  }

  // Fills one section node with the data of one block.
  function applyBlock(root, type, block) {
    var d = {}; d[type] = block;

    all(root, '[data-s]').forEach(function (el) { setText(el, get(d, el.getAttribute('data-s'))); });
    all(root, '[data-m]').forEach(function (el) { var v = get(d, el.getAttribute('data-m')); if (has(v)) el.innerHTML = mark(v); });
    all(root, '[data-img]').forEach(function (el) { setImg(el, get(d, el.getAttribute('data-img'))); });
    all(root, '[data-href]').forEach(function (el) { var v = get(d, el.getAttribute('data-href')); if (has(v)) el.href = v; });
    all(root, '[data-bullets]').forEach(function (list) {
      var items = get(d, list.getAttribute('data-bullets')), tpl = list.querySelector('li');
      if (!tpl || !items || !items.length) return;
      var svg = tpl.querySelector('svg') ? tpl.querySelector('svg').outerHTML : '';
      list.innerHTML = items.map(function (t) { return '<li>' + svg + esc(t) + '</li>'; }).join('');
    });

    if (type === 'hero' && !block.portraitUrl) setImg(root.querySelector('[data-img="hero.portraitUrl"]'), block.portraitLegacyUrl);
    if (type === 'about' && !block.photoUrl) setImg(root.querySelector('[data-img="about.photoUrl"]'), block.photoLegacyUrl);

    if (type === 'problem') renderList(root.querySelector('[data-list="problem.cards"]'), block.cards, fillFields);
    if (type === 'services') renderList(root.querySelector('[data-list="services.items"]'), block.items, fillFields);
    if (type === 'process') renderList(root.querySelector('[data-list="process.steps"]'), block.steps, fillFields);

    if (type === 'stats' && block.items && block.items.length) {
      root.querySelector('.stats-grid').innerHTML = block.items.map(function (s, i) {
        return '<div class="stat rv"><span class="mono">' + esc(s.label || '') + '</span>' +
          '<div class="stat-num">' + (s.prefix ? '<small>' + esc(s.prefix) + '</small>' : '') +
          '<span>' + esc(has(s.value) ? s.value : '') + '</span>' +
          (s.suffix ? '<small>' + esc(s.suffix) + '</small>' : '') +
          (i === block.items.length - 1 ? '<span class="dot" aria-hidden="true"></span>' : '') + '</div>' +
          '<p>' + esc(s.text || '') + '</p></div>';
      }).join('');
    }

    if (type === 'cases' && block.items && block.items.length) {
      all(root, '.case-list').forEach(function (pane) {
        var cat = pane.getAttribute('data-cat');
        var list = block.items.filter(function (c) { return (c.category || 'kunden') === cat; });
        var tab = root.querySelector('.tab[aria-controls="' + pane.id + '"]');
        if (tab) tab.hidden = !list.length;
        renderList(pane, list, function (node, c) {
          fillFields(node, c);
          var im = node.querySelector('[data-f-img="image"]'), av = node.querySelector('[data-f-img="avatar"]');
          setImg(im, c.imageUrl || c.imageLegacyUrl, 800);
          setImg(av, c.avatarUrl || c.avatarLegacyUrl, 120);
          if (im) im.alt = c.name || '';
        });
      });
    }

    if (type === 'testimonials' && block.items && block.items.length) {
      root.querySelector('.quotes').innerHTML = block.items.map(function (t) {
        var face = t.avatarUrl || t.avatarLegacyUrl;
        return '<article class="q' + (t.wide ? ' wide' : '') + ' rv">' +
          '<div class="k">' + esc(t.kpi || '') + (t.kpiLabel ? '<small>' + esc(t.kpiLabel) + '</small>' : '') + '</div>' +
          '<p>' + esc(t.quote || '') + '</p>' +
          '<div class="person">' + (face ? '<img src="' + esc(sized(face, 120)) + '" alt="" loading="lazy">' : '') +
          '<div><b>' + esc(t.name || '') + '</b><span>' + esc(t.company || '') + '</span></div></div></article>';
      }).join('');
    }

    if (type === 'faq' && block.items && block.items.length) {
      root.querySelector('.faq-list').innerHTML = block.items.map(function (f) {
        return '<details><summary>' + esc(f.question || '') + '<span class="pm" aria-hidden="true">+</span></summary>' +
          '<div class="ans">' + paragraphs(f.answer) + '</div></details>';
      }).join('');
    }

    if (type === 'textBlock') {
      root.classList.toggle('dark', !!block.dark);
      var eb = root.querySelector('.eyebrow'); if (eb) eb.hidden = !has(block.eyebrow);
      root.querySelector('.prose').innerHTML = paragraphs(block.body);
      var btn = root.querySelector('.btn');
      if (btn) { btn.hidden = !has(block.buttonLabel); btn.querySelector('span').textContent = block.buttonLabel || ''; }
    }
  }

  function applySettings(s) {
    if (!s) return;
    var ft = document.querySelector('[data-m="settings.footerTitle"]');
    if (ft && has(s.footerTitle)) ft.innerHTML = mark(s.footerTitle);
    all(document, '[data-s^="settings."]').forEach(function (el) { setText(el, get({settings: s}, el.getAttribute('data-s'))); });
    if (has(s.email)) {
      window.__contactEmail = s.email;
      var ml = document.getElementById('mail-link');
      if (ml) { ml.href = 'mailto:' + s.email; ml.textContent = s.email; }
    }
    if (has(s.whatsapp)) {
      var digits = String(s.whatsapp).replace(/\D/g, '');
      all(document, 'a[href^="https://wa.me/"]').forEach(function (a) { a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + digits); });
    }
    if (has(s.seoTitle)) document.title = s.seoTitle;
    if (has(s.seoDescription)) { var m = document.querySelector('meta[name=description]'); if (m) m.content = s.seoDescription; }
  }

  function build(doc) {
    if (!doc || !doc.sections || !doc.sections.length) return;
    // An unfilled page in the Studio must never blank the live site.
    if (!doc.sections.some(function (b) { return b && has(b.title); })) return;
    var main = document.querySelector('main');
    var originals = {};
    all(main, '[data-block]').forEach(function (n) { originals[n.getAttribute('data-block')] = n; });
    var tplText = document.getElementById('tpl-textBlock');
    var used = {}, frag = document.createDocumentFragment();

    doc.sections.forEach(function (block) {
      var type = block._type, node;
      if (type === 'textBlock' && tplText) node = tplText.content.firstElementChild.cloneNode(true);
      else if (originals[type]) node = used[type] ? originals[type].cloneNode(true) : originals[type];
      if (!node) return;
      if (used[type] && node.id) node.removeAttribute('id');
      used[type] = true;
      applyBlock(node, type, block);
      frag.appendChild(node);
    });

    main.innerHTML = '';
    main.appendChild(frag);
    if (window.__reveal) window.__reveal(main);
  }

  if (!window.fetch) return;
  fetch(URL)
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (json) {
      if (!json || !json.result) return;
      build(json.result);
      applySettings(json.result.settings);
    })
    .catch(function () { /* keep built-in content */ });
})();
