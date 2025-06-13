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

// Routes
app.use("/api/auth", require("./routes/userRoutes"))
app.use("/api/activities", require("./routes/activityRoutes"))
const contactRoutes = require("./routes/contactRoutes");
const donationRoutes = require("./routes/donationRoutes");
const admissionRoutes = require("./routes/admissionRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
app.use("/api/contact", contactRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api/gallery", galleryRoutes);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
