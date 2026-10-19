// Dates and guests for a hotel stay: the calendar and guest sheets the listing and Confirm and pay share, and the
// date words both print. SLStay(options) adds the two sheets to the phone, opens them from any [data-open]
// button, and calls onChange when the stay changes. It returns { state, open }.
// options: checkIn, checkOut (Dates or null), adults, kids, maxParty, optional (dates can be cleared), onChange,
// single (pick one day, for tickets: one month at a time), from (with single, the first day that can be picked),
// guestNote (text under the guest counters; '' for none).
// SLStay.month(month, picked, from) is that one-month calendar as HTML: [data-day] days and [data-mnav] arrows.
(function () {
  var DAY = 864e5, MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var WK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var plural = function (n, one, many) { return n + ' ' + (n === 1 ? one : many); };
  var fmt = {
    parse: function (s) { var m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(s || ''); return m ? new Date(+m[1], m[2] - 1, +m[3]) : null; },
    iso: function (d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); },
    add: function (d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); },
    nights: function (a, b) { return Math.round((b - a) / DAY); },
    day: function (d) { return WK[d.getDay()] + ', ' + d.getDate() + ' ' + MON[d.getMonth()]; },
    range: function (a, b) {
      return a.getMonth() === b.getMonth()
        ? WK[a.getDay()] + ' ' + a.getDate() + ' – ' + WK[b.getDay()] + ' ' + b.getDate() + ' ' + MON[b.getMonth()]
        : WK[a.getDay()] + ' ' + a.getDate() + ' ' + MON[a.getMonth()] + ' – ' + WK[b.getDay()] + ' ' + b.getDate() + ' ' + MON[b.getMonth()];
    },
    // Short, for a bottom bar: "23 – 25 Oct", or "30 Oct – 2 Nov" across months.
    short: function (a, b) {
      return a.getMonth() === b.getMonth()
        ? a.getDate() + ' – ' + b.getDate() + ' ' + MON[b.getMonth()]
        : a.getDate() + ' ' + MON[a.getMonth()] + ' – ' + b.getDate() + ' ' + MON[b.getMonth()];
    },
    plural: plural,
    party: function (a, k) { return plural(a, 'adult', 'adults') + (k ? ', ' + plural(k, 'child', 'children') : ''); }
  };
  // The prototype's "today" is Sat 17 Oct 2026; the calendar runs a year from it, like hotel apps.
  var today = new Date(2026, 9, 17);
  var months = [];
  for (var mi = 0; mi < 12; mi++) months.push(new Date(today.getFullYear(), today.getMonth() + mi, 1));
  // One month for picking a single day: the month with arrows, weekday letters, then the days; days before from
  // (today unless a ticket must be bought ahead) are off.
  function month(m, picked, from) {
    var cells = '', first = m.getDay(), last = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    for (var b = 0; b < first; b++) cells += '<span></span>';
    for (var d = 1; d <= last; d++) {
      var day = new Date(m.getFullYear(), m.getMonth(), d), on = picked && +day === +picked;
      cells += '<button class="c-bkday' + (on ? ' is-start' : '') + '" type="button" data-day="' + fmt.iso(day) + '"' + (day < (from || today) ? ' disabled' : '') +
        ' aria-label="' + fmt.day(day) + '"' + (on ? ' aria-pressed="true"' : '') + '>' + d + '</button>';
    }
    var nav = function (step, label, icon, off) {
      return '<button class="c-mcal__nav" type="button" data-mnav="' + step + '" aria-label="' + label + '"' + (off ? ' disabled' : '') + '>' +
        '<i class="ph-light ph-caret-' + icon + '" aria-hidden="true"></i></button>';
    };
    return '<section class="c-bkmonth c-mcal"><div class="c-mcal__head"><h3 class="c-mcal__title">' + MONTH[m.getMonth()] + ' ' + m.getFullYear() + '</h3>' +
      nav(-1, 'Previous month', 'left', +m <= +months[0]) + nav(1, 'Next month', 'right', +m >= +months[months.length - 1]) + '</div>' +
      '<div class="c-mcal__dow" aria-hidden="true"><span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span></div>' +
      '<div class="c-bkmonth__grid">' + cells + '</div></section>';
  }

  var SHEETS =
    '<div class="c-sheet c-bksheet" data-sheet="dates" role="dialog" aria-modal="true" aria-label="Choose dates" hidden>' +
      '<button class="c-sheet__scrim" type="button" data-close aria-label="Close"></button>' +
      '<div class="c-sheet__panel">' +
        '<div class="c-sheet__grabber" aria-hidden="true"></div>' +
        '<div class="c-bksheet__head"><h2 class="c-bksheet__title">Dates</h2><p class="c-bksheet__sub" data-cal-sum aria-live="polite"></p></div>' +
        '<div class="c-bkdow" aria-hidden="true"><span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span></div>' +
        '<div class="c-bkcal" data-cal></div>' +
        '<div class="c-bksheet__foot"><button class="c-bksheet__link" type="button" data-cal-clear>Clear</button><button class="c-bksheet__done" type="button" data-cal-done>Done</button></div>' +
      '</div>' +
    '</div>' +
    '<div class="c-sheet c-bksheet" data-sheet="guests" role="dialog" aria-modal="true" aria-label="Guests" hidden>' +
      '<button class="c-sheet__scrim" type="button" data-close aria-label="Close"></button>' +
      '<div class="c-sheet__panel">' +
        '<div class="c-sheet__grabber" aria-hidden="true"></div>' +
        '<div class="c-bksheet__head"><h2 class="c-bksheet__title">Guests</h2></div>' +
        '<div class="c-melist c-cgform">' +
          '<div class="c-merow"><span class="c-merow__main">Adults<span class="c-merow__sub">Ages 13 or above</span></span><span class="c-cgstep"><button class="c-cgstep__btn" type="button" data-gstep="a-1" aria-label="Remove an adult"><i class="ph-light ph-minus" aria-hidden="true"></i></button><span class="c-cgstep__value" data-adults aria-live="polite">2</span><button class="c-cgstep__btn" type="button" data-gstep="a1" aria-label="Add an adult"><i class="ph-light ph-plus" aria-hidden="true"></i></button></span></div>' +
          '<div class="c-merow"><span class="c-merow__main">Children<span class="c-merow__sub">Ages 2 to 12</span></span><span class="c-cgstep"><button class="c-cgstep__btn" type="button" data-gstep="c-1" aria-label="Remove a child"><i class="ph-light ph-minus" aria-hidden="true"></i></button><span class="c-cgstep__value" data-kids aria-live="polite">0</span><button class="c-cgstep__btn" type="button" data-gstep="c1" aria-label="Add a child"><i class="ph-light ph-plus" aria-hidden="true"></i></button></span></div>' +
        '</div>' +
        '<p class="c-bksheet__note" data-guest-note></p>' +
        '<div class="c-bksheet__foot"><button class="c-bksheet__done is-wide" type="button" data-guests-done>Done</button></div>' +
      '</div>' +
    '</div>';

  window.SLStay = function (o) {
    var phone = document.querySelector('.phone');
    phone.querySelector('.c-homeindicator').insertAdjacentHTML('beforebegin', SHEETS);
    var $ = function (q) { return phone.querySelector(q); };
    var $$ = function (q) { return Array.prototype.slice.call(phone.querySelectorAll(q)); };
    var view = months[0];
    if (o.single) {
      $('[data-sheet="dates"] .c-bksheet__title').textContent = 'Date';
      $('[data-sheet="dates"] .c-bkdow').style.display = 'none';
    }
    var s = { checkIn: (o.checkIn && (o.single || o.checkOut) && o.checkIn) || null, checkOut: (o.checkIn && o.checkOut) || null, adults: o.adults || 2, kids: o.kids || 0 };
    var opener = null, pickIn = null, pickOut = null;

    // Sheets slide up over the page; the scrim, Escape or Done closes them.
    function open(name, from) {
      opener = from || null;
      if (name === 'dates') {
        pickIn = s.checkIn; pickOut = s.checkOut;
        if (o.single && pickIn) view = new Date(pickIn.getFullYear(), pickIn.getMonth(), 1);
        drawCal();
      }
      if (name === 'guests') drawGuests();
      var sheet = $('[data-sheet="' + name + '"]');
      sheet.hidden = false;
      (sheet.querySelector('[data-focus]') || sheet.querySelector('button')).focus();
      if (name === 'dates') {
        var at = $('[data-cal] .is-start');
        $('[data-cal]').scrollTop = at ? at.closest('.c-bkmonth').offsetTop : 0;
      }
    }
    function close() {
      $$('[data-sheet]').forEach(function (x) { x.hidden = true; });
      if (opener) opener.focus();
    }
    $$('[data-open]').forEach(function (b) { b.addEventListener('click', function () { open(b.dataset.open, b); }); });
    $$('.c-bksheet [data-close]').forEach(function (b) { b.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    // Calendar: tap check-in, then check-out; tapping again starts over.
    function drawCal() {
      $('[data-cal]').innerHTML = o.single ? month(view, pickIn, o.from) : months.map(function (m) {
        var cells = '', first = m.getDay(), last = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
        for (var b = 0; b < first; b++) cells += '<span></span>';
        for (var d = 1; d <= last; d++) {
          var day = new Date(m.getFullYear(), m.getMonth(), d), cls = 'c-bkday';
          if (pickIn && +day === +pickIn) cls += ' is-start';
          if (pickOut && +day === +pickOut) cls += ' is-end';
          if (pickIn && pickOut && day > pickIn && day < pickOut) cls += ' is-in';
          if (pickIn && pickOut) cls += ' has-range';
          cells += '<button class="' + cls + '" type="button" data-day="' + fmt.iso(day) + '"' + (day < today ? ' disabled' : '') +
            ' aria-label="' + fmt.day(day) + '"' + (cls.indexOf('is-start') > -1 || cls.indexOf('is-end') > -1 ? ' aria-pressed="true"' : '') + '>' + d + '</button>';
        }
        return '<section class="c-bkmonth"><h3 class="c-bkmonth__title">' + MONTH[m.getMonth()] + ' ' + m.getFullYear() + '</h3><div class="c-bkmonth__grid">' + cells + '</div></section>';
      }).join('');
      $('[data-cal-sum]').textContent = o.single ? (pickIn ? fmt.day(pickIn) : 'Pick a day') : pickIn && pickOut
        ? fmt.range(pickIn, pickOut) + ' · ' + plural(fmt.nights(pickIn, pickOut), 'night', 'nights')
        : pickIn ? 'Check-in ' + fmt.day(pickIn) + ' · now pick check-out' : 'Pick your check-in day';
      $('[data-cal-done]').disabled = !(pickIn && (pickOut || o.single)) && !(o.optional && !pickIn);
    }
    $('[data-cal]').addEventListener('click', function (e) {
      var nv = e.target.closest('[data-mnav]');
      if (nv) {
        view = new Date(view.getFullYear(), view.getMonth() + Number(nv.dataset.mnav), 1);
        drawCal();
        var nv2 = $('[data-cal] [data-mnav="' + nv.dataset.mnav + '"]');
        if (nv2 && !nv2.disabled) nv2.focus();
        return;
      }
      var b = e.target.closest('[data-day]');
      if (!b || b.disabled) return;
      var d = fmt.parse(b.dataset.day);
      if (o.single || !pickIn || pickOut || d <= pickIn) { pickIn = d; pickOut = null; }
      else pickOut = d;
      drawCal();
      var again = $('[data-day="' + b.dataset.day + '"]');
      if (again) again.focus();
    });
    $('[data-cal-clear]').addEventListener('click', function () { pickIn = null; pickOut = null; drawCal(); });
    $('[data-cal-done]').addEventListener('click', function () { s.checkIn = pickIn; s.checkOut = pickOut; close(); o.onChange(); });

    // Guests: adults (at least one) and children; the total is capped at the biggest room here.
    function drawGuests() {
      $('[data-adults]').textContent = s.adults;
      $('[data-kids]').textContent = s.kids;
      $('[data-gstep="a-1"]').disabled = s.adults <= 1;
      $('[data-gstep="c-1"]').disabled = s.kids <= 0;
      $('[data-gstep="a1"]').disabled = $('[data-gstep="c1"]').disabled = s.adults + s.kids >= o.maxParty;
      $('[data-guest-note]').textContent = o.guestNote != null ? o.guestNote : 'Rooms here sleep up to ' + o.maxParty + '.';
    }
    $$('[data-gstep]').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.dataset.gstep, step = k.slice(1) === '1' ? 1 : -1;
        if (k[0] === 'a') s.adults += step; else s.kids += step;
        drawGuests();
        o.onChange();
      });
    });
    $('[data-guests-done]').addEventListener('click', close);

    return { state: s, open: open };
  };
  SLStay.fmt = fmt;
  SLStay.today = today;
  SLStay.month = month;
})();
