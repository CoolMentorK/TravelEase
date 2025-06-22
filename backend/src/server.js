const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config(); // Loads .env before anything else

// Middleware setup
app.use(express.json());
app.use(require('cors')());

// MongoDB connection using env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Health check route
app.get("/", (req, res) => res.send("TravelEase backend up!"));

// Dynamic port from env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));