const mongoose = require("mongoose");

const formDataSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  title: String,
  company: String,
  reason: String,
  cvFilePath: String,
}, { timestamps: true });

module.exports = mongoose.model("FormData", formDataSchema);
