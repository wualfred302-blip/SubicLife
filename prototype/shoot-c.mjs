import { chromium } from 'file:///C:/Users/ampoy/SubicLife/node_modules/playwright/index.mjs';
import { readFileSync, existsSync } from 'node:fs';

const D = 'C:/Users/ampoy/SubicLife/prototype';
const phones = ['welcome', 'signup', 'choose-tier', 'concierge', 'concierge-chat', 'me', 'me-bookings', 'me-payments', 'me-payment-methods', 'me-notifications', 'me-language', 'me-add-method'];
const flows = [...phones, 'index'];

// Static link check: every local href/src in Agent C's files must point at a file that exists.
const mine = [...flows, 'components-c'].map(n => n === 'components-c' ? null : n).filter(Boolean);
const missing = [];
let hashLinks = 0;
for (const n of mine) {
  const html = readFileSync(`${D}/${n}.html`, 'utf8');
  hashLinks += (html.match(/href="#"/g) || []).length;
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const u = m[1];
    if (!u || u.startsWith('#') || /^(https?:|mailto:|tel:|data:)/.test(u) || /['+]/.test(u)) continue;
    const file = u.split('#')[0].split('?')[0];
    if (!existsSync(`${D}/${file}`)) missing.push(`${n}.html -> ${u}`);
  }
}
console.log(`href="#" in Agent C files: ${hashLinks}`);
console.log(`missing local targets: ${missing.length ? missing.join(' | ') : 'none'}`);

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
let current = '';
const errs = {};
p.on('pageerror', e => { (errs[current] ||= []).push(`pageerror: ${e.message}`); });
p.on('console', m => { if (m.type() === 'error') (errs[current] ||= []).push(`console: ${m.text()}`); });

for (const n of phones) {
  current = n;
  await p.goto(`file:///${D}/${n}.html`, { waitUntil: 'load' });
  await p.waitForTimeout(700);
  const el = await p.$('.phone');
  await el.screenshot({ path: `${D}/shots/${n}.png` });
}

// Concierge topic variants: same page, different opener and subtitle.
for (const t of ['table', 'transfer', 'other']) {
  current = `concierge-chat?topic=${t}`;
  await p.goto(`file:///${D}/concierge-chat.html?topic=${t}`, { waitUntil: 'load' });
  await p.waitForTimeout(700);
  const el = await p.$('.phone');
  await el.screenshot({ path: `${D}/shots/concierge-chat-${t}.png` });
}

// Choose-tier states: the carousel opens on the requested card. Also check for horizontal page scroll.
const tierOverflow = {};
for (const t of ['premium', 'elite']) {
  current = `choose-tier?tier=${t}`;
  await p.goto(`file:///${D}/choose-tier.html?tier=${t}`, { waitUntil: 'load' });
  await p.waitForTimeout(700);
  const el = await p.$('.phone');
  await el.screenshot({ path: `${D}/shots/choose-tier-${t}.png` });
}
for (const t of ['prestige', 'premium', 'elite']) {
  await p.goto(`file:///${D}/choose-tier.html?tier=${t}`, { waitUntil: 'load' });
  await p.waitForTimeout(300);
  tierOverflow[t] = await p.evaluate(() => ({
    page: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    main: document.querySelector('.screen-scroll').scrollWidth - document.querySelector('.screen-scroll').clientWidth
  }));
}
console.log(`choose-tier horizontal overflow (px): ${JSON.stringify(tierOverflow)}`);

// Launcher is a plain page, not a phone: shoot it full page at phone width.
current = 'index';
const q = await b.newPage({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 2 });
q.on('pageerror', e => { (errs.index ||= []).push(`pageerror: ${e.message}`); });
q.on('console', m => { if (m.type() === 'error') (errs.index ||= []).push(`console: ${m.text()}`); });
await q.goto(`file:///${D}/index.html`, { waitUntil: 'load' });
await q.waitForTimeout(700);
await q.screenshot({ path: `${D}/shots/index.png`, fullPage: true });

await b.close();

// Font requests to fonts.googleapis.com fail offline; those are not page errors, so they are not listed.
for (const n of [...flows, "concierge-chat?topic=table", "concierge-chat?topic=transfer", "concierge-chat?topic=other", "choose-tier?tier=premium", "choose-tier?tier=elite"]) {
  const list = (errs[n] || []).filter(x => !/ERR_|Failed to load resource/.test(x) || !/fonts\.g/.test(x));
  console.log(`${n}: ${list.length ? list.join(' ; ') : 'no console errors'}`);
}
