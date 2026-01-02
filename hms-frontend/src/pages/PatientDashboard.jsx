import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]); 
  const [medicineInventory, setMedicineInventory] = useState([]); // Store all available meds for name lookup
  const [form, setForm] = useState({ doctorId: '', appointmentDate: '', reason: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
    fetchDoctors();
    fetchMedicineInventory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/api/appointments/my-appointments');
      setAppointments(res.data);
    } catch (err) { 
      console.error("History Error", err); 
    } finally { 
      setLoading(false); 
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/api/admin/doctors'); 
      setDoctors(res.data);
    } catch (err) {
      console.error("Could not fetch doctors list", err);
    }
  };

  // New: Fetch inventory to translate IDs to Names
  const fetchMedicineInventory = async () => {
    try {
      const res = await api.get('/api/medicines');
      setMedicineInventory(res.data);
    } catch (err) {
      console.error("Could not fetch medicines", err);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/appointments/book', form);
      alert("Appointment Booked!");
      setForm({ doctorId: '', appointmentDate: '', reason: '' }); 
      fetchHistory(); 
    } catch (error) {
      alert(error.response?.data?.message || "Booking Failed");
    }
  };

  // --- HELPERS ---

  const getDoctorName = (appt) => {
    if (appt.doctorId && appt.doctorId.name) return appt.doctorId.name;
    if (appt.doctorName) return appt.doctorName;
    return 'Unknown Doctor';
  };

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // FIXED: Helper to find medicine name from ID
  const getMedName = (medId) => {
    // 1. If backend sent a populated object with a name, use it
    if (medId && medId.name) return medId.name;
    
    // 2. If it's just an ID string, look it up in our inventory
    const foundMed = medicineInventory.find(m => m._id === medId);
    if (foundMed) return foundMed.name;

    // 3. Fallback
    return 'Unknown Medicine';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Navbar role="Patient" />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COL: BOOKING FORM */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 sticky top-6">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Book Appointment</h2>
            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Select Doctor</label>
                <select 
                  required
                  value={form.doctorId}
                  className="w-full bg-slate-900 border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-medical-primary"
                  onChange={(e) => setForm({...form, doctorId: e.target.value})}
                >
                  <option value="">-- Choose Doctor --</option>
                  {doctors.map(doc => (
                    <option key={doc._id} value={doc._id}>
                      Dr. {doc.name} - {doc.specialization || 'General'}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
                <input 
                  type="date" 
                  required
                  min={getTodayString()} 
                  value={form.appointmentDate}
                  className="w-full bg-slate-900 border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-medical-primary"
                  onChange={(e) => setForm({...form, appointmentDate: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Reason</label>
                <textarea 
                  required rows="3"
                  value={form.reason}
                  className="w-full bg-slate-900 border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-medical-primary"
                  onChange={(e) => setForm({...form, reason: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-medical-primary hover:bg-teal-600 text-white font-bold py-2.5 px-4 rounded transition-colors shadow-lg">
                Confirm Booking
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COL: HISTORY */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Medical History</h2>
          <div className="bg-slate-800 rounded-lg shadow border border-slate-700 overflow-hidden">
            {appointments.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <p>No appointment history found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900 text-slate-400 uppercase font-medium">
                    <tr>
                      <th className="px-6 py-4">Date & Doctor</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Diagnosis & Prescription</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700 text-slate-300">
                    {appointments.map((appt) => (
                      <tr key={appt._id} className="hover:bg-slate-700/30 transition-colors">
                        
                        <td className="px-6 py-4 align-top">
                          <p className="text-white font-bold text-base">{getDoctorName(appt)}</p>
                          <p className="text-slate-500 text-xs mt-1">
                            {new Date(appt.appointmentDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </td>

                        <td className="px-6 py-4 align-top">
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            appt.status === 'completed' ? 'bg-green-900 text-green-200' : 
                            appt.status === 'pending' ? 'bg-yellow-900 text-yellow-200' : 'bg-red-900 text-red-200'
                          }`}>
                            {appt.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 align-top">
                          {appt.status === 'completed' ? (
                            <div className="space-y-2">
                              <div>
                                <span className="text-slate-500 text-xs uppercase tracking-wide">Diagnosis:</span>
                                <p className="text-white">{appt.diagnosis}</p>
                              </div>

                              {/* FIXED: Using 'prescribedMedicines' key based on your JSON */}
                              {appt.prescribedMedicines && appt.prescribedMedicines.length > 0 && (
                                <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
                                  <span className="text-slate-500 text-xs uppercase tracking-wide block mb-1">Prescribed Meds:</span>
                                  <ul className="list-disc list-inside text-slate-300 text-xs space-y-0.5">
                                    {appt.prescribedMedicines.map((m, idx) => (
                                      <li key={idx}>
                                        {/* Look up name from inventory using ID */}
                                        <span className="text-white">{getMedName(m.medicineId)}</span> 
                                        <span className="text-slate-500"> (x{m.quantity})</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {(appt.billAmount > 0 || appt.totalBill > 0) && (
                                <div className="mt-2 pt-2 border-t border-slate-700 flex items-center gap-2">
                                  <span className="text-slate-400 text-xs uppercase">Total Bill:</span>
                                  <span className="text-green-400 font-bold text-lg">
                                    ${appt.billAmount || appt.totalBill}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-500 italic text-xs">Waiting for checkup...</span>
                          )}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;