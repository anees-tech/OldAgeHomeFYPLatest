const express = require("express");
const router = express.Router();
const { emailTemplates, sendEmail } = require("../config/emailConfig");
const Admission = require("../models/Admission"); // Import the Admission model

// Calculate age from date of birth
const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Submit admission application - UPDATED TO SAVE TO MONGODB
router.post("/apply", async (req, res) => {
  try {
    const {
      // Applicant Information
      firstName, lastName, dateOfBirth, gender, maritalStatus,
      // Contact Information (of applicant)
      phone, email, address, city, state, zipCode,
      // Emergency Contact
      emergencyContactName, emergencyContactPhone, emergencyContactRelation,
      // Medical Information
      primaryPhysician, medicalConditions, medications, mobilityLevel,
      // Care Requirements
      careLevel, specialNeeds, preferredRoom, moveInDate, additionalComments
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !dateOfBirth || !gender || !phone || !address || !city || !state || !zipCode || !emergencyContactName || !emergencyContactPhone || !emergencyContactRelation || !mobilityLevel || !careLevel) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const age = calculateAge(dateOfBirth);

    const admissionDataForDb = {
      residentInfo: {
        firstName, lastName, age, gender, dateOfBirth: new Date(dateOfBirth), maritalStatus: maritalStatus || ""
      },
      contactInfo: {
        contactName: emergencyContactName,
        relationship: emergencyContactRelation,
        phone: emergencyContactPhone, // Emergency contact's phone
        email: email || "",           // Applicant's email
        address: `${address}, ${city}, ${state} ${zipCode}` // Applicant's address
      },
      applicantPhone: phone, // Applicant's own phone
      medicalInfo: {
        primaryPhysician: primaryPhysician || "",
        medicalConditions: medicalConditions || "",
        medications: medications || "",
        mobility: mobilityLevel, // Schema uses 'mobility'
        careLevel: careLevel,
        diet: "regular", 
      },
      additionalInfo: additionalComments || "", // Schema uses 'additionalInfo'
      specialNeeds: specialNeeds || "",
      preferredRoom: preferredRoom || "",
      moveInDate: moveInDate ? new Date(moveInDate) : null,
      urgency: "flexible", 
      status: "pending",
      originalFormData: req.body 
    };

    const newAdmissionDocument = new Admission(admissionDataForDb);
    const savedAdmission = await newAdmissionDocument.save();

    // Send confirmation email to applicant (if email provided)
    if (email) {
      try {
        const confirmationEmail = emailTemplates.admissionConfirmation(
          firstName, // Send to applicant, using their name
          email,
          `${firstName} ${lastName}` // Resident's name
        );
        await sendEmail(confirmationEmail);
      } catch (emailError) {
        console.error("Applicant confirmation email sending failed:", emailError);
      }
    }

    // Send notification email to admin
    try {
      const adminNotification = emailTemplates.newAdmissionNotification({
        residentInfo: savedAdmission.residentInfo,
        contactInfo: savedAdmission.contactInfo, // This is the emergency contact info
        medicalInfo: savedAdmission.medicalInfo,
        urgency: savedAdmission.urgency
      });
      await sendEmail(adminNotification);
    } catch (emailError) {
      console.error("Admin notification email failed:", emailError);
    }

    res.status(201).json({
      message: "Admission application submitted successfully! We will contact you within 2-3 business days.",
      admission: savedAdmission,
      success: true
    });

  } catch (err) {
    console.error("Admission creation error:", err.message, err.stack);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: "Validation Error", errors: err.errors });
    }
    res.status(500).json({ message: "Server Error while creating admission." });
  }
});

// Get all admissions (admin only) - UPDATED TO FETCH FROM DB
router.get("/all", async (req, res) => {
  try {
    const { status, urgency } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (urgency && urgency !== 'all') {
      query.urgency = urgency;
    }

    const dbAdmissions = await Admission.find(query).sort({ createdAt: -1 });
    res.json(dbAdmissions);
  } catch (err) {
    console.error("Admissions fetch error from DB:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update admission status - TODO: Update to use MongoDB
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    // const admissionIndex = admissions.findIndex(admission => admission._id === req.params.id); // In-memory
    
    // DB equivalent:
    const updatedAdmission = await Admission.findByIdAndUpdate(
      req.params.id,
      { status: status, updatedAt: new Date() },
      { new: true } // Returns the updated document
    );
    
    if (!updatedAdmission) {
      return res.status(404).json({ message: "Admission not found" });
    }

    // Send status update email (optional)
    // try {
    //   console.log(`Admission status updated to ${status} for ${updatedAdmission.residentInfo.firstName}`);
    // } catch (emailError) {
    //   console.error("Status update email failed:", emailError);
    // }

    res.json({ message: "Admission status updated successfully", admission: updatedAdmission });
  } catch (err) {
    console.error("Admission status update error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete admission - TODO: Update to use MongoDB
router.delete("/:id", async (req, res) => {
  try {
    // const admissionIndex = admissions.findIndex(admission => admission._id === req.params.id); // In-memory
    
    // DB equivalent:
    const deletedAdmission = await Admission.findByIdAndDelete(req.params.id);

    if (!deletedAdmission) {
      return res.status(404).json({ message: "Admission not found" });
    }

    res.json({ message: "Admission deleted successfully" });
  } catch (err) {
    console.error("Admission delete error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get admission form options (remains the same as it provides static options)
router.get("/form-options", async (req, res) => {
  try {
    const options = {
      careLevels: [
        { value: 'independent', label: 'Independent Living' },
        { value: 'assisted', label: 'Assisted Living' },
        { value: 'memory', label: 'Memory Care' },
        { value: 'skilled', label: 'Skilled Nursing' }
      ],
      mobilityLevels: [
        { value: 'independent', label: 'Independent' },
        { value: 'assistive-device', label: 'Uses Assistive Device' },
        { value: 'wheelchair', label: 'Wheelchair' },
        { value: 'bedridden', label: 'Bedridden' }
      ],
      roomTypes: [
        { value: 'private', label: 'Private Room' },
        { value: 'semi-private', label: 'Semi-Private Room' }
      ],
      relationships: [
        { value: 'spouse', label: 'Spouse' },
        { value: 'child', label: 'Child' },
        { value: 'sibling', label: 'Sibling' },
        { value: 'friend', label: 'Friend' },
        { value: 'other', label: 'Other' }
      ]
    };
    
    res.json(options);
  } catch (err) {
    console.error("Form options fetch error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;