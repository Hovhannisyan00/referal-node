const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Import routes
const userRoutes = require("./routes/users");
const referralRoutes = require("./routes/referrals");

// Use routes
app.use("/users", userRoutes);
app.use("/update", referralRoutes);

module.exports = app;
