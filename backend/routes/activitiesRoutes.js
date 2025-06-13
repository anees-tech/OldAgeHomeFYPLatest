const express = require("express");
const router = express.Router();

// In-memory storage for demo
let activities = [
  {
    _id: "1",
    title: "Morning Yoga",
    description: "Gentle yoga session to start the day",
    date: new Date("2024-12-20"),
    time: "08:00",
    location: "Activity Room A",
    category: "Exercise & Fitness",
    maxParticipants: 15,
    isActive: true,
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "Arts & Crafts",
    description: "Creative crafting session with various materials",
    date: new Date("2024-12-21"),
    time: "14:00",
    location: "Craft Room",
    category: "Arts & Crafts",
    maxParticipants: 12,
    isActive: true,
    createdAt: new Date(),
  },
];

// Get all activities
router.get("/", async (req, res) => {
  try {
    const { category, upcoming, active } = req.query;
    let filteredActivities = [...activities];

    if (category && category !== 'all') {
      filteredActivities = filteredActivities.filter(activity => activity.category === category);
    }

    if (upcoming === 'true') {
      filteredActivities = filteredActivities.filter(activity => new Date(activity.date) >= new Date());
    }

    if (active !== undefined) {
      filteredActivities = filteredActivities.filter(activity => activity.isActive === (active === 'true'));
    }

    // Sort by date
    filteredActivities.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(filteredActivities);
  } catch (err) {
    console.error("Activities fetch error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Add new activity
router.post("/", async (req, res) => {
  try {
    const { title, description, date, time, location, category, maxParticipants, isActive = true } = req.body;

    if (!title || !date || !time || !location || !category) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const newActivity = {
      _id: Date.now().toString(),
      title,
      description: description || "",
      date: new Date(date),
      time,
      location,
      category,
      maxParticipants: maxParticipants || 0,
      isActive,
      createdAt: new Date(),
    };

    activities.push(newActivity);
    res.status(201).json({ message: "Activity added successfully", activity: newActivity });
  } catch (err) {
    console.error("Activity add error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update activity
router.put("/:id", async (req, res) => {
  try {
    const activityIndex = activities.findIndex(activity => activity._id === req.params.id);
    if (activityIndex === -1) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const { title, description, date, time, location, category, maxParticipants, isActive } = req.body;
    
    activities[activityIndex] = {
      ...activities[activityIndex],
      title: title || activities[activityIndex].title,
      description: description !== undefined ? description : activities[activityIndex].description,
      date: date ? new Date(date) : activities[activityIndex].date,
      time: time || activities[activityIndex].time,
      location: location || activities[activityIndex].location,
      category: category || activities[activityIndex].category,
      maxParticipants: maxParticipants !== undefined ? maxParticipants : activities[activityIndex].maxParticipants,
      isActive: isActive !== undefined ? isActive : activities[activityIndex].isActive,
      updatedAt: new Date(),
    };

    res.json({ message: "Activity updated successfully", activity: activities[activityIndex] });
  } catch (err) {
    console.error("Activity update error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete activity
router.delete("/:id", async (req, res) => {
  try {
    const activityIndex = activities.findIndex(activity => activity._id === req.params.id);
    if (activityIndex === -1) {
      return res.status(404).json({ message: "Activity not found" });
    }

    activities.splice(activityIndex, 1);
    res.json({ message: "Activity deleted successfully" });
  } catch (err) {
    console.error("Activity delete error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;