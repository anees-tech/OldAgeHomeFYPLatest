const express = require("express");
const router = express.Router();
const { emailTemplates, sendEmail } = require("../config/emailConfig");
const Contact = require("../models/Contact"); // Import the Contact Mongoose model

// Get all contacts (admin only) - UPDATED TO USE MONGODB
// This will handle GET requests to /api/contact/all (if you decide to use it)
// AND also GET requests to /api/contact/ if no other specific route matches first
// For clarity, the frontend currently calls /api/contact, which will be handled by router.get("/") below.
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

    const dbContacts = await Contact.find(query).sort({ createdAt: -1 });
    res.json(dbContacts);
  } catch (err) {
    console.error("Contacts fetch error from DB:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all contacts (handles GET /api/contact) - UPDATED TO USE MONGODB
router.get("/", async (req, res) => {
  try {
    const { status, urgency } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (urgency && urgency !== 'all') {
      query.urgency = urgency;
    }

    const dbContacts = await Contact.find(query).sort({ createdAt: -1 });
    res.json(dbContacts);
  } catch (err) {
    console.error("Contacts fetch error from DB:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Submit contact form - UPDATED TO USE MONGODB
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message, urgency, preferredContact } = req.body;

    // Basic validation (align with Contact model)
    if (!name || !email || !message) { // Subject is not required in model
      return res.status(400).json({ 
        message: "Name, email, and message are required fields" 
      });
    }

    // Create contact record using Mongoose model
    const newContactDocument = new Contact({
      name,
      email,
      phone: phone || "",
      subject: subject || "General Inquiry", // Default if not provided
      message,
      urgency: urgency || "normal", // Default from model
      preferredContact: preferredContact || "email", // Default from model
      status: "new", // Default from model
    });

    const savedContact = await newContactDocument.save();

    // Send confirmation email to user
    try {
      const confirmationEmail = emailTemplates.contactConfirmation(savedContact.name, savedContact.email);
      await sendEmail(confirmationEmail);
    } catch (emailError) {
      console.error("User confirmation email sending failed:", emailError);
    }

    // Send notification email to admin
    try {
      const adminNotification = emailTemplates.newContactNotification(savedContact);
      await sendEmail(adminNotification);
    } catch (emailError) {
      console.error("Admin notification email failed:", emailError);
    }

    res.status(201).json({ 
      message: "Thank you for contacting us! We will get back to you shortly.",
      contact: savedContact, // Send back the saved contact
      success: true 
    });
  } catch (err) {
    console.error("Contact form submission error:", err.message, err.stack);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: "Validation Error", errors: err.errors });
    }
    res.status(500).json({ message: "Server Error while processing contact form." });
  }
});

// Update contact status - UPDATED TO USE MONGODB
router.put("/:id/status", async (req, res) => {
  try {
    const { status, adminNotes } = req.body; // Allow updating adminNotes too
    
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: status, adminNotes: adminNotes, updatedAt: new Date() }, // Ensure updatedAt is set if not handled by timestamps:true on this specific update
      { new: true, runValidators: true } // Returns the updated document and runs schema validators
    );
    
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({ message: "Contact status updated successfully", contact: updatedContact });
  } catch (err) {
    console.error("Contact status update error:", err);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: "Validation Error", errors: err.errors });
    }
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete contact - UPDATED TO USE MONGODB
router.delete("/:id", async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({ message: "Contact deleted successfully" });
  } catch (err) {
    console.error("Error deleting contact:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;