import { chromium } from 'file:///C:/Users/ampoy/SubicLife/node_modules/playwright/index.mjs';
const D = 'C:/Users/ampoy/SubicLife/prototype';
const pages = [
  'explore', 'map', 'map?p=ocean', 'place', 'place?p=meatplus', 'book', 'book-done',
  'search', 'category?c=hotels', 'category?c=food', 'saved', 'saved-empty'
];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const errors = [];
let current = '';
p.on('console', m => { if (m.type() === 'error') errors.push(`[${current}] console: ${m.text()}`); });
p.on('pageerror', e => errors.push(`[${current}] pageerror: ${e.message}`));
p.on('requestfailed', r => errors.push(`[${current}] requestfailed: ${r.url().slice(0, 90)}`));
for (const n of pages) {
  current = n;
  const [file, query] = n.split('?');
  await p.goto(`file:///${D}/${file}.html${query ? '?' + query : ''}`, { waitUntil: 'load' });
  await p.waitForTimeout(1200);
  const el = await p.$('.phone');
  await el.screenshot({ path: `${D}/shots/${n.replace(/[?=&]/g, '-')}.png` });
}
await b.close();
console.log(errors.length ? errors.join('\n') : 'no console errors, no failed requests');
