import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Phone, Mail, Calendar, 
  FileText, Activity, Download, Edit3, Plus, Save, X
} from "lucide-react";

export default function PatientProfile() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  // 1. الحالة الخاصة بالبيانات (عشان تقدر تعدلها)
  const [isEditing, setIsEditing] = useState(false);
  const [patientData, setPatientData] = useState({
    id: id,
    name: "Soraia Mohamed",
    age: "28",
    gender: "Female",
    bloodType: "O+",
    phone: "+20 123 456 789",
    email: "soraia@example.com",
    diagnosis: "Chronic Hypertension",
    notes: "Patient shows consistent improvement in blood pressure levels.",
    history: [
      { date: "2026-02-04", condition: "Regular Checkup", result: "Stable" },
      { date: "2026-01-10", condition: "High BP Crisis", result: "Medicated" }
    ]
  });

  // 2. وظيفة حفظ التعديلات
  const handleSave = () => {
    setIsEditing(false);
    alert("Patient record updated successfully!");
    // هنا المفروض تبعت الـ state الجديد للـ API (Axios.put)
  };

  // 3. وظيفة إضافة سجل طبي جديد (Prompt سريع)
  const addHistoryRecord = () => {
    const condition = prompt("Enter condition:");
    if (condition) {
      const newRecord = {
        date: new Date().toLocaleDateString(),
        condition: condition,
        result: "Pending"
      };
      setPatientData({ ...patientData, history: [newRecord, ...patientData.history] });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header مع أزرار التحكم */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 hover:text-cyan-500 font-black text-[10px] uppercase tracking-widest transition-all"
        >
          <ArrowLeft size={18} /> Back to Appointments
        </button>
        
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                <X size={16} /> Cancel
              </button>
              <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-100 hover:bg-green-600 transition-all">
                <Save size={16} /> Save Changes
              </button>
            </>
          ) : (
            <>
              <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
                <Download size={16} /> Export PDF
              </button>
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-cyan-100 hover:bg-cyan-600 transition-all">
                <Edit3 size={16} /> Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* العمود الأيسر: البيانات الشخصية */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm space-y-8 h-fit">
          <div className="text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 border border-slate-100 text-cyan-500 shadow-inner">
              <User size={40} />
            </div>
            {isEditing ? (
              <input 
                className="w-full text-center text-xl font-black bg-slate-50 rounded-xl p-2 outline-none border border-cyan-100"
                value={patientData.name}
                onChange={(e) => setPatientData({...patientData, name: e.target.value})}
              />
            ) : (
              <h2 className="text-2xl font-black text-slate-800">{patientData.name}</h2>
            )}
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Patient ID: #{id}</p>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-50">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-300 uppercase">Blood Type</span>
              <span className="text-xs font-black text-red-500 bg-red-50 px-3 py-1 rounded-lg">{patientData.bloodType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-300 uppercase">Gender</span>
              <span className="text-xs font-black text-slate-600">{patientData.gender}</span>
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <label className="text-[9px] font-black text-slate-300 uppercase block ml-2">Contact Details</label>
            <div className="flex items-center gap-3 text-slate-600 p-3 bg-slate-50 rounded-2xl">
              <Phone size={14} className="text-cyan-500" />
              <input 
                disabled={!isEditing}
                className="bg-transparent text-xs font-bold outline-none w-full disabled:text-slate-500"
                value={patientData.phone}
                onChange={(e) => setPatientData({...patientData, phone: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-3 text-slate-600 p-3 bg-slate-50 rounded-2xl">
              <Mail size={14} className="text-cyan-500" />
              <input 
                disabled={!isEditing}
                className="bg-transparent text-xs font-bold outline-none w-full disabled:text-slate-500"
                value={patientData.email}
                onChange={(e) => setPatientData({...patientData, email: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* العمود الأيمن: الحالة الطبية والسجل */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* التشخيص والملاحظات */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Activity size={16} className="text-cyan-500" /> Medical Diagnosis
            </h3>
            <div className="space-y-4">
              <input 
                disabled={!isEditing}
                className="w-full p-4 bg-cyan-50/30 text-cyan-700 font-black rounded-2xl border border-cyan-50 outline-none focus:ring-2 focus:ring-cyan-200"
                value={patientData.diagnosis}
                onChange={(e) => setPatientData({...patientData, diagnosis: e.target.value})}
              />
              <textarea 
                disabled={!isEditing}
                rows="4"
                className="w-full p-6 bg-slate-50 text-slate-600 text-sm font-medium rounded-[2rem] border border-slate-100 outline-none focus:ring-2 focus:ring-cyan-100 resize-none"
                value={patientData.notes}
                onChange={(e) => setPatientData({...patientData, notes: e.target.value})}
              />
            </div>
          </div>

          {/* سجل التاريخ الطبي */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={16} className="text-cyan-500" /> Medical History
              </h3>
              <button 
                onClick={addHistoryRecord}
                className="p-2 bg-cyan-50 text-cyan-500 rounded-xl hover:bg-cyan-500 hover:text-white transition-all"
              >
                <Plus size={18} />
              </button>
            </div>
            
            <div className="space-y-4">
              {patientData.history.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-5 bg-slate-50/50 rounded-3xl border border-transparent hover:border-slate-100 hover:bg-white transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-300 group-hover:text-cyan-500 shadow-sm transition-colors">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-700">{item.condition}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.date}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-cyan-600 uppercase bg-cyan-50 px-4 py-2 rounded-xl border border-cyan-100">
                    {item.result}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}