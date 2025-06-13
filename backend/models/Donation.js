const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['monetary', 'goods', 'volunteer'] },
  amount: { type: Number },
  donorInfo: {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    isAnonymous: { type: Boolean, default: false }
  },
  status: { 
    type: String, 
    default: 'pending', 
    enum: ['pending', 'processed', 'completed', 'cancelled'] 
  },
  paymentMethod: { type: String },
  transactionId: { type: String },
  adminNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Donation", DonationSchema);