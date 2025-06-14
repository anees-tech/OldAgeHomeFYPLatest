const express = require("express");
const router = express.Router();
const { emailTemplates, sendEmail } = require("../config/emailConfig");
const Donation = require("../models/Donation"); // Import the Donation model

// Create new donation
const createDonationHandler = async (req, res) => {
  try {
    const {
      type, // 'monetary', 'goods', 'volunteer'
      amount,
      donorInfo, // { firstName, lastName, email, phone, address, city, state, zipCode, isAnonymous }
      category,
      paymentMethod, // e.g., 'credit-card'
      message,
      donationType // e.g., 'one-time', 'monthly' (recurrence)
    } = req.body;

    // Basic validation
    if (!donorInfo || !donorInfo.email || (type === 'monetary' && (amount === undefined || amount === null || amount <= 0))) {
      return res.status(400).json({
        message: "Please fill in all required fields (Email and Amount for monetary donations)"
      });
    }

    const donationDataForDb = {
      type,
      amount: type === 'monetary' ? parseFloat(amount) : undefined, // Store amount only if monetary
      donorInfo: {
        firstName: donorInfo.isAnonymous ? '' : donorInfo.firstName || '',
        lastName: donorInfo.isAnonymous ? '' : donorInfo.lastName || '',
        email: donorInfo.email,
        phone: donorInfo.phone || '',
        address: donorInfo.address || '',
        city: donorInfo.city || '',
        state: donorInfo.state || '',
        zipCode: donorInfo.zipCode || '',
        isAnonymous: Boolean(donorInfo.isAnonymous)
      },
      category: category || "general",
      paymentMethod: paymentMethod || (type === 'monetary' ? "credit-card" : undefined),
      message: message || "",
      donationType: donationType || "one-time", // Field for recurrence
      status: "pending", // Default status, can be updated after payment processing
      // transactionId and adminNotes can be added later
    };

    const newDonationDocument = new Donation(donationDataForDb);
    const savedDonation = await newDonationDocument.save();

    // Send confirmation email to donor
    try {
      const donorDisplayName = savedDonation.donorInfo.isAnonymous ? "Anonymous Donor" : `${savedDonation.donorInfo.firstName} ${savedDonation.donorInfo.lastName}`.trim();
      const confirmationEmail = emailTemplates.donationConfirmation(
        donorDisplayName,
        savedDonation.donorInfo.email,
        savedDonation.amount,
        savedDonation.type // Pass the main type ('monetary', 'goods', 'volunteer')
      );
      await sendEmail(confirmationEmail);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the donation if email fails
    }

    res.status(201).json({
      message: "Thank you for your generous donation!",
      donation: savedDonation,
      success: true
    });
  } catch (err) {
    console.error("Donation creation error:", err.message, err.stack);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: "Validation Error", errors: err.errors });
    }
    res.status(500).json({ message: "Server Error while creating donation." });
  }
};

router.post("/", createDonationHandler);
router.post("/create", createDonationHandler); // Both routes use the same handler

// Get all donations (admin only) - UPDATE THIS TO USE DB
router.get("/all", async (req, res) => {
  try {
    const { status, category, donationType } = req.query;
    let query = {};

    if (status && status !== 'all') query.status = status;
    if (category && category !== 'all') query.category = category;
    if (donationType && donationType !== 'all') query.donationType = donationType; // Query by recurrence

    const dbDonations = await Donation.find(query).sort({ createdAt: -1 });
    res.json(dbDonations);
  } catch (err) {
    console.error("Donations fetch error from DB:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get donation statistics - UPDATE THIS TO USE DB
router.get("/stats", async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    const totalDonationsCount = await Donation.countDocuments();
    
    const totalAmountResult = await Donation.aggregate([
      { $match: { status: 'completed', type: 'monetary' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalAmount = totalAmountResult.length > 0 ? totalAmountResult[0].total : 0;

    const monthlyAmountResult = await Donation.aggregate([
      { 
        $match: { 
          status: 'completed', 
          type: 'monetary',
          createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const monthlyAmount = monthlyAmountResult.length > 0 ? monthlyAmountResult[0].total : 0;
    
    // You can add more stats like categoryBreakdown if needed using aggregation

    res.json({
      totalDonations: totalDonationsCount,
      totalAmount,
      monthlyAmount,
      // averageDonation: totalDonationsCount > 0 ? totalAmount / totalDonationsCount : 0 // Be careful with division by zero
    });
  } catch (err) {
    console.error("Stats fetch error from DB:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update donation status - UPDATE THIS TO USE DB
router.put("/:id", async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    const updatedDonation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!updatedDonation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    res.json(updatedDonation);
  } catch (err) {
    console.error("Donation update error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete donation - UPDATE THIS TO USE DB
router.delete("/:id", async (req, res) => {
  try {
    const deletedDonation = await Donation.findByIdAndDelete(req.params.id);
    if (!deletedDonation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    res.json({ message: "Donation deleted successfully" });
  } catch (err) {
    console.error("Donation delete error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get donation categories and payment methods (Static options, can remain as is or fetch from DB if dynamic)
router.get("/meta/options", async (req, res) => {
  // ... (your existing static options code) ...
  try {
    const options = {
      categories: [
        { value: 'general', label: 'General Support' },
        { value: 'medical', label: 'Medical Care' },
        { value: 'activities', label: 'Activities & Recreation' },
        { value: 'facilities', label: 'Facilities & Maintenance' },
        { value: 'emergency', label: 'Emergency Fund' },
        { value: 'meals', label: 'Meals & Nutrition' },
        { value: 'transportation', label: 'Transportation' }
      ],
      donationTypes: [ // This is for recurrence
        { value: 'one-time', label: 'One-time Donation' },
        { value: 'monthly', label: 'Monthly Recurring' },
        // { value: 'annual', label: 'Annual Donation' } // Add if supported
      ],
      mainDonationTypes: [ // This is for the type of donation
        {value: 'monetary', label: 'Monetary Donation'},
        {value: 'goods', label: 'Goods & Supplies'},
        {value: 'volunteer', label: 'Volunteer Time'},
      ]
      // Payment methods can also be static or fetched if they change
    };
    
    res.json(options);
  } catch (err) {
    console.error("Options fetch error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;