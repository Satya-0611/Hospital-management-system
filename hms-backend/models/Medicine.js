const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Prevent duplicates like "Paracetamol" appearing twice
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Price cannot be negative
  },
  stock: {
    type: Number,
    required: true,
    min: 0, // Stock cannot be negative
    default: 0,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  // Optional: A description or generic name
  description: {
    type: String,
  }
}, { timestamps: true });

const Medicine = mongoose.model('Medicine', medicineSchema);

module.exports = Medicine;