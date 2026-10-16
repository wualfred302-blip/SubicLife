// shoot-g.mjs - screenshots for Agent G (concierge). Run: node shoot-g.mjs
import { chromium } from 'file:///C:/Users/ampoy/SubicLife/node_modules/playwright/index.mjs';
const D = 'C:/Users/ampoy/SubicLife/prototype';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const errors = [];
p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
p.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

async function shot(url, file, { wait = 1000, scroll = 0, act = null } = {}) {
  await p.goto(`file:///${D}/${url}`);
  await p.waitForTimeout(wait);
  if (act) await act(p);
  if (scroll) await p.evaluate((y) => { const s = document.querySelector('.screen-scroll') || document.querySelector('.c-chat'); s.scrollTop = y; }, scroll);
  await p.waitForTimeout(300);
  const el = await p.$('.phone');
  await el.screenshot({ path: `${D}/shots/${file}.png` });
}

await shot('concierge.html', 'g-concierge');
await shot('concierge.html', 'g-concierge-2', { scroll: 560 });
await shot('concierge-request.html?type=yacht', 'g-request-yacht');
await shot('concierge-request.html?type=yacht', 'g-request-yacht-2', { scroll: 600 });
await shot('concierge-chat.html', 'g-chat', { scroll: 99999 });
await shot('concierge-chat.html?topic=table', 'g-chat-table');
await shot('concierge-chat.html?topic=table', 'g-chat-typing', {
  act: async (pg) => {
    await pg.click('.c-reply >> text=Rama');
    await pg.waitForTimeout(600);
  }
});
await shot('concierge-chat.html?topic=yacht&from=request&date=2026-10-17&time=10:00&guests=6&note=Sunset%20drinks%20please', 'g-chat-request', { wait: 4800, scroll: 99999 });
await shot('concierge-trip.html', 'g-trip');
await shot('concierge-trip.html', 'g-trip-2', { scroll: 400 });

console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'no console errors');
await b.close();
