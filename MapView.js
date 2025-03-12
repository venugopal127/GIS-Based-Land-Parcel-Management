import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import api from "../../utils/api";

const MapComponent = () => {
  const [parcels, setParcels] = useState([]);

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const response = await api.get("/parcels");
        const parsedParcels = response.data.map((parcel) => ({
          id: parcel.id,
          path: JSON.parse(parcel.geom).coordinates[0].map(([lng, lat]) => [lat, lng])
        }));
        setParcels(parsedParcels);
      } catch (error) {
        console.error("Error fetching parcels:", error);
      }
    };
    fetchParcels();
  }, []);

  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {parcels.map((parcel) => (
        <Polygon key={parcel.id} positions={parcel.path} color="blue" />
      ))}
    </MapContainer>
  );
};

export default MapComponent;
