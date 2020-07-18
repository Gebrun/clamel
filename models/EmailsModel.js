// Import mongoose

const mongoose = require("mongoose");

// Schema

const EmailsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Model

const EmailsModel = mongoose.model("emails", EmailsSchema);
module.exports = EmailsModel;
