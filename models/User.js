const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userID: { type: String, required: true }, // Updated to `String` for generated idKey
  referralCount: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", userSchema);
