
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "./models/Event.js";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import jwt from "jsonwebtoken";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error.message);
  });

// Home route
app.get("/", (req, res) => {
  res.send("EventSphere Backend is Running!");
});
app.get("/test", (req, res) => {
  res.json({ message: "Backend API is working!" });
});
// API: Get all events
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// API: Create a new event
app.post("/api/events", async (req, res) => {
  try {
    const { title, description, date, location, category, image } = req.body;

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      category,
      image,
    });

    const savedEvent = await newEvent.save();

    res.status(201).json({
      message: "Event created successfully!",
      event: savedEvent,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create event",
      error: error.message,
    });
  }
});


// User Registration API
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill in all fields.",
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    // Check whether the email is already registered
    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "This email is already registered.",
      });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      message: "Registration successful!",
    });
  } catch (error) {
    // Handle duplicate email and other database errors
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This email is already registered.",
      });
    }

    console.error("Registration error:", error.message);

    return res.status(500).json({
      message: "Registration failed. Please try again.",
    });
  }
});

// User Login API
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Login failed. Please try again.",
    });
  }
});



// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

