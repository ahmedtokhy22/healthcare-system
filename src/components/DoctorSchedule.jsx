import React, { useState, useEffect } from 'react';
import { Calendar, X, Plus, Loader2, Clock } from "lucide-react";
import axios from 'axios'; // استخدم axios أو الـ instance الخاص بك

export default function DoctorSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}` };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      // ✅ التعديل: المسار الصحيح من الصورة الأولى هو /api/Doctors/me/schedule
      const res = await axios.get('/api/Doctors/me/schedule', { headers });
      setSchedule(res.data);
    } catch (err) { 
      console.error("Error fetching schedule:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  const removeSlot = async (slotId) => {
    if (!window.confirm("Delete this time slot?")) return;
    try {
      // ✅ التعديل: المسار الصحيح من الصورة الأولى هو DELETE /api/Doctors/me/slots/{id}
      await axios.delete(`/api/Doctors/me/slots/${slotId}`, { headers });
      // تحديث الواجهة محلياً أو إعادة الجلب
      fetchSchedule();
    } catch (err) { 
      alert("Failed to remove slot"); 
    }
  };

  const addSlot = async (day) => {
    const time = prompt(`Enter start time for ${day} (e.g., 14:00):`);
    if (!time) return;

    try {
      // ✅ التعديل: المسار الصحيح من الصورة الأولى هو POST /api/Doctors/me/slots
      // يتوقع الباك إند غالباً جسم الطلب يحتوي على اليوم والوقت
      await axios.post('/api/Doctors/me/slots', { 
        dayOfWeek: day, 
        startTime: time 
      }, { headers });
      fetchSchedule();
    } catch (err) {
      alert("Failed to add slot. Make sure format is HH:mm");
    }
  };

  return (
    <div className="p-10 bg-[#f8fafc] min-h-screen text-left font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Availability Schedule</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Set your weekly working hours</p>
          </div>
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <Calendar className="text-cyan-500" size={24} />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-cyan-500" size={40} /></div>
        ) : (
          <div className="space-y-6">
            {schedule.length === 0 && (
               <div className="bg-white p-10 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold">No slots defined. Click '+' to start adding slots.</p>
               </div>
            )}

            {schedule.map((dayData, dIdx) => (
              <div key={dIdx} className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span className="font-black uppercase text-xs tracking-[0.2em] text-slate-500">
                      {dayData.dayOfWeek || dayData.dayName}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {dayData.slots?.map((slot) => (
                    <div key={slot.id} className="bg-slate-50 text-slate-700 px-5 py-3 rounded-[1.2rem] text-xs font-black flex items-center gap-4 border border-slate-100 group/slot hover:border-cyan-200 hover:bg-cyan-50 transition-all">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-cyan-500" />
                        {slot.startTime}
                      </div>
                      <button 
                        onClick={() => removeSlot(slot.id)} 
                        className="text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => addSlot(dayData.dayOfWeek || dayData.dayName)}
                    className="p-3 bg-white border-2 border-dashed border-slate-100 rounded-[1.2rem] text-slate-300 hover:text-cyan-500 hover:border-cyan-500 hover:bg-cyan-50/30 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}