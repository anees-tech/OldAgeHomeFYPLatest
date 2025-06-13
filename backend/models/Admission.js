const mongoose = require("mongoose");

const AdmissionSchema = new mongoose.Schema({
  // Applicant Information
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  maritalStatus: { type: String },
  
  // Contact Information
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  
  // Emergency Contact
  emergencyContactName: { type: String, required: true },
  emergencyContactPhone: { type: String, required: true },
  emergencyContactRelation: { type: String, required: true },
  
  // Medical Information
  primaryPhysician: { type: String },
  medicalConditions: { type: String },
  medications: { type: String },
  mobilityLevel: { type: String },
  
  // Care Requirements
  careLevel: { type: String },
  specialNeeds: { type: String },
  
  // Additional Information
  preferredRoom: { type: String },
  moveInDate: { type: Date },
  additionalComments: { type: String },
  
  // Application Status
  status: { 
    type: String, 
    default: 'pending', 
    enum: ['pending', 'under-review', 'approved', 'rejected', 'waitlist'] 
  },
  adminNotes: { type: String },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Admission", AdmissionSchema);