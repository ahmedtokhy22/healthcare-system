import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FileText, History, Activity, User, 
  ChevronLeft, Loader2, Clipboard, ShieldAlert,
  Calendar, Clock, HeartPulse, MapPin, Banknote, AlertCircle, Timer
} from "lucide-react";

export default function NurseAppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);

  const API_BASE = 'https://healthcare52.runasp.net/api'; 
  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}` };

  useEffect(() => {
    const fetchNurseData = async () => {
      try {
        setLoading(true);
        const appRes = await axios.get(`${API_BASE}/nurse-appointments/${id}`, { headers });
        const appData = appRes.data;
        setAppointment(appData);

        if (appData?.patientId) {
          const medicalRes = await axios.get(`${API_BASE}/Patients/${appData.patientId}/medical-record`, { headers });
          setMedicalRecord(medicalRes.data);
        }
      } catch (err) {
        console.error("Error fetching patient data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNurseData();
  }, [id]);

  const handleNoShow = async () => {
    if (window.confirm("Record patient no-show? This will close the appointment.")) {
      try {
        await axios.patch(`${API_BASE}/Appointments/${id}/final-status`, {
          appointmentType: "nurse",
          status: "NoShow"
        }, { headers });
        alert("✅ Recorded successfully");
        setAppointment(prev => ({ ...prev, status: "NoShow" }));
      } catch (err) {
        alert("❌ Update failed: " + (err.response?.data?.message || "Server Error"));
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      <p className="font-black text-slate-400 text-xs uppercase tracking-widest">Fetching Patient File...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-left" dir="ltr">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-black text-xs uppercase"
          >
            <ChevronLeft size={20} /> Back to Station
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
            <ShieldAlert size={16} />
            <span className="text-[10px] font-black uppercase tracking-tighter">Nurse Clinical Review Mode</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm p-8">
               <h4 className="flex items-center gap-2 font-black text-sm mb-6 text-slate-800 uppercase tracking-tight">
                  <Clipboard size={18} className="text-blue-600" /> Appointment Request Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Patient Notes</span>
                    <div className="bg-slate-50 p-4 rounded-2xl text-xs font-bold text-slate-700 border border-slate-100 min-h-[50px]">
                      {appointment?.notes || "No notes provided"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Visit Address</span>
                    <div className="bg-slate-50 p-4 rounded-2xl text-xs font-bold text-slate-700 border border-slate-100 flex items-start gap-2">
                      <MapPin size={14} className="text-red-500 shrink-0 mt-0.5" />
                      {appointment?.address || "No address found"}
                    </div>
                  </div>
                </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
              <div className="bg-slate-900 px-8 py-5 text-white flex items-center gap-3">
                <History size={20} className="text-blue-400" />
                <h2 className="font-black text-sm uppercase tracking-tight">Patient Medical History</h2>
              </div>
              
              <div className="p-8">
                <h4 className="flex items-center gap-2 font-black text-sm mb-6 text-slate-800">
                  <Activity size={18} className="text-blue-600" /> Previous Diagnoses
                </h4>
                <div className="space-y-4 mb-10">
                  {medicalRecord?.diagnoses?.length > 0 ? (
                    medicalRecord.diagnoses.map((diag, idx) => (
                      <div key={idx} className="bg-slate-50 border-l-4 border-blue-500 rounded-2xl p-5 hover:bg-slate-100 transition-colors">
                        <div className="flex justify-between mb-2">
                          <span className="font-black text-blue-700 text-[12px]">Dr. {diag.doctorName}</span>
                          <span className="text-[10px] font-bold text-slate-400">{diag.appointmentDate}</span>
                        </div>
                        <p className="text-xs font-black text-slate-700">Diagnosis: {diag.diagnosis}</p>
                        <p className="text-[11px] text-slate-500 font-bold mt-1">Prescription: {diag.prescription}</p>
                      </div>
                    ))
                  ) : (
                    <div className="bg-slate-50 rounded-2xl p-6 text-center text-slate-400 font-bold italic text-xs">
                      No records found
                    </div>
                  )}
                </div>

                <h4 className="flex items-center gap-2 font-black text-sm mb-6 text-slate-800">
                  <FileText size={18} className="text-blue-600" /> Laboratory Results
                </h4>
                <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-400 font-black uppercase">
                      <tr>
                        <th className="p-4">Date</th>
                        <th className="p-4">Test</th>
                        <th className="p-4">Value</th>
                        <th className="p-4 text-center">Report</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                      {medicalRecord?.labResults?.map((lab, i) => 
                        lab.results?.map((res, j) => (
                          <tr key={`${i}-${j}`} className="hover:bg-blue-50/30 transition-colors">
                            <td className="p-4 text-slate-400">{lab.appointmentDate}</td>
                            <td className="p-4">{res.testName}</td>
                            <td className="p-4 text-red-600 font-black">{res.value}</td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => res.resultFileUrl && window.open(res.resultFileUrl, "_blank")}
                                className="text-blue-600 hover:underline flex items-center gap-1 mx-auto disabled:opacity-30"
                                disabled={!res.resultFileUrl}
                              >
                                View PDF
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {(!medicalRecord?.labResults || medicalRecord.labResults.length === 0) && (
                    <div className="p-8 text-center text-slate-400 font-bold text-xs italic">
                      No lab data available
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <HeartPulse size={80} />
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <User size={14}/> Patient Information
                </span>
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                  appointment?.status === 'NoShow' ? 'bg-red-100 text-red-600' : 
                  appointment?.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {appointment?.status || 'Unknown'}
                </span>
              </div>

              <div className="text-center pb-6 border-b border-slate-50 mb-6">
                <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">{appointment?.serviceType || "QuickVisit"}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-300 uppercase">Date</span>
                  <span className="text-xs font-black text-slate-700 flex items-center gap-2">
                    <Calendar size={14}/> {appointment?.date || "No date"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-300 uppercase">Start Time</span>
                  <span className="text-xs font-black text-slate-700 flex items-center gap-2">
                    <Clock size={14}/> {appointment?.appointmentStartTime?.slice(0, 5) || "00:00"}
                  </span>
                </div>
                {appointment?.serviceType === "HourlyStay" && appointment?.hours && (
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-300 uppercase">Duration</span>
                    <span className="text-xs font-black text-slate-700 flex items-center gap-2">
                      <Timer size={14}/> {appointment?.hours} Hours
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                  <span className="text-[10px] font-black text-slate-300 uppercase">Total Fee</span>
                  <span className="text-sm font-black text-emerald-600 flex items-center gap-1">
                    <Banknote size={16}/> {appointment?.totalFee || 0} EGP
                  </span>
                </div>
              </div>

              {/* No-Show Button — Only active/visible if status is Completed */}
              {appointment?.status === "Completed" && (
                <button 
                  onClick={handleNoShow}
                  className="w-full border-2 border-red-50 text-red-500 py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase hover:bg-red-100 hover:text-red-600 active:scale-95 transition-all shadow-sm"
                >
                  <AlertCircle size={18} /> Mark as No-Show
                </button>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
              <h4 className="text-white text-[10px] font-black uppercase mb-6 text-center tracking-widest flex items-center justify-center gap-2 border-b border-slate-800 pb-4">
                <FileText size={16} className="text-emerald-500" /> Chronic Conditions
              </h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {medicalRecord?.medicalConditions && Object.entries(medicalRecord.medicalConditions)
                  .filter(([key, value]) => value === true && key !== 'id')
                  .map(([key]) => (
                    <span key={key} className="bg-slate-800 text-blue-400 text-[9px] px-3 py-2 rounded-xl font-black border border-slate-700 uppercase">
                      {key.replace('has', '').replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  ))
                }
                {(!medicalRecord?.medicalConditions || Object.values(medicalRecord.medicalConditions).every(v => v === false || typeof v !== 'boolean')) && (
                  <span className="text-slate-500 text-[10px] font-bold italic text-center">No conditions listed</span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}