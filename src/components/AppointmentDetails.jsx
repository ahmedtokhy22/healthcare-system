import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { 
  Save, Video, AlertCircle, FileText, CheckCircle2, 
  History, Activity, User, ClipboardList, ExternalLink, Loader2
} from "lucide-react";

export default function AppointmentDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [availableTests, setAvailableTests] = useState([]);
  
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [selectedTests, setSelectedTests] = useState([]);

  const API_BASE = 'https://healthcare52.runasp.net/api'; 
  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}` };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const appRes = await axios.get(`${API_BASE}/doctor-appointments/${id}`, { headers });
        const appData = appRes.data;
        setAppointment(appData);
        setDiagnosis(appData.diagnosis || "");
        setPrescription(appData.prescriptions || "");
        
        const medicalRes = await axios.get(`${API_BASE}/Patients/${appData.patientId}/medical-record`, { headers });
        setMedicalRecord(medicalRes.data);

        const testsRes = await axios.get(`${API_BASE}/tests`, { headers });
        setAvailableTests(testsRes.data || []);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id]);

  const handleSaveDiagnosis = async () => {
    setSubmitting(true);
    try {
      await axios.put(`${API_BASE}/doctor-appointments/${id}/diagnoses`, {
        diagnosis,
        prescriptions: prescription,
        requiredTests: selectedTests 
      }, { headers });
      alert("✅ تم تحديث التشخيص بنجاح");
    } catch (err) {
      alert("❌ فشل الحفظ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinMeeting = async () => {
    try {
      const res = await axios.post(`${API_BASE}/doctor-appointments/${id}/prepare-meetings`, {}, { headers });
      if (res.data.meetingUrl) window.open(res.data.meetingUrl, "_blank");
    } catch (err) {
      alert("❌ تعذر بدء الاجتماع");
    }
  };

  const handleNoShow = async () => {
    if (window.confirm("تسجيل غياب المريض؟")) {
      try {
        await axios.put(`${API_BASE}/Appointments/${id}/final-status`, {
          appointmentType: appointment?.appointmentType || "doctor",
          status: "NoShow"
        }, { headers });
        alert("✅ تم التسجيل");
      } catch (err) {
        alert("❌ فشل التحديث");
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-sans">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      <p className="font-black text-slate-400">جاري تحميل البيانات الشاملة...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-right" dir="rtl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* المحتوى الرئيسي (يمين) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* نموذج التشخيص والتحاليل */}
          <section className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
            <div className="bg-blue-600 px-8 py-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ClipboardList size={20} />
                <h2 className="font-black text-sm uppercase">تحديث الحالة الحالية</h2>
              </div>
            </div>
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block font-black text-slate-700 mb-3 text-xs uppercase">التشخيص (Diagnosis)</label>
                  <textarea 
                    className="w-full border-2 border-slate-100 rounded-2xl p-4 text-sm h-32 outline-none focus:border-blue-500/50 resize-none"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 mb-3 text-xs uppercase">الروشتة (Prescriptions)</label>
                  <textarea 
                    className="w-full border-2 border-slate-100 rounded-2xl p-4 text-sm h-32 outline-none focus:border-blue-500/50 resize-none"
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-[1.5rem] p-6">
                <label className="block font-black text-blue-900 text-xs uppercase mb-4">طلب تحاليل إضافية</label>
                <select 
                  multiple 
                  className="w-full border-2 border-white rounded-xl h-40 p-3 text-xs font-bold outline-none focus:ring-4 focus:ring-blue-100"
                  value={selectedTests}
                  onChange={(e) => setSelectedTests(Array.from(e.target.selectedOptions, o => o.value))}
                >
                  {availableTests.map(test => (
                    <option key={test.id} value={test.id} className="py-2 px-4 rounded-lg mb-1">{test.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  onClick={handleSaveDiagnosis}
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl flex items-center gap-3 text-xs font-black shadow-lg shadow-emerald-100 active:scale-95 disabled:opacity-50 transition-all"
                >
                  {submitting ? <Loader2 className="animate-spin" size={18}/> : <><Save size={18} /> حفظ وإرسال البيانات</>}
                </button>
              </div>
            </div>
          </section>

          {/* السجل الطبي ونتائج المعامل (كل البيانات موجودة) */}
          <section className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
             <div className="bg-slate-900 px-8 py-5 text-white flex items-center gap-3">
                <History size={20} />
                <h2 className="font-black text-sm uppercase">السجل التاريخي للمريض</h2>
             </div>
             <div className="p-8">
                <h4 className="flex items-center gap-2 font-black text-sm mb-6 text-slate-800"><Activity size={18} className="text-blue-600" /> التشخيصات السابقة</h4>
                <div className="space-y-4 mb-10">
                  {medicalRecord?.diagnoses?.map((diag, idx) => (
                    <div key={idx} className="bg-slate-50 border-r-4 border-blue-500 rounded-2xl p-5 hover:bg-slate-100 transition-colors">
                      <div className="flex justify-between mb-3">
                        <span className="font-black text-blue-700 text-sm">د. {diag.doctorName}</span>
                        <span className="text-[10px] font-bold text-slate-400">{diag.appointmentDate}</span>
                      </div>
                      <p className="text-xs font-black text-slate-700">التشخيص: {diag.diagnosis}</p>
                      <p className="text-[11px] text-slate-500 font-bold mt-1">الروشتة: {diag.prescription}</p>
                    </div>
                  ))}
                </div>

                <h4 className="flex items-center gap-2 font-black text-sm mb-6 text-slate-800"><FileText size={18} className="text-blue-600" /> نتائج التحاليل المخبرية</h4>
                <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                   <table className="w-full text-right text-xs">
                      <thead className="bg-slate-50 text-slate-400 font-black uppercase">
                         <tr>
                            <th className="p-4">التاريخ</th>
                            <th className="p-4">التحليل</th>
                            <th className="p-4">النتيجة</th>
                            <th className="p-4 text-center">التقرير</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-bold">
                         {medicalRecord?.labResults?.map((lab, i) => lab.results.map((res, j) => (
                           <tr key={`${i}-${j}`} className="hover:bg-blue-50/30 transition-colors">
                              <td className="p-4 text-slate-400">{lab.appointmentDate}</td>
                              <td className="p-4 text-slate-800">{res.testName}</td>
                              <td className="p-4 text-red-600 font-black">{res.value}</td>
                              <td className="p-4">
                                 <button onClick={() => window.open(res.resultFileUrl, "_blank")} className="flex items-center gap-2 mx-auto bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-blue-600 hover:border-blue-600 transition-all">
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

        {/* السايدبار الثابت (يسار) */}
        <div className="lg:col-span-4 sticky top-8 space-y-6">
          
          {/* كارت معلومات المريض */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl p-8">
            <div className="flex justify-between items-center mb-8">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><User size={14}/> Patient Info</span>
               <span className={`px-4 py-1.5 rounded-full text-[9px] font-black ${appointment?.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                 {appointment?.status?.toUpperCase()}
               </span>
            </div>

            <div className="space-y-6 mb-10">
               <div className="text-center pb-6 border-b border-slate-50">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-1">{appointment?.patientName}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{appointment?.appointmentType}</p>
               </div>
               <InfoItem label="التاريخ" value={appointment?.date} color="text-slate-800" />
               <InfoItem label="الوقت" value={`${appointment?.startTime} - ${appointment?.endTime}`} color="text-slate-800" />
               <InfoItem label="العنوان" value={appointment?.address || "في العيادة"} color="text-blue-600" />
            </div>

            <button 
              onClick={handleJoinMeeting}
              className="w-full py-5 rounded-[1.5rem] flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest bg-blue-600 text-white shadow-lg hover:bg-blue-700 active:scale-95 mb-4 transition-all"
            >
              <Video size={20} /> الانضمام للمقابلة
            </button>

            <button 
              onClick={handleNoShow}
              className="w-full border-2 border-red-50 text-red-500 py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase hover:bg-red-50 active:scale-95 transition-all"
            >
              <AlertCircle size={18} /> المريض لم يحضر
            </button>
          </div>

          {/* كارت الحالات المزمنة - تم تأكيد ثباته أسفل كارت المريض */}
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
             <h4 className="text-white text-[10px] font-black uppercase mb-6 text-center tracking-widest flex items-center justify-center gap-2 border-b border-slate-800 pb-4">
                <CheckCircle2 size={16} className="text-emerald-500" /> الأمراض المزمنة
             </h4>
             <div className="flex flex-wrap gap-2 justify-center">
                {medicalRecord?.medicalConditions && Object.entries(medicalRecord.medicalConditions).map(([key, value]) => (
                  value === true && (
                    <span key={key} className="bg-slate-800 text-blue-400 text-[10px] px-4 py-2 rounded-xl font-black border border-slate-700">
                      {key.replace('has', '')}
                    </span>
                  )
                ))}
                {!medicalRecord?.medicalConditions && <span className="text-slate-500 text-[10px] font-bold italic">لا توجد حالات مسجلة</span>}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, color }) {
  return (
    <div className="flex justify-between items-end border-b border-slate-50 pb-2">
      <span className="text-[10px] font-black text-slate-300 uppercase">{label}</span>
      <span className={`text-[11px] font-black ${color}`}>{value}</span>
    </div>
  );
}