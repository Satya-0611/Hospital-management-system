const express = require('express');
const router = express.Router();
const { getDashboardStats, getChartData, getReport } = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

// All Analytics routes require Admin access
router.get('/stats', protect, admin, getDashboardStats);
router.get('/chart-data', protect, admin, getChartData);
router.get('/download-report', protect, admin, getReport);

module.exports = router;