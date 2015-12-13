var mongoose = require("mongoose");

var projectSchema = mongoose.Schema({
  Address: { type: String, required: true },
  description: String,
  photo: String,
  title: { type: String, required: true },
});

module.exports = mongoose.model('Project', projectSchema);