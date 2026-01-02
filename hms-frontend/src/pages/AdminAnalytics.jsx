import React, { useEffect, useState } from 'react';
import api from '../services/api'; // Assumes you have your axios instance here
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  Users, 
  Stethoscope, 
  CalendarCheck, 
  DollarSign, 
  Download, 
  TrendingUp 
} from 'lucide-react';

const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    revenue: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // 1. Fetch KPI Cards Data
      const statsRes = await axios.get('/api/admin/stats');
      
      // 2. Fetch Chart Data
      const chartRes = await axios.get('/api/admin/chart-data');
      
      setStats(statsRes.data);
      
      // 3. Process Chart Data (Convert Month Number _id: 1 to "Jan")
      const formattedData = processChartData(chartRes.data.monthlyRevenue);
      setRevenueData(formattedData);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setLoading(false);
    }
  };

  // Helper to convert backend group data (1, 2, 3) to (Jan, Feb, Mar)
  const processChartData = (data) => {
    const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Ensure we have data, otherwise return empty array
    if (!data || !Array.isArray(data)) return [];

    // Map existing data to months
    return data.map(item => ({
      name: monthNames[item._id], // _id is the month number from MongoDB
      Revenue: item.revenue,
      Appointments: item.count
    })).sort((a, b) => {
        // Simple sort logic if needed, usually DB sorts it
        return monthNames.indexOf(a.name) - monthNames.indexOf(b.name);
    });
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axios.get('/api/admin/download-report', {
        responseType: 'blob', // Important: Treat response as a file
      });
      
      // Create a hidden link to trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Hospital_Report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download report.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading Analytics...</div>;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hospital Analytics</h1>
          <p className="text-gray-500 text-sm">Real-time performance overview</p>
        </div>
        <button 
          onClick={handleDownloadReport}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Total Patients" 
          value={stats.patients} 
          icon={<Users size={24} className="text-blue-600" />} 
          color="bg-blue-50"
        />
        <KpiCard 
          title="Doctors" 
          value={stats.doctors} 
          icon={<Stethoscope size={24} className="text-green-600" />} 
          color="bg-green-50"
        />
        <KpiCard 
          title="Appointments" 
          value={stats.appointments} 
          icon={<CalendarCheck size={24} className="text-purple-600" />} 
          color="bg-purple-50"
        />
        <KpiCard 
          title="Total Revenue" 
          value={`$${stats.revenue.toLocaleString()}`} 
          icon={<DollarSign size={24} className="text-yellow-600" />} 
          color="bg-yellow-50"
        />
      </div>

      {/* Charts Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={20} className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-700">Monthly Revenue & Traffic</h2>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip 
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              
              {/* Revenue Bar */}
              <Bar 
                dataKey="Revenue" 
                fill="#0d9488" // Teal color
                radius={[4, 4, 0, 0]} 
                barSize={40}
                name="Revenue ($)"
              />
              
              {/* Optional: Add a second bar for appointment count if you want comparison */}
              {/* <Bar dataKey="Appointments" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={40} /> */}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Reusable KPI Card Component
const KpiCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
    </div>
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
  </div>
);

export default AdminAnalytics;