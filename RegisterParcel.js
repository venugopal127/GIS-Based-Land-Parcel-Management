import React, { useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Polygon } from "react-leaflet";
import "../Pages/styles.css";
import parcelBg from "../Pages/p2.jpg";

const RegisterParcel = () => {
  const [parcelDetails, setParcelDetails] = useState({
    owner: "",
    size: "",
    description: "",
    coordinates: [],
  });

  const [polygonCoords, setPolygonCoords] = useState([]);

  // Handle map clicks to collect parcel coordinates
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setPolygonCoords((prevCoords) => [...prevCoords, [lat, lng]]);
      },
    });
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setParcelDetails({ ...parcelDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission and save data
    alert(`Parcel Registered:\n${JSON.stringify(parcelDetails, null, 2)}`);
    setParcelDetails({
      owner: "",
      size: "",
      description: "",
      coordinates: [],
    });
    setPolygonCoords([]);
  };

  return (
    <div
      className="register-parcel-page full-page-register"
      style={{
        backgroundImage: `url(${parcelBg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="form-container"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "30px",
          borderRadius: "8px",
          maxWidth: "800px",
          width: "100%",
        }}
      >
        <h2 className="text-center mb-4">Register Parcel</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Owner Name :</label>
            <input
              type="text"
              name="owner"
              className="form-control"
              value={parcelDetails.owner}
              onChange={handleInputChange}
              placeholder="Enter owner's name"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Parcel Size (in acres) :</label>
            <input
              type="number"
              name="size"
              className="form-control"
              value={parcelDetails.size}
              onChange={handleInputChange}
              placeholder="Enter parcel size"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description :</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={parcelDetails.description}
              onChange={handleInputChange}
              placeholder="Enter additional details"
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Draw Parcel Boundary (Click on Map) :</label>
            <MapContainer
              center={[51.505, -0.09]}
              zoom={13}
              style={{ height: "400px", width: "100%", borderRadius: "8px" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapClickHandler />
              {polygonCoords.length > 0 && (
                <Polygon
                  positions={polygonCoords}
                  color="blue"
                  pathOptions={{ fillOpacity: 0.4 }}
                />
              )}
            </MapContainer>
          </div>
          <div className="button-container">
            <button type="submit" className="btn btn-primary">
              Register Parcel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterParcel;
