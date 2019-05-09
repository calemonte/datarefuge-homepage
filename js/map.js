(function initMap() {
  const request = new XMLHttpRequest();
  request.open("GET", "./data/locations.csv", true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      const resp = request.responseText;

      // Pull out our headers.
      let linebreaks = resp.split(/\n|\r\n/);
      const headers = linebreaks[0].split(",");

      // For each linebreak, create a new object containing our data.
      let locations = [];
      for (let i = 1; i < linebreaks.length; i++) {
        let col = CSVtoArray(linebreaks[i]);

        if (col.length == headers.length) {
          let location = {};
          for (let j = 0; j < headers.length; j++) {
            location[headers[j]] = col[j];
          }

          locations.push(location);
        } else {
          console.error("CSV headers do not match number of columns.");
        }
      }

      genMap(locations);
    } else {
      console.error(request.error);
    }
  };

  request.send();
})();

// Generate our mapbox based on locations array.
function genMap(locations) {
  const map = L.map("mapid").setView([39.491215, -100.131379], 4);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  for (let i = 0; i < locations.length; i++) {
    console.log(locations[i]);
    L.marker([locations[i].lat, locations[i].lon])
      .addTo(map)
      .bindPopup(
        `<h1>${locations[i].title}</h1>
       <p>${locations[i].description}</p>
       <a href='${
         locations[i].link
       }' target='_blank' rel='noopener'><button>Learn more</button></a>`
      );
  }
}

// Function courtesy Daniel Couper via Quora (https://www.quora.com/How-can-I-parse-a-CSV-string-with-Javascript).
function CSVtoArray(text) {
  const re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
  const re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
  if (!re_valid.test(text)) return null;
  let a = [];
  text.replace(re_value, function(m0, m1, m2, m3) {
    if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
    else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
    else if (m3 !== undefined) a.push(m3);
    return "";
  });
  if (/,\s*$/.test(text)) a.push("");
  return a;
}
