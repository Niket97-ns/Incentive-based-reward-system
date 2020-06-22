const mongoose = require("mongoose");
const schema = mongoose.Schema;

// Create User Schema

const UserSchema = new schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  mobile_number: {
    type: String,
    require: true,
  },
  referred_by: {
    type: String,
    default: null,
  },
  total_points: {
    type: Number,
    default: 0,
  },
  points_redeemed: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    default: "Bronze",
  },
  level_of_user: {
    type: String,
    require: true,
  },
  referral_code: {
    type: String,
    require: true,
  },
  allowal_date_to_redeem: {
    type: Date,
    default: null,
  },
});

module.exports = User = mongoose.model("users", UserSchema);
