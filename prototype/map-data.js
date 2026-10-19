// map-data.js - pins for map.html. Read by map.html only; partner names, photos and offers come from data-a.js (PLACES).
// Coordinates are approximate Subic Bay Freeport points, checked against satellite imagery at zoom 16 so every pin sits on
// land or beach. Waterfront pins follow the Waterfront Road strip. Extras have no page of their own in data-a.js:
// their View button goes to the nearest partner page.
(function () {
  var MAP = {
    center: { lat: 14.8205, lng: 120.2790 },   // default view centre (zoom 14); pins outside the view are reachable by pan
    zoom: 15.5,
    you: { lat: 14.8215, lng: 120.2790 },    // fake "you are here", beside Harbor Point
    places: [
      { id: 'lighthouse', partner: true, lat: 14.8208, lng: 120.2745, cats: ['hotels'] },        // Lighthouse Marina Resort, Moonbay
      { id: 'meatplus', partner: true, lat: 14.8235, lng: 120.2830, cats: ['food'] },            // Harbor Point
      { id: 'ramas', partner: true, lat: 14.8195, lng: 120.2800, cats: ['food'] },               // Waterfront Rd
      { id: 'yacht', partner: true, lat: 14.8214, lng: 120.2754, cats: ['food', 'water-sports'] }, // Subic Bay Yacht Club
      { id: 'camayan', partner: true, lat: 14.7729, lng: 120.2285, cats: ['hotels', 'beaches'] }, // Camayan Beach
      { id: 'ocean', partner: true, lat: 14.7739, lng: 120.2295, cats: ['water-sports'] },       // Ocean Adventure, Camayan Wharf
      { id: 'sailing', partner: true, lat: 14.8214, lng: 120.2719, cats: ['water-sports'] },     // Subic Sailing, Lighthouse Marina

      { id: 'networx', partner: true, lat: 14.8180, lng: 120.2815, cats: ['water-sports'] },     // NetWorX Jetsports, Waterfront Rd (SAMPLE spot)
      { id: 'zoobic', partner: true, lat: 14.7533, lng: 120.2722, cats: ['nature'] },          // Zoobic Safari, Ilanin Forest
      { id: 'bestwestern', partner: true, lat: 14.8234, lng: 120.2737, cats: ['hotels'] },  // Best Western PLUS Subic, Dewey Avenue
      { id: 'lecharme', partner: true, lat: 14.8233, lng: 120.3005, cats: ['hotels'] },  // Le Charmé Suites, Palm Street
      { id: 'segara', partner: true, lat: 14.8148, lng: 120.2849, cats: ['hotels'] },  // Segara Villas, Waterfront Road
      { id: 'reef', partner: true, lat: 14.8157, lng: 120.2826, cats: ['hotels'] },  // The Reef Hotel & Residences, Waterfront Road
      { id: 'terrace', partner: true, lat: 14.8206, lng: 120.2754, cats: ['hotels'] },  // Terrace Hotel, Moonbay Marina
      { id: 'bayfront', partner: true, lat: 14.8212, lng: 120.2758, cats: ['hotels'] },  // Bayfront Hotel, Moonbay Marina
      { id: 'forestview', partner: true, lat: 14.8044, lng: 120.3233, cats: ['hotels'] },  // Forestview Leisure Residences, Binictican
      { id: 'elfilos', partner: true, lat: 14.8217, lng: 120.2751, cats: ['food', 'nightlife'] },  // El Filo's, Moonbay Marina
      { id: 'teppan', partner: true, lat: 14.8230, lng: 120.3009, cats: ['food'] },  // Teppan 101, Palm Street
      { id: 'sands', partner: true, lat: 14.8211, lng: 120.2714, cats: ['food'] },  // Sands Resto-Grill, Lighthouse Marina
      { id: 'labanca', partner: true, lat: 14.8232, lng: 120.2919, cats: ['water-sports'] },  // La Banca Cruises, WV Docks

      { id: 'all-hands', partner: false, name: 'All Hands Beach', category: 'Beach', area: 'Camayan',
        lat: 14.7705, lng: 120.2300, cats: ['beaches'], discount: 10, offerShort: '10% off',
        offer: '10% off day passes · Prestige', photo: 'img/pass-subic-bay.jpg' },
      { id: 'camayan-point', partner: false, name: 'Camayan Point Lookout', category: 'Viewpoint', area: 'Camayan Point',
        lat: 14.7646, lng: 120.2256, cats: ['nature'], discount: 0, offerShort: 'Free entry',
        offer: 'Free entry for members', photo: 'img/card-ocean.jpg' },
      { id: 'ilanin', partner: false, name: 'Ilanin Forest Trail', category: 'Nature reserve', area: 'Ilanin Forest',
        lat: 14.7985, lng: 120.2783, cats: ['nature'], discount: 10, offerShort: '10% off',
        offer: '10% off guided walks · Prestige', photo: 'img/hist-zoobic.jpg' },
      { id: 'kayak', partner: false, name: 'Kayak Harbor Tours', category: 'Water sports', area: 'Moonbay Marina',
        lat: 14.8186, lng: 120.2774, cats: ['water-sports'], discount: 15, offerShort: '15% off',
        offer: '15% off guided kayak tours · Prestige', photo: 'img/hist-lighthouse-oct.jpg' },
      { id: 'surfside', partner: false, name: 'Surfside Bay Beach', category: 'Beach', area: 'Waterfront Rd',
        lat: 14.8192, lng: 120.2787, cats: ['beaches'], discount: 0, offerShort: 'Free loungers',
        offer: 'Free loungers with a member dining bill', photo: 'img/card-camayan.jpg' },
      { id: 'sunset', partner: false, name: 'Waterfront Sunset Bar', category: 'Bar', area: 'Waterfront Rd',
        lat: 14.8200, lng: 120.2818, cats: ['nightlife'], discount: 10, offerShort: '10% off',
        offer: '10% off cocktails after 6 PM · Prestige', photo: 'img/hist-lighthouse-sep.jpg' },
      { id: 'baypoint', partner: false, name: 'Baypoint Night Lounge', category: 'Lounge', area: 'Harbor Point',
        lat: 14.8222, lng: 120.2812, cats: ['nightlife'], discount: 0, offerShort: 'Free welcome drink',
        offer: 'Free welcome drink with a member card', photo: 'img/thumb-ramas.jpg' }
    ]
  };
  window.MAP_DATA = MAP;
})();
