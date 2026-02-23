import React from 'react';
import "../styles/Register.css";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from '../utils/axios.js'; // Import the axios instance



const Register = () => {
  const [inputs, setInputs] = useState({
    UserName: "",
    Email: "",
    Password: "",
  });

  const [err, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value })); 
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/register", inputs); // Axios instance handles base URL
      setSuccess(res.data.message); // Set success message from server response
      setError(null); // Clear any previous error
      console.log(res.data.message); 
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed."); // Set error message from server response
      setSuccess(null); // Clear any previous success
    }
  }; 
 

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await fetch("http://localhost:8800/api/auth/register", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(inputs),
  //     });
  //     const data = await res.json();
  //     console.log(data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  return (
    <div className="auth">
      <h1>Register</h1>
      <form>
        <input type="text" placeholder="Username" name="UserName" onChange={handleChange} required /> 
        <input type="email" placeholder="Email" name="Email" onChange={handleChange} required />
        <input type="password" placeholder="Password" name="Password" onChange={handleChange} required />
        <button onClick={handleSubmit}>Register</button>
        {err && <p style={{ color: "red", paddingTop: "15px" }}>{err}</p>}
        {success && <p style={{ color: "green", paddingTop: "15px" }}>{success}</p>}
        <span>
          Already have an account? <Link to="/login">Login</Link>
        </span>
      </form>
    </div>
  );
};


export default Register;
