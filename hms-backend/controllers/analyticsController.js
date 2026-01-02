const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Get Overall Dashboard Stats (KPIs)
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
  try {
    // Run all queries in parallel for better performance
    const [patientsCount, doctorsCount, appointmentsCount, financialData] = await Promise.all([
      // 1. Count Total Patients
      User.countDocuments({ role: 'patient' }),

      // 2. Count Total Doctors
      User.countDocuments({ role: 'doctor' }),

      // 3. Count Total Appointments
      Appointment.countDocuments(),

      // 4. Calculate Total Revenue (Aggregation)
      Appointment.aggregate([
        {
          $group: {
            _id: null, // Group everything into one bucket
            totalRevenue: { $sum: '$totalBill' } // Sum the 'totalBill' field
          }
        }
      ])
    ]);

    // financialData returns an array like [{ _id: null, totalRevenue: 5000 }]
    // We need to safely access the number, defaulting to 0 if no data exists
    const totalRevenue = financialData.length > 0 ? financialData[0].totalRevenue : 0;

    res.json({
      patients: patientsCount,
      doctors: doctorsCount,
      appointments: appointmentsCount,
      revenue: totalRevenue
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChartData = async (req, res) => {
    try {
      // 1. Monthly Revenue (The Aggregation Pipeline)
      const monthlyRevenue = await Appointment.aggregate([
        { 
          $match: { status: 'completed' } // Only calculate completed (paid) appointments
        },
        {
          $group: {
            _id: { $month: "$appointmentDate" }, // Group by Month (1 = Jan, 2 = Feb)
            revenue: { $sum: "$totalBill" },     // Sum up the money
            count: { $sum: 1 }                   // Count how many appointments
          }
        },
        { $sort: { _id: 1 } } // Sort from Jan to Dec
      ]);
  
      // 2. Appointments by Status (Pending vs Completed)
      const statusStats = await Appointment.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]);
  
      res.json({ monthlyRevenue, statusStats });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // @desc    Download Report as CSV
  // @route   GET /api/admin/download-report
  // @access  Private (Admin)
  const getReport = async (req, res) => {
    try {
      // Fetch completed appointments and get names via populate
      const appointments = await Appointment.find({ status: 'completed' })
        .populate('doctorId', 'name')
        .populate('patientId', 'name');
  
      // Construct CSV String manually (Lightweight approach, no extra libraries)
      let csv = 'Date,Doctor,Patient,Diagnosis,Bill\n'; // Header Row
  
      appointments.forEach((app) => {
        // Format: 2023-12-25, Dr. Smith, John Doe, "Fever", 50
        const date = app.appointmentDate.toISOString().split('T')[0];
        const docName = app.doctorId ? app.doctorId.name : 'Unknown';
        const patName = app.patientId ? app.patientId.name : 'Unknown';
        
        csv += `${date},${docName},${patName},"${app.diagnosis}",${app.totalBill}\n`;
      });
  
      // Send file to browser
      res.header('Content-Type', 'text/csv');
      res.attachment('hms_report.csv'); // Tells browser to download
      res.send(csv);
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // IMPORTANT: Update the export at the very bottom
  module.exports = { getDashboardStats, getChartData, getReport };