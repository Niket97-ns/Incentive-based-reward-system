const mongoose = require("mongoose");
const schema = mongoose.Schema;

// Create referral transaction schema

const ReferralTransactionSchema = new mongoose.Schema({
  referred_user: {
    type: String,
    require: true,
  },
  referred_by: {
    type: String,
    require: true,
  },
  points_gained: {
    type: Number,
    require: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  type_of_referral: {
    type: String,
    require: true,
  },
});

module.exports = ReferralTransaction = mongoose.model(
  "referral_transactions",
  ReferralTransactionSchema
);
