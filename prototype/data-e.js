// data-e.js - Explore feed records for Agent E: events, member stories, member offers and the popular list.
// Read by explore.html, post.html and offer.html. Places are keys from data-a.js (PLACES). Photos are the
// img/ set already in the project. Names, times, prices and comments are placeholder demo values.
// cats are the feed filter tags (hotels, food, beaches, water-sports, nature, nightlife).
(function () {
  var EVENTS = [
    {
      id: 'sunset-sail', kind: 'event', title: 'Sunset sail from the Yacht Club',
      when: 'Sat 17 Oct, 5:30 PM', place: 'yacht', cats: ['water-sports'],
      photos: ['img/hist-sailing-club.jpg', 'img/hist-lighthouse-sep.jpg'],
      caption: 'Two hours on the bay with a skipper. Drinks are included for Prestige members. Twelve seats left.',
      going: 38, likes: 61,
      comments: [
        { who: 'Paolo Cruz', initials: 'PC', avatar: 'img/avatar-paolo.jpg', ago: '40m', text: 'Is the boat big enough for six?' },
        { who: 'Jen Santos', initials: 'JS', avatar: 'img/avatar-jen.jpg', ago: '22m', text: 'Yes, the catamaran seats eight.' }
      ]
    },
    {
      id: 'marina-sundowner', kind: 'event', title: 'Marina sundowner night',
      when: 'Fri 16 Oct, 6:00 PM', place: 'yacht', cats: ['nightlife', 'food'],
      photos: ['img/hist-lighthouse-sep.jpg', 'img/thumb-yacht-club.jpg'],
      caption: 'Acoustic set on the deck with the sun going down over the marina. Member drinks are 10% off the menu.',
      going: 54, likes: 90,
      comments: [
        { who: 'Marco Dizon', initials: 'MD', avatar: 'img/avatar-marco.jpg', ago: '2h', text: 'Saving a table near the rail.' }
      ]
    },
    {
      id: 'pool-brunch', kind: 'event', title: 'Sunday pool brunch',
      when: 'Sun 18 Oct, 10:00 AM', place: 'lighthouse', cats: ['hotels', 'food'],
      photos: ['img/hist-lighthouse-oct.jpg', 'img/place-lighthouse.jpg'],
      caption: 'A buffet by the pool and a long table under the palms. Book a cabana through the concierge.',
      going: 27, likes: 40,
      comments: []
    },
    {
      id: 'beach-cleanup', kind: 'event', title: 'Camayan beach clean-up',
      when: 'Sat 17 Oct, 7:00 AM', place: 'camayan', cats: ['beaches', 'nature'],
      photos: ['img/card-camayan.jpg', 'img/card-lighthouse.jpg'],
      caption: 'Two hours on the sand with gloves and bags provided. The resort serves breakfast after.',
      going: 19, likes: 33,
      comments: []
    }
  ];

  // Stories come from visits: a member can only share one after paying with the card there, so each
  // carries its visit date (shown as "Verified visit"). Ana Reyes is the signed-in member. Newest first.
  var STORIES = [
    {
      id: 'camayan-sunrise', kind: 'story', author: 'Marco Dizon', initials: 'MD', avatar: 'img/avatar-marco.jpg', ago: '2h', visited: 'Today',
      place: 'camayan', cats: ['beaches', 'nature'], commentCount: 18,
      photos: ['img/pass-subic-bay.jpg', 'img/card-camayan.jpg'],
      caption: 'Sunrise walk before the crowds. The sand is clean and the water is flat this week.',
      likes: 214,
      comments: [
        { who: 'Ana Reyes', initials: 'AR', avatar: 'img/avatar.jpg', ago: '1h', text: 'Going this weekend. Is the garden side worth it?' },
        { who: 'Jen Santos', initials: 'JS', avatar: 'img/avatar-jen.jpg', ago: '50m', text: 'Yes, book the garden side. The pool is quieter.' },
        { who: 'Marco Dizon', initials: 'MD', avatar: 'img/avatar-marco.jpg', ago: '20m', text: 'Garden side all the way.' }
      ]
    },
    {
      id: 'meatplus-steak', kind: 'story', author: 'Bea Lim', initials: 'BL', avatar: 'img/avatar-bea.jpg', ago: '5h', visited: 'Today',
      place: 'meatplus', cats: ['food'], commentCount: 9,
      photos: ['img/hist-lighthouse-sep.jpg', 'img/hist-meat-plus.jpg'],
      caption: 'Window table just as the boats came in. Book ahead on weekends, the terrace fills up fast.',
      likes: 132,
      comments: [
        { who: 'Paolo Cruz', initials: 'PC', avatar: 'img/avatar-paolo.jpg', ago: '3h', text: 'Which steak did you get?' }
      ]
    },
    // SAMPLE member stories for every bookable listing, added by design/after-pay/stories.mjs
    {
      id: 'zoobic-safari', kind: 'story', author: 'Marco Dizon', initials: 'MD', avatar: 'img/avatar-marco.jpg', ago: '2d', visited: 'Oct 18',
      place: 'zoobic', cats: ['nature'], commentCount: 5,
      photos: ['img/zoobic-1.jpg', 'img/pass-subic-bay.jpg'],
      caption: "The safari ride was the highlight for the kids. Bring a hat, the walk between stops is sunny.",
      likes: 64, comments: []
    },
    {
      id: 'zoobic-early', kind: 'story', author: 'Jen Santos', initials: 'JS', avatar: 'img/avatar-jen.jpg', ago: '6d', visited: 'Oct 14',
      place: 'zoobic', cats: ['nature'], commentCount: 2,
      photos: ['img/zoobic-6.jpg', 'img/pass-subic-bay.jpg'],
      caption: "Took my parents for the day. Go early before it gets hot, we were done by lunch.",
      likes: 38, comments: []
    },
    {
      id: 'sailing-first', kind: 'story', author: 'Bea Lim', initials: 'BL', avatar: 'img/avatar-bea.jpg', ago: '3d', visited: 'Oct 17',
      place: 'sailing', cats: ['water-sports'], commentCount: 4,
      photos: ['img/sailing-bay.jpg', 'img/pass-subic-bay.jpg'],
      caption: "First time on a dinghy and the instructor had me steering in minutes. The bay was calm all morning.",
      likes: 52, comments: []
    },
    {
      id: 'sailing-birthday', kind: 'story', author: 'Paolo Cruz', initials: 'PC', avatar: 'img/avatar-paolo.jpg', ago: '1w', visited: 'Oct 11',
      place: 'sailing', cats: ['water-sports'], commentCount: 1,
      photos: ['img/sailing-lighthouse.jpg', 'img/pass-subic-bay.jpg'],
      caption: "Booked a lesson for my son’s birthday. Now he wants to go back every weekend.",
      likes: 31, comments: []
    },
    {
      id: 'networx-bay', kind: 'story', author: 'Jen Santos', initials: 'JS', avatar: 'img/avatar-jen.jpg', ago: '4d', visited: 'Oct 16',
      place: 'networx', cats: ['water-sports'], commentCount: 3,
      photos: ['img/pass-subic-bay.jpg', 'img/pass-subic-bay.jpg'],
      caption: "Jet ski with my brother. Short briefing, then the bay was all ours.",
      likes: 45, comments: []
    },
    {
      id: 'networx-drybag', kind: 'story', author: 'Marco Dizon', initials: 'MD', avatar: 'img/avatar-marco.jpg', ago: '1w', visited: 'Oct 12',
      place: 'networx', cats: ['water-sports'], commentCount: 2,
      photos: ['img/sailing-bay.jpg', 'img/pass-subic-bay.jpg'],
      caption: "Worth it for the view of the bay from the water. Bring a dry bag for your phone.",
      likes: 27, comments: []
    },
    {
      id: 'labanca-sunset', kind: 'story', author: 'Bea Lim', initials: 'BL', avatar: 'img/avatar-bea.jpg', ago: '5d', visited: 'Oct 15',
      place: 'labanca', cats: ['water-sports'], commentCount: 6,
      photos: ['img/pass-subic-bay.jpg', 'img/pass-subic-bay.jpg'],
      caption: "Family cruise and everyone fit easily. The crew even took our photos.",
      likes: 73, comments: []
    },
    {
      id: 'labanca-anniv', kind: 'story', author: 'Paolo Cruz', initials: 'PC', avatar: 'img/avatar-paolo.jpg', ago: '2w', visited: 'Oct 4',
      place: 'labanca', cats: ['water-sports'], commentCount: 4,
      photos: ['img/pass-subic-bay.jpg', 'img/pass-subic-bay.jpg'],
      caption: "Celebrated our anniversary on the yacht. Calm water and the mountains all around.",
      likes: 58, comments: []
    },
    {
      id: 'bestwestern-quiet', kind: 'story', author: 'Jen Santos', initials: 'JS', avatar: 'img/avatar-jen.jpg', ago: '6d', visited: 'Oct 13',
      place: 'bestwestern', cats: ['hotels'], commentCount: 1,
      photos: ['img/pass-subic-bay.jpg', 'img/pass-subic-bay.jpg'],
      caption: "Clean, quiet room and a friendly front desk. A good base for a weekend in Subic.",
      likes: 22, comments: []
    },
    {
      id: 'lecharme-sisters', kind: 'story', author: 'Bea Lim', initials: 'BL', avatar: 'img/avatar-bea.jpg', ago: '1w', visited: 'Oct 10',
      place: 'lecharme', cats: ['hotels'], commentCount: 2,
      photos: ['img/pass-subic-bay.jpg', 'img/pass-subic-bay.jpg'],
      caption: "Two nights with my sister. The room was spotless and the staff remembered our names.",
      likes: 34, comments: []
    },
    {
      id: 'segara-friends', kind: 'story', author: 'Marco Dizon', initials: 'MD', avatar: 'img/avatar-marco.jpg', ago: '9d', visited: 'Oct 9',
      place: 'segara', cats: ['hotels'], commentCount: 3,
      photos: ['img/pass-subic-bay.jpg', 'img/pass-subic-bay.jpg'],
      caption: "Rented a villa with friends. Plenty of room to spread out after a day on the bay.",
      likes: 41, comments: []
    },
    {
      id: 'reef-view', kind: 'story', author: 'Paolo Cruz', initials: 'PC', avatar: 'img/avatar-paolo.jpg', ago: '4d', visited: 'Oct 15',
      place: 'reef', cats: ['hotels'], commentCount: 1,
      photos: ['img/pass-subic-bay.jpg', 'img/pass-subic-bay.jpg'],
      caption: "Woke up to a nice view and slept well. Check-in with the card was easy.",
      likes: 19, comments: []
    },
    {
      id: 'terrace-evening', kind: 'story', author: 'Jen Santos', initials: 'JS', avatar: 'img/avatar-jen.jpg', ago: '2w', visited: 'Oct 3',
      place: 'terrace', cats: ['hotels'], commentCount: 2,
      photos: ['img/pass-subic-bay.jpg', 'img/pass-subic-bay.jpg'],
      caption: "We spent every evening out on our terrace. Quiet and comfortable.",
      likes: 26, comments: []
    },
    {
      id: 'bayfront-simple', kind: 'story', author: 'Bea Lim', initials: 'BL', avatar: 'img/avatar-bea.jpg', ago: '1w', visited: 'Oct 11',
      place: 'bayfront', cats: ['hotels'], commentCount: 0,
      photos: ['img/pass-subic-bay.jpg', 'img/pass-subic-bay.jpg'],
      caption: "Simple, clean and close to everything we wanted to see.",
      likes: 17, comments: []
    },
    {
      id: 'forestview-family', kind: 'story', author: 'Marco Dizon', initials: 'MD', avatar: 'img/avatar-marco.jpg', ago: '2w', visited: 'Oct 5',
      place: 'forestview', cats: ['hotels'], commentCount: 2,
      photos: ['img/pass-subic-bay.jpg', 'img/pass-subic-bay.jpg'],
      caption: "Great for a family weekend. The kids loved having a bedroom of their own.",
      likes: 29, comments: []
    },
    {
      id: 'camayan-calm', kind: 'story', author: 'Paolo Cruz', initials: 'PC', avatar: 'img/avatar-paolo.jpg', ago: '5d', visited: 'Oct 14',
      place: 'camayan', cats: ['beaches', 'nature'], commentCount: 2,
      photos: ['img/card-camayan.jpg', 'img/pass-subic-bay.jpg'],
      caption: "Beach day with the kids. The water was calm and clear in the morning.",
      likes: 36, comments: []
    },
    // SAMPLE member stories (made up, like every demo story), added by design/activity-fix/story-v2.mjs
    {
      id: 'ocean-dolphins', kind: 'story', author: 'Bea Lim', initials: 'BL', avatar: 'img/avatar-bea.jpg', ago: '3d', visited: 'Oct 10',
      place: 'ocean', cats: ['water-sports', 'nature'], commentCount: 3,
      photos: ['img/pass-subic-bay.jpg', 'img/card-ocean.jpg'],
      caption: 'Go for the first show, the stands are half empty and the kids got to sit up front.',
      likes: 41, comments: []
    },
    {
      id: 'ocean-lunch', kind: 'story', author: 'Paolo Cruz', initials: 'PC', avatar: 'img/avatar-paolo.jpg', ago: '1w', visited: 'Oct 6',
      place: 'ocean', cats: ['water-sports', 'nature'], commentCount: 2,
      photos: ['img/card-ocean.jpg', 'img/pass-subic-bay.jpg'],
      caption: 'Bring water shoes and a dry bag. The day pass covers more than we could do in one visit.',
      likes: 29, comments: []
    },
    {
      id: 'ocean-snorkel', kind: 'story', author: 'Jen Santos', initials: 'JS', avatar: 'img/avatar-jen.jpg', ago: '1d', visited: 'Oct 12',
      place: 'ocean', cats: ['water-sports', 'nature'], commentCount: 6,
      photos: ['img/card-ocean.jpg', 'img/pass-subic-bay.jpg'],
      caption: 'Snorkel day with the kids. We saw a sea turtle near the reef and the crew knew every stop.',
      likes: 88,
      comments: [
        { who: 'Ana Reyes', initials: 'AR', avatar: 'img/avatar.jpg', ago: '1d', text: 'The half-day trip is enough for kids.' }
      ]
    },
    {
      id: 'ramas-curry', kind: 'story', author: 'Paolo Cruz', initials: 'PC', avatar: 'img/avatar-paolo.jpg', ago: '2d', visited: 'Oct 11',
      place: 'ramas', cats: ['food'], commentCount: 4,
      photos: ['img/hist-ramas.jpg', 'img/thumb-ramas.jpg'],
      caption: 'The curry was the best thing we ate all week. Worth the drive from the port.',
      likes: 47,
      comments: []
    },
    {
      id: 'lighthouse-pool', kind: 'story', author: 'Paolo Cruz', initials: 'PC', avatar: 'img/avatar-paolo.jpg', ago: '3d', visited: 'Oct 10',
      place: 'lighthouse', cats: ['hotels'], commentCount: 3,
      photos: ['img/hist-lighthouse-oct.jpg', 'img/place-lighthouse.jpg'],
      caption: 'The pool is quiet before ten. Ask for an upper floor if you want the bay view.',
      likes: 76,
      comments: [
        { who: 'Jen Santos', initials: 'JS', avatar: 'img/avatar-jen.jpg', ago: '2d', text: 'Upper floor is worth it, the sunsets are right there.' }
      ]
    },
    {
      id: 'meatplus-burger', kind: 'story', author: 'Jen Santos', initials: 'JS', avatar: 'img/avatar-jen.jpg', ago: '4d', visited: 'Oct 9',
      place: 'meatplus', cats: ['food'], commentCount: 2,
      photos: ['img/thumb-meat-plus.jpg', 'img/hist-meat-plus.jpg'],
      caption: 'Big portions. One grill plate fed both kids, and they had crayons at the table.',
      likes: 58,
      comments: []
    },
    {
      id: 'lighthouse-sunset', kind: 'story', author: 'Marco Dizon', initials: 'MD', avatar: 'img/avatar-marco.jpg', ago: '6d', visited: 'Oct 7',
      place: 'lighthouse', cats: ['hotels', 'nature'], commentCount: 5,
      photos: ['img/card-lighthouse.jpg', 'img/place-lighthouse.jpg'],
      caption: 'Golden hour walk out to the lighthouse. Go before six, the path gets busy after.',
      likes: 102,
      comments: []
    },
    {
      id: 'bestwestern-roof', kind: 'story', author: 'Jen Santos', initials: 'JS', avatar: 'img/avatar-jen.jpg', ago: '6d', visited: 'Oct 11',
      place: 'bestwestern', cats: ['hotels'], commentCount: 2,
      photos: ['img/pass-subic-bay.jpg', 'img/pass-subic-bay.jpg'],
      real: ['img/real/bestwestern/bestwestern-03.jpg', 'img/real/bestwestern/bestwestern-04.jpg'],
      caption: 'Sky Oasis on the roof at sunset, the bay right below. The kids’ pool is next to the big one, open till 10 PM.',
      likes: 64,
      comments: []
    },
    {
      id: 'lecharme-pool', kind: 'story', author: 'Marco Dizon', initials: 'MD', avatar: 'img/avatar-marco.jpg', ago: '6d', visited: 'Oct 11',
      place: 'lecharme', cats: ['hotels'], commentCount: 4,
      photos: ['img/pass-subic-bay.jpg', 'img/pass-subic-bay.jpg'],
      real: ['img/real/lecharme/lecharme-02.jpg', 'img/real/lecharme/lecharme-05.jpg'],
      caption: 'Rooftop infinity pool over the whole bay. We brought our bikes and there’s a rack right in the room.',
      likes: 88,
      comments: []
    },
    {
      id: 'segara-villa', kind: 'story', author: 'Bea Lim', initials: 'BL', avatar: 'img/avatar-bea.jpg', ago: '7d', visited: 'Oct 10',
      place: 'segara', cats: ['hotels'], commentCount: 1,
      photos: ['img/pass-subic-bay.jpg', 'img/pass-subic-bay.jpg'],
      real: ['img/real/segara/segara-04.jpg', 'img/real/segara/segara-01.jpg'],
      caption: 'Breakfast comes with the villa, and the pool and garden are for guests only, so it stays quiet. Book a massage after the beach.',
      likes: 41,
      comments: []
    },
    {
      id: 'reef-work', kind: 'story', author: 'Paolo Cruz', initials: 'PC', avatar: 'img/avatar-paolo.jpg', ago: '7d', visited: 'Oct 10',
      place: 'reef', cats: ['hotels'], commentCount: 1,
      photos: ['img/pass-subic-bay.jpg', 'img/pass-subic-bay.jpg'],
      real: ['img/real/reef/reef-04.jpg', 'img/real/reef/reef-02.jpg'],
      caption: 'Fast fibre Wi-Fi, so I could work from the room. Pirates Bistro is downstairs and the shop is open 24 hours.',
      likes: 23,
      comments: []
    },
    {
      id: 'terrace-room', kind: 'story', author: 'Jen Santos', initials: 'JS', avatar: 'img/avatar-jen.jpg', ago: '7d', visited: 'Oct 9',
      place: 'terrace', cats: ['hotels'], commentCount: 0,
      photos: ['img/pass-subic-bay.jpg', 'img/pass-subic-bay.jpg'],
      real: ['img/real/terrace/terrace-07.jpg', 'img/real/terrace/terrace-01.jpg'],
      caption: 'Our room had its own terrace, and parking out front is free.',
      likes: 17,
      comments: []
    },
    {
      id: 'bayfront-pool', kind: 'story', author: 'Marco Dizon', initials: 'MD', avatar: 'img/avatar-marco.jpg', ago: '8d', visited: 'Oct 9',
      place: 'bayfront', cats: ['hotels'], commentCount: 2,
      photos: ['img/pass-subic-bay.jpg', 'img/pass-subic-bay.jpg'],
      real: ['img/real/bayfront/bayfront-02.jpg', 'img/real/bayfront/bayfront-04.jpg'],
      caption: 'Breakfast for two came with our Deluxe room. There’s an indoor pool too, handy when it rains.',
      likes: 35,
      comments: []
    },
    {
      id: 'forestview-kitchen', kind: 'story', author: 'Bea Lim', initials: 'BL', avatar: 'img/avatar-bea.jpg', ago: '8d', visited: 'Oct 8',
      place: 'forestview', cats: ['hotels'], commentCount: 1,
      photos: ['img/pass-subic-bay.jpg', 'img/pass-subic-bay.jpg'],
      real: ['img/real/forestview/forestview-02.jpg', 'img/real/forestview/forestview-06.jpg'],
      caption: 'We cooked breakfast in our own kitchen. Lots of trees, and a big pool for the kids.',
      likes: 29,
      comments: []
    },
    {
      id: 'yacht-charter', kind: 'story', mine: true, author: 'Ana Reyes', avatar: 'img/avatar.jpg', ago: '8d', visited: 'Oct 5',
      place: 'yacht', cats: ['water-sports'], commentCount: 3,
      photos: ['img/hist-sailing-club.jpg', 'img/thumb-yacht-club.jpg'],
      caption: 'Sunset charter from the pontoons. Bring a light jacket, it gets windy past the point.',
      likes: 31,
      comments: [
        { who: 'Marco Dizon', initials: 'MD', avatar: 'img/avatar-marco.jpg', ago: '7d', text: 'Good call on the jacket.' }
      ]
    }
  ];

  var OFFERS = [
    {
      id: 'lighthouse-rooms', title: '20% off rooms', place: 'lighthouse', cats: ['hotels'],
      photo: 'img/card-lighthouse.jpg', tier: 'Prestige · 20% off', valid: '31 Dec 2026',
      applies: 'Room rates', bookable: true,
      terms: [
        'Applies to every room type.',
        'Show your Prestige card at check-in.',
        'Not valid with other resort promotions.',
        'Subject to availability. Blackout 23 Dec to 2 Jan.'
      ]
    },
    {
      id: 'bestwestern-rooms', title: '10% off rooms', place: 'bestwestern', cats: ['hotels'],
      photo: 'img/pass-subic-bay.jpg', tier: 'Prestige · 10% off', valid: '31 Dec 2026',
      applies: 'Room rates', bookable: true,
      terms: [
        'Applies to every room type.',
        'Show your Prestige card at check-in.',
        'Subject to availability.'
      ]
    },
    {
      id: 'lecharme-rooms', title: '10% off rooms', place: 'lecharme', cats: ['hotels'],
      photo: 'img/pass-subic-bay.jpg', tier: 'Prestige · 10% off', valid: '31 Dec 2026',
      applies: 'Room rates', bookable: true,
      terms: [
        'Applies to every room type.',
        'Show your Prestige card at check-in.',
        'Subject to availability.'
      ]
    },
    {
      id: 'segara-rooms', title: '10% off rooms', place: 'segara', cats: ['hotels'],
      photo: 'img/pass-subic-bay.jpg', tier: 'Prestige · 10% off', valid: '31 Dec 2026',
      applies: 'Room rates', bookable: true,
      terms: [
        'Applies to every room type.',
        'Show your Prestige card at check-in.',
        'Subject to availability.'
      ]
    },
    {
      id: 'reef-rooms', title: '10% off rooms', place: 'reef', cats: ['hotels'],
      photo: 'img/pass-subic-bay.jpg', tier: 'Prestige · 10% off', valid: '31 Dec 2026',
      applies: 'Room rates', bookable: true,
      terms: [
        'Applies to every room type.',
        'Show your Prestige card at check-in.',
        'Subject to availability.'
      ]
    },
    {
      id: 'terrace-rooms', title: '10% off rooms', place: 'terrace', cats: ['hotels'],
      photo: 'img/pass-subic-bay.jpg', tier: 'Prestige · 10% off', valid: '31 Dec 2026',
      applies: 'Room rates', bookable: true,
      terms: [
        'Applies to every room type.',
        'Show your Prestige card at check-in.',
        'Subject to availability.'
      ]
    },
    {
      id: 'bayfront-rooms', title: '10% off rooms', place: 'bayfront', cats: ['hotels'],
      photo: 'img/pass-subic-bay.jpg', tier: 'Prestige · 10% off', valid: '31 Dec 2026',
      applies: 'Room rates', bookable: true,
      terms: [
        'Applies to every room type.',
        'Show your Prestige card at check-in.',
        'Subject to availability.'
      ]
    },
    {
      id: 'forestview-rooms', title: '10% off rooms', place: 'forestview', cats: ['hotels'],
      photo: 'img/pass-subic-bay.jpg', tier: 'Prestige · 10% off', valid: '31 Dec 2026',
      applies: 'Room rates', bookable: true,
      terms: [
        'Applies to every room type.',
        'Show your Prestige card at check-in.',
        'Subject to availability.'
      ]
    },
    {
      id: 'elfilos-bill', title: '10% off your bill', place: 'elfilos', cats: ['food', 'nightlife'],
      photo: 'img/pass-subic-bay.jpg', tier: 'Prestige · 10% off', valid: '31 Dec 2026',
      applies: 'Food and drinks', bookable: false,
      terms: [
        'Applies to food and drinks, before tax.',
        'Show your card when the bill comes.',
        'One discount per table.'
      ]
    },
    {
      id: 'teppan-bill', title: '10% off your bill', place: 'teppan', cats: ['food'],
      photo: 'img/pass-subic-bay.jpg', tier: 'Prestige · 10% off', valid: '31 Dec 2026',
      applies: 'Food and drinks', bookable: false,
      terms: [
        'Applies to food and drinks, before tax.',
        'Show your card when the bill comes.',
        'One discount per table.'
      ]
    },
    {
      id: 'sands-bill', title: '10% off your bill', place: 'sands', cats: ['food'],
      photo: 'img/pass-subic-bay.jpg', tier: 'Prestige · 10% off', valid: '31 Dec 2026',
      applies: 'Food and drinks', bookable: false,
      terms: [
        'Applies to food and drinks, before tax.',
        'Show your card when the bill comes.',
        'One discount per table.'
      ]
    },
    {
      id: 'labanca-perk', title: '10% off cruises', place: 'labanca', cats: ['water-sports'],
      photo: 'img/pass-subic-bay.jpg', tier: 'Prestige · 10% off', valid: '31 Dec 2026',
      applies: 'Every cruise booked in the app', bookable: true,
      terms: [
        'Applies to every booking in the app.',
        'Show your card QR when you arrive.'
      ]
    },
    {
      id: 'meatplus-bill', title: '20% off your bill', place: 'meatplus', cats: ['food'],
      photo: 'img/hist-meat-plus.jpg', tier: 'Prestige · 20% off', valid: '31 Dec 2026',
      applies: 'Food and drinks', bookable: false,
      terms: [
        'Applies to food and drinks, before tax.',
        'Show your card when the bill comes.',
        'Staff confirm the discount on the bill.',
        'One discount per table.'
      ]
    },
    {
      id: 'ocean-tours', title: '15% off tickets', place: 'ocean', cats: ['water-sports', 'nature'],
      photo: 'img/card-ocean.jpg', tier: 'Prestige · 15% off', valid: '30 Nov 2026',
      applies: 'Every ticket booked in the app', bookable: true,
      terms: [
        'Applies to every ticket you book in the app.',
        'Show your card QR at the gate.',
        'The park\'s ₱20 environment fee is paid at the gate.'
      ]
    },
    {
      id: 'sailing-lessons', title: '10% off lessons', place: 'sailing', cats: ['water-sports'],
      photo: 'img/hist-sailing-club.jpg', tier: 'Prestige · 10% off', valid: '30 Nov 2026',
      applies: 'Every lesson booked in the app', bookable: true,
      terms: [
        'Applies to every lesson you book in the app.',
        'Show your card QR at the marina.'
      ]
    },
    {
      id: 'networx-rides', title: '10% off rides', place: 'networx', cats: ['water-sports'],
      photo: 'img/pass-subic-bay.jpg', tier: 'Prestige · 10% off', valid: '30 Nov 2026',
      applies: 'Every ride booked in the app', bookable: true,
      terms: [
        'Applies to every ride you book in the app.',
        'Show your card QR at the dock.'
      ]
    },
    {
      id: 'zoobic-tickets', title: '10% off tickets', place: 'zoobic', cats: ['nature'],
      photo: 'img/zoobic-1.jpg', tier: 'Prestige · 10% off', valid: '30 Nov 2026',
      applies: 'Every ticket booked in the app', bookable: true,
      terms: [
        'Applies to every ticket you book in the app.',
        'Show your card QR at the gate.',
        'The park\'s ₱20 environment fee is paid at the gate.'
      ]
    },
    {
      id: 'camayan-rooms', title: '10% off rooms', place: 'camayan', cats: ['hotels', 'beaches'],
      photo: 'img/card-camayan.jpg', tier: 'Prestige · 10% off', valid: '31 Dec 2026',
      applies: 'Rooms and the residence', bookable: true,
      terms: [
        'Applies to Deluxe Room and Adventure Cove Residence rates.',
        'Show your Prestige card at check-in.',
        'Subject to availability.'
      ]
    },
    {
      id: 'yacht-counter', title: '10% off at the counter', place: 'yacht', cats: ['food', 'nightlife'],
      photo: 'img/thumb-yacht-club.jpg', tier: 'Prestige · 10% off', valid: '31 Dec 2026',
      applies: 'Marina dining', bookable: false,
      terms: [
        'Applies to food and drinks at the marina deck.',
        'Show your card when you pay at the counter.',
        'Not valid on event nights.'
      ]
    },
    {
      id: 'ramas-dessert', title: 'Free dessert', place: 'ramas', cats: ['food'],
      photo: 'img/thumb-ramas.jpg', tier: 'Prestige · free dessert', valid: '31 Dec 2026',
      applies: 'Dessert with any bill', bookable: false,
      terms: [
        'One free dessert per bill.',
        'Show your card when you pay at the counter.',
        'Dessert is chosen from the menu on the day.'
      ]
    }
  ];

  // Popular with members: place keys from PLACES, with the tags the filter uses.
  // Brochure partners, one or two per kind of outing. The offer line is the place's own perk.
  var POPULAR = [
    { place: 'ocean', cats: ['water-sports', 'nature'] },
    { place: 'zoobic', cats: ['nature'] },
    { place: 'labanca', cats: ['water-sports'] },
    { place: 'lecharme', cats: ['hotels'] },
    { place: 'sailing', cats: ['water-sports'] },
    { place: 'elfilos', cats: ['food', 'nightlife'] },
    { place: 'segara', cats: ['hotels'] },
    { place: 'networx', cats: ['water-sports'] },
    { place: 'sands', cats: ['food'] }
  ];

  // Ana's own card visits, newest first (the Card tab lists the same three). A visit can carry one story.
  var VISITS = [
    { place: 'meatplus', when: 'Today', what: 'Dinner' },
    { place: 'lighthouse', when: 'Oct 10', what: 'Hotel dining' },
    { place: 'yacht', when: 'Oct 5', what: 'Sunset charter', story: 'yacht-charter' }
  ];

  // Stories Ana shares in the prototype are kept in localStorage, so they show up on every page.
  function ago(t) {
    var m = Math.floor((Date.now() - t) / 60000);
    return m < 1 ? 'Just now' : m < 60 ? m + 'm' : m < 1440 ? Math.floor(m / 60) + 'h' : Math.floor(m / 1440) + 'd';
  }
  window.myStories = function () {
    var list = [];
    try { list = JSON.parse(localStorage.getItem('subic-stories')) || []; } catch (e) { list = []; }
    return list.map(function (s) {
      return { id: s.id, kind: 'story', mine: true, author: 'Ana Reyes', avatar: 'img/avatar.jpg', ago: ago(s.at),
        visited: s.visited, place: s.place, cats: (window.PLACES && PLACES[s.place] && PLACES[s.place].categories) || [],
        photos: s.photos, caption: s.caption, rating: s.rating, likes: 0, comments: [] };
    });
  };
  window.saveStory = function (s) {
    try {
      var list = JSON.parse(localStorage.getItem('subic-stories') || '[]');
      localStorage.setItem('subic-stories', JSON.stringify([s].concat(list)));
      return true;
    } catch (e) { return false; }
  };
  window.deleteStory = function (id) {
    try {
      var list = JSON.parse(localStorage.getItem('subic-stories') || '[]');
      localStorage.setItem('subic-stories', JSON.stringify(list.filter(function (s) { return s.id !== id; })));
    } catch (e) { /* nothing stored */ }
  };
  // Visits that have no story yet: these are the ones Ana can share from.
  window.visitsToShare = function () {
    var mine = window.myStories();
    return VISITS.filter(function (v) {
      return !v.story && !mine.some(function (s) { return s.place === v.place && s.visited === v.when; });
    });
  };

  window.FEED = { events: EVENTS, stories: window.myStories().concat(STORIES), offers: OFFERS, popular: POPULAR, visits: VISITS };

  // One story tile: photo, who, where. On a place page (mode 'place') the second line is the visit; on
  // Your stories (mode 'own') the tile shows the place, the visit and likes, and no avatar.
  function escT(t) { return String(t).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
  window.storyTile = function (s, mode) {
    var own = mode === 'own', day = s.visited === 'Today' ? 'today' : s.visited;
    var place = PLACES[s.place];
    var face = s.avatar ? '<img src="' + s.avatar + '" alt="">' : '<span class="c-mono" style="background:' + window.monoColour(s.initials) + '">' + escT(s.initials) + '</span>';
    return '<a class="c-story" href="post.html?id=' + s.id + '" data-cats="' + (s.cats || []).join(' ') + '">' +
      '<img class="c-story__img" src="' + s.photos[0] + '" alt="">' +
      (own ? '' : '<span class="c-story__avatar">' + face + '</span>') +
      '<span class="c-story__text">' +
        '<span class="c-story__name">' + escT(own ? place.name : s.mine ? 'You' : s.author) + '</span>' +
        '<span class="c-story__place">' + escT(own ? s.visited + (s.likes ? ' · ' + s.likes + (s.likes === 1 ? ' like' : ' likes') : '') : mode === 'place' ? 'Visited ' + day : place.name) + '</span>' +
      '</span></a>';
  };
  // One story as a Discover → Stories post (who, the tip, the photos, likes, Like / Comment). meta is the grey
  // line under the name; by default the place and how long ago.
  window.storyPost = function (s, meta) {
    var face = s.avatar ? '<img src="' + s.avatar + '" alt="">' : '<span class="c-mono" style="background:' + window.monoColour(s.initials) + '">' + escT(s.initials) + '</span>';
    var href = 'post.html?id=' + s.id;
    var shots = (s.photos || []).slice(0, 2);
    var talk = s.commentCount != null ? s.commentCount : (s.comments || []).length;
    return '<article class="c-spost">' +
      '<a class="c-spost__head" href="' + href + '"><span class="c-spost__face">' + face + '</span>' +
        '<span class="c-spost__who"><span class="c-spost__name">' + escT(s.mine ? 'You' : s.author) + '</span>' +
        '<span class="c-spost__meta">' + escT(meta || PLACES[s.place].name + ' · ' + s.ago) + '</span>' + window.starsHTML(s.rating) + '</span></a>' +
      '<a class="c-spost__body" href="' + href + '">' +
        (s.caption ? '<p class="c-spost__text">' + escT(s.caption) + '</p>' : '') +
        (shots.length ? '<span class="c-spost__photos is-' + shots.length + '">' +
          shots.map(function (src) { return '<img src="' + src + '" alt="">'; }).join('') + '</span>' : '') +
      '</a>' +
      '<div class="c-spost__counts"><span class="c-spost__bubble"><i class="ph-fill ph-heart" aria-hidden="true"></i></span>' +
        '<span data-likes>' + (s.likes || 0) + '</span><span class="c-spost__talk">' + talk + (talk === 1 ? ' comment' : ' comments') + '</span></div>' +
      '<div class="c-spost__actions">' +
        '<button class="c-spost__act" type="button" data-like aria-pressed="false"><i class="ph-light ph-heart" aria-hidden="true"></i>Like</button>' +
        '<a class="c-spost__act" href="' + href + '"><i class="ph-light ph-chat-circle" aria-hidden="true"></i>Comment</a>' +
      '</div></article>';
  };
  // Like toggles in place on any list of posts.
  window.bindLikes = function (root) {
    root.addEventListener('click', function (e) {
      var like = e.target.closest('[data-like]');
      if (!like) return;
      var on = like.getAttribute('aria-pressed') !== 'true';
      var count = like.closest('.c-spost').querySelector('[data-likes]');
      like.setAttribute('aria-pressed', on ? 'true' : 'false');
      like.firstChild.className = (on ? 'ph-fill' : 'ph-light') + ' ph-heart';
      count.textContent = +count.textContent + (on ? 1 : -1);
    });
  };
  // A story as a card in a swipe row on a place page: photo, who and when, two lines of the tip, likes.
  window.storyCard = function (s) {
    var face = s.avatar ? '<img src="' + s.avatar + '" alt="">' : '<span class="c-mono" style="background:' + window.monoColour(s.initials) + '">' + escT(s.initials) + '</span>';
    var talk = s.commentCount != null ? s.commentCount : (s.comments || []).length;
    return '<a class="c-plstory" href="post.html?id=' + s.id + '">' +
      '<img class="c-plstory__img" src="' + s.photos[0] + '" alt="">' +
      '<span class="c-plstory__who"><span class="c-plstory__face">' + face + '</span>' +
        '<span class="c-plstory__name">' + escT(s.mine ? 'You' : s.author) + '</span><span class="c-plstory__ago">' + escT(s.ago) + '</span></span>' +
      window.starsHTML(s.rating) +
      (s.caption ? '<span class="c-plstory__text">' + escT(s.caption) + '</span>' : '') +
      '<span class="c-plstory__meta"><i class="ph-fill ph-heart" aria-hidden="true"></i>' + (s.likes || 0) + ' · ' + talk + (talk === 1 ? ' comment' : ' comments') + '</span>' +
    '</a>';
  };
  // The first tile of a row: your photo with a plus. A button opens the visit picker, a link goes straight to a visit.
  window.addStoryTile = function (href, label, sub) {
    var inner = '<span class="c-story__me"><img src="img/avatar.jpg" alt=""></span>' +
      '<span class="c-story__plus" aria-hidden="true"><span class="material-symbols-outlined">add</span></span>' +
      '<span class="c-story__text"><span class="c-story__name">' + label + '</span><span class="c-story__place">' + sub + '</span></span>';
    return href ? '<a class="c-story c-story--add" href="' + href + '">' + inner + '</a>'
      : '<button class="c-story c-story--add" type="button" data-add-story>' + inner + '</button>';
  };

  // Members without a photo get a monogram in one of six deep colours, the same one every time.
  window.monoColour = function (initials) {
    var hues = ['#0E7C86', '#5A55D6', '#C2477A', '#2F6BDB', '#9A5B0E', '#187A46'];
    var n = 0;
    String(initials).split('').forEach(function (c) { n += c.charCodeAt(0); });
    return hues[n % hues.length];
  };

  // Look up an event or story by id (post.html), or an offer by id (offer.html).
  window.storyFor = function (id) {
    var all = EVENTS.concat(window.myStories(), STORIES);
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  };
  window.offerFor = function (id) {
    for (var i = 0; i < OFFERS.length; i++) if (OFFERS[i].id === id) return OFFERS[i];
    return null;
  };
})();

// Ratings come from members' stories: each story carries 1 to 5 stars, a place's rating is their average.
(function () {
  // SAMPLE: the demo stories have no real ratings yet; seed 3 to 5 stars from the story id so each one stays the same.
  FEED.stories.forEach(function (s) {
    if (s.rating != null || s.mine) return;
    var n = 0; String(s.id).split('').forEach(function (c) { n += c.charCodeAt(0); });
    s.rating = [5, 4, 5, 4, 3, 5, 4][n % 7];
  });
  window.starsHTML = function (r) {
    if (!r) return '';
    var out = ''; for (var i = 1; i <= 5; i++) out += i <= r ? '\u2605' : '\u2606';
    return '<span class="c-rstars" role="img" aria-label="Rated ' + r + ' out of 5">' + out + '</span>';
  };
  window.placeRating = function (id) {
    var rated = window.myStories().concat(FEED.stories.filter(function (s) { return !s.mine; }))
      .filter(function (s) { return s.place === id && s.rating; });
    var sum = rated.reduce(function (t, s) { return t + s.rating; }, 0);
    return { n: rated.length, avg: rated.length ? sum / rated.length : 0 };
  };
  // Every page that shows p.rating (Discover, Saved, the listing) now shows the stories' average.
  Object.keys(PLACES).forEach(function (id) {
    var r = window.placeRating(id);
    PLACES[id].rating = r.n ? r.avg.toFixed(1) : 'New';
    PLACES[id].ratingCount = r.n;
  });
})();
