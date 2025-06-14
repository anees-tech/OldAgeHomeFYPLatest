const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity"); // Ensure Activity model is imported
const User = require("../models/User");

// Get all activities - UPDATED TO USE MONGODB
router.get("/", async (req, res) => {
  try {
    // Query parameters for filtering (optional)
    const { type, upcoming, active, day } = req.query;
    let query = {};

    if (type && type !== 'all') {
      query.type = type; // Model uses 'type'
    }
    if (day && day !== 'all') {
      query.day = day;
    }

    // Handle 'upcoming' based on current date
    if (upcoming === 'true') {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
      query.date = { $gte: today.toISOString().split('T')[0] }; // Compare with date string
    }

    // Handle 'active' status (if your model had an 'isActive' field)
    // if (active !== undefined && Activity.schema.paths.isActive) {
    //   query.isActive = (active === 'true');
    // }


    const activities = await Activity.find(query).sort({ date: 1, time: 1 });
    res.json(activities);
  } catch (err) {
    console.error("Activities fetch error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Add new activity - UPDATED TO USE MONGODB
router.post("/", async (req, res) => {
  try {
    const { 
      title, 
      description, 
      type, // Changed from category
      date, 
      time, 
      duration, // Added
      capacity, // Changed from maxParticipants
      location, 
      day,      // Added
      isActive // Frontend sends this, model doesn't have it by default
    } = req.body;

    // Validation based on the Activity model requirements
    if (!title || !description || !type || !date || !time || !duration || !capacity || !location || !day) {
      let missingFields = [];
      if (!title) missingFields.push("title");
      if (!description) missingFields.push("description");
      if (!type) missingFields.push("type");
      if (!date) missingFields.push("date");
      if (!time) missingFields.push("time");
      if (!duration) missingFields.push("duration");
      if (!capacity) missingFields.push("capacity");
      if (!location) missingFields.push("location");
      if (!day) missingFields.push("day");
      
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    const newActivity = new Activity({
      title,
      description,
      type,
      date,
      time,
      duration: parseInt(duration),
      capacity: parseInt(capacity),
      location,
      day,
      participants: 0, // Default value from model
      // If you add isActive to your Activity model, you can include it here:
      // isActive: isActive !== undefined ? isActive : true, 
    });

    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity); // Return the created activity object
  } catch (err) {
    console.error("Activity add error:", err.message, err.stack);
    if (err.name === 'ValidationError') {
        let errors = {};
        Object.keys(err.errors).forEach((key) => {
            errors[key] = err.errors[key].message;
        });
        return res.status(400).json({ message: "Validation Error", errors });
    }
    res.status(500).json({ message: "Server Error" });
  }
});

// Update activity - TODO: Update this to use MongoDB and correct fields
router.put("/:id", async (req, res) => {
  try {
    // This needs to be updated to use Activity.findByIdAndUpdate
    // and expect the correct fields (type, capacity, duration, day)
    // For now, returning a placeholder to avoid breaking if called
    const activity = await Activity.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json(activity);
  } catch (err) {
    console.error("Activity update error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete activity - TODO: Update this to use MongoDB
router.delete("/:id", async (req, res) => {
  try {
    // This needs to be updated to use Activity.findByIdAndDelete
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json({ message: "Activity deleted successfully" });
  } catch (err) {
    console.error("Activity delete error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get dashboard statistics - This route already uses Mongoose models
router.get("/stats/overview", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalResidents = await User.countDocuments({ role: 'resident' });
    const totalCaregivers = await User.countDocuments({ role: 'caregiver' });
    const totalActivities = await Activity.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const upcomingActivities = await Activity.find({ 
      date: { $gte: today.toISOString().split('T')[0] }, // Compare with date string
      // isActive: true // Add this if your Activity model has an isActive field
    })
      .sort({ date: 1, time: 1 })
      .limit(5)
      .lean();

    res.json({
      totalUsers,
      totalResidents,
      totalCaregivers,
      totalActivities,
      upcomingActivities,
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;