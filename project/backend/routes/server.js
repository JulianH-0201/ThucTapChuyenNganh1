const express = require("express");
const path = require("path");
const cors = require("cors");
const artists = require("./artists");
const admin = require("./admin");
const app = express();
const port = 3000;
//authentication
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Parse JSON bodies (for future POST/PUT endpoints)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// Enable CORS so frontend (vite) can access this API
app.use(cors());
//Login and register
mongoose
  .connect("mongodb://127.0.0.1/node")
  .then(() => {
    console.log("MongoDB connected successfully. ");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
//for register
app.post("/register", (req, res) => {
  const newUser = new User();
  newUser.name = req.body.name;
  newUser.email = req.body.email;
  newUser.password = req.body.password;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newUser.password, salt, function (err, hash) {
      if (err) {
        return res.json({
          success: false,
          message: "Error hashing password",
          error: err.message,
        });
      }
      newUser.password = hash;

      newUser
        .save()
        .then((userSave) => {
          res.json({ success: true, message: "User registered successfully" });
        })
        .catch((err) => {
          res.json({
            success: false,
            message: "User registration error",
            error: err.message,
          });
        });
    });
  });
});
//for login
app.post("/login", (req, res) => {
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
              name: user.name,
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

// api routes
app.use("/api/artists", artists);

// admin API
app.use("/api/admin", admin);

// access songs
app.use(express.static(path.join(__dirname, "..", "public")));

// just port
app.listen(port, () => console.log(`Server is running at port ${port}`));
