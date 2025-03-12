import React from "react";
import { Link } from "react-router-dom";
import p1Image from './p1.jpg'; // Adjust path based on where you put the image
import "./styles.css";

const Home = () => (
  <div
    className="home-page"
    style={{
      backgroundImage: `url(${p1Image})`,
      backgroundRepeat: "no-repeat",  // Prevent repeating the background
      backgroundSize: "cover",  // Ensure the image covers the container
      backgroundPosition: "center",  // Center the image
    }}
  >
    <div className="container text-center">
      <div className="card">
        <h1 className="display-4 mb-3">Welcome to KNUCT Blockchain</h1>
        <p className="lead">
          Your platform for secure land parcel management and transactions using GIS and blockchain technology.
        </p>
        {/* Buttons container aligned to the right */}
        <div className="button-container">
          <div className="button-box">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          </div>
          <div className="button-box">
            <Link to="/register" className="btn btn-secondary">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Home;
