
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddEvent from "./pages/AddEvent";
import "./App.css";

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load events");
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load events. Please check your backend.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="app">
      <header className="navbar">
        <a className="logo" href="/">
          Event<span>Sphere</span>
        </a>

        <nav>
          <a href="#home">Home</a>
          <a href="#events">Explore Events</a>
          <a href="#about">About</a>
        </nav>

        <div className="nav-actions">
          <a className="login-button" href="/login">
            Login
          </a>
          <a className="nav-button" href="/register">
            Register
          </a>
          <a className="nav-button" href="/add-event">
           Add Event
          </a>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">YOUR WORLD, YOUR EVENTS</p>
            <h1>
              Discover Events.
              <br />
              Create <span>Memories.</span>
            </h1>
            <p className="hero-description">
              Find exciting events, connect with people, and make every
              moment count with EventSphere.
            </p>
            <a href="#events" className="primary-button">
              Explore Events →
            </a>
          </div>

          <div className="hero-card">
            <div className="hero-card-icon">✦</div>
            <p>Something exciting is waiting for you.</p>
            <h2>Make it memorable.</h2>
          </div>
        </section>

        <section className="events-section" id="events">
          <div className="section-heading">
            <div>
              <p className="eyebrow">WHAT'S HAPPENING</p>
              <h2>Explore Events</h2>
            </div>
            <span className="event-count">
              {events.length} {events.length === 1 ? "Event" : "Events"}
            </span>
          </div>

          {loading ? (
            <p className="status-message">Loading events...</p>
          ) : error ? (
            <p className="status-message">{error}</p>
          ) : events.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✦</div>
              <h3>No events yet</h3>
              <p>Your next great experience will appear here.</p>
            </div>
          ) : (
            <div className="events-grid">
              {events.map((event) => (
                <article className="event-card" key={event._id}>
                  {event.image ? (
                    <img
                      className="event-image"
                      src={event.image}
                      alt={event.title}
                    />
                  ) : (
                    <div className="event-placeholder">✦</div>
                  )}

                  <div className="event-card-content">
                    <span className="event-category">{event.category}</span>
                    <h3>{event.title}</h3>
                    <p className="event-description">{event.description}</p>
                    <p className="event-detail">📍 {event.location}</p>
                    <p className="event-detail">
                      📅{" "}
                      {new Date(event.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="about-section" id="about">
          <p className="eyebrow">ABOUT EVENTSPHERE</p>
          <h2>Every event starts with an idea.</h2>
          <p>
            EventSphere brings events and people together in one place.
            Discover your interests, explore new experiences, and make
            unforgettable memories.
          </p>
        </section>
      </main>

      <footer className="footer">
        <a className="logo" href="#home">
          Event<span>Sphere</span>
        </a>
        <p>Discover experiences. Create memories.</p>
        <p>© 2026 EventSphere. All rights reserved.</p>
      </footer>
    </div>
  );
}

function App() {
return ( <BrowserRouter> <Routes>
<Route path="/" element={<Home />} />
<Route path="/register" element={<Register />} />
<Route path="/login" element={<Login />} />
<Route path="/add-event" element={<AddEvent />} /> </Routes> </BrowserRouter>
);
}

export default App;





