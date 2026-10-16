# AUDIT-explore-map

Consistency pass on Explore and Map, aligned to the approved Card section. Items below are the spec, verbatim from the planner audit.

## Shared system: define once in tokens.css and components.css, then use everywhere

## S1. Radii, one scale only

Radii, one scale only: --r-thumb 10px (list thumbnails), --r-media 16px (carousel photos, place-card photo, sheets, cards, map place card), --r-control 12px (buttons, search, inputs), --r-pill 999px (chips, pins). Remove 24px photo radii and any other radius values.

## S2. Buttons

Buttons: one c-btn, 48px tall, radius --r-control, 16 semibold. Variants:
- .primary: orange fill, white text
- .secondary: search-fill grey, near-black text
- .plain: text only

The map place card's Directions/View place, Card's "Show to staff", receipt "Done" and card-none's "Choose your pass" all use it. Apple Wallet keeps its own black style but is also 48px.

## S3. Search

Search: one c-search, 40px tall, radius --r-control, search-fill, 16px icon, 15 text. Explore and map use the identical component; map adds only the trailing clear X.

## S4. List row

List row: one c-list-row, min-height 64:
- leading: a 48px thumbnail (--r-thumb) or a 24px outline icon in a 48px slot
- title 15 semibold near-black, subtitle 13 grey (one line, ellipsis)
- trailing: value (15 semibold) or orange offer (13 semibold) or text action, then an optional chevron
- hairline between rows, inset to start at the text column

Use it for Explore "Popular with members", Card benefits rows, savings history rows and the map list. Remove the per-page row variants.

## S5. Section rhythm

Section rhythm: section title 20 semibold, 32px above, 12px below. No hairlines between sections, only inside lists. Remove the hairlines under the Explore chip row and above "Popular with members".

## S6. Orange discipline

Orange discipline: orange is used only for the primary button, the active tab, the selected pin, and member-offer text ("Members 20% off", "15% off"). The "Map" link and "Book" become near-black 15 semibold text links. "See Elite" keeps the gold dot.

## S7. Tab bar

Tab bar: identical on every page. 24px icons weight 300. Labels 11px 500, inactive #8E8E93 token, active orange. The active icon is filled, the same treatment for every tab. Fix the Explore active icon, which currently renders as a solid orange disc: use the "explore" symbol filled, at 24px, not a circle background.

## S8. Large title

Large title: Explore and Card share the exact same c-largetitle (34 bold, 20 gutter, same top offset). The right-side slot is always 32px: avatar on Explore, "..." on Card.

## Explore page

## E1. Membership presence

Membership presence: directly under the chip row (24px), add a compact c-member-strip, 64px tall. It's a plain row with:
- left: a 56x35 mini c-mcard of the member's tier (Prestige)
- text: "Prestige member" 15 semibold, with "₱12,450 saved this year" 13 grey under it
- right: a chevron

Tap goes to card.html. No box, hairline under it.

## E2. Near you carousel

Near you carousel: photos at 3:4, 168px wide, radius --r-media, 12px gap, starting at the 20px gutter. Text under each photo: name 15 semibold, meta 13 grey, offer 13 semibold orange. Each line 4px apart.

## E3. Popular with members

Popular with members uses c-list-row with thumbnails and an orange offer trailing.

## Map page

## M1. Top bar

The top bar uses the same c-search (S3). The "List" button becomes a 40px square secondary icon button ("format_list_bulleted"), matching the map controls' style.

## M2. Map controls

Map controls: a white 44px-wide stack, radius --r-control, hairline border, the same shadow token as the place card.

## M3. Place card

Place card: radius --r-media, 16px padding, a 72px photo (--r-thumb), title 17 semibold, meta 13 grey, offer 13 semibold orange, open status 13 (green "Open" + grey "· closes 23:00"). Buttons per S2 side by side, 12px gap. Page dots 12px below.

## M4. Pins

Pins: keep them, but use the same orange token and pill radius as chips.

## Card (approved last round; apply these three planner notes too)

## C1. Prestige silver foil

Prestige silver foil is too weak and reads as flat grey. Raise the foil contrast: linear-gradient(135deg, #FFFFFF, #B8C2CE 40%, #FFFFFF 52%, #8E99A6), plus a subtle text-shadow 0 1px 1px rgba(0,0,0,.35) on a wrapper for legibility.

## C2. Premium presence

Premium needs presence: a 1px inner edge in warm taupe rgba(120,100,70,.18), plus a fine 1px hairline rule under the wordmark row in the same color.

## C3. Card tab rhythm

Card tab rhythm: card, 8px, hint, 24px, Saved row, 16px, Show to staff, 12px, Wallet. Remove the extra space above the Saved row.

## Acceptance (report numbers only)

## A1. Build and hex check

1. shoot.mjs exits 0, and the hex check on components.css prints 0.

## A2. Computed values

2. Playwright prints computed values:
  - (a) c-search height on explore.html and on map.html (both 40)
  - (b) border-radius of the first Near-you photo (16px) and of the map place-card photo (10px)
  - (c) height of the map "View place" button and of card.html "Show to staff" (both 48)
  - (d) color of the explore "Map" link (near-black, not orange)
  - (e) the explore active tab icon's background-color (transparent)
  - (f) c-member-strip exists on explore.html, and its href is card.html

## A3. List row usage

3. `grep -c "c-list-row" explore.html card-benefits.html card-savings.html`: each count is greater than 0.

Report the changed files with line counts. Don't judge the visuals; the planner reviews the screenshots.
