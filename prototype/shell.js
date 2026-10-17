/* shell.js - app shell bridge. Loaded in every app page (head) and in the two host pages.
   Host page (body[data-shell]): owns the navigation stack, the transitions, browser history and the
   desktop / real-phone layout. Each screen is told which mode it is in with ?shell=device or ?shell=desktop.
   Embedded page (inside a host iframe): marks <html> with is-embedded (and is-device on a real phone), sends
   link clicks to the host, drags and snaps horizontal rows, and sets viewport-fit and theme-color.
   Standalone page (opened on its own): does nothing, links work normally. */
(function () {
  'use strict';

  var SHEETS = ['pay-request.html', 'me-add-method.html', 'card-receipt.html', 'story-new.html'];
  var EASE = 'cubic-bezier(.2,.8,.2,1)';
  var inFrame = window.parent !== window;
  var root = document.documentElement;
  var PHONE_MQ = '(max-width: 500px), (pointer: coarse)';

  function isDevice() { return window.matchMedia(PHONE_MQ).matches; }

  function pageOf(href) { return String(href).split(/[?#]/)[0]; }

  // Which transition a link asks for: tab bar = tab, back chevron = back, sheet pages = sheet, else push.
  // data-root = a new root (Sign out): the stack is reset to that one screen.
  function classify(href, anchor) {
    if (anchor && anchor.hasAttribute && anchor.hasAttribute('data-root')) return 'root';
    if (anchor && anchor.closest && anchor.closest('.c-tabbar, .c-iconnav')) return 'tab';
    if (anchor && anchor.matches && anchor.matches('[data-back], .c-navbar__back')) return 'back';
    return SHEETS.indexOf(pageOf(href)) >= 0 ? 'sheet' : 'push';
  }

  function post(href, kind) {
    window.parent.postMessage({ type: 'subic-nav', href: href, kind: kind }, '*');
  }

  // Pages call this for timed auto-advances. Inside the shell it goes through the host; standalone it is a plain link.
  window.subicNav = function (href, kind) {
    if (inFrame) post(href, kind || classify(href));
    else window.location.href = href;
  };

  // ---------- embedded pages ----------
  // The nearest ancestor that scrolls sideways and has more content than fits.
  function scrollerOf(el) {
    for (var n = el; n && n !== document.body; n = n.parentElement) {
      if (n.nodeType !== 1) continue;
      var cs = window.getComputedStyle(n);
      if ((cs.overflowX === 'auto' || cs.overflowX === 'scroll') && n.scrollWidth > n.clientWidth + 1) return n;
    }
    return null;
  }

  // Horizontal rows with cards get scroll-snap; every sideways row gets the grab cursor.
  function markScrollers() {
    var els = document.querySelectorAll('body *');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var cs = window.getComputedStyle(el);
      if ((cs.overflowX !== 'auto' && cs.overflowX !== 'scroll') || el.scrollWidth <= el.clientWidth + 1) continue;
      el.classList.add('shell-hscroll');
      var first = el.firstElementChild;
      var cls = first ? (first.getAttribute('class') || '') : '';
      if (el.hasAttribute('data-snap') || /card|tile|offer|post|event|story|photo|place/i.test(cls)) {
        el.classList.add('shell-snap');
      }
    }
  }

  var drag = null;
  var suppressClick = false;

  function childReady() {
    var vp = document.querySelector('meta[name="viewport"]');
    if (!vp) {
      vp = document.createElement('meta');
      vp.name = 'viewport';
      vp.content = 'width=device-width, initial-scale=1';
      document.head.appendChild(vp);
    }
    if (vp.content.indexOf('viewport-fit') < 0) vp.content += ', viewport-fit=cover';
    if (!document.querySelector('meta[name="theme-color"]')) {
      var tc = document.createElement('meta');
      tc.name = 'theme-color';
      tc.content = window.getComputedStyle(root).getPropertyValue('--bg').trim() || '#FFFFFF';
      document.head.appendChild(tc);
    }
    markScrollers();
  }

  if (inFrame) {
    var params = new URLSearchParams(window.location.search);
    root.classList.add('is-embedded');
    if (params.get('shell') === 'device') root.classList.add('is-device');

    // Links go to the host. A drag that moved more than 6px does not count as a click.
    document.addEventListener('click', function (e) {
      if (suppressClick) { suppressClick = false; e.preventDefault(); e.stopImmediatePropagation(); return; }
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || /^(https?:|mailto:|tel:)/i.test(href) || a.target === '_blank') return;
      e.preventDefault();
      post(href, classify(href, a));
    }, true);

    // Mouse drag-to-scroll on sideways rows. Touch uses the native swipe.
    document.addEventListener('pointerover', function (e) {
      if (e.pointerType !== 'mouse') return;
      var row = scrollerOf(e.target);
      if (row) row.classList.add('shell-hscroll');
    }, true);
    document.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      var row = scrollerOf(e.target);
      if (!row) return;
      drag = { row: row, x: e.clientX, left: row.scrollLeft, moved: false, snap: row.style.scrollSnapType };
    }, true);
    document.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      if (!drag.moved) {
        if (Math.abs(dx) <= 6) return;
        drag.moved = true;
        drag.row.classList.add('is-dragging');
        drag.row.style.scrollSnapType = 'none';
        try { drag.row.setPointerCapture(e.pointerId); } catch (err) { /* capture is best effort */ }
      }
      drag.row.scrollLeft = drag.left - dx;
    }, true);
    function endDrag() {
      if (!drag) return;
      if (drag.moved) {
        suppressClick = true;
        setTimeout(function () { suppressClick = false; }, 100);
      }
      drag.row.classList.remove('is-dragging');
      drag.row.style.scrollSnapType = drag.snap;
      drag = null;
    }
    document.addEventListener('pointerup', endDrag, true);
    document.addEventListener('pointercancel', endDrag, true);
    document.addEventListener('dragstart', function (e) {
      if (scrollerOf(e.target)) e.preventDefault();
    }, true);

    document.addEventListener('DOMContentLoaded', childReady);
    window.addEventListener('load', markScrollers);
  }

  // ---------- host page ----------
  function hostInit(body) {
    var screen = document.querySelector('.shell-screen');
    var device = document.querySelector('.shell-device');
    var startHref = body.getAttribute('data-start') || 'welcome.html';
    var qs = new URLSearchParams(window.location.search);
    // ?reset=1 clears saved wallpaper, stories and the saved list before any screen loads
    if (qs.get('reset') === '1') {
      try {
        window.localStorage.removeItem('sl-wall');
        window.localStorage.removeItem('subic-stories');
        window.localStorage.removeItem('sl-saved');
      } catch (e) { /* storage blocked, nothing to clear */ }
    }
    // ?start=<page>.html opens that screen first; other params (e.g. topic=table) pass through to it
    var startPage = qs.get('start') || '';
    if (/^[a-z0-9-]+\.html$/.test(startPage) && startPage !== 'index.html') {
      qs.delete('start');
      qs.delete('reset');
      var extra = qs.toString();
      startHref = startPage + (extra ? '?' + extra : '');
    }
    var front = null; // the iframe currently on screen
    var stack = [];   // [{h: href, k: kind}] the screens currently open, root first
    var log = [];     // snapshots of the stack, one per browser history entry
    var pos = 0;      // index into log that the browser is on
    var busy = false;
    var epoch = 0;    // bumped by a root reset (Sign out); history entries from an older epoch are skipped

    function snap(s) { return s.map(function (e) { return { h: e.h, k: e.k }; }); }
    function sameHrefs(a, b) {
      return a.length === b.length && a.every(function (e, i) { return e.h === b[i].h; });
    }
    function indexOfHref(s, href) {
      for (var i = 0; i < s.length; i++) if (s[i].h === href) return i;
      return -1;
    }
    function findLogIndex(target) {
      for (var i = pos; i >= 0; i--) if (sameHrefs(log[i], target)) return i;
      return -1;
    }
    function isShellFrame(win) {
      for (var i = 0; i < screen.children.length; i++) {
        if (screen.children[i].contentWindow === win) return true;
      }
      return false;
    }
    // The page learns its mode from the URL, so its own layout matches the host.
    function withMode(href) {
      return href + (href.indexOf('?') >= 0 ? '&' : '?') + 'shell=' + (isDevice() ? 'device' : 'desktop');
    }

    // A fresh iframe per screen. A new iframe's first load adds no browser history entry, so the back button
    // only sees the app's own steps. Resolves once the page has loaded (6s cap so a slow page never locks the app).
    function loadFrame(href) {
      return new Promise(function (resolve) {
        var f = document.createElement('iframe');
        var done = false;
        var timer = setTimeout(finish, 6000);
        function finish() {
          if (done) return;
          done = true;
          clearTimeout(timer);
          f.removeEventListener('load', finish);
          resolve(f);
        }
        f.className = 'shell-frame';
        f.title = 'Subic.Life app';
        f.style.visibility = 'hidden';
        f.style.zIndex = '1';
        f.addEventListener('load', finish);
        f.src = withMode(href);
        screen.appendChild(f);
      });
    }

    function animate(el, keyframes, ms) {
      return el.animate(keyframes, { duration: ms, easing: EASE }).finished.catch(function () {});
    }

    // Show `target` as the new top of the stack. Modes: instant (tab swap), slide-in (push), rise (sheet),
    // slide-out (back to a parent), drop (sheet dismissed).
    async function apply(target, from) {
      var top = target[target.length - 1];
      var old = from.length ? from[from.length - 1] : null;
      var outgoing = front;
      var incoming = await loadFrame(top.h);
      incoming.style.visibility = 'visible';

      var mode;
      if (!outgoing || !old || top.k === 'tab' || top.k === 'root' || target.length === from.length) mode = 'instant';
      else if (target.length > from.length) mode = top.k === 'sheet' ? 'rise' : 'slide-in';
      else mode = old.k === 'sheet' ? 'drop' : 'slide-out';

      if (mode === 'slide-in' || mode === 'rise') {
        incoming.style.zIndex = 3;
        if (outgoing) outgoing.style.zIndex = 1;
        if (mode === 'rise') await animate(incoming, [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], 320);
        else await animate(incoming, [{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }], 300);
      } else if (mode === 'slide-out' || mode === 'drop') {
        incoming.style.zIndex = 1;
        outgoing.style.zIndex = 3;
        if (mode === 'drop') await animate(outgoing, [{ transform: 'translateY(0)' }, { transform: 'translateY(100%)' }], 320);
        else await animate(outgoing, [{ transform: 'translateX(0)' }, { transform: 'translateX(100%)' }], 300);
      }

      if (outgoing && outgoing.parentNode) outgoing.parentNode.removeChild(outgoing);
      incoming.style.zIndex = 2;
      front = incoming;
      stack = snap(target);
    }

    // A link or timer asked to go somewhere. Decide the stack change, then either move through browser history
    // (back, so the back button stays in step) or record a new entry and run the transition now.
    function navigate(href, kind) {
      if (busy || typeof href !== 'string' || !stack.length) return;
      var cur = stack;
      var top = cur[cur.length - 1];
      if (top.h === href) return;
      kind = kind || classify(href);
      var idx = indexOfHref(cur, href);
      var target;

      if (kind === 'tab' || kind === 'root') target = [{ h: href, k: kind }];
      else if (kind === 'back') target = cur.length > 1 ? cur.slice(0, -1) : [{ h: href, k: 'push' }];
      else if (idx >= 0) target = cur.slice(0, idx + 1);               // a screen already open below: pop to it
      else target = cur.concat([{ h: href, k: kind }]);

      busy = true;
      var isRoot = kind === 'root';
      if (!isRoot && target.length < cur.length) {
        var j = findLogIndex(target);
        if (j >= 0 && j !== pos) { history.go(j - pos); return; }      // popstate runs the transition
      }
      if (isRoot) { epoch++; log = []; pos = -1; }                    // a root forgets the screens before it
      log = log.slice(0, pos + 1);
      log.push(snap(target));
      pos = log.length - 1;
      history.pushState({ e: epoch, i: pos }, '');
      apply(target, cur).then(function () { busy = false; });
    }

    window.addEventListener('message', function (e) {
      var d = e.data;
      if (!d || d.type !== 'subic-nav') return;
      if (!isShellFrame(e.source)) return;
      navigate(d.href, d.kind);
    });

    // Browser back, forward and Alt+Left land here. The state carries the log index.
    window.addEventListener('popstate', function (e) {
      var i = e.state && typeof e.state.i === 'number' ? e.state.i : -1;
      if (e.state && e.state.e !== undefined && e.state.e !== epoch) { history.forward(); return; }  // before Sign out: step back onto the root
      if (i < 0 || !log[i]) { history.pushState({ e: epoch, i: pos }, ''); return; }   // outside the app: stay in it
      if (i === pos && sameHrefs(log[i], stack)) return;
      var from = stack;
      pos = i;
      busy = true;
      apply(snap(log[i]), from).then(function () { busy = false; });
    });

    // Desktop: scale the 390 x 844 screen down to fit the window height. Real phone: no scaling.
    function fit() {
      if (!device) return;
      if (isDevice()) { device.style.transform = ''; return; }
      var s = Math.min(1, (window.innerHeight - 32) / 844);
      device.style.transform = 'scale(' + s.toFixed(4) + ')';
    }
    window.addEventListener('resize', fit);
    var mq = window.matchMedia(PHONE_MQ);
    mq.addEventListener('change', function () { root.classList.toggle('is-device', mq.matches); fit(); });
    fit();

    busy = true;
    loadFrame(startHref).then(function (f) {
      front = f;
      f.style.visibility = 'visible';
      f.style.zIndex = '2';
      stack = [{ h: startHref, k: 'root' }];
      log = [snap(stack)];
      pos = 0;
      history.replaceState({ e: epoch, i: 0 }, '');
      busy = false;
    });
  }

  if (!inFrame) {
    if (isDevice()) root.classList.add('is-device');
    document.addEventListener('DOMContentLoaded', function () {
      var body = document.body;
      if (body && body.hasAttribute('data-shell')) hostInit(body);
    });
  }
})();

