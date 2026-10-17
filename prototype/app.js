// app.js - prototype interactions only. Plain vanilla JS, no dependencies.
// "Map" and "List" links are plain hrefs in the HTML, so they need no code here.

// Chips: clicking one moves .is-selected to it within its row.
document.querySelectorAll('.c-chiprow').forEach(function (row) {
  row.addEventListener('click', function (e) {
    var chip = e.target.closest('.c-chip');
    if (!chip || !row.contains(chip)) return;
    row.querySelectorAll('.c-chip').forEach(function (c) {
      c.classList.toggle('is-selected', c === chip);
    });
  });
});

// Map pins: clicking a pin selects it (orange) and shows the place card.
var pins = document.querySelectorAll('.c-pin');
var sheet = document.querySelector('.c-place-sheet');

function clearPins() {
  pins.forEach(function (p) { p.classList.remove('is-selected'); });
}

pins.forEach(function (pin) {
  pin.addEventListener('click', function () {
    clearPins();
    pin.classList.add('is-selected');
    if (sheet) sheet.hidden = false;
  });
});

// Close X: hides the place card and drops the orange selection.
var closeBtn = document.querySelector('.c-place-sheet__close');
if (closeBtn && sheet) {
  closeBtn.addEventListener('click', function () {
    sheet.hidden = true;
    clearPins();
  });
}

// Membership card (c-mcard, marked data-mcard): tap flips it to the QR side; pointer movement tilts it
// up to 6deg and moves the sheen. Tilt is skipped under prefers-reduced-motion; the flip still works.
var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('[data-mcard]').forEach(function (card) {
  card.addEventListener('click', function () {
    var flipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', flipped ? 'true' : 'false');
  });
  card.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });

  if (reduceMotion) return;

  card.addEventListener('pointermove', function (e) {
    var r = card.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width;   // 0 to 1, left to right
    var y = (e.clientY - r.top) / r.height;   // 0 to 1, top to bottom
    card.style.setProperty('--rx', ((0.5 - y) * 12).toFixed(2) + 'deg');
    card.style.setProperty('--ry', ((x - 0.5) * 12).toFixed(2) + 'deg');
    // Sheen background-position runs opposite to the pointer so the band sits under it.
    card.style.setProperty('--sx', (100 - x * 100).toFixed(1) + '%');
    card.style.setProperty('--sy', (100 - y * 100).toFixed(1) + '%');
  });
  card.addEventListener('pointerleave', function () {
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
    card.style.setProperty('--sx', '50%');
    card.style.setProperty('--sy', '50%');
  });
});

// Member QR: encode the pass code once and draw it into every empty .c-qr slot.
// Error level M, margin 0 (the white tile supplies the padding). Size: 140px on the card back (.is-card),
// 264px for .is-large, 168px otherwise.
if (typeof qrcode === 'function') {
  document.querySelectorAll('.c-qr').forEach(function (slot) {
    if (slot.childElementCount > 0) return;
    var qr = qrcode(0, 'M');
    qr.addData('SUBICLIFE:00421187');
    qr.make();
    var n = qr.getModuleCount();
    var size = slot.classList.contains('is-large') ? 264
      : slot.classList.contains('is-card') ? 140 : 168;
    // One path in module units: shared edges are filled once, so no hairline seams show between modules.
    var d = '';
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        if (qr.isDark(r, c)) d += 'M' + c + ' ' + r + 'h1v1h-1z';
      }
    }
    slot.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
                     '" viewBox="0 0 ' + n + ' ' + n + '" role="img" aria-label="Member QR code"><path fill="currentColor" d="' + d + '"/></svg>';
  });
}
