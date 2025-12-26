// routes/user.route.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User.model"); // Đảm bảo đường dẫn này đúng

// POST /register
router.post("/register", async (req, res, next) => {
  const { username, email, password } = req.body;
  let errors = [];

  // Validation
  if (!username)
    errors.push({ field: "username", message: "Username is required" });
  if (!email) errors.push({ field: "email", message: "E-mail is required" });
  if (!password || password.length < 6) {
    errors.push({
      field: "password",
      message: "Password must be at least 6 characters",
    });
  }

  if (errors.length > 0) {
    return res
      .status(400)
      .json({ success: false, message: "Validation failed", errors: errors });
  }

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(409)
        .json({ success: false, message: "Email is already registered!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email: email,
      password: hash,
      username: username,
    });

    await newUser.save();
    return res
      .status(201)
      .json({ success: true, message: "Successfully registered!" });
  } catch (err) {
    console.error("Registration Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error during registration." });
  }
});

// POST /login
router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, matched) => {
          if (err)
            return res.json({
              success: false,
              message: "Error comparing passwords",
              error: err.message,
            });
          if (matched) {
            res.json({
              success: true,
              message: "Login successful",
              user,
            });
          } else {
            res.json({ success: false, message: "Password incorrect" });
          }
        });
      } else {
        res.json({ success: false, message: "User not found" });
      }
    })
    .catch((err) => {
      res.json({
        success: false,
        message: "Error finding user",
        error: err.message,
      });
    });
});

module.exports = router;
