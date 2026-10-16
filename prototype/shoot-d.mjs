import { chromium } from 'file:///C:/Users/ampoy/SubicLife/node_modules/playwright/index.mjs';

const D = 'C:/Users/ampoy/SubicLife/prototype';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });

const frameOf = (name) => p.frames().find((f) => f.url().endsWith('/' + name));
async function waitFrame(name) {
  for (let i = 0; i < 100; i++) {
    const f = frameOf(name);
    if (f) { await f.waitForLoadState('load').catch(() => {}); return f; }
    await p.waitForTimeout(100);
  }
  throw new Error('frame never loaded: ' + name);
}

// 1. Start: only the phone is on the page.
await p.goto(`file:///${D}/index.html`);
await p.waitForTimeout(1500);
await p.screenshot({ path: `${D}/shots/shell-start.png` });

// 2. After one push: Get started -> signup.
const welcome = await waitFrame('welcome.html');
await welcome.click('a[href="signup.html"]');
await waitFrame('signup.html');
await p.waitForTimeout(600);
await p.screenshot({ path: `${D}/shots/shell-push.png` });

// 3. Mid-sheet: signup -> choose tier -> card -> Simulate staff scan, shot while the sheet rises.
await (await waitFrame('signup.html')).click('a[href="choose-tier.html"]');
await waitFrame('choose-tier.html');
await p.waitForTimeout(600);
await (await waitFrame('choose-tier.html')).click('a#go');
await waitFrame('card.html');
await p.waitForTimeout(600);
await (await waitFrame('card.html')).click('a.c-demo-link');
await waitFrame('pay-request.html');
await p.waitForTimeout(120);
await p.screenshot({ path: `${D}/shots/shell-sheet.png` });
await p.waitForTimeout(600);
await p.screenshot({ path: `${D}/shots/shell-sheet-done.png` });

await b.close();
console.log('shots written: shell-start.png, shell-push.png, shell-sheet.png, shell-sheet-done.png');
