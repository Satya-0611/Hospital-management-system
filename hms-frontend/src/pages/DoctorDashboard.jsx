import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedAppt, setSelectedAppt] = useState(null); 
  const [diagnosis, setDiagnosis] = useState('');
  
  // PHARMACY STATE 💊
  const [inventory, setInventory] = useState([]); // Full list of available meds
  const [prescribedMeds, setPrescribedMeds] = useState([]); // Meds added to current patient
  const [currentMedId, setCurrentMedId] = useState(''); // Currently selected dropdown value
  const [currentQty, setCurrentQty] = useState(1); // Currently typed quantity

  useEffect(() => {
    fetchAppointments();
    fetchMedicines(); // Fetch inventory on load
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/api/appointments/doctor-appointments');
      setAppointments(res.data);
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Fetch Available Medicines
  const fetchMedicines = async () => {
    try {
      const res = await api.get('/api/medicines');
      setInventory(res.data);
    } catch (error) {
      console.error("Could not fetch inventory", error);
    }
  };

  // 2. Add Medicine to Temporary List (Frontend Only)
  const addMedicine = (e) => {
    e.preventDefault();
    if (!currentMedId || currentQty <= 0) return;

    // Find the full medicine object to display name/price
    const medObj = inventory.find(m => m._id === currentMedId);
    if (!medObj) return;

    // Prevent duplicates (optional: could just add qty)
    if (prescribedMeds.some(item => item.medicineId === currentMedId)) {
      alert("Medicine already added. Remove it to change quantity.");
      return;
    }

    const newItem = {
      medicineId: currentMedId,
      name: medObj.name,
      price: medObj.price,
      quantity: parseInt(currentQty)
    };

    setPrescribedMeds([...prescribedMeds, newItem]);
    
    // Reset small inputs
    setCurrentMedId('');
    setCurrentQty(1);
  };

  // 3. Remove Medicine from List
  const removeMedicine = (id) => {
    setPrescribedMeds(prescribedMeds.filter(item => item.medicineId !== id));
  };

  // 4. Calculate Total (Visual feedback for Doctor)
  const calculateTotal = () => {
    return prescribedMeds.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  // 5. Submit Final Payload
  const handleComplete = async () => {
    if (!diagnosis) return alert("Please enter a diagnosis");
    
    // Format payload exactly as backend expects
    const payload = {
      diagnosis,
      medicines: prescribedMeds.map(m => ({
        medicineId: m.medicineId,
        quantity: m.quantity
      }))
    };

    try {
      await api.put(`/api/appointments/complete/${selectedAppt._id}`, payload);
      alert("Checkup Completed & Bill Generated!");
      closeModal();
      fetchAppointments();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to complete checkup");
    }
  };

  const closeModal = () => {
    setSelectedAppt(null);
    setDiagnosis('');
    setPrescribedMeds([]);
    setCurrentMedId('');
    setCurrentQty(1);
  };

  // Helper for names
  const getPatientName = (appt) => {
    if (appt.patientId && appt.patientId.name) return appt.patientId.name;
    if (appt.patientName) return appt.patientName;
    return 'Unknown Patient';
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar role="Doctor" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-white mb-6 pl-4 border-l-4 border-medical-primary">
          Today's Appointments
        </h2>

        {loading ? (
          <p className="text-slate-400 pl-4">Loading schedule...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {appointments.map((appt) => (
              <div key={appt._id} className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6 hover:border-medical-primary transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{getPatientName(appt)}</h3>
                    <p className="text-sm text-slate-400">Date: {new Date(appt.appointmentDate).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    appt.status === 'completed' ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'
                  }`}>
                    {appt.status}
                  </span>
                </div>
                <p className="text-slate-300 text-sm mb-4">Reason: {appt.reason}</p>
                
                {appt.status !== 'completed' && (
                  <button 
                    onClick={() => setSelectedAppt(appt)}
                    className="w-full bg-medical-primary hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Treat Patient
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 🏥 TREATMENT MODAL */}
        {selectedAppt && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full border border-slate-600 shadow-2xl my-8">
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Treat: {getPatientName(selectedAppt)}</h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-white">✕</button>
              </div>

              {/* SECTION 1: DIAGNOSIS */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-400 mb-1">Diagnosis</label>
                <textarea
                  className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white focus:ring-1 focus:ring-medical-primary"
                  rows="3"
                  placeholder="Clinical observations..."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                />
              </div>

              {/* SECTION 2: PHARMACY / MEDICINES */}
              <div className="mb-6 bg-slate-900 p-4 rounded-lg border border-slate-700">
                <h4 className="text-sm font-bold text-medical-primary mb-3 uppercase tracking-wide">Prescribe Medicines</h4>
                
                {/* Medicine Input Row */}
                <div className="flex gap-2 mb-4">
                  <select 
                    className="flex-1 p-2 rounded bg-slate-800 border border-slate-600 text-white text-sm"
                    value={currentMedId}
                    onChange={(e) => setCurrentMedId(e.target.value)}
                  >
                    <option value="">-- Select Medicine --</option>
                    {inventory.map(med => (
                      <option key={med._id} value={med._id} disabled={med.stock < 1}>
                        {med.name} (${med.price}) - {med.stock > 0 ? `${med.stock} left` : 'OUT OF STOCK'}
                      </option>
                    ))}
                  </select>
                  <input 
                    type="number" 
                    min="1"
                    className="w-20 p-2 rounded bg-slate-800 border border-slate-600 text-white text-sm"
                    value={currentQty}
                    onChange={(e) => setCurrentQty(e.target.value)}
                  />
                  <button 
                    onClick={addMedicine}
                    className="bg-medical-secondary text-white px-4 py-2 rounded text-sm hover:bg-slate-600"
                  >
                    Add
                  </button>
                </div>

                {/* Selected Medicines List */}
                {prescribedMeds.length > 0 ? (
                  <div className="bg-slate-800 rounded overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-700 text-slate-300">
                        <tr>
                          <th className="p-2">Medicine</th>
                          <th className="p-2 text-center">Qty</th>
                          <th className="p-2 text-right">Price</th>
                          <th className="p-2 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {prescribedMeds.map((item) => (
                          <tr key={item.medicineId}>
                            <td className="p-2 text-white">{item.name}</td>
                            <td className="p-2 text-center text-slate-300">{item.quantity}</td>
                            <td className="p-2 text-right text-medical-primary">${item.price * item.quantity}</td>
                            <td className="p-2 text-center">
                              <button 
                                onClick={() => removeMedicine(item.medicineId)}
                                className="text-red-400 hover:text-red-300 font-bold px-2"
                              >
                                ×
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="p-2 text-right text-white font-bold border-t border-slate-700 bg-slate-700/50">
                      Est. Total: ${calculateTotal()}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm text-center italic">No medicines added yet.</p>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
                <button 
                  onClick={closeModal}
                  className="px-4 py-2 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleComplete}
                  className="px-6 py-2 bg-medical-primary hover:bg-teal-700 text-white rounded font-bold shadow-lg shadow-teal-900/50"
                >
                  Complete & Bill
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;