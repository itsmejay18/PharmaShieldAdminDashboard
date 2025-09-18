var map = L.map('map')
map.setView([6.74434, 125.35559], 7);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

navigator.geolocation.watchPosition(success, error);

let marker, circle, zoomed;

var greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});




// Function to generate popup content
function createScanPopup(pharmacyName, valid, duplicate, expired, suspicious) {
  // clone template node (safe to modify)
  const template = document.querySelector("#scan-popup-template .scan-popup").cloneNode(true);

  // set header
  template.querySelector(".scan-header").textContent = pharmacyName;

  // set counts — include parentheses so they stay glued to the number
  template.querySelector(".count-valid").textContent = `(${valid})`;
  template.querySelector(".count-duplicate").textContent = `(${duplicate})`;
  template.querySelector(".count-expired").textContent = `(${expired})`;
  template.querySelector(".count-suspicious").textContent = `(${suspicious})`;

  return template.outerHTML;
}

// Example usage:
var maker3 = L.marker([6.746268, 125.354945], {icon: greenIcon}).addTo(map);
maker3.bindPopup(createScanPopup("Pharmacy 1", 17, 5, 3, 2));



function success(pos){

    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const accuracy = pos.coords.accuracy;

    if (marker){
        map.removeLayer(marker);
        map.removeLayer(circle);
    }

    marker = L.marker([lat, lng],{title: "Your Location"}).addTo(map);
    circle = L.circle([lat, lng], {radius: accuracy}).addTo(map);

    if (!zoomed){
        zoomed = map.fitBounds(circle.getBounds());
    }

    map.setView([lat ,lng], 14);
  
}

function error(err){
    if(err.code === 1) {
        alert("Please allow geolocation access");
    }else{
        alert("Cannot get current location");
    }
}