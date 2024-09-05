// Store the URL for the GeoJSON data
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Add a Leaflet tile layer
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create a Leaflet map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
    layers: [streets]
});

// Create a baseMaps object to hold the streetmap layer
let baseMaps = {
    "Streets": streets
};

// Define the earthquake layergroup for the map
let earthquake_data = new L.LayerGroup();

// Define the overlays and link the layergroups to separate overlays
let overlays = {
    "Earthquakes": earthquake_data
};

// Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map
L.control.layers(baseMaps, overlays).addTo(myMap);

//StyleInfo function to dictate the styling for all of the earthquake points on the map
function styleInfo(feature) {
    return {
        color: chooseColor(feature.geometry.coordinates[2]),
        radius: chooseRadius(feature.properties.mag), // Sets radius based on magnitude 
        fillColor: chooseColor(feature.geometry.coordinates[2]) // Sets fillColor based on the depth of the earthquake
    };
}

// Define a function to choose the fillColor of the earthquake based on earthquake depth
function chooseColor(depth) {
    if (depth <= 10) return "red";
    else if (depth > 10 && depth <= 25) return "orange";
    else if (depth > 25 && depth <= 40) return "yellow";
    else if (depth > 40 && depth <= 55) return "pink";
    else if (depth > 55 && depth <= 70) return "blue";
    else return "green";
}

// Define a function to determine the radius of each earthquake marker
function chooseRadius(magnitude) {
    return magnitude * 5;
}

// Pull the earthquake JSON data with d3
d3.json(url).then(function(data) {
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng).bindPopup(`Location: [${latlng.lat}, ${latlng.lng}]<br>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]}`);
        },
        style: styleInfo
    }).addTo(earthquake_data);

    earthquake_data.addTo(myMap);
});

// Create legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Depth Color Legend</h4>";
    div.innerHTML += '<i style="background-color: red"></i><span>(Depth < 10)</span><br>';
    div.innerHTML += '<i style="background-color: orange"></i><span>(10 < Depth <= 25)</span><br>';
    div.innerHTML += '<i style="background-color: yellow"></i><span>(25 < Depth <= 40)</span><br>';
    div.innerHTML += '<i style="background-color: pink"></i><span>(40 < Depth <= 55)</span><br>';
    div.innerHTML += '<i style="background-color: blue"></i><span>(55 < Depth <= 70)</span><br>';
    div.innerHTML += '<i style="background-color: green"></i><span>(Depth > 70)</span><br>';

    return div;
};

// Add the legend to the map
legend.addTo(myMap);

//collect data with d3
d3.json(url).then(function (data) {
    console.log(data);
    let features = data.features;
    console.log(features);

    let results = features.filter(id => id.id == "nc73872510"); //replace the id string with the argument of the function once created
    let first_result = results[0];
    console.log(first_result);
    let geometry = first_result.geometry;
    console.log(geometry);
    let coordinates = geometry.coordinates;
    console.log(coordinates);
    console.log(coordinates[0]); // longitude
    console.log(coordinates[1]); // latitude
    console.log(coordinates[2]); // depth of earthquake
    let magnitude = first_result.properties.mag;
    console.log(magnitude);
    //define depth variable
    let depth = geometry.coordinates[2];
    console.log(depth);
    let id = first_result.id;
    console.log(id);

});