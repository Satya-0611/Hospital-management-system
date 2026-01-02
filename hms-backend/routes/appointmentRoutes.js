const express = require('express');
const router = express.Router();
const { 
  bookAppointment, 
  getMyAppointments, 
  getDoctorAppointments, 
  updateAppointmentStatus 
} = require('../controllers/appointmentController');

// Import the new 'doctor' middleware
const { protect, doctor } = require('../middleware/authMiddleware');

// Patient Routes
router.post('/book', protect, bookAppointment);
router.get('/my-appointments', protect, getMyAppointments);

// Doctor Routes (Protected + Doctor Only)
router.get('/doctor-appointments', protect, doctor, getDoctorAppointments);
router.put('/complete/:id', protect, doctor, updateAppointmentStatus);

module.exports = router;