// ======================================
// MAP
// ======================================

const map = L.map("map").setView(
  [19.0760, 72.8777],
  13
);

// ======================================
// TILE LAYER
// ======================================

L.tileLayer(

  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

  {

    attribution:
      "&copy; OpenStreetMap"
  }

).addTo(map);

// ======================================
// USER LOCATION
// ======================================

const userMarker = L.marker(

  [19.0760, 72.8777]

).addTo(map)

.bindPopup(
  "📍 Your Location"
)

.openPopup();

// ======================================
// DELIVERY BOY
// ======================================

const deliveryMarker = L.marker(

  [19.0860, 72.8877]

).addTo(map)

.bindPopup(
  "🚚 Delivery Boy"
);

// ======================================
// LIVE MOVEMENT
// ======================================

let lat = 19.0860;
let lng = 72.8877;

setInterval(() => {

  lat -= 0.0005;
  lng -= 0.0005;

  deliveryMarker.setLatLng(
    [lat, lng]
  );

}, 2000);

// ======================================
// CALL BUTTON
// ======================================

document.querySelector(
  ".call-btn"
).addEventListener(
  "click",
  () => {

    window.location.href =
      "tel:+919876543210";
  }
);

// ======================================
// DASHBOARD
// ======================================

function goDashboard(){

  window.location.href =
    "dashboard.html";
}