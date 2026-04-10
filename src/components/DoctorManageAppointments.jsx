import React, { useState, useEffect } from 'react';
import { 
  Clock, DollarSign, Home, Globe, Building, 
  CheckCircle, Calendar, Plus, Trash2, X, User 
} from "lucide-react";
import api from '../api/axios';

export default function DoctorManageAppointments() {
  const [settings, setSettings] = useState({
    price: 0,
    isHomeVisitAvailable: false,
    isOnlineAvailable: false,
    isClinicAvailable: true,
  });

  const [newSlot, setNewSlot] = useState({ date: '', startTime: '', endTime: '' });
  const [mySlots, setMySlots] = useState([]); 
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const settingsRes = await api.get('/api/Doctors/profile');
      const slotsRes = await api.get('/api/Doctors/me/schedule'); 
      const appointmentsRes = await api.get('/api/doctor-appointments/me');

      setMySlots(slotsRes.data || []);
      setUpcomingAppointments(appointmentsRes.data || []);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const handleAddSlot = async () => {
    try {
      await api.post('/api/doctors/me/slots', newSlot);
      alert("Slot added successfully! ✅");
      fetchData();
    } catch (err) {
      alert("Failed to add slot");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10" dir="ltr">
      <div className="max-w-[1600px] mx-auto space-y-10">
        
        {/* 1. Consultation Settings Section */}
        <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50">
          <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <div className="p-2 bg-cyan-50 text-cyan-500 rounded-xl"><DollarSign size={20}/></div>
            Consultation Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (EGP)</label>
              <input 
                type="number" 
                value={settings.price} 
                onChange={(e) => setSettings({...settings, price: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-black text-slate-700 outline-none focus:ring-4 focus:ring-cyan-50 transition-all"
                placeholder="0.00"
              />
            </div>
            <ToggleOption icon={<Globe size={20}/>} label="Online" active={settings.isOnlineAvailable} onClick={() => setSettings({...settings, isOnlineAvailable: !settings.isOnlineAvailable})} />
            <ToggleOption icon={<Home size={20}/>} label="Home Visit" active={settings.isHomeVisitAvailable} onClick={() => setSettings({...settings, isHomeVisitAvailable: !settings.isHomeVisitAvailable})} />
            <ToggleOption icon={<Building size={20}/>} label="Clinic" active={settings.isClinicAvailable} onClick={() => setSettings({...settings, isClinicAvailable: !settings.isClinicAvailable})} />
          </div>
        </section>

        {/* 2. Main Grid Layout - مقسومة نصين */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
          
          {/* النص اليسار: إدارة المواعيد المتاحة (Schedule / Slots) */}
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm">
              <h2 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-500 rounded-xl"><Clock size={20}/></div>
                Create Work Slots
              </h2>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Date</label>
                  <input type="date" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-600 outline-none focus:ring-4 focus:ring-blue-50" onChange={(e)=>setNewSlot({...newSlot, date: e.target.value})}/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">From</label>
                    <input type="time" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-600" onChange={(e)=>setNewSlot({...newSlot, startTime: e.target.value})}/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">To</label>
                    <input type="time" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-600" onChange={(e)=>setNewSlot({...newSlot, endTime: e.target.value})}/>
                  </div>
                </div>
                <button onClick={handleAddSlot} className="w-full py-4 bg-cyan-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-cyan-600 transition-all shadow-lg shadow-cyan-100 mt-4">
                  <Plus size={18} strokeWidth={3}/> Add Time Slot
                </button>
              </div>
            </div>

            {/* عرض الـ Slots الحالية اللي الدكتور ضافها */}
            <div className="space-y-4">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Current Available Slots</h3>
               <div className="grid grid-cols-1 gap-4">
                  {mySlots.map((slot, i) => (
                    <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-50 flex justify-between items-center group hover:border-cyan-200 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-cyan-50 text-cyan-500 rounded-xl flex items-center justify-center font-bold text-xs">
                          {i+1}
                        </div>
                        <div>
                          <p className="font-black text-slate-700 text-sm">{slot.date}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{slot.startTime} - {slot.endTime}</p>
                        </div>
                      </div>
                      <button className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* النص اليمين: الحجوزات القادمة (Upcoming Appointments) */}
          <div className="xl:col-span-3">
            <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-50 min-h-[600px]">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-500 rounded-xl"><Calendar size={20}/></div>
                  Upcoming Appointments
                </h2>
                <div className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Total: {upcomingAppointments.length}
                </div>
              </div>

              <div className="space-y-4">
                {upcomingAppointments.map((app) => (
                  <div key={app.id} className="p-6 bg-white border border-slate-100 rounded-[2.5rem] hover:shadow-xl hover:shadow-cyan-100/20 transition-all duration-500 flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500">
                        <User size={24} />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-lg tracking-tight">{app.patientName}</h4>
                        <div className="flex gap-4 mt-1">
                          <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-1">
                            <Clock size={12}/> {app.time}
                          </span>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-l pl-4 border-slate-100">
                            {app.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <button className="bg-slate-50 text-slate-400 p-4 rounded-2xl hover:bg-green-50 hover:text-green-500 transition-all shadow-sm">
                         <CheckCircle size={20}/>
                       </button>
                       <button className="bg-slate-50 text-slate-400 p-4 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
                         <X size={20}/>
                       </button>
                    </div>
                  </div>
                ))}

                {upcomingAppointments.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20">
                    <Calendar size={80} strokeWidth={1}/>
                    <p className="mt-4 font-black uppercase tracking-widest text-sm">No Appointments Scheduled</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ToggleOption({ icon, label, active, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex flex-col items-center gap-3 ${
        active 
          ? 'bg-cyan-500 text-white border-cyan-500 shadow-xl shadow-cyan-100' 
          : 'bg-white text-slate-300 border-slate-50 hover:border-cyan-100 hover:text-cyan-500'
      }`}
    >
      <div className={`transition-transform duration-500 ${active ? 'scale-110' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.1em]">{label}</span>
    </div>
  );
}