const express = require('express');
const router = express.Router();
const { addMedicine, getAllMedicines } = require('../controllers/medicineController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route: POST /api/medicines (Only Admin can add)
router.post('/', protect, admin, addMedicine);

// Route: GET /api/medicines (Doctors need to see this list too)
router.get('/', protect, getAllMedicines);

module.exports = router;