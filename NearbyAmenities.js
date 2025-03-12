import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const NearbyAmenities = () => {
  const [position, setPosition] = useState([12.9716, 77.5946]); // Default to Bangalore
  const [amenities, setAmenities] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          fetchAmenities(pos.coords.latitude, pos.coords.longitude);
        },
        () => alert("Geolocation is not enabled! Using default location."),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const fetchAmenities = async (lat, lon) => {
    const query = `
      [out:json];
      (node["amenity"](around:1000, ${lat}, ${lon}););
      out body;
    `;
    try {
      const response = await axios.get(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
      );
      setAmenities(response.data.elements);
    } catch (error) {
      console.error("Error fetching amenities:", error);
    }
  };

  return (
    <MapContainer center={position} zoom={15} style={{ height: "500px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position}>
        <Popup>Your Location</Popup>
      </Marker>
      {amenities.map((amenity) => (
        <Marker key={amenity.id} position={[amenity.lat, amenity.lon]}>
          <Popup>{amenity.tags.name || "Unnamed Amenity"} ({amenity.tags.amenity})</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default NearbyAmenities;
