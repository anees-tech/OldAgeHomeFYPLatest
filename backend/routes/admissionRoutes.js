const express = require("express");
const router = express.Router();
const { emailTemplates, sendEmail } = require("../config/emailConfig");

// In-memory storage for demo
let admissions = [
  {
    _id: "1",
    residentInfo: {
      firstName: "Mary",
      lastName: "Johnson",
      age: 78,
      gender: "female",
      dateOfBirth: new Date("1945-03-15"),
    },
    contactInfo: {
      contactName: "Robert Johnson",
      relationship: "son",
      phone: "555-0123",
      email: "robert.j@email.com",
      address: "123 Main St, Anytown, ST 12345"
    },
    medicalInfo: {
      conditions: "Diabetes, High blood pressure",
      medications: "Metformin, Lisinopril",
      careLevel: "assisted-living",
      mobility: "walker",
      diet: "diabetic"
    },
    urgency: "within_month",
    status: "pending",
    additionalInfo: "Mom needs help with daily activities but is still fairly independent.",
    createdAt: new Date("2024-12-01"),
  },
  {
    _id: "2",
    residentInfo: {
      firstName: "James",
      lastName: "Wilson",
      age: 82,
      gender: "male",
      dateOfBirth: new Date("1941-08-22"),
    },
    contactInfo: {
      contactName: "Linda Wilson",
      relationship: "daughter",
      phone: "555-0124",
      email: "linda.w@email.com",
      address: "456 Oak Ave, Somewhere, ST 67890"
    },
    medicalInfo: {
      conditions: "Alzheimer's disease, Arthritis",
      medications: "Donepezil, Ibuprofen",
      careLevel: "memory-care",
      mobility: "wheelchair",
      diet: "regular"
    },
    urgency: "immediate",
    status: "under_review",
    additionalInfo: "Dad has been diagnosed with early-stage Alzheimer's and needs specialized care.",
    createdAt: new Date("2024-11-28"),
  }
];

// Submit admission application
router.post("/", async (req, res) => {
  try {
    const {
      residentInfo,
      contactInfo,
      medicalInfo,
      urgency,
      additionalInfo
    } = req.body;

    // Basic validation
    if (!residentInfo?.firstName || !residentInfo?.lastName || !contactInfo?.contactName || !contactInfo?.email) {
      return res.status(400).json({ 
        message: "Please fill in all required fields" 
      });
    }

    // Create admission record
    const newAdmission = {
      _id: Date.now().toString(),
      residentInfo: {
        firstName: residentInfo.firstName,
        lastName: residentInfo.lastName,
        age: parseInt(residentInfo.age),
        gender: residentInfo.gender,
        dateOfBirth: new Date(residentInfo.dateOfBirth),
      },
      contactInfo: {
        contactName: contactInfo.contactName,
        relationship: contactInfo.relationship,
        phone: contactInfo.phone || "",
        email: contactInfo.email,
        address: contactInfo.address || ""
      },
      medicalInfo: {
        conditions: medicalInfo?.conditions || "",
        medications: medicalInfo?.medications || "",
        careLevel: medicalInfo?.careLevel || "independent",
        mobility: medicalInfo?.mobility || "independent",
        diet: medicalInfo?.diet || "regular"
      },
      urgency: urgency || "flexible",
      status: "pending",
      additionalInfo: additionalInfo || "",
      createdAt: new Date(),
    };

    // Save admission
    admissions.push(newAdmission);

    // Send confirmation email to contact person
    try {
      const confirmationEmail = emailTemplates.admissionConfirmation(
        contactInfo.contactName,
        contactInfo.email,
        `${residentInfo.firstName} ${residentInfo.lastName}`
      );
      await sendEmail(confirmationEmail);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    res.status(201).json({
      message: "Admission application submitted successfully! We will contact you within 2-3 business days.",
      admission: newAdmission,
      success: true
    });
  } catch (err) {
    console.error("Admission creation error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all admissions (admin only)
router.get("/", async (req, res) => {
  try {
    const { status, urgency } = req.query;
    let filteredAdmissions = [...admissions];

    if (status && status !== 'all') {
      filteredAdmissions = filteredAdmissions.filter(admission => admission.status === status);
    }

    if (urgency && urgency !== 'all') {
      filteredAdmissions = filteredAdmissions.filter(admission => admission.urgency === urgency);
    }

    // Sort by creation date (newest first)
    filteredAdmissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(filteredAdmissions);
  } catch (err) {
    console.error("Admissions fetch error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update admission status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const admissionIndex = admissions.findIndex(admission => admission._id === req.params.id);
    
    if (admissionIndex === -1) {
      return res.status(404).json({ message: "Admission not found" });
    }

    admissions[admissionIndex].status = status;
    admissions[admissionIndex].updatedAt = new Date();

    // Send status update email
    try {
      const admission = admissions[admissionIndex];
      // You can create different email templates for different statuses
      console.log(`Admission status updated to ${status} for ${admission.residentInfo.firstName} ${admission.residentInfo.lastName}`);
    } catch (emailError) {
      console.error("Status update email failed:", emailError);
    }

    res.json({ message: "Admission status updated successfully" });
  } catch (err) {
    console.error("Admission status update error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete admission
router.delete("/:id", async (req, res) => {
  try {
    const admissionIndex = admissions.findIndex(admission => admission._id === req.params.id);
    
    if (admissionIndex === -1) {
      return res.status(404).json({ message: "Admission not found" });
    }

    admissions.splice(admissionIndex, 1);
    res.json({ message: "Admission deleted successfully" });
  } catch (err) {
    console.error("Admission delete error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get admission form options
router.get("/form-options", async (req, res) => {
  try {
    const options = {
      careLevels: [
        { value: 'independent', label: 'Independent Living' },
        { value: 'assisted-living', label: 'Assisted Living' },
        { value: 'memory-care', label: 'Memory Care' },
        { value: 'skilled-nursing', label: 'Skilled Nursing' }
      ],
      mobilityLevels: [
        { value: 'independent', label: 'Independent' },
        { value: 'walker', label: 'Uses Walker' },
        { value: 'wheelchair', label: 'Uses Wheelchair' },
        { value: 'assistance', label: 'Needs Assistance' }
      ],
      dietTypes: [
        { value: 'regular', label: 'Regular Diet' },
        { value: 'diabetic', label: 'Diabetic Diet' },
        { value: 'low-sodium', label: 'Low Sodium' },
        { value: 'pureed', label: 'Pureed/Soft Foods' },
        { value: 'special', label: 'Special Diet (specify in notes)' }
      ],
      urgencyLevels: [
        { value: 'immediate', label: 'Immediate (within 1 week)' },
        { value: 'within_month', label: 'Within 1 month' },
        { value: 'within_3_months', label: 'Within 3 months' },
        { value: 'flexible', label: 'Flexible timing' }
      ]
    };
    
    res.json(options);
  } catch (err) {
    console.error("Form options fetch error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;