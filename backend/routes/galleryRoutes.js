const express = require("express");
const router = express.Router();
const Gallery = require("../models/Gallery"); // Import the Mongoose model
// const User = require("../models/User"); // Assuming uploadedBy might be used later

// Get all gallery images - UPDATED TO USE MONGODB
router.get("/", async (req, res) => {
  try {
    const { category, active } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    // Assuming 'active' refers to the 'isActive' field in the model
    if (active !== undefined) {
      query.isActive = (active === 'true');
    }

    const images = await Gallery.find(query).sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    console.error("Gallery fetch error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get single image - UPDATED TO USE MONGODB
router.get("/:id", async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.json(image);
  } catch (err) {
    console.error("Gallery item fetch error:", err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: "Image not found (invalid ID format)" });
    }
    res.status(500).json({ message: "Server Error" });
  }
});

// Add new image - UPDATED TO USE MONGODB
router.post("/", async (req, res) => {
  try {
    const { title, description, category, imageUrl, isActive, dateOfEvent, tags } = req.body;

    // Validation based on the Gallery model
    if (!title || !imageUrl || !category) {
      return res.status(400).json({ message: "Title, image URL, and category are required" });
    }

    const newImage = new Gallery({
      title,
      description: description || "",
      category,
      imageUrl,
      isActive: isActive !== undefined ? isActive : true,
      dateOfEvent: dateOfEvent || null,
      tags: tags || [],
      // uploadedBy: req.user ? req.user.id : null // If you implement user authentication for uploads
    });

    const savedImage = await newImage.save();
    res.status(201).json({ message: "Image added successfully", image: savedImage });
  } catch (err) {
    console.error("Gallery add error:", err.message, err.stack);
     if (err.name === 'ValidationError') {
        return res.status(400).json({ message: "Validation Error", errors: err.errors });
    }
    res.status(500).json({ message: "Server Error" });
  }
});

// Update image - UPDATED TO USE MONGODB
router.put("/:id", async (req, res) => {
  try {
    const { title, description, category, imageUrl, isActive, dateOfEvent, tags } = req.body;

    // Construct update object carefully to handle partial updates
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (dateOfEvent !== undefined) updateData.dateOfEvent = dateOfEvent;
    if (tags !== undefined) updateData.tags = tags;


    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No update data provided." });
    }
    
    updateData.updatedAt = new Date(); // Manually set if not relying on Mongoose default for $set

    const updatedImage = await Gallery.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedImage) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.json({ message: "Image updated successfully", image: updatedImage });
  } catch (err) {
    console.error("Gallery update error:", err.message, err.stack);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: "Validation Error", errors: err.errors });
    }
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: "Image not found (invalid ID format)" });
    }
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete image - UPDATED TO USE MONGODB
router.delete("/:id", async (req, res) => {
  try {
    const deletedImage = await Gallery.findByIdAndDelete(req.params.id);

    if (!deletedImage) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Gallery delete error:", err);
     if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: "Image not found (invalid ID format)" });
    }
    res.status(500).json({ message: "Server Error" });
  }
});

// Get gallery categories (Static, can remain as is or fetch distinct from DB)
router.get("/meta/categories", async (req, res) => {
  try {
    // Option 1: Static categories (as it is now)
    const categories = [
      'Activities', 'Facilities', 'Events', 'Residents', 
      'Staff', 'Dining', 'Recreation', 'Healthcare', 
      'Celebrations', 'General', 'Other' // Added 'Other' to match model default
    ];
    // Option 2: Fetch distinct categories from the database
    // const categories = await Gallery.distinct('category');
    res.json(categories.sort());
  } catch (err) {
    console.error("Categories fetch error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;