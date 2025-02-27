const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// Log when routes are called (for debugging)
router.post("/register", (req, res, next) => {
  console.log("📌 Register API Hit");
  next();
}, register);

router.post("/login", (req, res, next) => {
  console.log("📌 Login API Hit");
  next();
}, login);

module.exports = router;
