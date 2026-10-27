// Subic.Life street map: OpenFreeMap "liberty" vector style recoloured to the cool grey + sea look.
// Text is drawn by the GPU, so it stays sharp at every zoom. Our own pins replace third-party POIs.
window.SLMapStyle = function () {
  return fetch('https://tiles.openfreemap.org/styles/liberty').then(function (r) { return r.json(); }).then(function (s) {
    var INK = '#33373D', LAND = '#E9E7E2', SEA = '#9DCDF0', ORANGE = '#E8590C';
    var BIG = ['motorway', 'trunk'];
var byClass = function (big, other) { return ['match', ['get', 'class'], BIG, big, other]; };
    s.layers = s.layers.filter(function (l) { return !/^poi_|building-3d|road_one_way|natural_earth/.test(l.id); });
    s.layers.forEach(function (l) {
      var id = l.id, p = l.paint = l.paint || {};
      if (l.type === 'background') p['background-color'] = LAND;
      else if (/^landuse_residential|^landuse_|landcover_ice|aeroway_fill/.test(id)) p['fill-color'] = LAND;
      else if (/^park$|landcover_wood|landcover_grass|landcover_wetland/.test(id)) { p['fill-color'] = '#DCE4D6'; p['fill-opacity'] = 1; }
      else if (/^park_outline/.test(id)) p['line-opacity'] = 0;
      else if (/landcover_sand/.test(id)) p['fill-color'] = '#EEE8DA';
      else if (id === 'water') p['fill-color'] = SEA;
      else if (/^waterway/.test(id) && l.type === 'line') p['line-color'] = SEA;
      else if (id === 'building') { p['fill-color'] = '#DEDBD4'; p['fill-outline-color'] = '#D3D0C8'; }
      else if (/(motorway|trunk_primary)(_link)?_casing$/.test(id)) p['line-color'] = '#C9C5BC';
      else if (/_casing$/.test(id)) p['line-color'] = '#D8D5CE';
      else if (/(motorway|trunk_primary)(_link)?$/.test(id) && l.type === 'line') p['line-color'] = '#FFFFFF';
      else if (/(minor|secondary_tertiary|service_track|link|street|path_pedestrian)$/.test(id) && l.type === 'line') p['line-color'] = '#FFFFFF';
      if (l.type === 'symbol' && l.layout && l.layout['text-field']) {
        var big = /^highway-name/.test(id);
        p['text-color'] = INK;
        p['text-halo-color'] = /water/.test(id) ? SEA : '#FFFFFF';
        p['text-halo-width'] = 1.2;
        if (/water/.test(id)) p['text-color'] = '#3C6E8F';
      }
    });
    return s;
  });
};
