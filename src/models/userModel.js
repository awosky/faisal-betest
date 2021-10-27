const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: Number,
    required: true,
  },
  emailAddress: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  identityNumber: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", userSchema);
