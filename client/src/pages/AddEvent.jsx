import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function AddEvent() {
const navigate = useNavigate();

const [formData, setFormData] = useState({
title: "",
description: "",
date: "",
location: "",
category: "",
image: "",
});

const [message, setMessage] = useState("");
const [isLoading, setIsLoading] = useState(false);

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
  const response = await fetch("http://localhost:5000/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error("Server se valid response nahi mila.");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Event add nahi hua.");
  }

  setMessage("Event successfully add ho gaya!");

  setTimeout(() => {
    navigate("/");
  }, 1000);
} catch (error) {
  setMessage(error.message || "Backend se connect nahi ho pa raha.");
} finally {
  setIsLoading(false);
}


}

return ( <div className="register-page"> <div className="register-card"> <Link className="register-logo" to="/">
Event<span>Sphere</span> </Link>


    <h1>Add New Event</h1>
    <p className="register-subtitle">
      Apna next exciting event create karo.
    </p>

    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Event Title</label>
      <input
        id="title"
        name="title"
        placeholder="Enter event title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        placeholder="Describe your event"
        value={formData.description}
        onChange={handleChange}
        required
        rows="4"
      />

      <label htmlFor="date">Event Date</label>
      <input
        id="date"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <label htmlFor="location">Location</label>
      <input
        id="location"
        name="location"
        placeholder="Enter event location"
        value={formData.location}
        onChange={handleChange}
        required
      />

      <label htmlFor="category">Category</label>
      <select
        id="category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      >
        <option value="">Select category</option>
        <option value="Music">Music</option>
        <option value="Technology">Technology</option>
        <option value="Sports">Sports</option>
        <option value="Education">Education</option>
        <option value="Business">Business</option>
        <option value="Other">Other</option>
      </select>

      <label htmlFor="image">Image URL (optional)</label>
      <input
        id="image"
        name="image"
        type="url"
        placeholder="https://example.com/image.jpg"
        value={formData.image}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="register-submit"
        disabled={isLoading}
      >
        {isLoading ? "Adding Event..." : "Add Event"}
      </button>
    </form>

    {message && (
      <p className="register-message" role="status">
        {message}
      </p>
    )}

    <p className="register-login">
      <Link to="/">Back to Home</Link>
    </p>
  </div>
</div>


);
}

export default AddEvent;
