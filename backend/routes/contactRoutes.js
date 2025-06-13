const express = require("express");
const router = express.Router();
const { emailTemplates, sendEmail } = require("../config/emailConfig");

// In-memory storage for demo
let contacts = [];

// Get all contacts (admin only)
router.get("/", async (req, res) => {
  try {
    const { status, urgency } = req.query;
    let filteredContacts = [...contacts];

    if (status && status !== 'all') {
      filteredContacts = filteredContacts.filter(contact => contact.status === status);
    }

    if (urgency && urgency !== 'all') {
      filteredContacts = filteredContacts.filter(contact => contact.urgency === urgency);
    }

    // Sort by creation date (newest first)
    filteredContacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(filteredContacts);
  } catch (err) {
    console.error("Contacts fetch error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Submit contact form
router.post("/", async (req, res) => {
  const { name, email, phone, subject, message, preferredContact, urgency } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: "Please fill in all required fields" });
  }

  try {
    // Create contact record
    const newContact = {
      _id: Date.now().toString(),
      name,
      email,
      phone: phone || "",
      subject: subject || "General Inquiry",
      message,
      preferredContact: preferredContact || "email",
      urgency: urgency || "normal",
      status: "new",
      createdAt: new Date(),
    };

    // Save contact
    contacts.push(newContact);

    // Send confirmation email to user
    const confirmationEmail = emailTemplates.contactConfirmation(name, email);
    await sendEmail(confirmationEmail);

    // Send notification email to admin
    const adminNotification = emailTemplates.newContactNotification(newContact);
    await sendEmail(adminNotification);

    res.status(201).json({ 
      message: "Thank you for contacting us! We will get back to you within 24 hours.",
      success: true 
    });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update contact status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const contactIndex = contacts.findIndex(contact => contact._id === req.params.id);
    
    if (contactIndex === -1) {
      return res.status(404).json({ message: "Contact not found" });
    }

    contacts[contactIndex].status = status;
    contacts[contactIndex].updatedAt = new Date();

    res.json({ message: "Contact status updated successfully" });
  } catch (err) {
    console.error("Contact status update error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete contact
router.delete("/:id", async (req, res) => {
  try {
    const contactIndex = contacts.findIndex(contact => contact._id === req.params.id);
    if (contactIndex === -1) {
      return res.status(404).json({ message: "Contact not found" });
    }

    contacts.splice(contactIndex, 1);

    res.json({ message: "Contact deleted successfully" });
  } catch (err) {
    console.error("Error deleting contact:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get contact information
router.get("/info", async (req, res) => {
  try {
    const contactInfo = {
      address: "123 Golden Years Drive, Peaceful Valley, CA 90210",
      phone: "(555) 123-4567",
      email: "info@goldenyearshome.com",
      emergencyPhone: "(555) 987-6543",
      hours: {
        weekdays: "8:00 AM - 6:00 PM",
        weekends: "9:00 AM - 5:00 PM",
        holidays: "10:00 AM - 4:00 PM"
      },
      socialMedia: {
        facebook: "https://facebook.com/goldenyearshome",
        twitter: "https://twitter.com/goldenyearshome",
        instagram: "https://instagram.com/goldenyearshome"
      }
    };

    res.json(contactInfo);
  } catch (err) {
    console.error("Error fetching contact info:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;