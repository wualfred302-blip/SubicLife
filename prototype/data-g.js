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

  var MIKA = {
    name: 'Mika',
    role: 'Your Prestige concierge',
    status: 'Online · replies in ~5 min',
    phone: '+63 47 252 0800',
    phoneHref: 'tel:+63472520800'
  };

  // Experiences: the tiles on concierge.html and the request form. `reply` is what Mika sends after a request,
  // in order: text steps, then a booking card (`card`) or a partner place card (`place`). `lines(guests)` gives the receipt.
  var ORDER = ['yacht', 'dining', 'island', 'golf', 'spa', 'transfer'];
  var EXPERIENCES = {
    yacht: {
      title: 'Yacht charter', icon: 'sailing', img: 'img/hist-sailing-club.jpg',
      desc: 'A 42 ft charter with a crew of two, sailing from Subic Bay. Mika confirms the captain, the route and the boarding point.',
      price: 16000, priceNote: '', max: 6, guests: 6, time: '10:00',
      opener: 'Hi Ana, Mika here. Tell me the date, the start time and how many of you are sailing.',
      bookTitle: 'Yacht charter, 42 ft',
      lines: function () { return [['Charter, 3 hours', 16000], ['Crew and cleaning', 2400]]; },
      reply: [
        { t: 'Thank you, Ana. I am holding a 42 ft charter for {guests} on {date} at {time}.' },
        { card: true, quick: ['Pay now', 'Change the time'] }
      ]
    },
    dining: {
      title: 'Private dining', icon: 'dinner_dining', img: 'img/thumb-ramas.jpg',
      desc: 'A table at Rama\'s Kitchen for your group. Mika reserves it and tells the kitchen about any dietary needs.',
      price: 1800, priceNote: 'per guest', max: 12, guests: 2, time: '19:00',
      opener: 'Hi Ana, Mika here. How many guests, which evening, and any dietary needs I should pass on?',
      bookTitle: 'Private dining, Rama\'s Kitchen',
      lines: function (g) { return [['Set dinner, ' + guestsWord(g), 1800 * g]]; },
      reply: [
        { t: 'I have a table at Rama\'s Kitchen for {guests} on {date} at {time}.' },
        { place: 'ramas', quick: ['Book it', 'Something else'] }
      ]
    },
    island: {
      title: 'Island hopping', icon: 'directions_boat', img: 'img/pass-subic-bay.jpg',
      desc: 'A half day on a private boat with snorkel gear and a guide. Mika arranges the boat, the stops and the pickup at the dock.',
      price: 2720, priceNote: 'per guest', max: 10, guests: 2, time: '08:00',
      opener: 'Hi Ana, Mika here. Tell me the date, the start time and how many are coming.',
      bookTitle: 'Island hop and snorkel',
      lines: function (g) { return [['Half day, ' + guestsWord(g), 2720 * g]]; },
      reply: [
        { t: 'Thank you, Ana. I can take {guests} on the half-day trip on {date} at {time}.' },
        { card: true, quick: ['Pay now', 'Change the time'] }
      ]
    },
    golf: {
      title: 'Golf at Subic', icon: 'golf_course', img: 'img/place-lighthouse.jpg',
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
      title: 'Spa day', icon: 'spa', img: 'img/hist-lighthouse-oct.jpg',
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
      title: 'Airport transfer', icon: 'airport_shuttle', img: 'img/card-lighthouse.jpg',
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
    var lines = e.lines(guests);
    var total = 0;
    lines.forEach(function (l) { total += l[1]; });
    return { title: e.bookTitle, sub: fmtDate(date) + ' · ' + fmtTime(time), lines: lines, total: total };
  }

  var GLOBAL_RULES = [
    { match: /thank/i, steps: [{ t: 'Anytime, Ana. I will message you if anything changes.' }] },
    { match: /change|another|different|later|instead/i, steps: [{ t: 'Of course. What time would you like instead?', quick: ['10:00 AM', '2:00 PM', '4:00 PM'] }] },
    { match: /\d{1,2}(:\d{2})?\s?(am|pm)/i, steps: [{ t: 'Done. I have moved it and told the captain the new time.', quick: ['Thank you, Mika'] }] },
    { match: /pay|book|yes|confirm/i, steps: [{ t: 'Great. The booking is held for you. Pay when you are ready and it is locked in.', quick: ['Thank you, Mika'] }] }
  ];
  var FALLBACK = [{ t: 'Noted, Ana. I am checking that now and I will come back to you shortly.', quick: ['Thank you, Mika'] }];

  var HISTORY = [
    { k: 'in', t: 'Hi Ana, this is Mika. What can I arrange for you today?' },
    { k: 'out', t: 'A yacht for Saturday, please. Six of us, about three hours, from Subic Bay.' },
    { k: 'in', t: 'Saturday works. I have a 42 ft charter with a crew of two from 10:00 to 13:00.' },
    { k: 'out', t: 'Perfect. Please book it.' },
    { k: 'in', t: 'Booked. Your confirmation is below. Pay to lock the boat.' },
    { k: 'book', title: 'Yacht charter, 42 ft', sub: 'Sat 17 Oct · 10:00 to 13:00 · Crew of two',
      lines: [['Charter, 3 hours', 16000], ['Crew and cleaning', 2400]], total: 18400 }
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
      quick: ['Rama\'s Kitchen', 'Meat Plus Cafe', 'Any restaurant'],
      rules: [
        { match: /rama/i, steps: [
          { t: 'Rama\'s Kitchen has a table for two at 7:30 PM on Friday. Here it is.' },
          { place: 'ramas', quick: ['Book it', 'Something else'] }
        ] },
        { match: /meat/i, steps: [{ t: 'Meat Plus Cafe is open until 11:00 PM. For how many, and what time?', quick: ['2 guests', '4 guests', '6 guests'] }] }
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
      quick: ['Dinner reservation', 'Airport transfer', 'Yacht charter', 'Island hopping', 'Golf at Subic', 'Spa day']
    }
  };

  // In the general chat each chip starts that service's questions; Mika has already said hello, so her greeting is dropped.
  // The chips' own rules go first so "Golf at Subic" isn't read as a Clark–Subic transfer.
  function ask(opener) { return opener.replace(/^Hi Ana, Mika here\. /, ''); }
  CHAT_TOPICS.other.rules = [
    { match: /dinner/i, steps: [{ t: ask(CHAT_TOPICS.table.opener), quick: CHAT_TOPICS.table.quick }] },
    { match: /transfer|airport/i, steps: [{ t: ask(CHAT_TOPICS.transfer.opener), quick: CHAT_TOPICS.transfer.quick }] },
    { match: /yacht/i, steps: [{ t: ask(EXPERIENCES.yacht.opener) }] },
    { match: /island/i, steps: [{ t: ask(EXPERIENCES.island.opener) }] },
    { match: /golf/i, steps: [{ t: ask(EXPERIENCES.golf.opener) }] },
    { match: /\bspa\b/i, steps: [{ t: ask(EXPERIENCES.spa.opener) }] }
  ].concat(CHAT_TOPICS.table.rules, CHAT_TOPICS.transfer.rules);

  // Which chat script a ?topic= value uses. Experiences without a fixed script get their own opener.
  function topicFor(key) {
    if (CHAT_TOPICS[key]) return CHAT_TOPICS[key];
    if (EXPERIENCES[key]) return { sub: EXPERIENCES[key].title + ' · replies in ~5 min', opener: EXPERIENCES[key].opener, quick: [] };
    return CHAT_TOPICS.ongoing;
  }

  // Partner cards that Mika can drop into the chat. Same partner facts as data-a.js.
  var PARTNERS = {
    ramas: {
      name: 'Rama\'s Kitchen', meta: 'Restaurant · Subic Freeport', offer: 'Free dessert with your bill',
      img: 'img/thumb-ramas.jpg', href: 'place.html?p=ramas'
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
          { time: '10:00 AM', icon: 'sailing', title: 'Yacht charter, 42 ft', sub: 'Crew of two · 3 hours', status: 'confirmed',
            img: 'img/hist-sailing-club.jpg', href: 'concierge-chat.html?topic=yacht', ics: ['20261017T100000', '20261017T130000'] },
          { time: '3:00 PM', icon: 'login', title: 'Check in, Lighthouse Marina Resort', sub: 'Deluxe Bay View · King bed', status: 'confirmed',
            img: 'img/card-lighthouse.jpg', href: 'place.html?p=lighthouse', ics: ['20261017T150000', '20261017T160000'] },
          { time: '7:00 PM', icon: 'restaurant', title: 'Dinner, Rama\'s Kitchen', sub: 'Table for 2 · Free dessert with your bill', status: 'confirmed',
            img: 'img/thumb-ramas.jpg', href: 'place.html?p=ramas', ics: ['20261017T190000', '20261017T210000'] }
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
