import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, FileText, History, Activity, User, 
  Loader2, ShieldAlert, Calendar, Clock, HeartPulse,
  Beaker, CheckCircle2, Download, Save, Upload, HardDrive
} from "lucide-react";

export default function LabDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  
  // States للبيانات الجديدة
  const [testResults, setTestResults] = useState({}); // لقيم التحاليل
  const [selectedFile, setSelectedFile] = useState(null); // لملف الـ PDF
  const [submitting, setSubmitting] = useState(false);

  const API_BASE = 'https://healthcare52.runasp.net/api'; 
  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}` };

  useEffect(() => {
    const fetchLabData = async () => {
      try {
        setLoading(true);
        const appRes = await axios.get(`${API_BASE}/lab-appointments/${id}`, { headers });
        setAppointment(appRes.data);

        const medicalRes = await axios.get(`${API_BASE}/Patients/${appRes.data.patientId}/medical-record`, { headers });
        setMedicalRecord(medicalRes.data);
        
        // تحضير الـ state للقيم
        const initialResults = {};
        appRes.data.tests.forEach(test => initialResults[test] = "");
        setTestResults(initialResults);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLabData();
  }, [id]);

  const handleInputChange = (testName, value) => {
    setTestResults(prev => ({ ...prev, [testName]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmitResults = async () => {
    if (!selectedFile) {
      alert("Please upload the result PDF file first.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      
      // إضافة المعرف والملف
      formData.append("LabAppointmentId", id);
      formData.append("ResultFile", selectedFile);

      // إضافة نتائج التحاليل (بناءً على الصيغة المتوقعة للـ API)
      Object.entries(testResults).forEach(( [name, val], index) => {
        formData.append(`Results[${index}].TestName`, name);
        formData.append(`Results[${index}].Value`, val);
      });

      await axios.post(`${API_BASE}/lab-appointments/${id}/test-results`, formData, {
        headers: { 
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert("✅ Analysis submitted and file uploaded successfully!");
      navigate(-1); // العودة للوحة التحكم
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit results. Make sure all fields are filled.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      <p className="font-black text-slate-400 text-xs uppercase tracking-widest">Accessing Medical Database...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans" dir="ltr">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black text-xs uppercase">
            <ArrowLeft size={20} /> Exit Panel
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <ShieldAlert size={16} />
            <span className="text-[10px] font-black uppercase">Secure Lab Authorization</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Result Entry Form */}
            <section className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
              <div className="bg-blue-600 px-8 py-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Beaker size={20} />
                  <h2 className="font-black text-sm uppercase">Laboratory Entry Form</h2>
                </div>
              </div>
              
              <div className="p-8">
                <div className="space-y-4 mb-8">
                  {appointment?.tests?.map((test, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 font-black shadow-sm">
                          {idx + 1}
                        </div>
                        <span className="font-black text-slate-700 text-sm uppercase">{test}</span>
                      </div>
                      <input 
                        type="text"
                        placeholder="Result Value"
                        className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
                        value={testResults[test] || ""}
                        onChange={(e) => handleInputChange(test, e.target.value)}
                        disabled={appointment.status === 'ResultsDone'}
                      />
                    </div>
                  ))}
                </div>

                {/* File Upload Area */}
                {appointment.status !== 'ResultsDone' && (
                  <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-blue-50/50 transition-all group">
                    <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="text-blue-600" size={32} />
                    </div>
                    <p className="text-sm font-black text-slate-700 mb-1">Upload Final Report (PDF)</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-6 text-center">Max file size: 5MB • Format: PDF only</p>
                    
                    <label className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-blue-600 transition-all">
                      {selectedFile ? selectedFile.name : "Select Document"}
                      <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                    </label>
                  </div>
                )}

                {appointment.status !== 'ResultsDone' && (
                  <button 
                    onClick={handleSubmitResults}
                    disabled={submitting}
                    className="w-full mt-8 bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl shadow-blue-100"
                  >
                    {submitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                    Submit Analysis to System
                  </button>
                )}
              </div>
            </section>

            {/* 2. Patient History (ReadOnly) */}
            <section className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden opacity-90">
              <div className="bg-slate-900 px-8 py-5 text-white flex items-center gap-3">
                <History size={20} className="text-blue-400" />
                <h2 className="font-black text-sm uppercase tracking-tight">Clinical History</h2>
              </div>
              <div className="p-8">
                <div className="space-y-4">
                  {medicalRecord?.diagnoses?.slice(0, 2).map((diag, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-2xl p-5 border-l-4 border-blue-500">
                      <div className="flex justify-between mb-2">
                        <span className="font-black text-blue-700 text-[10px] uppercase">Dr. {diag.doctorName}</span>
                        <span className="text-[10px] font-bold text-slate-400">{diag.appointmentDate}</span>
                      </div>
                      <p className="text-xs font-black text-slate-700 leading-relaxed">{diag.diagnosis}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Profile Card */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl p-8 relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 p-6 opacity-5"><HeartPulse size={80} /></div>
              <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 mx-auto mb-6">
                <User size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-1">{appointment?.patientName}</h3>
              <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em]">{appointment?.appointmentType} Service</p>
              
              <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                <div className="flex justify-between items-center text-[11px] font-black">
                  <span className="text-slate-300 uppercase tracking-widest">Date</span>
                  <span className="text-slate-700 flex items-center gap-2"><Calendar size={14} className="text-blue-500"/> {appointment?.date}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-black">
                  <span className="text-slate-300 uppercase tracking-widest">Time</span>
                  <span className="text-slate-700 flex items-center gap-2"><Clock size={14} className="text-blue-500"/> {appointment?.startTime?.slice(0,5)}</span>
                </div>
              </div>
            </div>

            {/* Financial Info */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <HardDrive size={16}/> Billing Summary
                </h4>
                <div className="space-y-3 mb-8 opacity-60 text-xs font-bold">
                  <div className="flex justify-between"><span>Tests Subtotal</span><span>{appointment?.totalPrice - (appointment?.homeVisitFee || 0)} EGP</span></div>
                  <div className="flex justify-between"><span>Service Fees</span><span>{appointment?.homeVisitFee || 0} EGP</span></div>
                </div>
                <div className="flex justify-between items-end border-t border-white/10 pt-4">
                  <span className="text-[10px] font-black uppercase text-blue-400">Total</span>
                  <span className="text-3xl font-black">{appointment?.totalPrice} <span className="text-xs opacity-50 font-normal ml-1 text-white">EGP</span></span>
                </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}