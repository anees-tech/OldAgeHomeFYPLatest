const mongoose = require("mongoose");

const AdmissionSchema = new mongoose.Schema({
  residentInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    maritalStatus: { type: String },
  },
  contactInfo: { // Represents the primary/emergency contact details
    contactName: { type: String, required: true },    // From formData.emergencyContactName
    relationship: { type: String, required: true }, // From formData.emergencyContactRelation
    phone: { type: String, required: true },        // From formData.emergencyContactPhone
    email: { type: String },                        // From formData.email (applicant's email)
    address: { type: String, required: true },      // From formData.address, city, state, zip (applicant's address)
  },
  // Storing applicant's own phone from the form, as contactInfo.phone is for emergency contact
  applicantPhone: { type: String, required: true }, // From formData.phone

  medicalInfo: {
    primaryPhysician: { type: String },
    medicalConditions: { type: String },
    medications: { type: String },
    mobility: { type: String, required: true }, // Was mobilityLevel in form
    careLevel: { type: String, required: true },
    diet: { type: String, default: "regular" },
  },
  additionalInfo: { type: String }, // Was additionalComments in form
  specialNeeds: { type: String },
  preferredRoom: { type: String },
  moveInDate: { type: Date },
  urgency: { type: String, default: "flexible" },
  status: { type: String, default: "pending" },
  
  originalFormData: { type: mongoose.Schema.Types.Mixed }, // Stores the raw form submission

}, { timestamps: true });

module.exports = mongoose.model("Admission", AdmissionSchema);