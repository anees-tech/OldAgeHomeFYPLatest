const express = require("express");
const router = express.Router();

// In-memory storage for demo (replace with database)
let galleryImages = [
  {
    _id: "1",
    title: "Morning Exercise Class",
    description: "Residents enjoying their daily morning exercise routine",
    category: "Activities",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    _id: "2",
    title: "Arts and Crafts Workshop",
    description: "Creative arts and crafts session in the activity room",
    category: "Activities",
    imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500",
    isActive: true,
    createdAt: new Date("2024-01-10"),
  },
  {
    _id: "3",
    title: "Garden Therapy",
    description: "Residents tending to our beautiful garden",
    category: "Recreation",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500",
    isActive: true,
    createdAt: new Date("2024-01-05"),
  },
];

// Get all gallery images
router.get("/", async (req, res) => {
  try {
    const { category, active } = req.query;
    let filteredImages = [...galleryImages];

    if (category && category !== 'all') {
      filteredImages = filteredImages.filter(img => img.category === category);
    }

    if (active !== undefined) {
      filteredImages = filteredImages.filter(img => img.isActive === (active === 'true'));
    }

    // Sort by creation date (newest first)
    filteredImages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(filteredImages);
  } catch (err) {
    console.error("Gallery fetch error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get single image
router.get("/:id", async (req, res) => {
  try {
    const image = galleryImages.find(img => img._id === req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.json(image);
  } catch (err) {
    console.error("Gallery item fetch error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Add new image
router.post("/", async (req, res) => {
  try {
    const { title, description, category, imageUrl, isActive = true } = req.body;

    if (!title || !imageUrl || !category) {
      return res.status(400).json({ message: "Title, image URL, and category are required" });
    }

    const newImage = {
      _id: Date.now().toString(),
      title,
      description: description || "",
      category,
      imageUrl,
      isActive,
      createdAt: new Date(),
    };

    galleryImages.push(newImage);
    res.status(201).json({ message: "Image added successfully", image: newImage });
  } catch (err) {
    console.error("Gallery add error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update image
router.put("/:id", async (req, res) => {
  try {
    const imageIndex = galleryImages.findIndex(img => img._id === req.params.id);
    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found" });
    }

    const { title, description, category, imageUrl, isActive } = req.body;
    
    galleryImages[imageIndex] = {
      ...galleryImages[imageIndex],
      title: title || galleryImages[imageIndex].title,
      description: description !== undefined ? description : galleryImages[imageIndex].description,
      category: category || galleryImages[imageIndex].category,
      imageUrl: imageUrl || galleryImages[imageIndex].imageUrl,
      isActive: isActive !== undefined ? isActive : galleryImages[imageIndex].isActive,
      updatedAt: new Date(),
    };

    res.json({ message: "Image updated successfully", image: galleryImages[imageIndex] });
  } catch (err) {
    console.error("Gallery update error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete image
router.delete("/:id", async (req, res) => {
  try {
    const imageIndex = galleryImages.findIndex(img => img._id === req.params.id);
    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found" });
    }

    galleryImages.splice(imageIndex, 1);
    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Gallery delete error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get gallery categories
router.get("/meta/categories", async (req, res) => {
  try {
    const categories = [
      'Activities',
      'Facilities',
      'Events',
      'Residents',
      'Staff',
      'Dining',
      'Recreation',
      'Healthcare',
      'Celebrations',
      'General'
    ];
    res.json(categories);
  } catch (err) {
    console.error("Categories fetch error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;