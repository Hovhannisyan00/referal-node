const express = require("express");
const router = express.Router();
const User = require("../models/User");

const str1 = "22987";
const str2 = "10001";

// POST /users
router.post("/", async (req, res) => {
  const data = req.body;
  if (!data || typeof data.userID !== "number") {
    return res.status(400).json({ error: "Invalid data provided" });
  }

  try {
    const idKey = `${data.userID}${str1}${data.userID}${str2}${data.userID}`;
    const savedUser = new User({ userID: idKey, referralCount: 0 });
    await savedUser.save();

    res.status(201).json({ message: savedUser });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// GET /count
router.get("/count", async (req, res) => {
  try {
    const totalReferrals = await User.countDocuments();
    res.json({ totalReferrals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /user/:id
router.get("/user/:id", async (req, res) => {
  const idKey = req.params.id;
  try {
    const user = await User.findOne({ userID: idKey });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
