if (localStorage.getItem("allMapLocation") !== null || localStorage.getItem !== undefined) {
   var info = JSON.parse(localStorage.getItem("allMapLocation"));
   var myIcon = L.icon({
      iconUrl: './images/custom-marker.svg',
      iconSize: [48, 48],
      iconAnchor: [24.5, 49],
   });

   const map = L.map('map', {
      center: [40.3945925, 49.8549596],
      zoom: 11,
      maxZoom: 20,
      minZoom: 4
   });

   for (let i = 0; i < info.length; i++) {
      let newMarker = new L.marker([info[i].lat, info[i].long], { icon: myIcon })
         .bindPopup(info[i].name)
         .addTo(map);
   }

   const gl = L.maplibreGL({
      attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
      style: `https://api.maptiler.com/maps/574c7158-3d19-4835-a444-8e76fa987e9d/style.json?key=SuDRyIBNxk610kfExJY8`
   }).addTo(map);

}