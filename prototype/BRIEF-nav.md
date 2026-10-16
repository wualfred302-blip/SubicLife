# Brief: fully navigable prototype (Opus → Haiku, 2026-10-12)

Goal: a clickable HTML app that looks and moves like a shipped native iOS app. It will be shown in a client meeting.
Load the `impeccable` skill. **This Opus spec wins over the skill.**

## Shared rules (all agents)
- Reuse `tokens.css`, `screen.css`, `components.css` and `app.js`. Read `explore.html` and `card.html` first and copy their page skeleton exactly: fonts, `.phone` frame, `c-statusbar`, `c-largetitle`, `c-tabbar`, `c-homeindicator`.
- **Do NOT edit `components.css`, `tokens.css` or `screen.css`.** Each agent puts new components in its own file (`components-a.css`, `components-b.css`, `components-c.css`), linked after `components.css`. Use only `var(--…)` tokens, no hex values. Keep the `c-` prefix.
- Brand orange is `--brand` / #E8590C via tokens. Radii: `--r-thumb` 10, `--r-control` 12, `--r-media` 16, `--r-pill`. Icons: Material Symbols Outlined, weight 300 (500 when active).
- **Tab bar on every tab-root screen**, 5 tabs, real links: Explore `explore.html`, Saved `saved.html`, Card `card.html`, Concierge `concierge.html`, Me `me.html`. Set `is-active` on the correct tab. Pushed (detail) screens have no tab bar; they have an iOS nav bar: back chevron + small centered title, and the back link goes to the real parent page.
- Every tappable thing links somewhere real. No `href="#"` left in files you touch. A modal or sheet is its own page, drawn over a dimmed copy of its parent.
- Native feel: 17px body, 34px large titles, 44px minimum tap targets, hairline separators, grouped inset lists like iOS Settings. No gradients on buttons, no emoji, no drop-shadow cards stacked everywhere, no "AI" sparkle look.
- Use real-looking Subic Bay data. Partners already used: Lighthouse Marina Resort, Ocean Adventure, Camayan Beach Resort, Meat Plus Cafe, Rama's Kitchen, Subic Bay Yacht Club. Member: Prestige, ID 00421187, "₱12,450 saved this year". Photos: same Unsplash style already in explore.html.
- Add a small page transition in your own CSS: pushed pages slide in from the right (`@keyframes` on `.phone` content, 250ms ease-out). Sheets slide up. Keep it subtle.
- Screenshots: write your own `shoot-<a|b|c>.mjs`, a copy of `shoot.mjs` that shoots only your pages into `shots/`. Run it with `node`. Fix anything broken you see, then reshoot.
- Don't commit to git. Don't touch files outside `SubicLife\prototype\`.

## Agent A — Explore, place, booking, Saved
New pages:
1. `place.html` — partner detail (Lighthouse Marina Resort). Full-bleed hero photo 300px with back + save + share circle buttons over it. Name, category · area, rating, "Prestige price" badge. Member offer card ("20% off rooms · Prestige"). Info rows (hours, address, phone) with icons. Small static map thumb linking `map.html`. Sticky bottom bar: price "₱7,360 / night ~~₱9,200~~" + orange "Book" button → `book.html`.
2. `book.html` — checkout pushed screen: dates row, guests stepper, room choice list (radio rows), price breakdown (rack rate, Prestige discount in `--accent-text`, total), payment method row "GCash" with chevron, orange full-width "Pay ₱7,360" button → `book-done.html`.
3. `book-done.html` — confirmation: large check, "You're booked", booking card with dates and code, "You saved ₱1,840", buttons "Add to Calendar" (secondary) and "Done" → `explore.html`. Note: "Show your card QR at check-in".
4. `search.html` — tapping the Explore search bar opens it: focused field + Cancel, recent searches, category rows. Results rows link `place.html`.
5. `category.html` — e.g. "Water sports" list from a chip: filter chips + list rows → `place.html`.
6. `saved.html` — Saved tab root: large title "Saved", segmented control (Places / Offers), list of saved places with thumbs → `place.html`. Also a simple empty-state variant `saved-empty.html`.
Wire `explore.html`: every place card and list row → `place.html`; search bar → `search.html`; chips → `category.html`; tab bar links; map button → `map.html`. Wire `map.html` pins/cards → `place.html` and its tab bar.

## Agent B — Pay at the counter + staff side + card fix
Flow (member): staff scan the card QR and enter the bill; the member's phone gets a pay request.
1. `pay-request.html` — sheet over a dimmed `card.html`: partner logo + "Meat Plus Cafe", "Table 7 · Bill from staff", bill ₱2,400 struck through → **₱1,920** big, line "Prestige 20% off · you save ₱480" in `--accent-text`, payment method row (GCash ›), orange "Pay with Face ID" button → `pay-faceid.html`, text button "Decline".
2. `pay-faceid.html` — same sheet with the iOS Face ID glyph centered in a rounded dark square, "Face ID" caption. Use a JS timeout of 1.2s to go to `pay-done.html`.
3. `pay-done.html` — full screen success: animated check, "Paid ₱1,920", "Meat Plus Cafe · today 7:42 PM", "You saved ₱480", receipt rows, "Done" → `card.html`, link "View receipt" → `card-receipt.html`.
4. On `card.html` add a demo-only small link under the hint: "Simulate staff scan" → `pay-request.html` (styled as quiet secondary text, so it's clear it's for the demo).
Staff side (a partner's phone, use the same frame, a plain light staff UI, title "Subic.Life Partner"):
5. `staff-scan.html` — camera viewfinder (dark photo placeholder) with a rounded scan frame and hint "Scan member card". Tap → `staff-bill.html`.
6. `staff-bill.html` — member found: "Ana Reyes · Prestige ✓ valid", big number keypad entering bill "₱2,400", shows "Member pays ₱1,920 (20% off)", orange "Send to member" → `staff-wait.html`.
7. `staff-wait.html` — "Waiting for Ana to approve…" spinner, amount, Cancel. Auto-advance after 2s → `staff-paid.html`.
8. `staff-paid.html` — big green "Paid ✓ ₱1,920", reference number, "New scan" → `staff-scan.html`.
Card fixes: in the Prestige card, make the "Subic.Life" wordmark readable over the light sky (stronger white + subtle text-shadow or darker navy overlay behind the top-left only). Replace every `href="#"` in card-*.html with a real page. Wire the card tab bar.

## Agent C — Concierge, Me, onboarding, launcher
1. `concierge.html` — Concierge tab root: large title, a short intro row "Your Prestige concierge · replies in ~5 min", quick-action grid of 4 (Book a table, Charter a yacht, Airport transfer, Something else), recent requests list (status pills: Confirmed / In progress) → `concierge-chat.html`.
2. `concierge-chat.html` — iMessage-style chat with concierge "Mika": a few bubbles booking a yacht for Saturday, a confirmation card inside the chat with "Pay ₱18,400" button → `book-done.html`. Composer bar at bottom with + and send.
3. `me.html` — Me tab root: profile header (avatar, Ana Reyes, Prestige member since 2025), grouped lists: Membership (My card → `card.html`, Benefits → `card-benefits.html`, Savings → `card-savings.html`, Upgrade to Elite → `card-tiers.html`), Activity (Bookings → `me-bookings.html`, Payments → `me-payments.html`), Settings (Notifications, Payment methods → `me-payment-methods.html`, Language, Help), "Sign out" → `welcome.html`.
4. `me-bookings.html`, `me-payments.html` (transaction list with savings per row, each row → `card-receipt.html`), `me-payment-methods.html` (GCash, Maya, Visa •• 4242, "Add method").
5. Onboarding: `welcome.html` (full-bleed bay photo, wordmark, "Members save across Subic Bay", "Get started" → `signup.html`, "I have an account" → `explore.html`), `signup.html` (phone number + OTP style), `choose-tier.html` (3 tier cards Premium ₱5,000 / Prestige ₱12,000 / Elite ₱25,000, Prestige marked "Most popular") → `card.html`.
6. `index.html` — rewrite as the prototype launcher: a clean light page listing every flow (Onboarding, Explore, Booking, Pay at counter, Staff app, Concierge, Me, Card variants) with links. Include Agent A and B's page names from this brief even if they don't exist yet.

## Round 3 — Agent D: the app itself, not a sitemap (owner feedback 2026-10-12)
Owner opened `index.html`, saw a list of screens (with broken "chevron_right" text) and said: I don't want this navigation-section view, I want the app. So:
1. Rename the current launcher `index.html` → `sitemap.html` (dev only; fix its icon font so chevrons render). Nothing in the app links to it.
2. New `index.html` = **the app**. Full browser window, background `var(--bg-canvas)` or a soft neutral, one centered iPhone (390×844, radius 55, thin dark bezel, subtle shadow) scaled down with CSS `transform: scale()` to fit window height on laptops. No headings, no lists, no labels around it. Nothing else on the page.
3. Inside the phone: an app shell that shows screens in an `<iframe>` (390×844, no border). It starts at `welcome.html`. All navigation happens inside the iframe, so the outer page never reloads.
4. Smooth native transitions with no white flash: the shell keeps two stacked iframes. On navigation, load the next page into the hidden one, wait for `load`, then slide it in (push: from right, 300ms, iOS ease `cubic-bezier(.2,.8,.2,1)`; back to a parent: slide out to right; sheets: rise from bottom; tab switch: no animation, instant swap). Decide the type from link rules: tab bar links = tab, links whose target ends in a sheet page (pay-request, pay-faceid, me-add-method, card-receipt) = sheet, back chevrons (`.c-navbar` back link or links marked `data-back`) = back, everything else = push. Intercept clicks from inside the iframe (same origin file:// may block — if so, have each page include a tiny `shell.js` that posts `{href, kind}` to `window.parent` via `postMessage` and calls `preventDefault`; when not inside the shell, `shell.js` does nothing and links work normally). Timed auto-advances (Face ID, staff wait) must go through the same mechanism.
5. Embedded mode: when a page is inside the shell, hide its own outer frame/background so only the screen shows (add `html.is-embedded` from `shell.js` and in a new `shell.css` neutralise `.phone` border, radius, shadow, margins, body background). Add `shell.js` + `shell.css` to every app page, including the card-*, pay-*, staff-*, me-*, concierge*, book*, place, search, category, saved*, map, explore, welcome, signup, choose-tier pages.
6. Keep the "Simulate staff scan" text link on card.html as is (the meeting needs it). No other demo labels in the app.
7. Staff app: separate `partner.html`, same shell, starts at `staff-scan.html`. Not linked from the member app.
8. Browser back button and Alt+Left should go back inside the app (use `history.pushState` in the shell).
Acceptance: open `index.html` in Edge-equivalent Playwright: only a phone is visible; click Get started → signup → … → Explore → a place → Book → Pay → Done, and Card → Simulate staff scan → Pay with Face ID → Paid → Done, with no outer reload. Write `shoot-d.mjs` that shoots `index.html` at 1440×900 at start, after one push, and mid-sheet, into `shots/shell-*.png`. No console errors.

## Round 4 — owner feedback 2026-10-12
"Explore needs to move, I need to click the posts, the map needs to be more sophisticated and partially working, Concierge looks like an afterthought. Remove the bezel; this will go on my Android phone."
Each agent: own CSS file and own new pages only, as listed. Shared files you may NOT edit unless listed: tokens.css, components.css, screen.css, data-a.js (read it, don't change it).

### Agent D — no bezel, real-phone ready, scrolling (shell.css, shell.js, index.html, partner.html)
1. Remove the device frame entirely: no bezel, no Dynamic Island, no outer edge.
2. Real phone (viewport width ≤ 500px or touch device): the app fills the screen, `100dvh` × `100vw`, iframe full-size, respects `env(safe-area-inset-*)`. Hide the fake `c-statusbar` and `c-homeindicator` inside embedded pages there (`html.is-embedded.is-device`), since Android draws its own. Every page's `.phone` must become `width:100%; height:100dvh` in that mode, not a fixed 390×844. Add `<meta name="theme-color">` = brand background and `viewport-fit=cover`.
3. Desktop: plain 390×844 screen centered on a neutral background, radius 0–24px, soft shadow, no device frame. Fake status bar stays on desktop.
4. Scrolling must work everywhere inside the shell: vertical page scroll with mouse wheel and touch, and every horizontal carousel/chip row drags with the mouse on desktop (pointer-drag-to-scroll in shell.js for elements with `overflow-x:auto`, click suppressed after a drag > 6px) and swipes on touch, with `scroll-snap` where the row has cards. Hide scrollbars. Check explore.html really scrolls to its bottom inside the shell.
5. Shots: index.html at 1440×900, and at 412×915 (Android size) with `hasTouch:true` — confirm no fake status bar there.

### Agent E — Explore that moves, clickable posts (explore.html, new post.html, offer.html, components-e.css, shoot-e.mjs)
1. Explore becomes a rich, long scrolling feed (still the locked 01-exHome look at the top): hero search, chips, member strip, "Near you" carousel, then new sections: "This week in Subic" (event/post cards, 3–5, horizontal), "Member offers" (offer tiles, horizontal), "Stories from members" (vertical feed of 3–4 post cards: author avatar + name, place tag, photo, short caption, like count + comment count), "Popular with members" list. Use the local img/ photos already used in the project; vary them.
2. Every card is tappable: places → `place.html?p=`, events/stories → `post.html?id=`, offers → `offer.html?id=`. Put the post/offer data in a new `data-e.js`.
3. `post.html`: pushed screen, big photo (swipeable image carousel of 2–3 photos with dots), author row, caption, place card linking `place.html?p=`, like button that toggles (heart fills orange, count +1), a few comments, "Add a comment" field.
4. `offer.html`: pushed screen, hero photo, offer title, "Prestige · 20% off", terms list, valid dates, partner card, primary button "Show card" → card.html (or "Book" → book.html?p= when bookable).
5. Chips scroll horizontally and filter the feed sections live (Hotels / Food / Beaches / Water sports / Nightlife), active chip state.

### Agent F — sophisticated, partly working map (map.html, components-f.css, map-data.js, shoot-f.mjs)
1. Real interactive map with Leaflet 1.9.4 from cdnjs (`https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js` + css), CARTO light tiles (`https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`, attribution required), centered on Subic Bay Freeport (14.80, 120.28), zoom 14. Pan and pinch/scroll zoom work. If tiles fail offline, the old static map image stays as a fallback.
2. Custom pins as HTML divIcons in the existing pill style: orange pill with icon + discount ("20%"), selected pin scales up and turns dark. Put real-ish coordinates for all 6 partners plus 6–8 more in `map-data.js` (beaches, nightlife, nature), each with category.
3. Overlay UI stays native: floating search bar, category chips that filter pins live, locate-me button (animates to a fake "you are here" blue dot near Harbor Point), layers button toggling a satellite-ish style (CARTO voyager is fine).
4. Bottom: a swipeable horizontal card carousel synced with pins (tap pin → carousel scrolls to its card; swipe carousel → map flies to that pin). Cards: photo, name, offer, distance, "View" → `place.html?p=` (or a generic place if not in data-a.js — then link the nearest existing one), "Directions" → Google Maps URL with coordinates.
5. A list/map toggle top-right that slides up a sheet list of the visible partners sorted by distance.

### Agent G — Concierge that feels premium (concierge.html, concierge-chat.html, new concierge-request.html, concierge-trip.html, components-g.css, data-g.js, shoot-g.mjs)
Make it the most premium tab in the app, not a form.
1. `concierge.html`: large title, then a concierge hero card: Mika's photo (use an img/ portrait or a neutral avatar), "Mika · your Prestige concierge", green "Online · replies in ~5 min", buttons "Message" → chat and "Call" (tel: link). Then a big "What can we arrange?" tappable field → chat. Then "Experiences" horizontal photo tiles (Yacht charter, Private dining, Island hopping, Golf at Subic, Spa day, Airport transfer), each → `concierge-request.html?type=`. Then "Your trip" timeline card (Sat 17 Oct: check-in Lighthouse, 7 PM dinner Rama's, Sun yacht 10:00) → `concierge-trip.html`. Then "Requests" list with status pills → chat.
2. `concierge-request.html?type=`: pushed screen with photo header for that experience, short description, a native form (date picker row, time row, guests stepper, notes field), "From ₱X · Prestige price" line, orange "Send request" → chat with that topic, where Mika's scripted reply appears after a typing indicator.
3. `concierge-chat.html`: real-feeling chat: typing indicator (3 dots) before every scripted Mika reply (1–1.5s), quick-reply chips above the composer that send a message, your own sent messages appear instantly with "Delivered", in-chat rich cards (booking confirmation with Pay button → book-done.html, a place card → place.html?p=). Keep ?topic= support.
4. `concierge-trip.html`: itinerary day-by-day timeline with times, icons, place thumbnails, each item tappable to its place/booking, "Add to calendar".

## Acceptance (each agent)
- All your pages open in Chrome with no console errors and no broken links.
- Run: `grep -n 'href="#"' <your files>` → no results.
- Your `shots/*.png` exist and look like a real iOS app at 390×844.
- Reply with: list of files created/changed, and anything you could not do.
