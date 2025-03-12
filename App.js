import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

// Importing components lazily for better performance
const Home = React.lazy(() => import("./components/Pages/Home"));
const Login = React.lazy(() => import("./components/Auth/Login"));
const Register = React.lazy(() => import("./components/Auth/Register"));
const UserDashboard = React.lazy(() => import("./components/Dashboard/UserDashboard"));
const AdminDashboard = React.lazy(() => import("./components/Dashboard/AdminDashboard"));
const MapView = React.lazy(() => import("./components/GIS/MapView"));
const RegisterParcel = React.lazy(() => import("./components/GIS/RegisterParcel"));
const NearbyAmenities = React.lazy(() => import("./components/GIS/NearbyAmenities"));

// Simulated authentication function (Replace with actual auth logic)
const isAuthenticated = () => {
  return localStorage.getItem("token") ? true : false;
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          {/* GIS & Map Routes */}
          <Route path="/map" element={<MapView />} />
          <Route path="/register-parcel" element={<ProtectedRoute><RegisterParcel /></ProtectedRoute>} />
          <Route path="/nearby-amenities" element={<NearbyAmenities />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
