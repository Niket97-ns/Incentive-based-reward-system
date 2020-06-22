const express = require("express");
const router = express.Router();
const config = require("config");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// @route GET /referralCode
// @desc Check if that user exists
// @access public

router.post("/", (req, res) => {
  const { email, referralCode } = req.body;

  User.findOne({ referral_code: referralCode }).then((user) => {
    // Prevent user from entering his own code
    if (!user || user.email == email) {
      return res.status(400).json({ msg: "Invalid Referral Code" });
    } else {
      return res.status(200).json({ msg: "Correct Referral" });
    }
  });
});

module.exports = router;
