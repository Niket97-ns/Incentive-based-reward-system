const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("config");
const User = require("../models/User");
const ReferralTransaction = require("../models/ReferralTransaction");

const customId = require("custom-id");
const ObjectId = require("mongodb").ObjectID;

// @route POST /referralTransactions
// @desc add transactions and the required changes
// @access public

router.post("/", (req, res) => {
  // Get data from request
  const { email, level_of_user } = req.body;
  var referred_user, referred_by;

  // Calculate points gained
  var points = config.get("points");
  points = parseInt(points[level_of_user]);

  // Create document of referralTransaction

  User.findOne({ email }).then((user) => {
    const r_transaction = new ReferralTransaction({
      points_gained: points,
      type_of_referral: "Direct",
      referred_by: user.referred_by,
      referred_user: user._id,
    });
    referred_by = user.referred_by;

    User.updateOne({ _id: referred_by }, { $inc: { total_points: points } })
      .then((user) => console.log("Referred_By user updated"))
      .catch((err) => {
        console.log(err);
      });

    r_transaction
      .save()
      .then((transaction) => {
        return res.status(200).json({ msg: "Successful" });
      })
      .catch((err) => {
        console.log("r " + err);
      });
  });
});

module.exports = router;
