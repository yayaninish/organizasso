const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["membre", "admin"], default: "membre" },
  validated: { type: Boolean, default: false },
  avatar: { type: String, default: "" } 
});

module.exports = mongoose.model("User", userSchema);
