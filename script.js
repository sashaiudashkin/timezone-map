mapboxgl.accessToken =
  "pk.eyJ1Ijoic2FzaGFpdWRhc2hraW4iLCJhIjoiY21kYzJ1cmF1MGJzNjJsczVkajN5ejZ6NCJ9.lnafZ1Qc_yEmyek6jscXOA";

const bounds = [
  [-46.957625601922075, 7.188501764452468], // Southwest coordinates
  [94.47640973093763, 72.00642873871325], // Northeast coordinates
];
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/sashaiudashkin/cmdhp77m4000c01sk5wu46x1e",
  config: {
    basemap: {
      theme: "monochrome",
    },
  },
  center: [36.26853255849761, 47.599270015725835],
  zoom: 1,
  maxBounds: bounds,
  preserveDrawingBuffer: true,
  customAttribution:
    'created by <a style="padding: 0 3px 0 3px; color:#FFFFFF; background-color: #000000;" target="_blank" href=http://www.geocadder.bg/en/portfolio.html>GEOCADDER</a>',
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

map.on("load", () => {
  map.addSource("dem", {
    type: "raster-dem",
    url: "mapbox://mapbox.mapbox-terrain-dem-v1",
  });
  map.addLayer({
    id: "hillshading",
    source: "dem",
    type: "hillshade",
    slot: "bottom",
  });
});

// add points from Google Sheets table
$.getJSON(
  "https://sheets.googleapis.com/v4/spreadsheets/1i174PBQXnEr436_j3ugQskMFhvB_jgyw8QiayWqWctI/values/Sheet1!A2:J3000?majorDimension=ROWS&key=AIzaSyAC0xe-T82T5td_Kjotz_vvtewJJs-ilYE",
  function (response) {
    var coordsArray = [];

    response.values.forEach(function (marker) {
      if (typeof marker[0] !== "undefined") {
        var markerId = marker[0];
        var name = marker[1];
        var subscribers = marker[2];
        var views = marker[3];
        var year = marker[4];
        var cityCountry = marker[5];
        var longitude = marker[6];
        var latitude = marker[7];
        var iframe = marker[8];
        var picture = marker[9];

        iframeModified = iframe.replace(/si=[^"&]+/, "autoplay=1&mute=1&controls=0&modestbranding=1&rel=0");
        iframeModified = iframeModified.replace(
          'width="560"',
          '"width="300px"'
        );
        iframeModified = iframeModified.replace(
          'height="315"',
          'height="171px"'
        );

        var pointCoordsArray = [latitude, longitude];
        coordsArray.push(pointCoordsArray);

        var el = document.createElement("span");
        el.className = "marker " + markerId;

        el.innerHTML =
          "<div class='marker-icon-text-container'><div class='marker-icon-text'><p>" +
          name +
          "</p><p>" +
          subscribers +
          " subscribers</p><p>" +
          views +
          " views</p><p>" +
          year +
          "</p><p>" +
          cityCountry +
          "</p></div></div>";

        var popupContent = "";
        popupContent += "";
        if (picture) {
          popupContent +=
            "<div class='iframe-class'>" +
            iframeModified +
            "</div><div class='popup-image'><img src = '" +
            picture +
            "'></div>";
        }

        var popup = new mapboxgl.Popup({ closeOnClick: false }).setHTML(
          popupContent
        );

        new mapboxgl.Marker(el)
          .setLngLat([latitude, longitude])
          .setPopup(popup)
          .addTo(map);

        popup.on("open", function () {
          $(el).addClass("active");
        });

        popup.on("close", function () {
          $(el).removeClass("active");
        });
      }
    });

    // close all opened popups
    // $(".marker").click(function () {
    //   $(".mapboxgl-popup").remove();
    // });

    $(".mapboxgl-canvas").click(function () {
      $(".mapboxgl-popup").remove();
      $(".marker").removeClass("active");
    });

    // $(".marker-icon-text").click(function () {
    //   $(".mapboxgl-popup").remove();
    // });

    // $(".marker-icon-text").click(function () {
    //   $(".mapboxgl-popup").remove();
    // });

    // map.fitBounds(australiaBounds);
  }
);
