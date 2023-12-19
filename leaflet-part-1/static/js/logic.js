// URL for the data
const geourl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

function mapStyle(feature) {
    return {
        color: "black",
        opacity: 1,
        fillOpacity: 1,
        fillColor: mapColor(feature.geometry.coordinates[2]),
        stroke: true,
        weight: 0.5,
        radius: mapRadius(feature.properties.mag),
    };
}
// Define color grade for the earthquake depth
function mapColor(depth) {
    switch (true) {
        case depth > 90:
            return "#63350f";
        case depth > 70:
            return "#c76c22";
        case depth > 50:
            return "#f5b362";
        case depth > 30:
            return "#f5e15f";
        case depth > 10:
            return "yellow";
        default:
            return "#a9f547";
    }
}

// Establish magnitude size
function mapRadius(mag) {
    return mag == 0 ? 1 : mag * 4
}

// Create the map
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3
});
  

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    detectRetina: true
}).addTo(myMap);

// Add the legend
let legend = L.control({position: "topright"});
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend"),
  depth = [-10, 10, 30, 50, 70, 90];

  for (var i = 0; i < depth.length; i++) {
    div.innerHTML +=
    '<i style="background:' + mapColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
  }
  return div;
};

legend.addTo(myMap)

d3.json(geourl).then(function(data) {
    // Add earthquake data to the map
    L.geoJson(data, {

        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: mapStyle,

        // Activate pop-up data when circles are clicked
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);

        }
    }).addTo(myMap);
  
});