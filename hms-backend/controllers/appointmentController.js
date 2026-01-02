const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Medicine = require('../models/Medicine');

// @desc    Book an Appointment
// @route   POST /api/appointments/book
// @access  Private (Patient)
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, reason } = req.body;

    // 1. Verify Doctor exists and is actually a doctor
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // 2. Create Appointment
    const appointment = await Appointment.create({
      patientId: req.user._id, // Comes from 'protect' middleware
      doctorId,
      appointmentDate,
      reason,
      status: 'pending'
    });

    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Patient's Appointment History
// @route   GET /api/appointments/my-appointments
// @access  Private (Patient)
const getMyAppointments = async (req, res) => {
  try {
    // Find appointments where patientId matches the logged-in user
    // .populate() automatically fetches the Doctor's name and email
    const appointments = await Appointment.find({ patientId: req.user._id })
      .populate('doctorId', 'name email specialization'); 

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctorAppointments = async (req, res) => {
    try {
      // Find appointments where doctorId matches the logged-in user
      const appointments = await Appointment.find({ doctorId: req.user._id })
        .populate('patientId', 'name email'); // Show patient details
      
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

const updateAppointmentStatus = async (req, res) => {
    try {
      const { diagnosis, medicines } = req.body; 
      // medicines format expected: [{ medicineId: "123", quantity: 2 }, ...]
  
      const appointment = await Appointment.findById(req.params.id);
  
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
  
      // Ensure the logged-in doctor owns this appointment
      if (appointment.doctorId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this appointment' });
      }
  
      // --- NEW LOGIC: CALCULATE BILL & UPDATE STOCK ---
      let totalBill = 0;
      let prescribedMedicines = [];
  
      if (medicines && medicines.length > 0) {
        for (const item of medicines) {
          const med = await Medicine.findById(item.medicineId);
  
          if (!med) {
            return res.status(404).json({ message: `Medicine not found with ID: ${item.medicineId}` });
          }
  
          if (med.stock < item.quantity) {
            return res.status(400).json({ message: `Insufficient stock for: ${med.name}` });
          }
  
          // 1. Calculate Cost
          totalBill += med.price * item.quantity;
  
          // 2. Deduct Stock from Inventory
          med.stock -= item.quantity;
          await med.save();
  
          // 3. Add to prescription list for the appointment record
          prescribedMedicines.push({
            medicineId: med._id,
            quantity: item.quantity
          });
        }
      }
      // ------------------------------------------------
  
      // Update Appointment Fields
      appointment.status = 'completed';
      appointment.diagnosis = diagnosis || appointment.diagnosis;
      appointment.prescribedMedicines = prescribedMedicines;
      appointment.totalBill = totalBill;
  
      const updatedAppointment = await appointment.save();
      res.json(updatedAppointment);
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Update the export line to include the new functions
  module.exports = { 
    bookAppointment, 
    getMyAppointments, 
    getDoctorAppointments, 
    updateAppointmentStatus 
  };