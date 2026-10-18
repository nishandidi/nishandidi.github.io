/*
 * Loads the published "Startseite" document from Sanity and swaps it into the page.
 * The HTML already contains the full content, so if Sanity is unreachable or a field
 * is empty, the page simply keeps what is there.
 */
(function () {
  var PROJECT = 'emuhnqj1';
  var DATASET = 'production';
  var QUERY = '*[_id == "landingPage"][0]{..., ' +
    'hero{..., "portraitUrl": portrait.asset->url}, ' +
    'about{..., "photoUrl": photo.asset->url}, ' +
    'cases{..., items[]{..., "imageUrl": image.asset->url, "avatarUrl": avatar.asset->url}}, ' +
    'testimonials{..., items[]{..., "avatarUrl": avatar.asset->url}}}';
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
  function img(url, w) { return url ? url + '?w=' + w + '&auto=format&fit=max' : ''; }
  function reveal(root) { if (window.__reveal) window.__reveal(root); }

  function setText(el, v) { if (has(v)) el.textContent = v; }
  function setImg(el, url, w) { if (url) { el.src = url.indexOf('cdn.sanity.io') > -1 ? img(url, w) : url; el.style.visibility = ''; } }

  // Rebuilds a list by cloning the existing children as templates (keeps icons and layout).
  function renderList(container, items, fill) {
    if (!container || !items || !items.length) return;
    var templates = Array.prototype.slice.call(container.children);
    var frag = document.createDocumentFragment();
    items.forEach(function (item, i) {
      var node = templates[i % templates.length].cloneNode(true);
      node.classList.remove('on');
      fill(node, item, i);
      frag.appendChild(node);
    });
    container.innerHTML = '';
    container.appendChild(frag);
    reveal(container);
  }
  function fillFields(node, item, i) {
    node.querySelectorAll('[data-f]').forEach(function (el) {
      var k = el.getAttribute('data-f');
      if (k === '#') el.textContent = i + 1; else setText(el, item[k]);
    });
  }
  function bulletsHtml(list, items) {
    var tpl = list.querySelector('li');
    if (!tpl || !items || !items.length) return;
    var svg = tpl.querySelector('svg').outerHTML;
    list.innerHTML = items.map(function (t) { return '<li>' + svg + esc(t) + '</li>'; }).join('');
  }

  function apply(d) {
    if (!d) return;

    document.querySelectorAll('[data-s]').forEach(function (el) { setText(el, get(d, el.getAttribute('data-s'))); });
    document.querySelectorAll('[data-m]').forEach(function (el) {
      var v = get(d, el.getAttribute('data-m')); if (has(v)) el.innerHTML = mark(v);
    });
    document.querySelectorAll('[data-img]').forEach(function (el) { setImg(el, get(d, el.getAttribute('data-img')), 1200); });
    document.querySelectorAll('[data-bullets]').forEach(function (el) { bulletsHtml(el, get(d, el.getAttribute('data-bullets'))); });
    document.querySelectorAll('[data-href]').forEach(function (el) { var v = get(d, el.getAttribute('data-href')); if (has(v)) el.href = v; });

    // legacy image URLs from the old site (used until a new image is uploaded)
    if (d.hero && !d.hero.portraitUrl && d.hero.portraitLegacyUrl) setImg(document.querySelector('[data-img="hero.portraitUrl"]'), d.hero.portraitLegacyUrl);
    if (d.about && !d.about.photoUrl && d.about.photoLegacyUrl) setImg(document.querySelector('[data-img="about.photoUrl"]'), d.about.photoLegacyUrl);

    renderList(document.querySelector('[data-list="problem.cards"]'), get(d, 'problem.cards'), fillFields);
    renderList(document.querySelector('[data-list="services.items"]'), get(d, 'services.items'), fillFields);
    renderList(document.querySelector('[data-list="process.steps"]'), get(d, 'process.steps'), fillFields);

    // stats
    var stats = get(d, 'stats.items');
    if (stats && stats.length) {
      var grid = document.getElementById('stats-grid');
      grid.innerHTML = stats.map(function (s, i) {
        return '<div class="stat rv"><span class="mono">' + esc(s.label || '') + '</span>' +
          '<div class="stat-num">' + (s.prefix ? '<small>' + esc(s.prefix) + '</small>' : '') +
          '<span>' + esc(has(s.value) ? s.value : '') + '</span>' +
          (s.suffix ? '<small>' + esc(s.suffix) + '</small>' : '') +
          (i === stats.length - 1 ? '<span class="dot" aria-hidden="true"></span>' : '') + '</div>' +
          '<p>' + esc(s.text || '') + '</p></div>';
      }).join('');
      reveal(grid);
    }

    // cases, split by category into the two tabs
    var cases = get(d, 'cases.items');
    if (cases && cases.length) {
      [['kunden', 'pane-k'], ['fachkraefte', 'pane-f']].forEach(function (pair) {
        var list = cases.filter(function (c) { return (c.category || 'kunden') === pair[0]; });
        renderList(document.getElementById(pair[1]), list, function (node, c) {
          fillFields(node, c);
          var im = node.querySelector('[data-f-img="image"]'), av = node.querySelector('[data-f-img="avatar"]');
          if (im) setImg(im, c.imageUrl || c.imageLegacyUrl, 800);
          if (av) setImg(av, c.avatarUrl || c.avatarLegacyUrl, 120);
          if (im) im.alt = c.name || '';
        });
      });
    }

    // testimonials
    var quotes = get(d, 'testimonials.items');
    if (quotes && quotes.length) {
      var q = document.getElementById('quotes');
      q.innerHTML = quotes.map(function (t) {
        var face = t.avatarUrl || t.avatarLegacyUrl;
        return '<article class="q' + (t.wide ? ' wide' : '') + ' rv">' +
          '<div class="k">' + esc(t.kpi || '') + (t.kpiLabel ? '<small>' + esc(t.kpiLabel) + '</small>' : '') + '</div>' +
          '<p>' + esc(t.quote || '') + '</p>' +
          '<div class="person">' + (face ? '<img src="' + esc(face.indexOf('cdn.sanity.io') > -1 ? img(face, 120) : face) + '" alt="" loading="lazy">' : '') +
          '<div><b>' + esc(t.name || '') + '</b><span>' + esc(t.company || '') + '</span></div></div></article>';
      }).join('');
      reveal(q);
    }

    // faq
    var faq = get(d, 'faq.items');
    if (faq && faq.length) {
      document.getElementById('faq-list').innerHTML = faq.map(function (f) {
        var paras = String(f.answer || '').split(/\n\s*\n/).map(function (p) { return '<p>' + esc(p.trim()).replace(/\n/g, '<br>') + '</p>'; }).join('');
        return '<details><summary>' + esc(f.question || '') + '<span class="pm" aria-hidden="true">+</span></summary><div class="ans">' + paras + '</div></details>';
      }).join('');
    }

    // contact details used by the form and links
    var email = get(d, 'contact.email'), wa = get(d, 'contact.whatsapp');
    if (has(email)) {
      window.__contactEmail = email;
      var ml = document.getElementById('mail-link');
      if (ml) { ml.href = 'mailto:' + email; ml.textContent = email; }
    }
    if (has(wa)) {
      var digits = String(wa).replace(/\D/g, '');
      document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function (a) {
        a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + digits);
      });
    }

    var seoTitle = get(d, 'footer.seoTitle'), seoDesc = get(d, 'footer.seoDescription');
    if (has(seoTitle)) document.title = seoTitle;
    if (has(seoDesc)) { var m = document.querySelector('meta[name=description]'); if (m) m.content = seoDesc; }
  }

  if (!window.fetch) return;
  fetch(URL)
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (json) { if (json && json.result) apply(json.result); })
    .catch(function () { /* keep built-in content */ });
})();
