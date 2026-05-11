import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Video, FileText, History, Activity, User, 
  ChevronLeft, Loader2, Clipboard, ShieldAlert,
  Calendar, Clock, HeartPulse
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
        // جلب تفاصيل موعد الممرض
        const appRes = await axios.get(`${API_BASE}/nurse-appointments/${id}`, { headers });
        const appData = appRes.data;
        setAppointment(appData);

        // جلب السجل الطبي للمريض (للقراءة فقط)
        const medicalRes = await axios.get(`${API_BASE}/Patients/${appData.patientId}/medical-record`, { headers });
        setMedicalRecord(medicalRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNurseData();
  }, [id]);

  const isMeetingActive = () => {
    if (!appointment?.date || !appointment?.startTime || !appointment?.endTime) return false;
    const now = new Date();
    const start = new Date(`${appointment.date}T${appointment.startTime}`);
    const end = new Date(`${appointment.date}T${appointment.endTime}`);
    return now >= start && now <= end;
  };

  const handleJoinMeeting = async () => {
    try {
      const res = await axios.post(`${API_BASE}/nurse-appointments/${id}/prepare-meetings`, {}, { headers });
      if (res.data.meetingUrl) window.open(res.data.meetingUrl, "_blank");
    } catch (err) {
      alert("❌ Unable to start meeting. Check connection or appointment time.");
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
        
        {/* Back Button & Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-black text-xs uppercase"
          >
            <ChevronLeft size={20} /> Back to Station
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
            <ShieldAlert size={16} />
            <span className="text-[10px] font-black uppercase">Read-Only Access</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content (Left) - Medical Record */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Medical History Section */}
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
                    <p className="text-xs text-slate-400 italic font-bold">No past diagnoses recorded.</p>
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
                    <tbody className="divide-y divide-slate-50 font-bold">
                      {medicalRecord?.labResults?.map((lab, i) => lab.results.map((res, j) => (
                        <tr key={`${i}-${j}`} className="hover:bg-blue-50/30 transition-colors">
                          <td className="p-4 text-slate-400">{lab.appointmentDate}</td>
                          <td className="p-4 text-slate-800">{res.testName}</td>
                          <td className="p-4 text-red-600 font-black">{res.value}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => window.open(res.resultFileUrl, "_blank")}
                              className="text-blue-600 hover:underline flex items-center gap-1 mx-auto"
                            >
                              View PDF
                            </button>
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar (Right) - Appointment & Profile */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Patient Card */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <HeartPulse size={80} />
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <User size={14}/> Profile
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black">
                  {appointment?.status?.toUpperCase()}
                </span>
              </div>

              <div className="text-center pb-6 border-b border-slate-50 mb-6">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-1">{appointment?.patientName}</h3>
                <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">{appointment?.serviceType}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-300 uppercase">Appointment Date</span>
                  <span className="text-xs font-black text-slate-700 flex items-center gap-2"><Calendar size={14}/> {appointment?.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-300 uppercase">Visit Time</span>
                  <span className="text-xs font-black text-slate-700 flex items-center gap-2"><Clock size={14}/> {appointment?.appointmentStartTime}</span>
                </div>
              </div>

              {appointment?.appointmentType === "Online" && (
                <button 
                  onClick={isMeetingActive() ? handleJoinMeeting : undefined}
                  disabled={!isMeetingActive()}
                  className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase transition-all ${
                    isMeetingActive()
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <Video size={18} />
                  {isMeetingActive() ? "Join Meeting" : "Meeting Inactive"}
                </button>
              )}
            </div>

            {/* Chronic Conditions (Crucial for Nurse) */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
              <h4 className="text-white text-[10px] font-black uppercase mb-6 text-center tracking-widest flex items-center justify-center gap-2 border-b border-slate-800 pb-4">
                <Clipboard size={16} className="text-emerald-500" /> Chronic Conditions
              </h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {medicalRecord?.medicalConditions && Object.entries(medicalRecord.medicalConditions).map(([key, value]) => (
                  value === true && (
                    <span key={key} className="bg-slate-800 text-blue-400 text-[9px] px-3 py-2 rounded-xl font-black border border-slate-700 uppercase">
                      {key.replace('has', '')}
                    </span>
                  )
                ))}
                {(!medicalRecord?.medicalConditions) && (
                  <span className="text-slate-500 text-[10px] font-bold italic">No chronic conditions listed</span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}