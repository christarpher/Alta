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
  map.resize();
  map.addSource("mapbox-traffic", {
    type: "vector",
    url: "mapbox://mapbox.mapbox-traffic-v1",
  });
  map.addLayer({
    id: "traffic-data",
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
});