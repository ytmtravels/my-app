// components/Map.js
import React, { useState } from "react";
import L from "leaflet";
import MarkerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MapPopup from "./MapPopup";

function Map({ data, isOpen }) {
  const listPosition = [
    { lat: "23.73283", long: "90.398619" },
    { lat: "23.83333", long: "88.91667" },
  ];
  console.log("map data: ", data);
  const position = [23.73283, 90.398619];
  return (
    <MapContainer
      style={{ width: "100%", height: "100%", zIndex: "49" }}
      center={position}
      zoom={2}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {data?.map((item, index) => (
        <Marker
          key={index}
          position={[item.latitude, item.longitude]}
          icon={
            new L.Icon({
              iconUrl: "/assets/map-pin.svg",
              iconSize: [48, 60],
              iconAnchor: [12.5, 41],
              popupAnchor: [0, -41],
              shadowUrl: MarkerShadow.src,
              shadowSize: [41, 41],
            })
          }
        >
          {console.log("lat: ", item.lat + "," + item.long)}
          <Popup closeButton={false}>
            <MapPopup isOpen={isOpen} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Map;
