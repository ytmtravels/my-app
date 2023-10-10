import React from "react";
import { Map } from "react-map-gl";

function MapBoxMap() {
  return (
    <Map
      mapboxAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      }}
      style={{ width: "100%", height: "100% " }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />
  );
}

export default MapBoxMap;
