import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // أضفنا هذا للتوجيه
import { 
  Calendar, Clock, User, MapPin, Video, Home, 
  ChevronRight, Plus, DollarSign, X, FileText, Trash2, CheckCircle2, Search
} from "lucide-react";

const initialSchedule = {
  "Monday 2/9/2026": ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00"],
  "Tuesday 2/10/2026": ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30"]
};

// بيانات المواعيد (تأكد أن الـ Status والـ Type مطابقة للفلاتر)
const initialAppointments = [
  { id: 1, name: "John Doe", status: "Confirmed", date: "Wed, Feb 4", time: "09:00", type: "In-Person", record: "..." },
  { id: 2, name: "Jane Smith", status: "Pending", date: "Wed, Feb 4", time: "09:30", type: "Online", record: "..." },
  { id: 3, name: "Soraia Mohamed", status: "Canceled", date: "Wed, Feb 4", time: "10:00", type: "Home Visit", record: "..." },
  { id: 4, name: "Ahmed Ibrahim", status: "Completed", date: "Wed, Feb 4", time: "11:00", type: "In-Person", record: "..." },
];

export default function AppointmentManagement() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("appointments");
  const [schedule, setSchedule] = useState(initialSchedule);
  const [prices, setPrices] = useState({ clinic: "100", online: "80", home: "150" });
  
  // --- States الجديدة للفلاتر والـ Pagination ---
  const [filters, setFilters] = useState({ name: "", status: "all", type: "all" });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 3; 

  // --- Logic الفلترة ---
  const filteredAppointments = initialAppointments.filter((appt) => {
    const matchName = appt.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchStatus = filters.status === "all" || appt.status === filters.status;
    const matchType = filters.type === "all" || 
                     (filters.type === "online" && appt.type === "Online") ||
                     (filters.type === "home" && appt.type === "Home Visit") ||
                     (filters.type === "location" && appt.type === "In-Person");
    return matchName && matchStatus && matchType;
  });

  // --- Logic الـ Pagination ---
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const currentRecords = filteredAppointments.slice(firstIndex, lastIndex);
  const nPages = Math.ceil(filteredAppointments.length / recordsPerPage);

  const deleteSlot = (day, time) => {
    setSchedule(prev => ({ ...prev, [day]: prev[day].filter(t => t !== time) }));
  };

  const addSlot = (day) => {
    const newTime = prompt("Enter new time (e.g., 16:00):");
    if (newTime) {
      setSchedule(prev => ({ ...prev, [day]: [...prev[day], newTime].sort() }));
    }
  };

  const deleteDay = (day) => {
    const updated = { ...schedule };
    delete updated[day];
    setSchedule(updated);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Tabs Switcher */}
        <div className="flex justify-center w-full mb-12"> 
          <div className="flex bg-white p-1.5 rounded-[2.5rem] shadow-sm border border-slate-100 w-full max-w-[500px]">
            <button onClick={() => setTab("appointments")} className={`flex-1 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${tab === "appointments" ? "bg-cyan-500 text-white shadow-lg shadow-cyan-100" : "text-slate-400 hover:text-slate-600"}`}>Appointments</button>
            <button onClick={() => setTab("schedule")} className={`flex-1 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${tab === "schedule" ? "bg-cyan-500 text-white shadow-lg shadow-cyan-100" : "text-slate-400 hover:text-slate-600"}`}>My Schedule</button>
          </div>
        </div>

        {tab === "appointments" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            
            {/* --- قسم الفلاتر الجديد --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input type="text" placeholder="Search by name..." className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-none text-xs font-bold outline-none focus:ring-2 focus:ring-cyan-100" onChange={(e) => {setFilters({...filters, name: e.target.value}); setCurrentPage(1);}} />
              </div>
              <select className="bg-slate-50 px-4 py-3 rounded-2xl border-none text-xs font-bold outline-none focus:ring-2 focus:ring-cyan-100 text-slate-500" onChange={(e) => {setFilters({...filters, status: e.target.value}); setCurrentPage(1);}}>
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Canceled">Canceled</option>
              </select>
              <select className="bg-slate-50 px-4 py-3 rounded-2xl border-none text-xs font-bold outline-none focus:ring-2 focus:ring-cyan-100 text-slate-500" onChange={(e) => {setFilters({...filters, type: e.target.value}); setCurrentPage(1);}}>
                <option value="all">All Types</option>
                <option value="online">Online</option>
                <option value="home">At Home</option>
                <option value="location">At Clinic</option>
              </select>
            </div>

            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-50">
              <div className="space-y-4">
                {currentRecords.map((appt) => (
                  <div key={appt.id} className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50/50 rounded-[2.5rem] border border-transparent hover:bg-white hover:border-cyan-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-cyan-500 shadow-sm group-hover:bg-cyan-500 group-hover:text-white transition-colors"><User size={24} /></div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-black text-slate-700">{appt.name}</h3>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${appt.status === 'Confirmed' ? 'text-green-500 bg-green-50' : appt.status === 'Canceled' ? 'text-red-500 bg-red-50' : 'text-blue-500 bg-blue-50'}`}>{appt.status}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-slate-400 font-bold text-[11px]">
                          <span className="flex items-center gap-1.5"><Calendar size={14}/> {appt.date}</span>
                          <span className="flex items-center gap-1.5"><Clock size={14}/> {appt.time}</span>
                          <span className="flex items-center gap-1.5">
                            {appt.type === 'Online' ? <Video size={14}/> : appt.type === 'Home Visit' ? <Home size={14}/> : <MapPin size={14}/>}
                            {appt.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* التعديل هنا للتحويل لصفحة المريض */}
                    <button onClick={() => navigate(`/doctor/patient-profile/${appt.id}`)} className="mt-4 md:mt-0 flex items-center gap-2 text-cyan-500 font-black text-[10px] uppercase tracking-widest hover:gap-4 transition-all">
                      View Medical Record <ChevronRight size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* --- أزرار Pagination --- */}
              {nPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-10">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 text-slate-400 hover:text-cyan-500 disabled:opacity-30"><ChevronRight className="rotate-180" /></button>
                  {[...Array(nPages)].map((_, i) => (
                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-full text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-100' : 'text-slate-400 hover:bg-slate-50'}`}>{i + 1}</button>
                  ))}
                  <button disabled={currentPage === nPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 text-slate-400 hover:text-cyan-500 disabled:opacity-30"><ChevronRight /></button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- Tab 2: My Schedule (بقي كما هو دون تغيير) --- */}
        {tab === "schedule" && (
          <div className="space-y-6 animate-in fade-in">
             <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-50">
               <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-8 flex items-center gap-2">
                 <DollarSign size={18} className="text-cyan-500" /> Pricing Settings
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {Object.keys(prices).map((key) => (
                   <div key={key} className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase ml-2">{key} Visit Price</label>
                     <div className="relative group">
                       <div className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500 font-bold">$</div>
                       <input type="number" value={prices[key]} onChange={(e) => setPrices({...prices, [key]: e.target.value})} className="w-full pl-10 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-50 focus:bg-white transition-all font-bold text-slate-700" />
                     </div>
                   </div>
                 ))}
               </div>
             </div>

             <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-50">
               <div className="flex justify-between items-center mb-10">
                 <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest">Weekly Availability</h2>
                 <button className="text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-400 px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors">Repeat Previous Week</button>
               </div>
               <div className="space-y-10">
                 {Object.keys(schedule).map((day) => (
                   <div key={day} className="relative pl-6 border-l-2 border-slate-100">
                     <div className="flex justify-between items-center mb-4">
                       <h3 className="text-sm font-black text-slate-700">{day}</h3>
                       <button onClick={() => deleteDay(day)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                     </div>
                     <div className="flex flex-wrap gap-3">
                       {schedule[day].map((time) => (
                         <div key={time} className="group flex items-center gap-2 bg-cyan-50 text-cyan-600 px-5 py-2.5 rounded-2xl font-bold text-xs border border-cyan-100 hover:bg-cyan-500 hover:text-white transition-all">
                           {time}
                           <button onClick={() => deleteSlot(day, time)}><X size={14} /></button>
                         </div>
                       ))}
                       <button onClick={() => addSlot(day)} className="flex items-center gap-2 bg-slate-50 text-slate-400 px-5 py-2.5 rounded-2xl font-bold text-xs border border-dashed border-slate-200 hover:border-cyan-500 hover:text-cyan-500 transition-all"><Plus size={14} /> Add Slot</button>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}