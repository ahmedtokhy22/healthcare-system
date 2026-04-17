import React, { useState } from "react";
import { 
  Calendar, Clock, MapPin, X, AlertCircle, Plus, 
  DollarSign, CheckCircle2, Save, Filter, Zap, Timer, Trash2
} from "lucide-react";

// بيانات تجريبية مطورة لتناسب التمريض
const initialRequests = [
  { 
    id: 1, 
    name: "Ahmed Ibrahim", 
    date: "Feb 18, 2026", 
    time: "10:00 AM", 
    type: "Home Visit", 
    serviceType: "Quick", 
    duration: "20 Mins", 
    address: "Qanater Khairyah, Qalyubia", 
    note: "Intramuscular Injection",
    price: 150
  },
  { 
    id: 2, 
    name: "Sara Mohamed", 
    date: "Feb 20, 2026", 
    time: "02:00 PM", 
    type: "Home Visit", 
    serviceType: "Hourly", 
    duration: "6 Hours", 
    address: "El Shorouk Academy Area", 
    note: "Post-surgery care and monitoring",
    price: 800
  }
];

const initialSchedule = {
  "Monday 2/16/2026": ["09:00 (30min)", "11:00 (30min)"],
  "Tuesday 2/17/2026": ["14:00 (30min)"]
};

