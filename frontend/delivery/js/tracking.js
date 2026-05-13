// ======================================
// LIVE MAP TRACKING
// ======================================

const mapDiv =

  document.getElementById(
    "map"
  );

// CHECK

if(navigator.geolocation){

  navigator.geolocation.getCurrentPosition(

    async position=>{

      // LOCATION

      const lat =
        position.coords.latitude;

      const lng =
        position.coords.longitude;

      // MAP

      const map =

        L.map("map")
        .setView([lat,lng],15);

      // TILE

      L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

          attribution:
            "PulseRx Tracking"
        }

      ).addTo(map);

      // MARKER

      L.marker([lat,lng])

      .addTo(map)

      .bindPopup(
        "🚚 Delivery Partner Location"
      )

      .openPopup();

      // AREA NAME

      try{

        const response =

          await fetch(

            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );

        const data =
          await response.json();

        const area =

          data.address.city ||

          data.address.town ||

          data.address.village ||

          "Unknown Area";

        // ADD AREA

        const areaBox =

          document.createElement(
            "h2"
          );

        areaBox.innerHTML =

          `📍 ${area}`;

        areaBox.style.marginBottom =
          "20px";

        document.body.prepend(
          areaBox
        );

      }catch(error){

        console.log(
          error
        );
      }
    },

    error=>{

      alert(
        "Location Permission Denied ❌"
      );
    }
  );
}