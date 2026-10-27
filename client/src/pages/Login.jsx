
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type") || "";

if (!contentType.includes("application/json")) {
  const responseText = await response.text();
  console.error("Expected JSON but received:", responseText);

  throw new Error(
    "Server se JSON response nahi mila. Backend URL aur server route check karo."
  );
}

const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      localStorage.setItem("token", data.token);

      setMessage("Login successful!");

      setTimeout(() => {
        navigate("/");
      }, 700);
    } catch (error) {
      setMessage(error.message || "Unable to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <Link className="register-logo" to="/">
          Event<span>Sphere</span>
        </Link>

        <h1>Welcome Back!</h1>

        <p className="register-subtitle">
          Login to discover amazing events.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />

          <button
            type="submit"
            className="register-submit"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <p className="register-message" role="status">
            {message}
          </p>
        )}

        <p className="register-login">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

