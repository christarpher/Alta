import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

import "./index.scss";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWx0YS1kZW52ZXIiLCJhIjoiY2s2czlyeHZlMDB0bzNlcjQ0MnoweGhtayJ9.A_2JYo7d7yPDljD96RCrEQ";

const map = new mapboxgl.Map({
  container: "map-container",
  style: "mapbox://styles/mapbox/streets-v11",
  zoom: 13,
  center: [-122.675, 45.5051],
});

map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
  })
);

map.on("load", () => {

  map.addSource("mapbox-traffic", {
    type: "vector",
    url: "mapbox://mapbox.mapbox-traffic-v1",
  });

  map.addLayer({
    id: "Traffic Data",
    type: "line",
    source: "mapbox-traffic",
    "source-layer": "traffic",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-width": 1.5,
      "line-color": [
        "case",
        ["==", "low", ["get", "congestion"]],
        "#00908C",
        ["==", "moderate", ["get", "congestion"]],
        "#3862AE",
        ["==", "heavy", ["get", "congestion"]],
        "#ee4e8b",
        ["==", "severe", ["get", "congestion"]],
        "#b43b71",
        "#222222",
      ],
    },
  });

  map.addSource("contours", {
    type: "vector",
    url: "mapbox://mapbox.mapbox-terrain-v2"
  });

  map.addLayer({
    "id": "Contour Lines",
    "type": "line",
    "source": "contours",
    "source-layer": "contour",
    "layout": {
      "visibility": "none",
      "line-join": "round",
      "line-cap": "round"
    },
    "paint": {
      "line-color": "#877b59",
      "line-width": 1
    }
    });
});

map.on("idle", function () {
  if (map.getLayer("Traffic Data") && map.getLayer("Contour Lines")) {
    var toggleableLayerIds = ["Traffic Data", "Contour Lines"];
    // Set up the corresponding toggle button for each layer.
    for (var i = 0; i < toggleableLayerIds.length; i++) {
      var id = toggleableLayerIds[i];
      if (!document.getElementById(id)) {
        // Create a link.
        var link = document.createElement("a");
        link.id = id;
        link.href = "#";
        link.textContent = id;
        if(id == "Contour Lines"){
          link.className = "";
        } else {
          link.className = "active";
        }
        // Show or hide layer when the toggle is clicked.
        link.onclick = function (e) {
          var clickedLayer = this.textContent;
          e.preventDefault();
          e.stopPropagation();
          var visibility = map.getLayoutProperty(
            clickedLayer,
            "visibility"
          );
          // Toggle layer visibility by changing the layout object's visibility property.
          if (visibility === "visible") {
            map.setLayoutProperty(
              clickedLayer,
              "visibility",
              "none"
            );
            this.className = "";
          } else {
            this.className = "active";
            map.setLayoutProperty(
              clickedLayer,
              "visibility",
              "visible"
            );
          }
        };
        
        var layers = document.getElementById("menu");
        layers.appendChild(link);
      }
    }
  }
});