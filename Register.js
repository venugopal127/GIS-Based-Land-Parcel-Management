import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api"; // Ensure api.js is properly set up
import p1Image from '../Pages/p3.jpg'; // Adjust path if needed
import "../Pages/styles.css";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });
  const [privshareUrl, setPrivshareUrl] = useState(null); // ✅ Store Private Share URL
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await api.post("/auth/register", formData);
      alert("Registration successful!");

      // ✅ Store the Private Share URL from backend response
      setPrivshareUrl(response.data.privshareUrl);
      setLoading(false); // End loading

    } catch (error) {
      alert("Registration failed: " + error.response?.data?.error || error.message);
      setLoading(false); // End loading even if it fails
    }
  };

  return (
    <div
      className="register-page full-page-login"
      style={{
        backgroundImage: `url(${p1Image})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container">
        <div className="card login-card">
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
              disabled={loading} // Disable input during loading
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              disabled={loading} // Disable input during loading
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              disabled={loading} // Disable input during loading
            />
            <div className="button-container">
              <div className="button-box">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </button>
              </div>
            </div>
          </form>

          {/* ✅ Show Download Button After Successful Registration */}
          {privshareUrl && (
            <div className="download-section">
              <p>Download your Private Share:</p>
              <a href={privshareUrl} download="privshare.png">
                <button className="btn btn-success">Download</button>
              </a>
            </div>
          )}

          {/* Loading Spinner */}
          {loading && (
            <div className="loading-section">
              <div className="spinner"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
