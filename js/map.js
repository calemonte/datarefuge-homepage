const map = L.map("mapid").setView([39.491215, -100.131379], 4);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

for (let i = 0; i < locations.length; i++) {
  L.marker([locations[i].lat, locations[i].lon])
    .addTo(map)
    .bindPopup(
      `<strong>${locations[i].title}</strong>
       <br> 
       ${locations[i].description}
       <br>
       <a href='${
         locations[i].link
       }' target='_blank' rel='noopener'>Learn more</a>`
    );
}
