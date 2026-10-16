// shoot-e.mjs - Agent E. Shots and checks for explore.html, post.html, offer.html.
// Part 1: each page standalone at 390x844 (explore top, middle, bottom, Food filter; post; offer), with the
// like, comment and filter checks. Part 2: the same flow inside index.html's app shell, through window.subicNav
// called inside the visible iframe. Writes shots into shots/e-*.png and prints one JSON summary.
import { chromium } from 'file:///C:/Users/ampoy/SubicLife/node_modules/playwright/index.mjs';

const D = 'C:/Users/ampoy/SubicLife/prototype';
const SHOTS = `${D}/shots`;
const errors = [];
const result = {};
const isFontNoise = (u) => /fonts\.(googleapis|gstatic)\.com/.test(u);

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
let current = '';
p.on('console', (m) => { if (m.type() === 'error') errors.push(`[${current}] console: ${m.text()}`); });
p.on('pageerror', (e) => errors.push(`[${current}] pageerror: ${e.message}`));
p.on('requestfailed', (r) => { if (!isFontNoise(r.url())) errors.push(`[${current}] requestfailed: ${r.url().slice(0, 100)}`); });

const open = async (file, query = '') => {
  current = file + query;
  await p.goto(`file:///${D}/${file}.html${query}`, { waitUntil: 'load' });
  await p.waitForTimeout(700);
};
const phone = () => p.$('.phone');
const scrollMain = (sel, y) => p.evaluate(([s, v]) => {
  const m = document.querySelector(s);
  m.scrollTop = v === 'end' ? m.scrollHeight : v;
}, [sel, y]);

// ---------- Part 1: standalone pages ----------
await open('explore');
result.exploreSections = await p.evaluate(() => document.querySelectorAll('[data-section]').length);
result.exploreEvents = await p.evaluate(() => document.querySelectorAll('#feed-events > a').length);
result.exploreOffers = await p.evaluate(() => document.querySelectorAll('#feed-offers > a').length);
result.exploreStories = await p.evaluate(() => document.querySelectorAll('#feed-stories > a').length);
result.explorePopular = await p.evaluate(() => document.querySelectorAll('#feed-popular > a').length);
await (await phone()).screenshot({ path: `${SHOTS}/e-explore-1.png` });
await scrollMain('main', 900);
await p.waitForTimeout(200);
await (await phone()).screenshot({ path: `${SHOTS}/e-explore-2.png` });
await scrollMain('main', 'end');
await p.waitForTimeout(200);
result.exploreBottom = await p.evaluate(() => {
  const m = document.querySelector('main');
  return { top: m.scrollTop, max: m.scrollHeight - m.clientHeight };
});
await (await phone()).screenshot({ path: `${SHOTS}/e-explore-3-bottom.png` });

await scrollMain('main', 0);
await p.click('[data-filter="food"]');
await p.waitForTimeout(400);
result.foodVisibleCards = await p.evaluate(() => document.querySelectorAll('[data-cats]:not([hidden])').length);
result.foodSectionsShown = await p.evaluate(() => [...document.querySelectorAll('[data-section]')].filter(s => !s.hidden).map(s => s.dataset.section));
await (await phone()).screenshot({ path: `${SHOTS}/e-explore-filter-food.png` });
await p.click('[data-filter="all"]');

await open('post', '?id=camayan-sunrise');
result.postPhotos = await p.evaluate(() => document.querySelectorAll('.c-pager__slide').length);
await (await phone()).screenshot({ path: `${SHOTS}/e-post-camayan.png` });
await p.click('#like');
await p.waitForTimeout(100);
result.likeAfterOne = await p.textContent('#like-count');
result.likeIsOrange = await p.evaluate(() => getComputedStyle(document.querySelector('#like .material-symbols-outlined')).color);
await p.click('#like');
result.likeAfterTwo = await p.textContent('#like-count');
await p.click('#like');
await scrollMain('#post-main', 'end');
await p.fill('#comment-input', 'Booked the garden side. See you there.');
await p.click('#comment-send');
await p.waitForTimeout(150);
result.commentCountAfterPost = await p.textContent('#comment-count');
await (await phone()).screenshot({ path: `${SHOTS}/e-post-camayan-comments.png` });

await open('post', '?id=sunset-sail');
result.eventTitle = await p.textContent('#nav-title');
await (await phone()).screenshot({ path: `${SHOTS}/e-post-event.png` });

await open('offer', '?id=lighthouse-rooms');
result.offerCta = await p.textContent('#cta');
await (await phone()).screenshot({ path: `${SHOTS}/e-offer-lighthouse.png` });

await open('offer', '?id=meatplus-bill');
result.offerCtaNoBook = await p.textContent('#cta');
await scrollMain('#offer-main', 'end');
await p.waitForTimeout(200);
await (await phone()).screenshot({ path: `${SHOTS}/e-offer-meatplus-bottom.png` });

// ---------- Part 2: inside the app shell ----------
current = 'shell';
await p.goto(`file:///${D}/index.html`, { waitUntil: 'load' });
await p.waitForTimeout(1500);

// The shell stacks two iframes; the one on screen is the one not hidden.
const visibleFrame = async () => {
  const handles = await p.$$('iframe');
  for (const h of handles) {
    const vis = await h.evaluate((e) => getComputedStyle(e).visibility);
    if (vis !== 'hidden') return h.contentFrame();
  }
  return null;
};

const shell = {};
let fr = await visibleFrame();
await fr.evaluate(() => window.subicNav('explore.html', 'tab'));
await p.waitForTimeout(1500);
fr = await visibleFrame();
shell.afterTab = fr.url().split('/').pop();
await p.screenshot({ path: `${SHOTS}/e-shell-explore.png` });

await fr.click('[data-filter="water-sports"]');
await p.waitForTimeout(400);
shell.waterCards = await fr.evaluate(() => document.querySelectorAll('[data-cats]:not([hidden])').length);
await fr.click('[data-filter="all"]');
await p.waitForTimeout(300);

await fr.evaluate(() => { const m = document.querySelector('main'); m.scrollTop = m.scrollHeight; });
await p.waitForTimeout(300);
shell.scrollBottom = await fr.evaluate(() => {
  const m = document.querySelector('main');
  return { top: Math.round(m.scrollTop), max: Math.round(m.scrollHeight - m.clientHeight) };
});
await p.screenshot({ path: `${SHOTS}/e-shell-explore-bottom.png` });

await fr.evaluate(() => { document.querySelector('main').scrollTop = 0; });
await fr.click('#feed-stories > .c-post');
await p.waitForTimeout(1500);
fr = await visibleFrame();
shell.afterStory = fr.url().split('/').pop();
await fr.click('#like');
shell.likeInShell = await fr.textContent('#like-count');
await p.screenshot({ path: `${SHOTS}/e-shell-post.png` });
await fr.click('.c-navbar__back');
await p.waitForTimeout(1500);
fr = await visibleFrame();
shell.afterBack = fr.url().split('/').pop();

await fr.click('#feed-offers > .c-offer-tile');
await p.waitForTimeout(1500);
fr = await visibleFrame();
shell.afterOffer = fr.url().split('/').pop();
await fr.click('#cta a');
await p.waitForTimeout(1500);
fr = await visibleFrame();
shell.afterCta = fr.url().split('/').pop();

result.shell = shell;
await b.close();

const hrefHash = [];
result.errors = errors.length ? errors : 'no console errors, no failed requests (font CDN noise excluded)';
console.log(JSON.stringify(result, null, 2));
