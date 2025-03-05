


if (localStorage.getItem("location") !== null || localStorage.getItem !== undefined) {
  var info = JSON.parse(localStorage.getItem("location"));
  var myIcon = L.divIcon({
    //iconUrl: 'LocationMarker.png',
    iconSize: [48, 48],
    iconAnchor: [25, 49],
    popupAnchor: [-17, -50],
    className: 'test-icon-1'
  });
  var testIcon = L.divIcon({ className: 'myIcon' });


  const map = L.map('map', {
    center: [info.lat, info.long],
    zoom: 16,
    maxZoom: 20,
    minZoom: 4
  });

  var marker1 = L.marker([info.lat, info.long], { alt: 'Hotel 1', icon: myIcon }).addTo(map);

  const gl = L.maplibreGL({
    attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    style: `https://api.maptiler.com/maps/574c7158-3d19-4835-a444-8e76fa987e9d/style.json?key=SuDRyIBNxk610kfExJY8`
  }).addTo(map);

}

//  localStorage.setItem('location','"location":{"lat":40.41026,"long":49.860733}');
