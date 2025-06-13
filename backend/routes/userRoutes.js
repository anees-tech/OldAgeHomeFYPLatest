const express = require("express")
const router = express.Router()
const User = require("../models/User")

// --- Middleware ---
// Placeholder for actual authentication/authorization middleware
// In a real app, this should verify a token (like JWT) and check user role/isAdmin status
const isAdminMiddleware = async (req, res, next) => {
  // --- !!! IMPORTANT SECURITY NOTE !!! ---
  // This is a placeholder and NOT secure.
  // You NEED to implement proper authentication (e.g., JWT verification)
  // and then check if the authenticated user has `isAdmin === true`.
  // For demonstration, we'll assume an admin user is somehow identified.
  // Replace this logic with your actual authentication check.
  console.log("isAdminMiddleware: Checking admin status (Placeholder - Implement proper auth!)")
  // Example: const userId = req.user.id; // Assuming req.user is populated by auth middleware
  // const user = await User.findById(userId);
  // if (user && user.isAdmin) {
  //   next();
  // } else {
  //   res.status(403).json({ message: "Access denied. Admin privileges required." });
  // }

  // --- Temporary bypass for demonstration ---
  console.warn("isAdminMiddleware: Bypassing admin check for demonstration purposes.")
  next()
  // --- End Temporary bypass ---
}

// --- User Registration (Public) ---
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, phone, role, password, confirmPassword, isAdmin } = req.body;

  // Basic validation
  if (!firstName || !lastName || !email || !password || !confirmPassword || !phone || !role) {
    return res.status(400).json({ message: "Please fill in all required fields" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Ensure only Caregiver role can be granted admin privileges
    if (isAdmin && role !== "caregiver") {
      return res.status(403).json({ message: "Only Caregivers can be granted admin privileges" });
    }

    user = new User({
      firstName,
      lastName,
      email,
      phone,
      role,
      password, // Remember to hash passwords in production!
      isAdmin: isAdmin || false, // Default to false if not provided
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
})

// --- User Login (Public) ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    // In a real app, compare hashed passwords
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials", code: 403 })
    }
    console.log("User logged in successfully:", user.email)
    // Exclude password from the response
    const userResponse = user.toObject()
    delete userResponse.password
    res.json({ message: "Login successful", user: userResponse, code: 201, success: true })
  } catch (err) {
    console.error("Login Error:", err)
    res.status(500).json({ message: "Server Error" })
  }
})

// --- Admin Routes ---

// Get all users (Admin only)
router.get("/users", isAdminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 }) // Exclude password, sort by newest
    res.json(users)
  } catch (err) {
    console.error("Get Users Error:", err)
    res.status(500).json({ message: "Server Error" })
  }
})

// Update a user (Admin only)
router.put("/users/:id", async (req, res) => {
  const { firstName, lastName, email, phone, role, isAdmin } = req.body

  // Ensure only Caregiver role can be granted admin privileges
  if (isAdmin && role !== "caregiver") {
    return res.status(403).json({ message: "Only Caregivers can be granted admin privileges" })
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstName,
          lastName,
          email,
          phone,
          role,
          isAdmin: isAdmin || false,
        },
      },
      { new: true, runValidators: true },
    )

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ message: "User updated successfully", user: updatedUser })
  } catch (err) {
    console.error("Update User Error:", err)
    res.status(500).json({ message: "Server Error" })
  }
})

// Delete a user (Admin only)
router.delete("/users/:id", isAdminMiddleware, async (req, res) => {
  const userId = req.params.id
  try {
    const deletedUser = await User.findByIdAndDelete(userId)

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ message: "User deleted successfully", userId: deletedUser._id })
    console.log("User deleted successfully:", deletedUser.email)
  } catch (err) {
    console.error("Delete User Error:", err)
    res.status(500).json({ message: "Server Error" })
  }
})

module.exports = router
