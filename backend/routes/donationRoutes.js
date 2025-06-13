const express = require("express");
const router = express.Router();
const { emailTemplates, sendEmail } = require("../config/emailConfig");

// In-memory storage for demo
let donations = [
  {
    _id: "1",
    donorName: "John Smith",
    email: "john.smith@email.com",
    phone: "555-0101",
    amount: 100,
    donationType: "one-time",
    category: "general",
    paymentMethod: "credit-card",
    isAnonymous: false,
    message: "Happy to support this great cause",
    status: "completed",
    createdAt: new Date("2024-12-01"),
  },
  {
    _id: "2",
    donorName: "Anonymous",
    email: "donor@email.com",
    phone: "",
    amount: 250,
    donationType: "monthly",
    category: "medical",
    paymentMethod: "bank-transfer",
    isAnonymous: true,
    message: "",
    status: "completed",
    createdAt: new Date("2024-12-05"),
  },
  {
    _id: "3",
    donorName: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "555-0102",
    amount: 50,
    donationType: "one-time",
    category: "activities",
    paymentMethod: "paypal",
    isAnonymous: false,
    message: "For recreational activities",
    status: "pending",
    createdAt: new Date("2024-12-10"),
  },
];

// Create new donation
router.post("/", async (req, res) => {
  try {
    const {
      donorName,
      email,
      phone,
      amount,
      donationType,
      category,
      paymentMethod,
      isAnonymous,
      message
    } = req.body;

    // Basic validation
    if (!donorName || !email || !amount || !donationType || !category) {
      return res.status(400).json({ 
        message: "Please fill in all required fields" 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ 
        message: "Donation amount must be greater than 0" 
      });
    }

    // Create donation record
    const newDonation = {
      _id: Date.now().toString(),
      donorName: isAnonymous ? "Anonymous" : donorName,
      email,
      phone: phone || "",
      amount: parseFloat(amount),
      donationType,
      category,
      paymentMethod: paymentMethod || "credit-card",
      isAnonymous: Boolean(isAnonymous),
      message: message || "",
      status: "completed", // In real app, this would be "pending" until payment processing
      createdAt: new Date(),
    };

    // Save donation
    donations.push(newDonation);

    // Send confirmation email to donor
    try {
      const confirmationEmail = emailTemplates.donationConfirmation(
        donorName, 
        email, 
        amount, 
        donationType
      );
      await sendEmail(confirmationEmail);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the donation if email fails
    }

    res.status(201).json({
      message: "Thank you for your generous donation!",
      donation: newDonation,
      success: true
    });
  } catch (err) {
    console.error("Donation creation error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Alternative endpoint for create (matching your frontend call)
router.post("/create", async (req, res) => {
  // Redirect to main POST handler
  return router.stack[0].handle(req, res);
});

// Get all donations (admin only)
router.get("/all", async (req, res) => {
  try {
    const { status, category, donationType } = req.query;
    let filteredDonations = [...donations];

    if (status && status !== 'all') {
      filteredDonations = filteredDonations.filter(donation => donation.status === status);
    }

    if (category && category !== 'all') {
      filteredDonations = filteredDonations.filter(donation => donation.category === category);
    }

    if (donationType && donationType !== 'all') {
      filteredDonations = filteredDonations.filter(donation => donation.donationType === donationType);
    }

    // Sort by creation date (newest first)
    filteredDonations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(filteredDonations);
  } catch (err) {
    console.error("Donations fetch error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get donation statistics
router.get("/stats", async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const totalDonations = donations.length;
    const totalAmount = donations
      .filter(d => d.status === 'completed')
      .reduce((sum, donation) => sum + donation.amount, 0);

    const monthlyAmount = donations
      .filter(d => {
        const donationDate = new Date(d.createdAt);
        return d.status === 'completed' && 
               donationDate.getMonth() === currentMonth && 
               donationDate.getFullYear() === currentYear;
      })
      .reduce((sum, donation) => sum + donation.amount, 0);

    const categoryBreakdown = donations
      .filter(d => d.status === 'completed')
      .reduce((acc, donation) => {
        acc[donation.category] = (acc[donation.category] || 0) + donation.amount;
        return acc;
      }, {});

    const recentDonations = donations
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.json({
      totalDonations,
      totalAmount,
      monthlyAmount,
      categoryBreakdown,
      recentDonations,
      averageDonation: totalDonations > 0 ? totalAmount / totalDonations : 0
    });
  } catch (err) {
    console.error("Stats fetch error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update donation status
router.put("/:id", async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const donationIndex = donations.findIndex(donation => donation._id === req.params.id);
    
    if (donationIndex === -1) {
      return res.status(404).json({ message: "Donation not found" });
    }

    donations[donationIndex] = {
      ...donations[donationIndex],
      status: status || donations[donationIndex].status,
      adminNotes: adminNotes || donations[donationIndex].adminNotes,
      updatedAt: new Date(),
    };

    res.json(donations[donationIndex]);
  } catch (err) {
    console.error("Donation update error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete donation
router.delete("/:id", async (req, res) => {
  try {
    const donationIndex = donations.findIndex(donation => donation._id === req.params.id);
    
    if (donationIndex === -1) {
      return res.status(404).json({ message: "Donation not found" });
    }

    donations.splice(donationIndex, 1);
    res.json({ message: "Donation deleted successfully" });
  } catch (err) {
    console.error("Donation delete error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get donation categories and payment methods
router.get("/meta/options", async (req, res) => {
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
      donationTypes: [
        { value: 'one-time', label: 'One-time Donation' },
        { value: 'monthly', label: 'Monthly Recurring' },
        { value: 'annual', label: 'Annual Donation' }
      ],
      paymentMethods: [
        { value: 'credit-card', label: 'Credit Card' },
        { value: 'debit-card', label: 'Debit Card' },
        { value: 'bank-transfer', label: 'Bank Transfer' },
        { value: 'paypal', label: 'PayPal' },
        { value: 'check', label: 'Check' }
      ]
    };
    
    res.json(options);
  } catch (err) {
    console.error("Options fetch error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;