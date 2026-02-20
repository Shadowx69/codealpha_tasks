import React, { useState, useEffect } from "react";
import axios from "../utils/axios";
import "../styles/Login.css"; // Reusing Login styles for consistency

const Profile = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    UserName: "",
    Street: "",
    City: "",
    State: "",
    ZipCode: "",
    Country: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.UserID) {
      // Fetch current user data
      axios.get(`/users/${user.UserID}`)
        .then(res => {
          const { UserName, Address } = res.data;
          let addressParts = { Street: "", City: "", State: "", ZipCode: "", Country: "" };
          
          if (Address) {
            try {
              // Try to parse if it's JSON, otherwise treat as plain string or split by comma
              // For simplicity, let's assume we store it as a comma-separated string: "Street, City, State, Zip, Country"
              const parts = Address.split(',').map(s => s.trim());
              if (parts.length >= 5) {
                 addressParts = {
                    Street: parts[0],
                    City: parts[1],
                    State: parts[2],
                    ZipCode: parts[3],
                    Country: parts[4]
                 };
              } else {
                  // Fallback if format doesn't match
                  addressParts.Street = Address;
              }
            } catch (e) {
              console.error("Error parsing address", e);
            }
          }

          setFormData({
            UserName: UserName || "",
            ...addressParts
          });
        })
        .catch(err => console.error(err));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const fullAddress = `${formData.Street}, ${formData.City}, ${formData.State}, ${formData.ZipCode}, ${formData.Country}`;

    try {
      await axios.put(`/users/${user.UserID}/address`, {
        address: fullAddress,
        UserName: formData.UserName
      });
      
      // Update local user state
      setUser({ ...user, UserName: formData.UserName });
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile.");
      console.error(err);
    }
  };

  if (!user) return <div className="auth"><h1>Please Login</h1></div>;

  return (
    <div className="auth">
      <h1>My Profile</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
        <div style={{ textAlign: 'left', width: '100%', marginBottom: '10px' }}>
            <label style={{ color: '#ccc', fontSize: '0.9rem' }}>Name</label>
            <input
            type="text"
            name="UserName"
            value={formData.UserName}
            onChange={handleChange}
            placeholder="Full Name"
            required
            />
        </div>

        <div style={{ textAlign: 'left', width: '100%', marginBottom: '10px' }}>
            <label style={{ color: '#ccc', fontSize: '0.9rem' }}>Street Address</label>
            <input
            type="text"
            name="Street"
            value={formData.Street}
            onChange={handleChange}
            placeholder="123 Main St"
            required
            />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ textAlign: 'left', width: '100%', marginBottom: '10px' }}>
                <label style={{ color: '#ccc', fontSize: '0.9rem' }}>City</label>
                <input
                type="text"
                name="City"
                value={formData.City}
                onChange={handleChange}
                placeholder="City"
                required
                />
            </div>
            <div style={{ textAlign: 'left', width: '100%', marginBottom: '10px' }}>
                <label style={{ color: '#ccc', fontSize: '0.9rem' }}>State</label>
                <input
                type="text"
                name="State"
                value={formData.State}
                onChange={handleChange}
                placeholder="State"
                required
                />
            </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ textAlign: 'left', width: '100%', marginBottom: '10px' }}>
                <label style={{ color: '#ccc', fontSize: '0.9rem' }}>Zip Code</label>
                <input
                type="text"
                name="ZipCode"
                value={formData.ZipCode}
                onChange={handleChange}
                placeholder="Zip Code"
                required
                />
            </div>
            <div style={{ textAlign: 'left', width: '100%', marginBottom: '10px' }}>
                <label style={{ color: '#ccc', fontSize: '0.9rem' }}>Country</label>
                <input
                type="text"
                name="Country"
                value={formData.Country}
                onChange={handleChange}
                placeholder="Country"
                required
                />
            </div>
        </div>

        <button type="submit">Save Changes</button>

        {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </form>
    </div>
  );
};

export default Profile;
