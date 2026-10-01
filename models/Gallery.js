const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: false
  },
  imageData: {
    type: String, // Storing base64 raw data
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
