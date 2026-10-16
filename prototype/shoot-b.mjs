import { chromium } from 'file:///C:/Users/ampoy/SubicLife/node_modules/playwright/index.mjs';
import fs from 'node:fs';
// Agent B: shoots only the Card, pay and staff pages, and checks console errors and local links.
const D = 'C:/Users/ampoy/SubicLife/prototype';
// Query "?still" freezes the timed auto-advance so the screenshot shows the intended state.
const pages = [
  ['card', ''], ['card-premium', ''], ['card-elite', ''], ['card-staff', ''], ['card-receipt', ''],
  ['card-benefits', ''], ['card-savings', ''], ['card-none', ''],
  ['pay-request', ''], ['pay-faceid', '?still'], ['pay-done', ''],
  ['staff-scan', ''], ['staff-bill', ''], ['staff-wait', '?still'], ['staff-paid', ''],
];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
let errs = [];
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
p.on('pageerror', e => errs.push('pageerror: ' + e.message));
p.on('requestfailed', r => errs.push('requestfailed: ' + r.url()));

for (const [name, query] of pages) {
  errs = [];
  await p.goto(`file:///${D}/${name}.html${query}`);
  await p.waitForTimeout(1000);
  const el = await p.$('.phone');
  await el.screenshot({ path: `${D}/shots/${name}.png` });
  const hrefs = await p.$$eval('a[href]', as => as.map(a => a.getAttribute('href')));
  const broken = hrefs.filter(h => {
    if (h === '#' || /^(https?:|mailto:|tel:)/.test(h)) return h === '#';
    return !fs.existsSync(`${D}/${h.split(/[?#]/)[0]}`);
  });
  console.log(`${name}: errors=${errs.length} broken=${broken.length ? broken.join(' ') : 'none'}`);
  for (const e of errs) console.log('   ' + e.slice(0, 160));
}

// Investor showcase has no phone frame: shoot the whole light page.
await p.goto(`file:///${D}/card-tiers.html`);
await p.waitForTimeout(1000);
await p.screenshot({ path: `${D}/shots/card-tiers.png`, fullPage: true });
await b.close();
