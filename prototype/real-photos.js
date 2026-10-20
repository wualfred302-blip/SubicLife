// real-photos.js: swaps stock photos for real ones when img/real/manifest.js is present.
// img/real/ is git-ignored reference material for the investor demo (not licensed). Without it, nothing changes.
(function () {
  var R = window.REAL;
  if (!R) return;
  // What each stock file stands for on pages with hard-coded photos (card, bookings, payments).
  var STOCK = {
    'hist-meat-plus': 'meatplus', 'thumb-meat-plus': 'meatplus',
    'card-lighthouse': 'lighthouse', 'place-lighthouse': 'lighthouse', 'hist-lighthouse-sep': 'lighthouse', 'hist-lighthouse-oct': 'lighthouse',
    'hist-sailing-club': 'yacht', 'thumb-yacht-club': 'yacht', 'hist-zoobic': 'zoobic',
    'hist-ramas': 'ramas', 'thumb-ramas': 'ramas', 'card-ocean': 'ocean', 'card-camayan': 'camayan'
  };
  var has = function (id) { return R[id] && R[id].photos.length; };
  var nth = function (id, i) { return has(id) ? R[id].photos[i % R[id].photos.length] : null; };
  var bySrc = function (src) {
    var m = /img\/([a-z0-9-]+)\.jpg$/.exec(src || '');
    return (m && STOCK[m[1]] && (R[STOCK[m[1]]] || {}).thumb) || (m && STOCK[m[1]] && nth(STOCK[m[1]], 0)) || src;
  };

  var P = window.PLACES || {};
  Object.keys(P).forEach(function (id) {
    var p = P[id], r = R[id];
    if (!has(id)) return;
    p.photos = r.photos.slice(0, 8);
    p.hero = r.photos[0];
    p.thumb = r.thumb || r.photos[0];
    if (r.video) { p.video = r.video; p.poster = r.poster || r.photos[0]; p.videoFirst = !!r.lead; }
    (p.rooms || []).forEach(function (room) { if (r.rooms && r.rooms[room.name]) room.photo = r.rooms[room.name]; });
  });

  var F = window.FEED;
  if (F) {
    F.offers.forEach(function (o) { if (has(o.place)) o.photo = R[o.place].offer || nth(o.place, 1); });
    F.events.concat(F.stories).forEach(function (s, k) {
      if (!has(s.place) || !s.photos) return;
      s.photos = s.real || s.photos.map(function (src, i) { return /^data:/.test(src) ? src : nth(s.place, k + i + 1); });
    });
  }

  (function walk(o) {
    if (!o || typeof o !== 'object') return;
    if (typeof o.img === 'string') {
      var m = /[?&]p=([a-z]+)/.exec(o.href || '');
      o.img = (m && has(m[1]) && (R[m[1]].thumb || nth(m[1], 0))) || bySrc(o.img);
    }
    Object.keys(o).forEach(function (k) { walk(o[k]); });
  })(window.CONCIERGE);

  // Pages without place data have the photos in their HTML.
  if (!window.PLACES) document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('img[src^="img/"]').forEach(function (img) {
      var src = bySrc(img.getAttribute('src'));
      if (src !== img.getAttribute('src')) img.src = src;
    });
  });
})();
