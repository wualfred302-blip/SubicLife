// data-g.js - concierge data for the prototype. Read by concierge, concierge-request, concierge-chat and
// concierge-trip. Prices are demo pesos. Partner names and member prices match data-a.js where a partner is named.
(function () {
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function peso(n) { return '₱' + n.toLocaleString('en-US'); }
  function guestsWord(g) { return g === 1 ? '1 guest' : g + ' guests'; }

  // "2026-10-17" -> "Sat 17 Oct". Built from parts so the time zone cannot shift the day.
  function fmtDate(iso) {
    var p = String(iso).split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return DAYS[d.getDay()] + ' ' + (+p[2]) + ' ' + MONTHS[+p[1] - 1];
  }

  // "19:00" -> "7:00 PM"
  function fmtTime(hm) {
    var p = String(hm).split(':');
    var h = +p[0];
    return (h % 12 || 12) + ':' + p[1] + ' ' + (h >= 12 ? 'PM' : 'AM');
  }

  function laBanca(hours, start, guests, date, where) {
    var boat = 5000 * hours, fee = 2000, off = Math.round((boat + fee) * 0.1);
    var end = (Number(start.slice(0, 2)) + hours) + start.slice(2);
    return {
      title: (where ? 'Island hopping' : 'Yacht charter') + ', La Banca 40 ft',
      sub: fmtDate(date) + ' · ' + fmtTime(start) + ' to ' + fmtTime(end) + (where ? ' · ' + where : ' · Captain on board'),
      lines: [['40 ft yacht, ' + hours + ' hours', boat], ['Terminal fee', fee], ['Prestige 10% off', -off]], total: boat + fee - off,
      href: 'book-done.html?p=labanca&room=0&h=' + hours + '&d=' + date + '&t=' + start.replace(':', '') + '&a=' + guests
    };
  }

  var MIKA = {
    name: 'Mika',
    role: 'Your Prestige concierge',
    status: 'Online · replies in ~5 min',
    phone: '+63 47 252 0800',
    phoneHref: 'tel:+63472520800'
  };

  // Experiences: the tiles on concierge.html and the request form. `reply` is what Mika sends after a request,
  // in order: text steps, then a booking card (`card`) or a partner place card (`place`). `lines(guests)` gives the receipt.
  var ORDER = ['yacht', 'island', 'cruise', 'dining', 'hotel', 'parks', 'jetski', 'spa', 'golf', 'transfer'];
  var EXPERIENCES = {
    yacht: {
      title: 'Yacht charter', icon: 'sailing', img: 'img/hist-sailing-club.jpg', href: 'place.html?p=labanca',
      desc: 'A private 40 ft yacht from La Banca Cruises, by the hour from WV Docks. Bring your own food and drinks. Mika confirms the captain, the route and the boarding point.',
      price: 10800, priceNote: '', max: 25, guests: 6, time: '10:00',
      opener: 'Hi Ana, Mika here. Tell me the date, the start time and how many of you are sailing.',
      bookTitle: 'Yacht charter, La Banca 40 ft',
      // La Banca's rate: ₱5,000 an hour (2 hours minimum) plus a one-time ₱2,000 terminal fee.
      lines: function () { return laBanca(3, '10:00', 0, '2026-10-17').lines; },
      card: function (g, date, time) { return laBanca(3, time, g, date); },
      reply: [
        { t: 'Thank you, Ana. La Banca has a 40 ft yacht for {guests} on {date} at {time}, for 3 hours.' },
        { card: true, quick: ['Pay now', 'Change the time'] }
      ]
    },
    dining: {
      title: 'Private dining', icon: 'dinner_dining', img: 'img/pass-subic-bay.jpg', href: 'place.html?p=sands', realImg: 'img/real/sands/sands-01.jpg',
      desc: 'A table at Sands Resto-Grill, on the beach at Lighthouse Marina Resort. Mika reserves it and tells the kitchen about any dietary needs.',
      price: 1800, priceNote: 'per guest', max: 12, guests: 2, time: '19:00',
      opener: 'Hi Ana, Mika here. How many guests, which evening, and any dietary needs I should pass on?',
      bookTitle: 'Private dining, Sands Resto-Grill',
      lines: function (g) { return [['Set dinner, ' + guestsWord(g), 1800 * g]]; },
      reply: [
        { t: 'I have a table at Sands Resto-Grill for {guests} on {date} at {time}.' },
        { place: 'sands', quick: ['Book it', 'Something else'] }
      ]
    },
    island: {
      title: 'Island hopping', icon: 'directions_boat', img: 'img/pass-subic-bay.jpg', realImg: 'img/real/concierge/island-01.jpg',
      desc: 'A private La Banca yacht to the coves north of Subic: Silanguin, Nagsasa, Anawangin or Capones Island. Swim and snorkel at each stop; bring your own food and drinks.',
      price: 28800, priceNote: '', max: 25, guests: 6, time: '08:00',
      opener: 'Hi Ana, Mika here. Which coves would you like to see, and how many are coming?',
      bookTitle: 'Island hopping, La Banca 40 ft',
      lines: function () { return laBanca(8, '08:00', 0, '2026-10-17', 'Anawangin and Nagsasa').lines; },
      card: function (g, date, time) { return laBanca(8, time, g, date, 'Anawangin and Nagsasa'); },
      reply: [
        { t: 'Thank you, Ana. La Banca can take {guests} to Anawangin and Nagsasa on {date}, leaving at {time} and back by late afternoon.' },
        { card: true, quick: ['Pay now', 'Change the time'] }
      ]
    },
    cruise: {
      title: 'Bay cruise', icon: 'sailing', img: 'img/sailing-bay.jpg', realImg: 'img/real/concierge/cruise-02.jpg',
      desc: 'The Subic Bay Yacht Club\'s all-inclusive cruise: 2 hours on the bay for up to 20 guests, with a waiter on board and food and drinks arranged ahead.',
      price: 30000, priceNote: '', max: 20, guests: 10, time: '16:00',
      opener: 'Hi Ana, Mika here. The Yacht Club\'s bay cruise is 2 hours for up to 20 guests, with a waiter and food and drinks arranged ahead. Which day, and how many?',
      bookTitle: 'Bay cruise, Subic Bay Yacht Club',
      lines: function () { return [['All-inclusive cruise, 2 hours', 30000]]; },
      reply: [
        { t: 'I have asked the Yacht Club for {date} at {time} for {guests}. The package is ₱30,000 for the boat. I will confirm here as soon as they reply.' },
        { place: 'yacht', quick: ['Thank you, Mika', 'Change the time'] }
      ]
    },
    hotel: {
      title: 'Hotel stay', icon: 'hotel', img: 'img/place-lighthouse.jpg', href: 'place.html?p=lighthouse', realImg: 'img/real/lighthouse/lighthouse-03.jpg',
      desc: 'A room at Lighthouse Marina Resort on the bay, 20% off with your card. Mika books the room and any early check-in.',
      price: 5920, priceNote: 'per night', max: 4, guests: 2, time: '14:00',
      opener: 'Hi Ana, Mika here. Which nights, how many guests, and would you like a sea view?',
      bookTitle: 'Hotel stay, Lighthouse Marina Resort',
      lines: function () { return [['Deluxe Bay View, 1 night', 7360]]; },
      reply: [
        { t: 'Lighthouse Marina Resort has a Deluxe Bay View for {guests} from {date}, ₱7,360 a night with your 20% off.' },
        { place: 'lighthouse', quick: ['Book it', 'Something else'] }
      ]
    },
    parks: {
      title: 'Theme parks', icon: 'attractions', img: 'img/card-ocean.jpg', href: 'place.html?p=ocean',
      desc: 'Tickets to Ocean Adventure or Zoobic Safari at the member price. Mika sends the QR tickets to your phone.',
      price: 805, priceNote: 'per adult', max: 12, guests: 2, time: '09:00',
      opener: 'Hi Ana, Mika here. Ocean Adventure or Zoobic Safari, and how many tickets?',
      bookTitle: 'Theme park tickets',
      lines: function (g) { return [['Ocean Adventure day pass, ' + guestsWord(g), 807 * g]]; },
      reply: [
        { t: 'Ocean Adventure has day passes for {guests} on {date}, ₱807 each with your 15% off.' },
        { place: 'ocean', quick: ['Book it', 'Zoobic Safari instead'] }
      ]
    },
    jetski: {
      title: 'Jet skis', icon: 'surfing', img: 'img/pass-subic-bay.jpg', href: 'place.html?p=networx', realImg: 'img/real/networx/networx-07.jpg',
      desc: 'Jet skis from NetWorX Jetsports on the bay, by the half hour or the hour, 10% off with your card.',
      price: 2340, priceNote: 'per 30 minutes', max: 6, guests: 2, time: '10:00',
      opener: 'Hi Ana, Mika here. How many jet skis, and for 30 minutes or an hour?',
      bookTitle: 'Jet skis, NetWorX Jetsports',
      lines: function () { return [['Jet ski, 30 minutes', 2340]]; },
      reply: [
        { t: 'NetWorX has jet skis free on {date} at {time}: ₱2,340 for 30 minutes or ₱3,870 for an hour, with your 10% off.' },
        { place: 'networx', quick: ['Book it', 'Something else'] }
      ]
    },
    golf: {
      title: 'Golf at Subic', icon: 'golf_course', img: 'img/place-lighthouse.jpg', realImg: 'img/real/concierge/golf-01.jpg',
      desc: 'Tee times at a Subic Bay course, with a cart on request. Mika books the time and sends the course details.',
      price: 4050, priceNote: 'per player', max: 4, guests: 2, time: '07:00',
      opener: 'Hi Ana, Mika here. Which day, what time, and how many players?',
      bookTitle: 'Golf at Subic',
      lines: function (g) { return [['Green fee, ' + guestsWord(g), 4050 * g]]; },
      reply: [
        { t: 'I can book a tee time for {guests} on {date} at {time}.' },
        { card: true, quick: ['Pay now', 'Change the time'] }
      ]
    },
    spa: {
      title: 'Spa day', icon: 'spa', img: 'img/hist-lighthouse-oct.jpg', realImg: 'img/real/concierge/spa-01.jpg',
      desc: 'A 60-minute massage at Camayan Beach Resort. Choose a time and Mika books the room and the therapist.',
      price: 2520, priceNote: 'per guest', max: 2, guests: 1, time: '15:00',
      opener: 'Hi Ana, Mika here. Is it just you, and what time suits you?',
      bookTitle: 'Spa day, Camayan Beach Resort',
      lines: function (g) { return [['60 min massage, ' + guestsWord(g), 2520 * g]]; },
      reply: [
        { t: 'Camayan has room for {guests} on {date} at {time}.' },
        { card: true, quick: ['Pay now', 'Change the time'] }
      ]
    },
    transfer: {
      title: 'Airport transfer', icon: 'airport_shuttle', img: 'img/card-lighthouse.jpg', realImg: 'img/real/concierge/transfer-01.jpg',
      desc: 'A private van from Clark airport to Subic Bay. The driver meets you at arrivals. Add your flight number in the notes.',
      price: 2400, priceNote: '', max: 6, guests: 2, time: '14:00',
      opener: 'Hi Ana, Mika here. Where are you flying in, and how many are travelling?',
      bookTitle: 'Airport transfer, Clark to Subic',
      lines: function () { return [['Private van, Clark to Subic', 2400]]; },
      reply: [
        { t: 'Your driver will meet {guests} at Clark arrivals on {date} at {time}.' },
        { card: true, quick: ['Pay now', 'Change the time'] }
      ]
    }
  };

  // Booking card for an experience: title, sub, receipt lines and total.
  function bookingFor(type, guests, date, time) {
    var e = EXPERIENCES[type];
    if (e.card) return e.card(guests, date, time);
    var lines = e.lines(guests);
    var total = 0;
    lines.forEach(function (l) { total += l[1]; });
    return { title: e.bookTitle, sub: fmtDate(date) + ' · ' + fmtTime(time), lines: lines, total: total };
  }

  var GLOBAL_RULES = [
    { match: /thank/i, steps: [{ t: 'Anytime, Ana. I will message you if anything changes.' }] },
    { match: /change|another|different|later|instead/i, steps: [{ t: 'Of course. What time would you like instead?', quick: ['10:00 AM', '2:00 PM', '4:00 PM'] }] },
    { match: /\d{1,2}(:\d{2})?\s?(am|pm)/i, steps: [{ t: 'Done. I have moved it and told the captain the new time.', quick: ['Thank you, Mika'] }] },
    { match: /pay|book it|yes|confirm/i, steps: [{ t: 'Great. The booking is held for you. Pay when you are ready and it is locked in.', quick: ['Thank you, Mika'] }] }
  ];
  var FALLBACK = [{ t: 'Noted, Ana. I am checking that now and I will come back to you shortly.', quick: ['Thank you, Mika'] }];

  var HISTORY = [
    { k: 'in', t: 'Hi Ana, this is Mika. What can I arrange for you today?' },
    { k: 'out', t: 'A yacht for Saturday, please. Six of us, about three hours, from Subic Bay.' },
    { k: 'in', t: 'Saturday works. La Banca has a 40 ft yacht with a captain from 10:00 to 13:00.' },
    { k: 'out', t: 'Perfect. Please book it.' },
    { k: 'in', t: 'Booked. Your confirmation is below. Pay to lock the boat.' },
    Object.assign({ k: 'book' }, laBanca(3, '10:00', 6, '2026-10-17'))
  ];

  var CHAT_TOPICS = {
    ongoing: {
      sub: 'Prestige concierge · replies in ~5 min',
      history: HISTORY,
      quick: ['Thank you, Mika', 'Change the time']
    },
    yacht: {
      sub: 'Yacht charter · replies in ~5 min',
      history: HISTORY,
      quick: ['Thank you, Mika', 'Change the time']
    },
    table: {
      sub: 'Table booking · replies in ~5 min',
      opener: 'Hi Ana, Mika here. Which restaurant or hotel would you like, for how many, and when?',
      quick: ['Sands Resto-Grill', 'Meat Plus Cafe', 'Any restaurant'],
      rules: [
        { match: /sands/i, steps: [
          { t: 'Sands Resto-Grill has a table for two at 7:30 PM on Friday. Here it is.' },
          { place: 'sands', quick: ['Book it', 'Something else'] }
        ] },
        { match: /meat/i, steps: [{ t: 'Meat Plus Cafe is open until 11:00 PM. For how many, and what time?', quick: ['2 guests', '4 guests', '6 guests'] }] }
      ]
    },
    island: {
      sub: 'Island hopping',
      opener: EXPERIENCES.island.opener,
      quick: ['Anawangin and Nagsasa', 'Silanguin Cove', 'Capones Island', 'Suggest one'],
      rules: [
        { match: /anawangin|nagsasa|suggest/i, steps: [
          { t: 'Anawangin and Nagsasa are the two pine-lined coves, about 3 hours north. It is a full day: we leave at 8:00 and you are back by 4:00.' },
          { book: laBanca(8, '08:00', 6, '2026-10-24', 'Anawangin and Nagsasa'), quick: ['Pay now', 'Change the time'] }
        ] },
        { match: /silanguin/i, steps: [
          { t: 'Silanguin is the closest quiet cove, about 2 hours out. Six hours gives you time to swim and snorkel there.' },
          { book: laBanca(6, '08:00', 6, '2026-10-24', 'Silanguin Cove'), quick: ['Pay now', 'Change the time'] }
        ] },
        { match: /capones/i, steps: [
          { t: 'Capones has the old lighthouse and clear water, about 4 hours out, so it takes the whole day.' },
          { book: laBanca(8, '08:00', 6, '2026-10-24', 'Capones Island'), quick: ['Pay now', 'Change the time'] }
        ] }
      ]
    },
    cruise: {
      sub: 'Bay cruise',
      opener: EXPERIENCES.cruise.opener,
      quick: ['Sunset, 10 guests', 'Afternoon, 20 guests'],
      rules: [
        { match: /sunset|afternoon|guests/i, steps: [{ t: 'I have asked the Yacht Club for Saturday at 4:00 PM. The package is ₱30,000 for the boat, food and drinks included. I will confirm here as soon as they reply.' }, { place: 'yacht', quick: ['Thank you, Mika','Change the time'] }] }
      ]
    },
    hotel: {
      sub: 'Hotel stay',
      opener: EXPERIENCES.hotel.opener,
      quick: ['Sea view, 2 adults', 'A suite', 'The best price'],
      rules: [
        { match: /sea view|adults/i, steps: [{ t: 'Lighthouse Marina Resort has a Deluxe Bay View with a king bed and a balcony, ₱7,360 a night with your 20% off.' }, { place: 'lighthouse', quick: ['Book it','Something else'] }] },
        { match: /suite/i, steps: [{ t: 'The Lighthouse Suite has a living room and a bay view, ₱11,840 a night with your 20% off.' }, { place: 'lighthouse', quick: ['Book it','Something else'] }] },
        { match: /price|cheap/i, steps: [{ t: 'The Garden Room at Lighthouse Marina Resort is ₱5,920 a night with your 20% off, by the pool.' }, { place: 'lighthouse', quick: ['Book it','Something else'] }] }
      ]
    },
    parks: {
      sub: 'Theme parks',
      opener: EXPERIENCES.parks.opener,
      quick: ['Ocean Adventure', 'Zoobic Safari'],
      rules: [
        { match: /ocean/i, steps: [{ t: 'Ocean Adventure day passes are ₱807 each with your 15% off: park entry and all three shows.' }, { place: 'ocean', quick: ['Book it','Zoobic Safari instead'] }] },
        { match: /zoobic/i, steps: [{ t: 'Zoobic Safari day passes are ₱805 each with your 10% off, including the tiger safari ride.' }, { place: 'zoobic', quick: ['Book it','Ocean Adventure instead'] }] }
      ]
    },
    jetski: {
      sub: 'Jet skis',
      opener: EXPERIENCES.jetski.opener,
      quick: ['1 jet ski, 30 minutes', '2 jet skis, 1 hour'],
      rules: [
        { match: /30 min/i, steps: [{ t: 'NetWorX has a jet ski at 10:00 AM: ₱2,340 for 30 minutes with your 10% off.' }, { place: 'networx', quick: ['Book it','Something else'] }] },
        { match: /hour/i, steps: [{ t: 'NetWorX has two jet skis at 10:00 AM: ₱3,870 each for an hour with your 10% off.' }, { place: 'networx', quick: ['Book it','Something else'] }] }
      ]
    },
    transfer: {
      sub: 'Airport transfer · replies in ~5 min',
      opener: 'Hi Ana, Mika here. Where do you need to go, how many are travelling, and when?',
      quick: ['Clark to Subic', 'Subic to Clark'],
      rules: [
        { match: /clark|subic/i, steps: [{ t: 'Got it. Which terminal, and what time do you land?', quick: ['Terminal 2', 'Terminal 3'] }] }
      ]
    },
    other: {
      sub: 'Ask anything · replies in ~5 min',
      opener: 'Hi Ana, Mika here. Tell me what you need and I will take care of it.',
      quick: ['Dinner reservation', 'Hotel stay', 'Yacht charter', 'Island hopping', 'Bay cruise', 'Theme parks', 'Jet skis', 'Golf at Subic', 'Spa day', 'Airport transfer']
    }
  };

  // In the general chat each chip starts that service's questions; Mika has already said hello, so her greeting is dropped.
  // The chips' own rules go first so "Golf at Subic" isn't read as a Clark–Subic transfer.
  function ask(opener) { return opener.replace(/^Hi Ana, Mika here\. /, ''); }
  CHAT_TOPICS.other.rules = [
    { match: /dinner/i, steps: [{ t: ask(CHAT_TOPICS.table.opener), quick: CHAT_TOPICS.table.quick }] },
    { match: /transfer|airport/i, steps: [{ t: ask(CHAT_TOPICS.transfer.opener), quick: CHAT_TOPICS.transfer.quick }] },
    { match: /yacht/i, steps: [{ t: ask(EXPERIENCES.yacht.opener) }] },
    { match: /hotel/i, steps: [{ t: ask(EXPERIENCES.hotel.opener), quick: CHAT_TOPICS.hotel.quick }] },
    { match: /bay cruise/i, steps: [{ t: ask(EXPERIENCES.cruise.opener), quick: CHAT_TOPICS.cruise.quick }] },
    { match: /theme park/i, steps: [{ t: ask(EXPERIENCES.parks.opener), quick: CHAT_TOPICS.parks.quick }] },
    { match: /jet ski/i, steps: [{ t: ask(EXPERIENCES.jetski.opener), quick: CHAT_TOPICS.jetski.quick }] },
    { match: /island hopping/i, steps: [{ t: ask(EXPERIENCES.island.opener), quick: CHAT_TOPICS.island.quick }] },
    { match: /golf/i, steps: [{ t: ask(EXPERIENCES.golf.opener) }] },
    { match: /\bspa\b/i, steps: [{ t: ask(EXPERIENCES.spa.opener) }] }
  ].concat(CHAT_TOPICS.island.rules, CHAT_TOPICS.hotel.rules, CHAT_TOPICS.parks.rules, CHAT_TOPICS.jetski.rules, CHAT_TOPICS.cruise.rules,
    CHAT_TOPICS.table.rules, CHAT_TOPICS.transfer.rules);

  // Which chat script a ?topic= value uses. Experiences without a fixed script get their own opener.
  function topicFor(key) {
    if (CHAT_TOPICS[key]) return CHAT_TOPICS[key];
    if (EXPERIENCES[key]) return { sub: EXPERIENCES[key].title + ' · replies in ~5 min', opener: EXPERIENCES[key].opener, quick: [] };
    return CHAT_TOPICS.ongoing;
  }

  // Partner cards that Mika can drop into the chat. Same partner facts as data-a.js.
  var PARTNERS = {
    lighthouse: { name: 'Lighthouse Marina Resort', meta: 'Hotel · Moonbay Marina', offer: '20% off rooms', img: 'img/place-lighthouse.jpg', href: 'place.html?p=lighthouse' },
    ocean: { name: 'Ocean Adventure', meta: 'Marine Park · Camayan Wharf', offer: '15% off tickets', img: 'img/card-ocean.jpg', href: 'place.html?p=ocean' },
    zoobic: { name: 'Zoobic Safari', meta: 'Wildlife Park · Ilanin Forest', offer: '10% off tickets', img: 'img/zoobic-1.jpg', href: 'place.html?p=zoobic' },
    networx: { name: 'NetWorX Jetsports', meta: 'Jet Ski Rental · Waterfront', offer: '10% off rides', img: 'img/pass-subic-bay.jpg', href: 'place.html?p=networx' },
    yacht: { name: 'Subic Bay Yacht Club', meta: 'Marina · Rizal Highway', offer: '10% off at the counter', img: 'img/hist-sailing-club.jpg', href: 'place.html?p=yacht' },
    sands: {
      name: 'Sands Resto-Grill', meta: 'Restaurant · Lighthouse Marina Resort', offer: '10% off your bill',
      img: 'img/pass-subic-bay.jpg', href: 'place.html?p=sands'
    }
  };

  var TRIP = {
    title: 'Your trip',
    dates: 'Sat 17 – Sun 18 Oct',
    days: [
      {
        label: 'Saturday, 17 October',
        items: [
          { time: '7:30 AM', icon: 'airport_shuttle', title: 'Airport transfer, Clark to Subic', sub: 'Private van · driver meets you at arrivals', status: 'progress', photo: false,
            img: 'img/card-lighthouse.jpg', href: 'concierge-chat.html?topic=transfer', ics: ['20261017T073000', '20261017T090000'] },
          { time: '10:00 AM', icon: 'sailing', title: 'Yacht charter, La Banca 40 ft', sub: 'Captain on board · 3 hours', status: 'confirmed',
            img: 'img/hist-sailing-club.jpg', href: 'concierge-chat.html?topic=yacht', ics: ['20261017T100000', '20261017T130000'] },
          { time: '3:00 PM', icon: 'login', title: 'Check in, Lighthouse Marina Resort', sub: 'Deluxe Bay View · King bed', status: 'confirmed',
            img: 'img/card-lighthouse.jpg', href: 'place.html?p=lighthouse', ics: ['20261017T150000', '20261017T160000'] },
          { time: '7:00 PM', icon: 'restaurant', title: 'Dinner, Sands Resto-Grill', sub: 'Table for 2 · 10% off your bill', status: 'confirmed',
            img: 'img/pass-subic-bay.jpg', href: 'place.html?p=sands', ics: ['20261017T190000', '20261017T210000'] }
        ]
      },
      {
        label: 'Sunday, 18 October',
        items: [
          { time: '11:00 AM', icon: 'logout', title: 'Check out, Lighthouse Marina Resort', sub: 'Deluxe Bay View · 1 night',
            img: 'img/card-lighthouse.jpg', href: 'place.html?p=lighthouse', ics: ['20261018T110000', '20261018T113000'] }
        ]
      }
    ]
  };

  window.CONCIERGE = {
    MIKA: MIKA,
    ORDER: ORDER,
    EXPERIENCES: EXPERIENCES,
    CHAT_TOPICS: CHAT_TOPICS,
    GLOBAL_RULES: GLOBAL_RULES,
    FALLBACK: FALLBACK,
    PARTNERS: PARTNERS,
    TRIP: TRIP,
    peso: peso,
    guestsWord: guestsWord,
    fmtDate: fmtDate,
    fmtTime: fmtTime,
    bookingFor: bookingFor,
    topicFor: topicFor
  };
})();
