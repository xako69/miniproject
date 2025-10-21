import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/adminlogin.css'; // (Optional: You can create this CSS file for styling)

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,   // the username user typed
        password: password,   // the password user typed
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Save access token
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      alert("Login successful!");
      // Redirect to next page (like home page)
      navigate("/home");

    } else {
      alert("Login failed: " + data.detail);
    }
  } catch (error) {
    alert("Something went wrong.");
    console.error("Error:", error);
  }
};


  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4">Faculty Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
