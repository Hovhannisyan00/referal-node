const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST /update/referrals/:id
router.post("/referrals/:id", async (req, res) => {
  const data = req.body;
  if (!data || !data.userID) {
    return res
      .status(400)
      .json({ error: "Invalid data provided. 'userID' must be specified." });
  }

  try {
    const user = await User.findOneAndUpdate(
      { userID: data.userID },
      { $inc: { referralCount: 1 } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
