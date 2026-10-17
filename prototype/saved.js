// saved.js - What Ana saves (places and offers), kept in localStorage so every page agrees.
// SLSaved.has(kind, id) / SLSaved.list(kind) / SLSaved.toggle(kind, id) -> true when now saved.
// SLSaved.note(on) shows a short black note: "Saved · View" (opens Saved) or "Removed from Saved".
(function () {
  var KEY = 'sl-saved';
  // First run (or after ?reset=1): what the Saved page used to show, so the demo isn't empty.
  var START = { place: ['lighthouse', 'meatplus', 'ramas', 'yacht'], offer: ['lighthouse-rooms', 'meatplus-bill', 'ramas-dessert', 'yacht-counter'] };

  function read() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.place && s.offer) return s;
    } catch (e) { /* storage blocked or bad data: fall back to the start list */ }
    return { place: START.place.slice(), offer: START.offer.slice() };
  }
  function write(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* not kept, the page still updates */ }
  }

  var note = null;
  window.SLSaved = {
    has: function (kind, id) { return read()[kind].indexOf(id) >= 0; },
    list: function (kind) { return read()[kind]; },
    toggle: function (kind, id) {
      var s = read(), list = s[kind], at = list.indexOf(id);
      if (at >= 0) list.splice(at, 1); else list.unshift(id);
      write(s);
      return at < 0;
    },
    note: function (on) {
      if (note) note.remove();
      var mine = note = document.createElement('p');
      mine.className = 'c-toast c-savenote';
      mine.setAttribute('role', 'status');
      mine.innerHTML = on ? 'Saved<a href="saved.html">View</a>' : 'Removed from Saved';
      document.querySelector('.phone').appendChild(mine);
      setTimeout(function () { mine.classList.add('is-gone'); }, 2600);
      setTimeout(function () { mine.remove(); }, 3000);
    }
  };
})();
