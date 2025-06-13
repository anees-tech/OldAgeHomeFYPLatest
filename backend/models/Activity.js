const mongoose = require("mongoose")

const ActivitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["fitness", "creative", "therapy", "social", "health"],
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: Number, required: true },
    capacity: { type: Number, required: true },
    location: { type: String, required: true },
    day: { type: String, required: true }, //change 6
    participants: { type: Number, default: 0 },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Activity", ActivitySchema)
