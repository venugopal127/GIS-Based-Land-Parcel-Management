import React from "react";
import "../Pages/styles.css";
import dashboardBg from "../Pages/p4.jpg";

const UserDashboard = () => (
  <div
    className="dashboard-page full-page-dashboard"
    style={{
      backgroundImage: `url(${dashboardBg})`,
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
        maxWidth: "600px",
        width: "100%",
      }}
    >
      <h2 className="text-center mb-4">User Dashboard</h2>
      <p>Welcome to your dashboard. Manage your land parcels and view transaction history here.</p>
      <div className="button-container">
        <button className="btn btn-primary m-2">View Parcels</button>
        <button className="btn btn-secondary m-2">Add New Parcel</button>
      </div>
    </div>
  </div>
);

export default UserDashboard;
