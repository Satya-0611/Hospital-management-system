const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Add a new Doctor
// @route   POST /api/admin/add-doctor
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create Doctor (Force role to 'doctor')
    const doctor = await User.create({
      name,
      email,
      password,
      specialization,
      role: 'doctor' 
    });

    res.status(201).json({ message: 'Doctor created successfully', doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all Patients
// @route   GET /api/admin/patients
const getAllPatients = async (req, res) => {
  try {
    // Find all users where role is 'patient'
    const patients = await User.find({ role: 'patient' }).select('-password');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Block a Patient
// @route   PUT /api/admin/block-patient/:id
const blockPatient = async (req, res) => {
  try {
    const patient = await User.findById(req.params.id);

    if (patient) {
      patient.isBlocked = true;
      await patient.save();
      res.json({ message: 'Patient has been blocked' });
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllDoctors = async (req, res) => {
    try {
      // Find all users where role is 'doctor'
      // We only need their name and specialization for the dropdown
      const doctors = await User.find({ role: 'doctor' })
        .select('name email specialization'); 
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Add to exports at the bottom
  module.exports = { addDoctor, getAllPatients, blockPatient, getAllDoctors };