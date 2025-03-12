import React, { useEffect, useState } from "react";
import api from "../../utils/api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [parcels, setParcels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userRes = await api.get("/users");
      const parcelRes = await api.get("/parcels");
      setUsers(userRes.data);
      setParcels(parcelRes.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Users</h3>
      <ul>{users.map((user) => <li key={user.id}>{user.name} - {user.email}</li>)}</ul>
      <h3>Parcels</h3>
      <ul>{parcels.map((parcel) => <li key={parcel.id}>Parcel ID: {parcel.id}</li>)}</ul>
    </div>
  );
};

export default AdminDashboard;
