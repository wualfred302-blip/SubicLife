import { chromium } from 'file:///C:/Users/ampoy/SubicLife/node_modules/playwright/index.mjs';
const D='C:/Users/ampoy/SubicLife/prototype';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
for(const n of ['explore','map']){await p.goto(`file:///${D}/${n}.html`);await p.waitForTimeout(2000);
const el=await p.$('.phone');await el.screenshot({path:`${D}/shots/${n}.png`});}
const cards=['card','card-premium','card-elite','card-staff','card-receipt','card-benefits','card-savings','card-none'];
for(const n of cards){await p.goto(`file:///${D}/${n}.html`);await p.waitForTimeout(1000);
const el=await p.$('.phone');await el.screenshot({path:`${D}/shots/${n}.png`});}
// Investor showcase has no phone frame: shoot the whole light page.
await p.goto(`file:///${D}/card-tiers.html`);await p.waitForTimeout(1000);
await p.screenshot({path:`${D}/shots/card-tiers.png`,fullPage:true});
const g=await b.newPage({viewport:{width:900,height:900}});await g.goto(`file:///${D}/components.html`);await g.waitForTimeout(2000);await g.screenshot({path:`${D}/shots/components.png`,fullPage:true});
await b.close();
