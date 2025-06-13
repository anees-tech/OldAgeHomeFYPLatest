const express = require("express")
const router = express.Router()
const Activity = require("../models/Activity")
const User = require("../models/User")

// Get all activities
router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find().sort({ date: 1, time: 1 })
    res.json(activities)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server Error" })
  }
})

// Get activity by ID
router.get("/:id", async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" })
    }
    res.json(activity)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server Error" })
  }
})

// Create a new activity
router.post("/", async (req, res) => {
  const { title, description, type, date, time, duration, capacity, location, day } = req.body // change 6

  try {
    const newActivity = new Activity({
      title,
      description,
      type,
      date,
      time,
      duration,
      capacity,
      location,
      day, // change 6
      participants: 0,
    })

    const activity = await newActivity.save()
    res.status(201).json(activity)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server Error" })
  }
})

// Update an activity
router.put("/:id", async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" })
    }

    res.json(activity)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server Error" })
  }
})

// Delete an activity
router.delete("/:id", async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id)

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" })
    }

    res.json({ message: "Activity deleted successfully" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server Error" })
  }
})

// Get dashboard statistics
router.get("/stats/overview", async (req, res) => {
  try {
    // Count total users
    const totalUsers = await User.countDocuments()

    // Count total residents
    const totalResidents = await User.countDocuments({ role: "resident" })

    // Count total caregivers
    const totalCaregivers = await User.countDocuments({ role: "caregiver" })

    // Count total activities
    const totalActivities = await Activity.countDocuments()

    // Get upcoming activities (next 5)
    const today = new Date()
    const formattedDate = today.toISOString().split("T")[0]
    const upcomingActivities = await Activity.find({
      date: { $gte: formattedDate },
    })
      .sort({ date: 1, time: 1 })
      .limit(5)

    // Send the aggregated data
    res.json({
      totalUsers,
      totalResidents,
      totalCaregivers,
      totalActivities,
      upcomingActivities,
    })
  } catch (err) {
    console.error("Error fetching dashboard stats:", err)
    res.status(500).json({ message: "Server Error" })
  }
})

module.exports = router
