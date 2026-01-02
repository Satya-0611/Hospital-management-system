const express = require('express');
const router = express.Router();
const { addDoctor, getAllPatients, blockPatient, getAllDoctors } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Apply 'protect' and 'admin' middleware to all routes below
router.post('/add-doctor', protect, admin, addDoctor);
router.get('/patients', protect, admin, getAllPatients);
router.put('/block-patient/:id', protect, admin, blockPatient);
router.get('/doctors', protect, getAllDoctors);

module.exports = router;