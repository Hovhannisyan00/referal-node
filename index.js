const express = require("express");
const cors = require("cors"); // Import CORS
const app = express();
const PORT = process.env.PORT || 3333;
const mongoose = require("mongoose");

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// mongoose connection
mongoose
  .connect("mongodb://localhost:27017/my-referal-tool")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

const userSchema = mongoose.Schema({
  userID: { type: Number, required: true },
  referralCount: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);
const str1 = "22987";
const str2 = "10001";

// POST /users endpoint
app.post("/users", async (req, res) => {
  const data = req.body; // id = data.userID
  if (!data || typeof data.userID !== "number") {
    return res.status(400).json({ error: "Invalid data provided" });
  }

  try {
    const idKey = data.userID + str1 + data.userID + str2 + data.userID;
    const saved = await new User({ userID: idKey, referralCount: 0 });
    await saved.save();

    res.status(201).json({ message: saved });
  } catch (error) {
    return res.status(500).send("Server error");
  }
});

// POST /update/referrals/:id endpoint
app.post("/update/referrals/:id", async (req, res) => {
  const idKey = req.params.id;
  console.log(idKey);

  const data = req.body; // id = data.userID
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
    console.log("Error in updating referral count:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /count endpoint
app.get("/count", async (req, res) => {
  try {
    const totalReferrals = await User.countDocuments();
    res.json({ totalReferrals });
  } catch (error) {
    console.log("Error in counting referrals:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /user/:id endpoint
app.get("/user/:id", async (req, res) => {
  const idKey = req.params.id;
  try {
    const user = await User.findOne({ userID: idKey });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (e) {
    console.log("Error in getting user:", e);
    res.status(500).json({ error: e.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
