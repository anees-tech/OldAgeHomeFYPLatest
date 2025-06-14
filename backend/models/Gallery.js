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
    // Updated enum to include all categories from frontend, in lowercase
    enum: [
      'activities', 
      'facilities', 
      'events', 
      'residents', 
      'staff', 
      'dining', 
      'recreation', 
      'healthcare', 
      'celebrations', 
      'general', 
      'other' // Keep 'other' as a fallback/default
    ],
    default: 'other',
    required: true // It's good practice to require category if it's a key part of the model
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