// Members other than Ana (the signed-in member), keyed by first name. Faces and names come from the stories
// (data-e.js). The chats are SAMPLE demo data; messages sent on this phone are kept in sessionStorage only.
(function () {
  window.MEMBERS = {
    marco: { name: 'Marco Dizon', avatar: 'img/avatar-marco.jpg' },
    jen: { name: 'Jen Santos', avatar: 'img/avatar-jen.jpg' },
    bea: { name: 'Bea Lim', avatar: 'img/avatar-bea.jpg' },
    paolo: { name: 'Paolo Cruz', avatar: 'img/avatar-paolo.jpg' }
  };
  window.memberId = function (name) {
    for (var id in window.MEMBERS) if (window.MEMBERS[id].name === name) return id;
    return null;
  };
  // SAMPLE chats, oldest message first. "me" is Ana.
  var THREADS = {
    jen: [
      { me: true, t: '9:12 AM', text: 'Hi Jen! Thanks for the tip on Camayan. Is the garden side quiet at night too?' },
      { t: '9:20 AM', text: 'Yes, very. Ask for a room near the pool, it is the quietest part.' },
      { me: true, t: '9:21 AM', text: 'Perfect, booking it now.' }
    ],
    marco: [
      { t: 'Yesterday', text: 'Saw you are going kayaking at NetWorX. Bring a dry bag for your phone.' },
      { me: true, t: 'Yesterday', text: 'Good call, I would have forgotten. Thanks Marco!' }
    ],
    bea: [
      { me: true, t: 'Mon', text: 'Your Meat Plus story made me hungry. Is it busy on weekends?' },
      { t: 'Mon', text: 'Saturday nights fill up. Reserve in the app before you go.' }
    ]
  };
  window.memberThread = function (id) {
    var sent = [];
    try { sent = JSON.parse(sessionStorage.getItem('sl-dm-' + id) || '[]'); } catch (e) {}
    return (THREADS[id] || []).concat(sent);
  };
  window.memberSend = function (id, text) {
    var sent = [];
    try { sent = JSON.parse(sessionStorage.getItem('sl-dm-' + id) || '[]'); } catch (e) {}
    sent.push({ me: true, t: 'Now', text: text });
    try { sessionStorage.setItem('sl-dm-' + id, JSON.stringify(sent)); } catch (e) {}
  };
  function getSet(k) { try { return JSON.parse(sessionStorage.getItem(k) || '{}'); } catch (e) { return {}; } }
  function putSet(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  window.memberBlocked = function (id) { return !!getSet('sl-dm-blocked')[id]; };
  window.memberSetBlocked = function (id, on) { var b = getSet('sl-dm-blocked'); if (on) b[id] = 1; else delete b[id]; putSet('sl-dm-blocked', b); };
  window.memberReport = function (id, why) { var r = getSet('sl-dm-reports'); r[id] = why; putSet('sl-dm-reports', r); };
  // Unread: their message is the last one and you haven't opened the chat since.
  window.memberUnread = function (id) { var th = window.memberThread(id), last = th[th.length - 1]; return !!last && !last.me && !getSet('sl-dm-read')[id]; };
  window.memberMarkRead = function (id) { var r = getSet('sl-dm-read'); r[id] = 1; putSet('sl-dm-read', r); };
  window.memberChats = function () {
    return Object.keys(THREADS).filter(function (id) { return !window.memberBlocked(id); })
      .map(function (id) { var th = window.memberThread(id); return { id: id, last: th[th.length - 1], unread: window.memberUnread(id) }; });
  };
  // The chat icon on Discover gets a dot while any chat is unread.
  document.addEventListener('DOMContentLoaded', function () {
    var icon = document.querySelector('.c-dicon[href="messages.html"]');
    if (icon) icon.classList.toggle('has-dot', window.memberChats().some(function (c) { return c.unread; }));
  });
})();
