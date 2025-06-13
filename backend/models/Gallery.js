const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['facilities', 'activities', 'events', 'residents', 'staff', 'other'],
    default: 'other'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [{
    type: String,
    trim: true
  }],
  dateOfEvent: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Gallery", GallerySchema);