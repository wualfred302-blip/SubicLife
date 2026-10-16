// shoot-f.mjs - Agent F checks for map.html, run inside the app shell (index.html).
// Shots go to shots/map-*.png. Checks: live tiles, pin tap, chip filter, carousel swipe sync, list sheet,
// and an offline pass that blocks the map CDNs to prove the static fallback still works.
import { chromium } from 'file:///C:/Users/ampoy/SubicLife/node_modules/playwright/index.mjs';

const D = 'C:/Users/ampoy/SubicLife/prototype';
const errors = [];
const checks = {};

async function run(label, { blockMaps }) {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  p.on('console', (m) => { if (m.type() === 'error') errors.push(`${label} console: ${m.text()}`); });
  p.on('pageerror', (e) => errors.push(`${label} pageerror: ${e.message}`));
  if (blockMaps) {
    await p.route(/basemaps\.cartocdn\.com|cdnjs\.cloudflare\.com\/ajax\/libs\/leaflet/, (r) => r.abort());
  }

  const frameOf = (name) => p.frames().find((f) => f.url().split('?')[0].endsWith('/' + name));
  async function waitFrame(name) {
    for (let i = 0; i < 150; i++) {
      const f = frameOf(name);
      if (f) { await f.waitForLoadState('load').catch(() => {}); return f; }
      await p.waitForTimeout(100);
    }
    throw new Error('frame never loaded: ' + name);
  }

  // Start in the shell, then go to the map from the welcome screen with the tab call.
  await p.goto(`file:///${D}/index.html`);
  const start = await waitFrame('welcome.html');
  await start.waitForFunction(() => typeof window.subicNav === 'function');
  await start.evaluate(() => window.subicNav('map.html', 'tab'));
  const f = await waitFrame('map.html');
  await p.waitForTimeout(400);

  // Live: wait for tiles (or the lock after the fallback timeout).
  if (!blockMaps) {
    await f.waitForFunction(() => document.querySelectorAll('.leaflet-tile-loaded').length >= 4, null, { timeout: 15000 })
      .catch(() => {});
  } else {
    await p.waitForTimeout(9500);
  }
  await f.waitForTimeout(900); // pin entrance (staggered) finished
  const selected = () => f.evaluate(() => {
    const s = document.querySelector('.c-fpin.is-selected');
    return s ? s.getAttribute('aria-label') : null;
  });
  const visiblePins = () => f.evaluate(() => [...document.querySelectorAll('.c-fpin')].filter((el) => !el.classList.contains('is-off')).length);
  const visibleCards = () => f.evaluate(() => [...document.querySelectorAll('.c-fcard')].filter((el) => !el.hidden).length);

  checks[label + ' tiles loaded'] = await f.evaluate(() => document.querySelectorAll('.leaflet-tile-loaded').length);
  checks[label + ' static'] = await f.evaluate(() => document.querySelector('.c-map').classList.contains('is-static'));
  checks[label + ' pins'] = await f.evaluate(() => document.querySelectorAll('.c-fpin').length);
  checks[label + ' start selected'] = await selected();
  checks[label + ' pins hidden under carousel'] = await f.evaluate(() => { const c = document.querySelector('.c-fcarousel').getBoundingClientRect().top; const t = document.querySelector('.c-map-topbar').getBoundingClientRect().bottom; return [...document.querySelectorAll('.c-fpin:not(.is-off)')].filter((el) => { const r = el.getBoundingClientRect(); return r.bottom > c || r.top < t; }).map((el) => el.getAttribute('aria-label').split(',')[0]); });
  const el = f.locator('.phone');
  await el.screenshot({ path: `${D}/shots/map-${label}-01-start.png` });

  // Pin tap: Meat Plus. Carousel should scroll to its card and the pin turns dark.
  await f.locator('.c-fpin[aria-label^="Meat Plus"]').dispatchEvent('click');
  await f.waitForTimeout(800);
  checks[label + ' pin tap selected'] = await selected();
  checks[label + ' pin tap card'] = await f.evaluate(() => {
    const t = document.querySelector('[data-track]');
    const c = document.querySelector('.c-fcard.is-target, .c-fcard[data-id="meatplus"]');
    if (!c) return null;
    const off = c.getBoundingClientRect().left - t.getBoundingClientRect().left;
    return Math.round(off);
  });
  await el.screenshot({ path: `${D}/shots/map-${label}-02-pin.png` });

  // Chip filter: Food.
  await f.locator('.c-chip[data-cat="food"]').click();
  await f.waitForTimeout(700);
  checks[label + ' food pins'] = await visiblePins();
  checks[label + ' food cards'] = await visibleCards();
  checks[label + ' food selected'] = await selected();
  await el.screenshot({ path: `${D}/shots/map-${label}-03-chip-food.png` });

  // Back to All, then swipe the carousel to the next card (mouse wheel, horizontal).
  await f.locator('.c-chip[data-cat="all"]').click();
  await f.waitForTimeout(900);
  const box = await f.locator('[data-track]').boundingBox();
  await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await p.mouse.wheel(300, 0);
  await f.waitForTimeout(900);
  checks[label + ' swipe selected'] = await selected();
  const firstCardName = await f.evaluate(() => {
    const t = document.querySelector('[data-track]');
    const tl = t.getBoundingClientRect().left + 20;
    let best = null, bd = Infinity;
    document.querySelectorAll('.c-fcard').forEach((c) => {
      const d = Math.abs(c.getBoundingClientRect().left - tl);
      if (d < bd) { bd = d; best = c.querySelector('.c-fcard__name').textContent; }
    });
    return best;
  });
  checks[label + ' swipe card'] = firstCardName;
  await el.screenshot({ path: `${D}/shots/map-${label}-04-swipe.png` });

  // List sheet: toggle opens it; the rows are sorted nearest first.
  await f.locator('[data-list-toggle]').click();
  await f.waitForTimeout(600);
  checks[label + ' list open'] = await f.evaluate(() => !document.querySelector('#fList').hidden);
  checks[label + ' list rows'] = await f.evaluate(() => [...document.querySelectorAll('.c-fsheet__list li')].filter((li) => !li.hidden && li.querySelector('.c-list-row')).length);
  await el.screenshot({ path: `${D}/shots/map-${label}-05-list.png` });
  await f.locator('.c-fsheet__done').click();
  await f.waitForTimeout(300);

  // Locate: the dot shows and the map flies to Harbor Point.
  await f.locator('[data-locate]').click();
  await f.waitForTimeout(1100);
  checks[label + ' locate dot'] = await f.evaluate(() => !document.querySelector('.c-fme').hidden);
  await el.screenshot({ path: `${D}/shots/map-${label}-06-locate.png` });

  await b.close();
}

await run('live', { blockMaps: false });
await run('offline', { blockMaps: true });

console.log(JSON.stringify(checks, null, 2));
console.log('errors:', errors.length ? errors : 'none');
