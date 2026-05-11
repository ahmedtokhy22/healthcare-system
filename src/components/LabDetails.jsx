import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, FileText, History, Activity, User, 
  Loader2, ShieldAlert, Calendar, Clock, HeartPulse,
  Beaker, CheckCircle2, Save, Upload, ExternalLink,
  MapPin, StickyNote, DollarSign, Check, AlertCircle
} from "lucide-react";

export default function LabDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  
  const [testForms, setTestForms] = useState({}); 
  const [submittingTest, setSubmittingTest] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

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
        
        const initialForms = {};
        appRes.data.testResults?.forEach(test => {
          initialForms[test.testId] = {
            value: test.value || "",
            summary: test.summary || "",
            file: null
          };
        });
        setTestForms(initialForms);

      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLabData();
  }, [id, refreshTrigger]);

  const handleInputChange = (testId, field, value) => {
    setTestForms(prev => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        [field]: value
      }
    }));
  };

  const handleFileChange = (testId, e) => {
    const file = e.target.files[0];
    setTestForms(prev => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        file: file
      }
    }));
  };

  const handleSubmitSingleTest = async (testId) => {
    const formState = testForms[testId];
    const existingTestInfo = appointment.testResults.find(t => t.testId === testId);

    if (!formState.file && !existingTestInfo?.resultFileUrl) {
      alert("Please upload the PDF result file for this test.");
      return;
    }

    try {
      setSubmittingTest(testId);
      const formData = new FormData();
      
      formData.append("Value", formState.value);
      formData.append("summary", formState.summary);
      
      if (formState.file) {
        formData.append("resultfile", formState.file);
      }

      await axios.post(`${API_BASE}/lab-appointments/${id}/test-result/${testId}`, formData, {
        headers: { 
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert("✅ Test analysis submitted successfully!");
      setRefreshTrigger(prev => prev + 1); 

    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit result. Make sure all fields are filled properly.");
    } finally {
      setSubmittingTest(null);
    }
  };

  const handleNoShow = async () => {
    if (window.confirm("Record patient no-show? This will close the appointment.")) {
      try {
        await axios.patch(`${API_BASE}/Appointments/${id}/final-status`, {
          appointmentType: "lab",
          status: "NoShow"
        }, { headers });
        alert("✅ Recorded successfully");
        setRefreshTrigger(prev => prev + 1);
      } catch (err) {
        alert("❌ Update failed: " + (err.response?.data?.message || "Server Error"));
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      <p className="font-black text-slate-400 text-xs uppercase tracking-widest">Accessing Medical Database...</p>
    </div>
  );

  const canEditResults = appointment?.status === 'Completed' || appointment?.status === 'ResultsDone';

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans" dir="ltr">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-8 space-y-8 order-2 lg:order-1">
          
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black text-xs uppercase">
              <ArrowLeft size={20} /> Exit Panel
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <ShieldAlert size={16} />
              <span className="text-[10px] font-black uppercase">Secure Lab Authorization</span>
            </div>
          </div>

          <section className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden text-left">
            <div className="bg-blue-600 px-8 py-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Beaker size={20} />
                <h2 className="font-black text-sm uppercase">Laboratory Entry Form</h2>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {!canEditResults && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-2xl flex items-center gap-3 mb-6">
                  <AlertCircle size={20} className="shrink-0" />
                  <p className="text-xs font-bold uppercase tracking-tight">
                    Data entry is disabled because the appointment status is currently 
                    <span className="ml-1 px-2 py-0.5 bg-amber-200 rounded-md text-amber-900">
                      {appointment?.status || 'Unknown'}
                    </span>
                  </p>
                </div>
              )}

              {appointment?.testResults?.map((test, idx) => (
                <div 
                  key={test.testId} 
                  className={`bg-slate-50 border rounded-[2rem] p-6 shadow-sm transition-all ${
                    !canEditResults ? 'border-slate-100 opacity-75' : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 mb-4 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 font-black shadow-sm border border-slate-100">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-800 text-sm uppercase">{test.testName}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          ID: {test.testId.split('-')[0]}
                        </p>
                      </div>
                    </div>
                    {test.status === 'Completed' && (
                      <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 uppercase tracking-widest">
                        <Check size={14} /> Completed
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                        Numeric Value
                      </label>
                      <input 
                        type="number"
                        step="any"
                        placeholder="e.g. 13.36"
                        disabled={!canEditResults}
                        className={`border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none w-full ${
                          !canEditResults ? 'bg-slate-100 border-transparent text-slate-500 cursor-not-allowed' : 'bg-white border-slate-200'
                        }`}
                        value={testForms[test.testId]?.value || ""}
                        onChange={(e) => handleInputChange(test.testId, 'value', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                        Medical Summary
                      </label>
                      <textarea 
                        placeholder="Add clinical context..."
                        disabled={!canEditResults}
                        className={`border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none w-full resize-none h-[46px] ${
                          !canEditResults ? 'bg-slate-100 border-transparent text-slate-500 cursor-not-allowed' : 'bg-white border-slate-200'
                        }`}
                        value={testForms[test.testId]?.summary || ""}
                        onChange={(e) => handleInputChange(test.testId, 'summary', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between bg-white border border-slate-100 rounded-2xl p-4 gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      {test.resultFileUrl && (
                        <button 
                          onClick={() => window.open(test.resultFileUrl, "_blank")}
                          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 transition-all"
                        >
                          <ExternalLink size={14} /> View Current PDF
                        </button>
                      )}
                      
                      {canEditResults ? (
                        <label className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase cursor-pointer transition-all border-2 border-dashed ${
                          testForms[test.testId]?.file ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-400'
                        }`}>
                          <Upload size={14} />
                          {testForms[test.testId]?.file ? testForms[test.testId].file.name : (test.resultFileUrl ? "Upload Replacement" : "Select PDF")}
                          <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileChange(test.testId, e)} />
                        </label>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase border-2 border-dashed bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed">
                          <Upload size={14} /> Upload Locked
                        </div>
                      )}
                    </div>

                    {canEditResults && (
                      <button 
                        onClick={() => handleSubmitSingleTest(test.testId)}
                        disabled={submittingTest === test.testId}
                        className="w-full md:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-900 transition-all disabled:opacity-50"
                      >
                        {submittingTest === test.testId ? <Loader2 className="animate-spin" size={16}/> : <Save size={16} />}
                        Save Result
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden text-left">
            <div className="bg-slate-900 px-8 py-5 text-white flex items-center gap-3">
              <History size={20} />
              <h2 className="font-black text-sm uppercase">Medical History</h2>
            </div>
            <div className="p-8">
              <h4 className="flex items-center gap-2 font-black text-sm mb-6 text-slate-800">
                <Activity size={18} className="text-blue-600" /> Past Diagnoses
              </h4>
              <div className="space-y-4 mb-10">
                {medicalRecord?.diagnoses?.map((diag, idx) => (
                  <div key={idx} className="bg-slate-50 border-l-4 border-blue-500 rounded-2xl p-5">
                    <div className="flex justify-between mb-3">
                      <span className="font-black text-blue-700 text-sm">Dr. {diag.doctorName}</span>
                      <span className="text-[10px] font-bold text-slate-400">{diag.appointmentDate}</span>
                    </div>
                    <p className="text-xs font-black text-slate-700">Diagnosis: {diag.diagnosis}</p>
                    <p className="text-[11px] text-slate-500 font-bold mt-1">Rx: {diag.prescription}</p>
                  </div>
                ))}
                {!medicalRecord?.diagnoses?.length && <p className="text-xs font-bold text-slate-400 italic">No past diagnoses found.</p>}
              </div>

              <h4 className="flex items-center gap-2 font-black text-sm mb-6 text-slate-800">
                <FileText size={18} className="text-blue-600" /> Laboratory Results
              </h4>
              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 font-black uppercase">
                    <tr>
                      <th className="p-4">Date</th>
                      <th className="p-4">Test Name</th>
                      <th className="p-4">Result</th>
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
                            className="flex items-center gap-2 mx-auto bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-blue-600 hover:border-blue-600 transition-all"
                          >
                            <ExternalLink size={12} /> PDF
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

        <div className="lg:col-span-4 sticky top-8 space-y-6 order-1 lg:order-2 text-left">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl p-8">
            <div className="flex justify-between items-center mb-8">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User size={14}/> Patient Profile
              </span>
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black ${
                appointment?.status === 'NoShow' ? 'bg-red-100 text-red-600' : 
                appointment?.status === 'ResultsDone' || appointment?.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 
                'bg-amber-100 text-amber-600'
              }`}>
                {appointment?.status?.toUpperCase()}
              </span>
            </div>

            <div className="space-y-6">
              <div className="text-center pb-6 border-b border-slate-50">
                <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 mx-auto mb-4">
                  <User size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tighter mb-1">
                  Patient Details
                </h3>
                <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">{appointment?.appointmentType} Service</p>
              </div>
              
              <InfoItem icon={<Calendar size={14}/>} label="Date" value={appointment?.date} color="text-slate-800" />
              <InfoItem icon={<Clock size={14}/>} label="Time" value={appointment?.startTime?.slice(0,5)} color="text-slate-800" />
              <InfoItem icon={<DollarSign size={14}/>} label="Total Fee" value={`${appointment?.totalFee} EGP`} color="text-blue-600" />
              
              {appointment?.address && (
                <div className="pt-4 border-t border-slate-50">
                  <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 mb-2"><MapPin size={12}/> Address</span>
                  <p className="text-[11px] font-bold text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl">{appointment.address}</p>
                </div>
              )}

              {appointment?.notes && (
                <div className="pt-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 mb-2"><StickyNote size={12}/> Notes</span>
                  <p className="text-[11px] font-bold text-slate-700 leading-relaxed bg-amber-50 text-amber-800 p-3 rounded-xl border border-amber-100">{appointment.notes}</p>
                </div>
              )}

              {/* No-Show Button: Only visible if status is Completed */}
              {appointment?.status === "Completed" && (
                <button 
                  onClick={handleNoShow}
                  className="w-full mt-4 border-2 border-red-50 text-red-500 py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase hover:bg-red-100 hover:text-red-600 active:scale-95 transition-all shadow-sm"
                >
                  <AlertCircle size={18} /> Mark as No-Show
                </button>
              )}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
            <h4 className="text-white text-[10px] font-black uppercase mb-6 text-center tracking-widest flex items-center justify-center gap-2 border-b border-slate-800 pb-4">
              <CheckCircle2 size={16} className="text-emerald-500" /> Chronic Conditions
            </h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {medicalRecord?.medicalConditions && Object.entries(medicalRecord.medicalConditions).map(([key, value]) => (
                value === true && key !== 'id' && (
                  <span key={key} className="bg-slate-800 text-blue-400 text-[10px] px-4 py-2 rounded-xl font-black border border-slate-700">
                    {key.replace('has', '').replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                )
              ))}
              {(!medicalRecord?.medicalConditions || Object.values(medicalRecord.medicalConditions).every(v => v !== true)) && (
                <span className="text-slate-500 text-[10px] font-bold italic">None recorded</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value, color }) {
  return (
    <div className="flex justify-between items-end border-b border-slate-50 pb-3">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
        {icon} {label}
      </span>
      <span className={`text-[11px] font-black ${color}`}>{value}</span>
    </div>
  );
}