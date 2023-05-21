// Create an initial map object
// Set the longitude, latitude, and the starting zoom level
let myMap = L.map("map").setView([37.09, -95.71], 5);


// Add a tile layer (the background map image) to the map. 
// Use the addTo method to add objects to our map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// Load the GeoJSON data.
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Get the data with d3. Perform a GET request to the query URL (as in excercise 10 in Module 15.1)
d3.json(geoData).then(function(data){
// Once we get a response, send the data.features object to the createFeatures function to create the earthquake markers
createFeatures(data.features);
// control is the legend and postion si where to locate lehgend
var legend = L.control({position:"bottomright"});
legend.onAdd = function(myMap){
    var div = L.DomUtil.create("div","legend");
    div.innerHTML += '<i style="background: #98ee00"></i><span>0-10</span><br>';
    div.innerHTML += '<i style="background: #d4ee00"></i><span>11-30</span><br>';
    div.innerHTML += '<i style="background: #eecc00"></i><span>31-50</span><br>';
    div.innerHTML += '<i style="background: #ee9c00"></i><span>51-70</span><br>';
    div.innerHTML += '<i style="background: #ea822c"></i><span>71-90</span><br>';
    div.innerHTML += '<i style="background: #ea2c2c"></i><span>90+</span><br>';
    return div;
}
legend.addTo(myMap);
});   


// The "createFeatures" function is responsible for creating the earthquake markers on the map. It takes in the "features" array as a parameter, which represents the individual 
// earthquake data. Inside the function, we iterate over each feature using the "forEach" method. For each feature, we extract the magnitude, depth, and coordinates of the earthquake. 
// The "coordinates" variable is an array containing the latitude and longitude values. The original GeoJSON data has the coordinates in the format "[longitude, latitude]", so we 
// swap the values to "[latitude, longitude]" for Leaflet to correctly position the markers on the map. Next, we create a "L.circleMarker" object at the specified coordinates. 
// The marker's properties include:
//  • "fillOpacity" set to "1" for full opacity
//  • "radius" calculated as "magnitude * 4" to determine the size of the marker based on the earthquake's magnitude
//  • "fillColor" set by calling the "getColor" function and passing the depth value to determine the appropriate color for the marker
//  • "color" set to "#000000" (black)
//  • "weight" set to "0.5" to specify the stroke weight of the marker
// The ".bindPopup" method is used to attach a popup to each marker. Inside the popup, we display the magnitude, depth, and location of the earthquake by accessing the corresponding
// values from the "feature" object. Finally, the marker is added to the "myMap" object using the ".addTo" method. (15.3 activity 2 shows how to create a marker and bind a pop up).

function createFeatures(features) {
    features.forEach(function (feature) {
        let magnitude = feature.properties.mag;
        let depth = feature.geometry.coordinates[2];
        let coordinates = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]; // Swap lat and lon

        let marker = L.circleMarker(coordinates, {
            fillOpacity: 1,
            radius: magnitude * 4,
            fillColor: getColor(depth),
            color: "#000000",
            weight: 0.5
        }).bindPopup(
            "Magnitude: " + magnitude +
            "<br>Depth: " + depth +
            "<br>Location: " + feature.properties.place
        ).addTo(myMap);
    });
}

// Function to determine the color based on depth
// The "getColor" function determines the appropriate color for the earthquake marker based on the depth value. It uses a "switch" statement to check the depth value against
//  different ranges and returns the corresponding color code. For example, if the depth is greater than 90, it returns "#ea2c2c" which represents a red color. If the depth 
// falls into the range of 70-90, it returns "#ea822c", an orange color, and so on. These functions work together to create the earthquake markers
function getColor(depth) {
    switch (true) {
        case depth > 90:
            return "#ea2c2c";
        case depth > 70:
            return "#ea822c";
        case depth > 50:
            return "#ee9c00";
        case depth > 30:
            return "#eecc00";
        case depth > 10:
            return "#d4ee00";
        default:
            return "#98ee00";
    }
}

