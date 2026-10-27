
import { useState } from "react";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  
async function handleSubmit(event) {
  event.preventDefault();
  setMessage("Registering...");

  try {
    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed.");
    }

    setMessage("Registration successful! You can now log in.");

    setFormData({
      name: "",
      email: "",
      password: "",
    });
  } catch (error) {
    setMessage(error.message || "Unable to connect to the server.");
  }
}



  return (
    <div className="register-page">
      <div className="register-card">
        <a className="register-logo" href="/">
          Event<span>Sphere</span>
        </a>

        <h1>Create Account</h1>
        <p className="register-subtitle">
          Join EventSphere and discover amazing events.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            required
          />

          <button type="submit" className="register-submit">
            Create Account
          </button>
        </form>

        {message && <p className="register-message">{message}</p>}

        <p className="register-login">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;

