const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const path = require("path")

dotenv.config()

const app = express()

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
}

app.use(express.json())
app.use(cors(corsOptions))

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

mongoose
  .connect(`mongodb+srv://OldAgeHome:12345@cluster0.6c94u7q.mongodb.net/`)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err))

// Import routes
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
const donationRoutes = require("./routes/donationRoutes");
const admissionRoutes = require("./routes/admissionRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const activitiesRoutes = require("./routes/activitiesRoutes");

// Routes
app.use("/api/auth", userRoutes); // Changed from /api/users to /api/auth
app.use("/api/contact", contactRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/activities", activitiesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    message: `API endpoint ${req.method} ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET /api/auth/users',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/contact/all',
      'POST /api/contact',
      'GET /api/admissions/all',
      'POST /api/admissions/apply',
      'GET /api/donations/all',
      'POST /api/donations/create',
      'GET /api/activities',
      'GET /api/activities/stats/overview',
      'POST /api/activities',
      'GET /api/gallery'
    ]
  });
});

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
