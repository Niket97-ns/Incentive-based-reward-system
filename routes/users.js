const axios = require("axios");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const ReferralTransaction = require("../models/ReferralTransaction");

const customId = require("custom-id");
const ObjectId = require("mongodb").ObjectID;

// @route POST /users
// @desc register user
// @access public

const jwtSecret = config.get("jwtSecret");

router.post("/", (req, res) => {
  const {
    name,
    email,
    password,
    mobile_number,
    referralCode,
    level_of_user,
  } = req.body;

  // Check for existing user
  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    let custom_id = customId({
      name: name,
      email: email,
    });
    const newUser = new User({
      name,
      password,
      email,
      mobile_number,
      level_of_user,
      referral_code: custom_id,
    });

    if (referralCode !== null) {
      User.findOne({ referral_code: referralCode }).then((user) => {
        newUser.referred_by = user._id;
      });
    } else {
      newUser.referred_by = "";
    }
    // Create salt and hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then((user) => {
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
            return res.status(400).json({ err });
          });
      });
    });
  });
});

router.get("/", auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then((user) => {
      return res.json({ user: user });
    })
    .catch((err) => {
      return res.status(440).json({ msg: "User token invalid/expired" });
    });
});

module.exports = router;
