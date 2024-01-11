const mongoose = require("mongoose");

const imagesSchema = mongoose.Schema({
  title: { type: String, required: true },
  file: { type: String, required: true },
});

module.exports = mongoose.model("Image", imagesSchema);