/* Wallpaper and hero. Members pick a wallpaper in Me > Appearance; it is a per-viewer preference, so it
   lives in localStorage and every page reads it before first paint. The page still renders (Dusk) without it.
   On tab screens (.phone.has-wall) the hero fades as the surface rides over it (--hp, 0 to 1), and past
   the hero the frosted bar takes the top (is-scrolled). */
(function () {
  'use strict';
  var root = document.documentElement;
  try {
    var saved = window.localStorage.getItem('sl-wall');
    if (saved) root.setAttribute('data-wall', saved);
  } catch (e) { /* storage blocked: keep the default */ }

  document.addEventListener('DOMContentLoaded', function () {
    var phone = document.querySelector('.phone.has-wall');
    var main = phone && phone.querySelector('.screen-scroll');
    if (main) {
      var hero = phone.querySelector('.c-hero');
      var sync = function () {
        var h = hero ? hero.offsetHeight : 160;
        var y = main.scrollTop;
        phone.classList.toggle('is-scrolled', y > h - 56);
        phone.style.setProperty('--hp', Math.min(1, Math.max(0, y / h)).toFixed(3));
      };
      main.addEventListener('scroll', sync, { passive: true });
      sync();
    }

    var opts = document.querySelectorAll('[data-wall-opt]');
    var mark = function (cur) {
      opts.forEach(function (o) { o.setAttribute('aria-checked', o.getAttribute('data-wall-opt') === cur ? 'true' : 'false'); });
    };
    // No attribute = the night default (theme.css, Pass 9). Dusk is set explicitly so it differs from it.
    mark(root.getAttribute('data-wall') || '');
    opts.forEach(function (o) {
      o.addEventListener('click', function () {
        var w = o.getAttribute('data-wall-opt');
        root.setAttribute('data-wall', w);
        try { window.localStorage.setItem('sl-wall', w); } catch (e) { /* not saved, still applied */ }
        mark(w);
      });
    });
  });
})();
