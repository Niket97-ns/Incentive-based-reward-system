const axios = require("axios");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const jwtSecret = config.get("jwtSecret");

// @route POST api/auth
// @desc Authenticate user
// @access Public
router.post("/", (req, res) => {
  const { email, password } = req.body;

  // Check for existing user
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    console.log("user =" + JSON.stringify(user));

    // Validate password
    bcrypt
      .compare(password, user.password)
      .then((isMatch) => {
        if (!isMatch) {
          return res.status(400).json({ msg: "Password doesn't match" });
        }
        console.log("Is Match passed");

        jwt.sign(
          { id: user.id },
          jwtSecret,
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            res.json({
              token,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
              },
            });
          }
        );
      })
      .catch((err) => {
        return res.status(400).json({ msg: "Invalid credentials" });
      });
  });
});

module.exports = router;
