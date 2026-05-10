import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  UserCheck, UserX, Clock, Loader2, Calendar, 
  MapPin, Phone, MessageSquare, Home, Stethoscope, AlertCircle, CheckCircle2
} from "lucide-react";

const API_BASE_URL = "https://healthcare52.runasp.net";

export default function PendingRequests({ type }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const token = localStorage.getItem("token");
  const headers = { 
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const actionPath = type === 'Doctor' ? 'doctor-appointments' : (type === 'Lab' ? 'lab-appointments' : 'nurse-appointments');
      const res = await axios.get(`${API_BASE_URL}/api/${actionPath}/me?status=Pending`, { headers });
      setRequests(res.data.items || res.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, [type]);

  const handleAction = async (id, newStatus) => {
    setActionLoading(id);
    setStatusMsg({ type: '', text: '' });
    const actionPath = type === 'Doctor' ? 'doctor' : (type === 'Lab' ? 'lab' : 'nurse');
    
    try {
      // المحاولة الأولى: إرسال كـ Object (وهو المعيار الأحدث)
      await axios.patch(
        `${API_BASE_URL}/api/Appointments/${id}/confrimation`, 
        { appointmentType: type,
          status: newStatus }, 
        { headers }
      );
      
      finalizeSuccess(id, newStatus);
    } catch (err) {
      // المحاولة الثانية: في حال كان السيرفر يتوقع String صريح (Fallback)
      try {
        await axios.patch(
          `${API_BASE_URL}/api/Appointments/${id}/confrimation`, 
          `"${newStatus}"`, 
          { headers }
        );
        finalizeSuccess(id, newStatus);
      } catch (retryErr) {
        console.error("Critical Auth/Logic Error:", retryErr.response?.data);
        setStatusMsg({ 
          type: 'error', 
          text: `فشل الإجراء: السيرفر يرفض التعديل. تأكد من صلاحيات حساب الـ ${type}.` 
        });
      }
    } finally {
      setActionLoading(null);
    }
  };

  const finalizeSuccess = (id, status) => {
    setRequests(prev => prev.filter(req => req.id !== id));
    setStatusMsg({ 
      type: 'success', 
      text: status === 'Confirmed' ? 'تم قبول الطلب بنجاح' : 'تم رفض الطلب' 
    });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 animate-pulse">
      <div className="w-12 h-12 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">جاري معالجة البيانات</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6" dir="rtl">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">
            {type} <span className="text-blue-600">Requests.</span>
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mr-1">إدارة الطلبات المعلقة بدقة واحترافية</p>
        </div>
        
        {/* Status Notification Mini-Card */}
        {statusMsg.text && (
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl border animate-in slide-in-from-top duration-500 ${
            statusMsg.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
            <span className="text-xs font-black">{statusMsg.text}</span>
          </div>
        )}
      </div>

      {/* Grid of Requests */}
      <div className="space-y-8">
        {requests.length > 0 ? requests.map((req) => (
          <div key={req.id} className="group bg-white border border-slate-100 rounded-[3rem] p-3 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500">
            <div className="flex flex-col lg:flex-row items-stretch">
              
              {/* Profile Section */}
              <div className="lg:w-72 bg-slate-50/50 rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative shadow-inner border border-slate-100/50">
                <span className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${
                   req.appointmentType === 'HomeVisit' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {req.appointmentType === 'HomeVisit' ? <Home size={12}/> : <Stethoscope size={12}/>}
                  {req.appointmentType}
                </span>
                
                <div className="w-20 h-20 bg-white rounded-3xl shadow-lg border border-slate-100 flex items-center justify-center text-3xl font-black text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  {req.patientName?.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-black text-slate-800 tracking-tighter">{req.patientName}</h3>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">{req.gender || 'Patient'}</p>
              </div>

              {/* Data Section */}
              <div className="flex-1 p-8 lg:px-12 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <DetailBox icon={<Calendar size={18}/>} label="تاريخ الحجز" value={req.date} />
                  <DetailBox icon={<Clock size={18}/>} label="الوقت المتوقع" value={`${req.startTime?.slice(0,5)} - ${req.endTime?.slice(0,5)}`} />
                  <DetailBox icon={<Phone size={18}/>} label="رقم الجوال" value={req.patientPhoneNumber} isSpecial />
                </div>

                <div className="space-y-4">
                  {req.address && (
                    <div className="flex items-center gap-4 bg-blue-50/20 p-4 rounded-2xl border border-blue-50/50">
                      <MapPin className="text-blue-600" size={18} />
                      <p className="text-sm font-bold text-slate-600">{req.address}</p>
                    </div>
                  )}
                  {req.notes && (
                    <div className="flex items-start gap-3 px-2">
                      <MessageSquare className="text-slate-200 mt-1" size={16} />
                      <p className="text-xs font-bold text-slate-400 italic leading-relaxed">"{req.notes}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Section */}
              <div className="p-6 lg:p-8 flex lg:flex-col justify-center gap-4 border-t lg:border-t-0 lg:border-r border-slate-50">
                <button 
                  onClick={() => handleAction(req.id, "Confirmed")}
                  disabled={actionLoading === req.id}
                  className="flex-1 lg:w-44 bg-blue-600 text-white h-16 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading === req.id ? <Loader2 className="animate-spin" size={18}/> : <><UserCheck size={20}/> Accept</>}
                </button>
                <button 
                  onClick={() => handleAction(req.id, "Cancelled")}
                  disabled={actionLoading === req.id}
                  className="flex-1 lg:w-44 bg-white border-2 border-slate-100 text-red-500 h-16 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-red-50 hover:border-red-100 hover:text-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading === req.id ? <Loader2 className="animate-spin" size={18}/> : <><UserX size={20}/> Reject</>}
                </button>
              </div>

            </div>
          </div>
        )) : (
          <div className="py-32 text-center bg-slate-50/50 rounded-[4rem] border-2 border-dashed border-white shadow-inner">
            <Clock className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-300 font-black text-[10px] uppercase tracking-[0.4em]">لا توجد طلبات جديدة حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailBox({ icon, label, value, isSpecial }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-blue-600/30">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className={`text-sm font-black ${isSpecial ? 'text-blue-600 underline decoration-blue-100 underline-offset-8' : 'text-slate-800'}`}>
        {value || '---'}
      </p>
    </div>
  );
}