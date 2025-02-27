const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
  profileImage: String, // Store image path or S3 URL
});

module.exports = mongoose.model("User", UserSchema);
