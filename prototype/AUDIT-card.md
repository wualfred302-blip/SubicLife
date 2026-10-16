# AUDIT-card

Visual audit of the Card section. Fixes below are the spec.

## G1. No figure/ground

The white QR panel sits on a white page, so the pass has no bottom edge. Rebuild c-pass as an Apple Wallet pass: the WHOLE pass is the tier color. The QR sits in a white 16px-radius tile (QR 168px, 12px padding), centered. Under the tile, the number "0042 1187" (15 medium, letter-spacing 2px, tabular-nums) and "Refreshes in 0:24" (13), both in white at 90% / 70% opacity (near-black on Premium). Pass shadow: 0 1px 0 rgba(0,0,0,.04), 0 12px 32px rgba(0,0,0,.16). Radius 20. Fixed height 440px.

## G2. Header inconsistency

Explore uses an iOS large title but Card uses a small centered title. Tab-root pages (card, card-elite, card-none) must use the same c-largetitle as explore.html: "Card" 34 bold on the left, and on the right a 32px round grey-fill (search-fill token) button with "more_horiz". c-navbar stays only for pushed pages (benefits, savings).

## G3. The fake QR looks fake

Use a real QR: load qrcode-generator from https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js and render "SUBICLIFE:00421187" as an SVG (error level M, cellSize so it fits 168px, margin 0) into every .c-qr via app.js. Delete the inline fake QR SVGs.

## G4. The wordmark is plain text

Make a c-wordmark: "Subic" weight 700 + ".Life" weight 400, 15px, letter-spacing -0.2px. The tier label is 11px, 600, letter-spacing .12em, uppercase.

## G5. Vertical rhythm is random, with dead space

Use only spacing tokens 8/12/16/20/24/32. Card home order: large title, 16, pass, 24, "Saved this year" row, 16, Wallet button. Nothing else.

## G6. The Wallet button competes with the pass

Make it secondary: auto width, 44px tall, black, 22px radius, centered, 15 semibold.

## P1. card.html (Prestige)

The pass background is the aerial photo covering the whole pass, with an overlay of linear navy (rgba(11,37,69,.35) top to rgba(11,37,69,.92) at 55%, solid below). Top row: wordmark + tier. 20px below: "Alfred Reyes" 22 semibold, "Member since 2024" 13 at 70%. Then the QR tile block anchored to the bottom (20px padding).

## P2. card-elite.html

Same structure. Background solid --tier-elite-bg. REMOVE the gold wave squiggle. Add a 1px inner border in gold at 35% opacity, inset 8px, radius 14. Tier label and a 24px gold hairline under the name, in gold.

## P3. card-none.html

Large title "Card". Hero: three full-size passes (same 350px width, 200px tall each, top part only, no QR), stacked with the back ones peeking 14px above the front. Order front to back: Prestige, Elite, Premium. Then 24 gap, "One pass for all of Subic Bay" 22 bold, body 15 grey, the 3 rows, "Choose your pass" primary, "I already have one" text button. Everything above the tab bar.

## P4. card-benefits.html

The nav title becomes "Benefits" (no duplicate "Prestige"). Header: mini pass 72x46 radius 6 (the real c-pass styling scaled down, not a crude thumbnail), "Prestige" 20 semibold, "Renews 12 Oct 2027" 13 grey. 32px above each section title, 8px below. "See Elite" in near-black semibold with a gold 8px dot before it (gold text fails contrast).

## P5. card-savings.html

Chart goes directly under the summary (24px gap), 112px tall, bars 16px wide, radius 4, a hairline baseline. Month initials 11px grey, 8px below the baseline. Remove the big empty gap.

## P6. card-staff.html

Real QR (G3) at 264px. The name block 32px below the nav. The progress line moves to just under the backup number (24px gap), 160px wide, centered, 3px tall, radius 2.

## P7. card-receipt.html

The dimmed background must use the new pass and large title. Receipt amounts 15 tabular, "You paid" row 17 bold. "Saved this year" line 13 grey, 16px above the button.

## Keep

- All colors via tokens. components.css hex count stays 0. Navigation links keep working. Explore and map pages unchanged except the shared tab bar.

## Acceptance (run and report numbers only)

1. `node C:/Users/ampoy/SubicLife/prototype/shoot.mjs` exits 0.
2. Hex check prints 0.
3. Playwright on card.html: print the .c-pass height (expect 440); confirm `.c-qr svg` exists and count its rect/path children (> 50); print the Wallet button width (< 300).
4. Playwright on card-none.html: print the "Choose your pass" button bottom (< tab bar top).
5. No `<svg` fake QR left: `grep -c "c-qr" *.html` count, and confirm the qrcode script tag is on the card pages.
