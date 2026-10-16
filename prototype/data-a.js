// data-a.js - partner data for the prototype. Read by explore, search, category, saved, place, book,
// book-done and map. Photos are the Subic Bay images already in img/. Hours, addresses, phone numbers,
// room rates and bill amounts are placeholder demo values.
(function () {
  var PLACES = {
    lighthouse: {
      id: 'lighthouse',
      about: "A boutique resort on the Moonbay Marina breakwater, built around a working lighthouse. Bay-view rooms, an infinity pool over the yachts and the 720 Bar for sundowners.",
      name: 'Lighthouse Marina Resort',
      category: 'Hotel',
      categories: ['hotels'],
      area: 'Moonbay Marina',
      distance: '1.2 km',
      rating: '4.6',
      hero: 'img/place-lighthouse.jpg',
      photos: ['img/place-lighthouse.jpg', 'img/card-lighthouse.jpg', 'img/hist-lighthouse-sep.jpg', 'img/hist-lighthouse-oct.jpg'],
      thumb: 'img/card-lighthouse.jpg',
      offer: '20% off rooms · Prestige',
      offerShort: '20% off',
      offerSub: 'Applied at checkout. Show your card at check-in.',
      discount: 20,
      hours: 'Check-in 2 PM · check-out noon',
      closes: 'closes 23:00',
      address: 'Moonbay Marina, Subic Bay Freeport Zone',
      phone: '+63 47 252 0100',
      bookable: true,
      unit: 'night',
      rackPrice: 9200,
      memberPrice: 7360,
      rooms: [
        { name: 'Deluxe Bay View', sub: 'King bed · balcony · sleeps 2', rate: 9200, photo: 'img/card-lighthouse.jpg' },
        { name: 'Lighthouse Suite', sub: 'Sea-facing terrace · sleeps 4', rate: 14800, photo: 'img/hist-lighthouse-sep.jpg' },
        { name: 'Garden Room', sub: 'Queen bed · pool side · sleeps 2', rate: 7400, photo: 'img/hist-lighthouse-oct.jpg' }
      ],
      dates: ['Check-in', 'Check-out', 'Sat, 17 Oct', 'Sun, 18 Oct'],
      code: 'SBL-4K7Q2M'
    },
    ocean: {
      id: 'ocean',
      about: "Open-water marine park on Camayan Point. Swim with sea lions, watch the dolphin show and walk the reef boardwalk. Best before noon, before the day trips arrive.",
      name: 'Ocean Adventure',
      category: 'Marine Park',
      categories: ['water-sports'],
      area: 'Subic Bay Freeport',
      distance: '4.8 km',
      rating: '4.8',
      hero: 'img/card-ocean.jpg',
      photos: ['img/card-ocean.jpg', 'img/hist-sailing-club.jpg'],
      thumb: 'img/card-ocean.jpg',
      offer: '15% off tours · Prestige',
      offerShort: '15% off',
      offerSub: 'Show your card at the dock to book at the member price.',
      discount: 15,
      hours: 'Open today, 8:00 AM to 5:00 PM',
      closes: 'closes 17:00',
      address: 'Ocean Adventure, Subic Bay Freeport Zone',
      phone: '+63 47 252 0200',
      bookable: true,
      unit: 'trip',
      rackPrice: 3200,
      memberPrice: 2720,
      rooms: [
        { name: 'Island hop and snorkel', sub: 'Half day · boat, gear, guide', rate: 3200, photo: 'img/pass-subic-bay.jpg' },
        { name: 'Full-day charter', sub: 'Up to 6 guests · lunch included', rate: 12800, photo: 'img/hist-sailing-club.jpg' }
      ],
      dates: ['Date', 'Start time', 'Sat, 17 Oct', '8:00 AM'],
      code: 'SBL-7Q4K2M'
    },
    camayan: {
      id: 'camayan',
      about: "A quiet cove resort at the mouth of the bay with its own reef, kayaks and beach huts. The calmest water in Subic for a swim.",
      name: 'Camayan Beach Resort',
      category: 'Beach Resort',
      categories: ['hotels', 'beaches'],
      area: 'Camayan',
      distance: '5.1 km',
      rating: '4.5',
      hero: 'img/card-camayan.jpg',
      photos: ['img/card-camayan.jpg', 'img/pass-subic-bay.jpg'],
      thumb: 'img/card-camayan.jpg',
      offer: '10% off rooms · Prestige',
      offerShort: '10% off',
      offerSub: 'Applied at checkout. Show your card at check-in.',
      discount: 10,
      hours: 'Reception open 24 hours',
      closes: '24 hours',
      address: 'Camayan Beach, Subic Bay',
      phone: '+63 47 252 0300',
      bookable: true,
      unit: 'night',
      rackPrice: 8600,
      memberPrice: 7740,
      rooms: [
        { name: 'Garden Cottage', sub: 'Garden view · sleeps 2', rate: 8600, photo: 'img/card-camayan.jpg' },
        { name: 'Family Villa', sub: 'Two bedrooms · sleeps 5', rate: 15200, photo: 'img/pass-subic-bay.jpg' }
      ],
      dates: ['Check-in', 'Check-out', 'Sat, 17 Oct', 'Sun, 18 Oct'],
      code: 'SBL-2C9R8A'
    },
    meatplus: {
      id: 'meatplus',
      about: "Dry-aged steaks and grill plates on Harbor Point, with a terrace facing the boats. Locals book the window tables for sunset.",
      name: 'Meat Plus Cafe',
      category: 'Restaurant',
      categories: ['food'],
      area: 'Harbor Point',
      distance: '2.6 km',
      rating: '4.6',
      hero: 'img/hist-meat-plus.jpg',
      photos: ['img/hist-meat-plus.jpg', 'img/thumb-meat-plus.jpg'],
      thumb: 'img/thumb-meat-plus.jpg',
      offer: '20% off · Prestige',
      offerShort: '20% off',
      offerSub: 'Show your card when the bill comes. Pay at the counter.',
      discount: 20,
      hours: 'Open today, 10:00 AM to 11:00 PM',
      closes: 'closes 23:00',
      address: 'Harbor Point, Subic Bay Freeport Zone',
      phone: '+63 47 252 0400',
      bookable: false,
      unit: 'visit',
      rackPrice: 2400,
      memberPrice: 1920,
      rooms: [],
      dates: [],
      code: ''
    },
    ramas: {
      id: 'ramas',
      about: "Family-run North Indian kitchen in the Freeport. Tandoor breads baked to order, slow curries and the best lassi on the waterfront.",
      name: "Rama's Kitchen",
      category: 'Restaurant',
      categories: ['food'],
      area: 'Subic Freeport',
      distance: '3.4 km',
      rating: '4.8',
      hero: 'img/hist-ramas.jpg',
      photos: ['img/hist-ramas.jpg', 'img/thumb-ramas.jpg'],
      thumb: 'img/thumb-ramas.jpg',
      offer: 'Free dessert with your bill',
      offerShort: 'Free dessert',
      offerSub: 'Show your card when you pay at the counter.',
      discount: 0,
      hours: 'Open today, 11:00 AM to 10:00 PM',
      closes: 'closes 22:00',
      address: 'Subic Freeport Zone, Subic Bay',
      phone: '+63 47 252 0500',
      bookable: false,
      unit: 'visit',
      rackPrice: 1800,
      memberPrice: 1800,
      rooms: [],
      dates: [],
      code: ''
    },
    yacht: {
      id: 'yacht',
      about: "The members' club on the bay. Waterfront dining, sunset sails and charters leave from the pontoons outside.",
      name: 'Subic Bay Yacht Club',
      category: 'Marina Dining',
      categories: ['food', 'water-sports'],
      area: 'Waterfront Rd',
      distance: '2.0 km',
      rating: '4.7',
      hero: 'img/hist-sailing-club.jpg',
      photos: ['img/hist-sailing-club.jpg', 'img/thumb-yacht-club.jpg', 'img/hist-lighthouse-sep.jpg'],
      thumb: 'img/thumb-yacht-club.jpg',
      offer: '10% off · Prestige',
      offerShort: '10% off',
      offerSub: 'Show your card when you pay at the counter.',
      discount: 10,
      hours: 'Open today, 8:00 AM to 10:00 PM',
      closes: 'closes 22:00',
      address: 'Waterfront Road, Subic Bay Freeport Zone',
      phone: '+63 47 252 0600',
      bookable: false,
      unit: 'visit',
      rackPrice: 2000,
      memberPrice: 1800,
      rooms: [],
      dates: [],
      code: ''
    }
  };

  var CATEGORIES = {
    hotels: { title: 'Hotels', icon: 'hotel' },
    food: { title: 'Food', icon: 'restaurant' },
    beaches: { title: 'Beaches', icon: 'beach_access' },
    'water-sports': { title: 'Water sports', icon: 'sailing' },
    nature: { title: 'Nature', icon: 'forest' },
    nightlife: { title: 'Nightlife', icon: 'local_bar' }
  };

  window.PLACES = PLACES;
  window.CATEGORIES = CATEGORIES;
  window.placeFor = function (id) { return PLACES[id] || PLACES.lighthouse; };
  window.placesIn = function (key) {
    return Object.keys(PLACES).map(function (k) { return PLACES[k]; }).filter(function (p) {
      return p.categories.indexOf(key) >= 0;
    });
  };
  window.queryParam = function (k) { return new URLSearchParams(window.location.search).get(k); };
  window.fmtPeso = function (n) { return '₱' + n.toLocaleString('en-US'); };
  window.mapsUrl = function (p) {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p.name + ' ' + p.area + ' Subic Bay');
  };
})();
