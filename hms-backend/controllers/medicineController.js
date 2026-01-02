const Medicine = require('../models/Medicine');

// @desc    Add new medicine to inventory
// @route   POST /api/medicines
// @access  Private (Admin)
const addMedicine = async (req, res) => {
  try {
    const { name, price, stock, expiryDate } = req.body;

    // Check if medicine already exists
    const exists = await Medicine.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: 'Medicine already exists' });
    }

    const medicine = await Medicine.create({
      name,
      price,
      stock,
      expiryDate
    });

    res.status(201).json({ message: 'Medicine added successfully', medicine });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all medicines
// @route   GET /api/medicines
// @access  Private (Admin, Doctor)
const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({});
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addMedicine, getAllMedicines };