export default function NurseManageAppointments() {
  const [tab, setTab] = useState("requests");
  const [requests, setRequests] = useState(initialRequests);
  const [appointments, setAppointments] = useState([]);
  const [schedule, setSchedule] = useState(initialSchedule);
  const [filterType, setFilterType] = useState("all"); // 'all', 'Quick', 'Hourly'
  
  // States للتحكم في الإضافة والسعر
  const [price, setPrice] = useState(200);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({ day: "", time: "" });

  // --- منطق الفلترة ---
  const filteredRequests = requests.filter(req => {
    if (filterType === "all") return true;
    return req.serviceType === filterType;
  });

  // --- الدوال الأساسية ---
  const acceptRequest = (id) => {
    const req = requests.find(r => r.id === id);
    setRequests(prev => prev.filter(r => r.id !== id));
    setAppointments(prev => [...prev, { ...req, status: "confirmed" }]);
  };

  const rejectRequest = (id) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const deleteSlot = (day, time) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].filter(t => t !== time)
    }));
  };

  const handleAddSlot = (e) => {
    e.preventDefault();
    if (!newSlot.day || !newSlot.time) return;
    setSchedule(prev => ({
      ...prev,
      [newSlot.day]: [...(prev[newSlot.day] || []), `${newSlot.time} (30min)`].sort()
    }));
    setIsModalOpen(false);
    setNewSlot({ day: "", time: "" });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-slate-50/30 min-h-screen text-left">
      
      {/* Modal إضافة موعد جديد */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-800">New Work Slot</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
            </div>
            <form onSubmit={handleAddSlot} className="space-y-6">
              <input 
                placeholder="Day (e.g. Sunday 2/22)" 
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                value={newSlot.day}
                onChange={e => setNewSlot({...newSlot, day: e.target.value})}
              />
              <input 
                type="time" 
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold"
                value={newSlot.time}
                onChange={e => setNewSlot({...newSlot, time: e.target.value})}
              />
              <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all">Save Slot</button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-800">Nurse Station</h1>
        <p className="text-slate-400 font-bold text-sm">Manage your quick tasks and hourly shifts</p>
      </header>

      {/* Tabs التبديل */}
      <div className="flex justify-center mb-12">
        <div className="flex w-full max-w-[600px] bg-white p-1.5 rounded-[2rem] border border-slate-200 shadow-sm">
          {["requests", "appointments", "schedule"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                tab === t ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {t === "schedule" ? "Pricing & Slots" : t}
            </button>
          ))}
        </div>
      </div>

      <main>
        {/* قسم الطلبات (مع الفلتر الجديد) */}
        {tab === "requests" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <Filter size={14} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase text-slate-400">Sort Services:</span>
              </div>
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'All', icon: null },
                  { id: 'Quick', label: 'Quick Tasks', icon: <Zap size={12}/> },
                  { id: 'Hourly', label: 'Hourly Shifts', icon: <Timer size={12}/> }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilterType(f.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      filterType === f.id ? "bg-blue-600 text-white shadow-blue-100 shadow-lg" : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    {f.icon} {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* القائمة */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRequests.map(req => (
                <div key={req.id} className="bg-white border border-slate-50 rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${req.serviceType === 'Quick' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-black text-slate-800 text-xl">{req.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`flex items-center gap-1 text-[9px] font-black px-3 py-1 rounded-full uppercase ${req.serviceType === 'Quick' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                          {req.serviceType === 'Quick' ? <Zap size={10}/> : <Timer size={10}/>}
                          {req.serviceType === 'Quick' ? 'Quick Task' : 'Hourly Shift'}
                        </span>
                        <span className="text-[9px] font-black text-slate-300 uppercase">{req.duration}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Fee</p>
                      <p className="text-lg font-black text-blue-600">{req.price} EGP</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                      <Calendar size={14} className="text-blue-500" /> {req.date} at {req.time}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                      <MapPin size={14} className="text-blue-500" /> {req.address}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => acceptRequest(req.id)} className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100">
                      <CheckCircle2 size={16} /> Accept Request
                    </button>
                    <button onClick={() => rejectRequest(req.id)} className="flex-1 bg-slate-50 text-slate-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all border border-slate-100">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* قسم المواعيد المؤكدة */}
        {tab === "appointments" && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {appointments.length > 0 ? appointments.map(apt => (
              <div key={apt.id} className="bg-white border border-slate-100 rounded-3xl p-6 flex justify-between items-center shadow-sm hover:border-blue-200 transition-all">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black ${apt.serviceType === 'Quick' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'}`}>
                    {apt.name[0]}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800">{apt.name}</h3>
                    <p className="text-xs font-bold text-slate-400 lowercase">{apt.date} • {apt.time} • {apt.serviceType}</p>
                  </div>
                </div>
                <button className="px-6 py-2.5 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-blue-600 transition-all">View Profile</button>
              </div>
            )) : (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                <p className="text-slate-400 font-black uppercase text-xs tracking-[0.2em]">No confirmed appointments yet</p>
              </div>
            )}
          </div>
        )}

        {/* قسم الجدول والأسعار */}
        {tab === "schedule" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            {/* إعدادات السعر */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm h-fit">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Service Pricing</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">Base Visit Fee (EGP)</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
                    <input 
                      type="number" value={price} onChange={e => setPrice(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>
                <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 flex items-center justify-center gap-2">
                  <Save size={16} /> Update Rates
                </button>
              </div>
            </div>

            {/* المواعيد المتاحة */}
            <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weekly Availability</h2>
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-50">
                  <Plus size={16} /> Add New Slot
                </button>
              </div>

              <div className="space-y-8">
                {Object.keys(schedule).map(day => (
                  <div key={day} className="border-b border-slate-50 pb-8 last:border-0">
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="font-black text-slate-800 text-sm tracking-tight">{day}</h3>
                      <button className="text-[9px] font-black text-red-300 hover:text-red-500 uppercase tracking-widest">Clear Day</button>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      {schedule[day].map(time => (
                        <div key={time} className="group flex items-center gap-3 bg-slate-50 text-slate-600 px-5 py-2.5 rounded-2xl border border-slate-100 hover:bg-white hover:border-blue-200 transition-all">
                          <span className="text-[11px] font-black">{time}</span>
                          <button onClick={() => deleteSlot(day, time)} className="text-slate-300 group-hover:text-red-500 transition-colors">
                            <Trash2 size={14}/>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}