import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import {
  Video, Home, Calendar, Clock, Loader2, Search, Trash2, Check, X,
  ChevronRight, Filter, Plus, CalendarDays
} from "lucide-react";

const API_BASE = "https://healthcare52.runasp.net/api";

export default function AppointmentManagement() {
  const navigate = useNavigate(); 
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [schedule, setSchedule] = useState({}); 
  const [loading, setLoading] = useState(true);
  
  // States للبحث والفلترة
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // State لإضافة رينج مواعيد (Bulk Generation)
  const [newSlot, setNewSlot] = useState({ 
    startDate: "", 
    endDate: "", 
    startTime: "", 
    endTime: "",
    consultationDurationInminutes: 20 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchSlots = async () => {
    try {
      const slotRes = await axios.get(`${API_BASE}/doctors/me/slots`, { headers });
      const grouped = (slotRes.data || []).reduce((acc, curr) => {
        if (!acc[curr.date]) acc[curr.date] = [];
        acc[curr.date].push(curr);
        return acc;
      }, {});
      setSchedule(grouped);
    } catch (err) { console.error("Error fetching slots:", err); }
  };

  useEffect(() => {
    const initFetch = async () => {
      try {
        setLoading(true);
        const apptRes = await axios.get(`${API_BASE}/doctor-appointments/me?pageNumber=1&pageSize=50`, { headers });
        setAppointments(apptRes.data.items || []);
        await fetchSlots();
      } catch (err) { console.error("Error init fetch:", err); } finally { setLoading(false); }
    };
    initFetch();
  }, []);

  // منطق الفلترة
  const filteredAppointments = appointments.filter(appt => {
    const nameMatch = appt.patientName?.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === "All" || appt.status === statusFilter;
    return nameMatch && statusMatch;
  });

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`${API_BASE}/doctor-appointments/${id}/status`, { status: newStatus }, { headers });
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (err) { alert("Failed to update status"); }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // تجهيز البيانات بالصيغة المطلوبة للـ API (Bulk JSON)
    const requestData = {
      ...newSlot,
      startTime: newSlot.startTime.length === 5 ? `${newSlot.startTime}:00` : newSlot.startTime,
      endTime: newSlot.endTime.length === 5 ? `${newSlot.endTime}:00` : newSlot.endTime,
      consultationDurationInminutes: parseInt(newSlot.consultationDurationInminutes)
    };

    try {
      await axios.post(`${API_BASE}/Schedules`, requestData, { headers });
      alert("Schedule generated successfully!");
      setNewSlot({ startDate: "", endDate: "", startTime: "", endTime: "", consultationDurationInminutes: 20 });
      await fetchSlots();
    } catch (err) { 
      alert(err.response?.data?.message || "Error generating schedule"); 
    } finally { setIsSubmitting(false); }
  };

  const handleDeleteSlot = async (id) => {
    if (!window.confirm("Delete this slot?")) return;
    try {
      await axios.delete(`${API_BASE}/Schedules/${id}`, { headers });
      await fetchSlots();
    } catch (err) { console.error("Delete error:", err); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#FDFDFF] py-10 px-4 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Header & Tabs */}
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-4xl font-[1000] tracking-tighter mb-6 uppercase italic">Flow<span className="text-blue-600">.</span></h1>
          
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 mb-8 shadow-inner">
            <button onClick={() => setActiveTab('appointments')} className={`px-8 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${activeTab === 'appointments' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>Appointments</button>
            <button onClick={() => setActiveTab('schedule')} className={`px-8 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${activeTab === 'schedule' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>My Schedule</button>
          </div>

          {activeTab === 'appointments' && (
            <div className="w-full flex flex-col md:flex-row gap-3 animate-in slide-in-from-top-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input type="text" placeholder="Search patient name..." className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-bold outline-none focus:ring-2 ring-blue-500/10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="relative min-w-[200px]">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <select className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-10 py-3 text-sm font-bold outline-none appearance-none cursor-pointer" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Completed">Completed</option>
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-300 pointer-events-none" size={16} />
              </div>
            </div>
          )}
        </div>

        {activeTab === 'appointments' ? (
          <div className="space-y-3 animate-in fade-in duration-500">
            {filteredAppointments.length > 0 ? filteredAppointments.map((appt) => (
              <div key={appt.id} className="bg-white border border-slate-100 rounded-[2rem] p-4 flex items-center gap-4 hover:shadow-md transition-all group border-l-4 border-l-transparent hover:border-l-blue-600">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${appt.appointmentType === "Online" ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'}`}>
                  {appt.appointmentType === "Online" ? <Video size={22} /> : <Home size={22} />}
                </div>

                <div className="flex-1">
                  <h3 className="text-[15px] font-black text-slate-900">{appt.patientName}</h3>
                  <div className="flex gap-4 text-slate-400 font-bold text-[10px] mt-1">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {appt.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {appt.startTime?.slice(0, 5)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {appt.status === 'Pending' ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleStatusUpdate(appt.id, 'Confirmed')} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><Check size={18} /></button>
                      <button onClick={() => handleStatusUpdate(appt.id, 'Cancelled')} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><X size={18} /></button>
                    </div>
                  ) : (
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${appt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>{appt.status}</span>
                  )}
                  
                  {appt.appointmentType === "Online" && appt.status === 'Confirmed' && (
                    <button className="bg-blue-600 text-white p-2.5 rounded-xl shadow-lg shadow-blue-100 hover:scale-110 transition-all animate-pulse">
                      <Video size={18} />
                    </button>
                  )}
                  <button onClick={() => navigate(`/doctor/appointment-details/${appt.id}`)} className="text-[10px] font-black uppercase text-slate-300 hover:text-blue-600 px-2 transition-colors">Details</button>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center opacity-30 font-black text-xs uppercase tracking-[0.2em]">No Data Found</div>
            )}
          </div>
        ) : (
          /* My Schedule Tab - Bulk Generation Form */
          <div className="animate-in zoom-in-95 duration-500">
            <form onSubmit={handleAddSlot} className="bg-white border border-blue-50 rounded-[2.5rem] p-6 mb-8 shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Start Date</label>
                  <input type="date" required className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold outline-none ring-1 ring-slate-100 focus:ring-blue-500/20" value={newSlot.startDate} onChange={e => setNewSlot({...newSlot, startDate: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-2">End Date</label>
                  <input type="date" required className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold outline-none ring-1 ring-slate-100 focus:ring-blue-500/20" value={newSlot.endDate} onChange={e => setNewSlot({...newSlot, endDate: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Start Time</label>
                  <input type="time" required className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold outline-none ring-1 ring-slate-100 focus:ring-blue-500/20" value={newSlot.startTime} onChange={e => setNewSlot({...newSlot, startTime: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-2">End Time</label>
                  <input type="time" required className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold outline-none ring-1 ring-slate-100 focus:ring-blue-500/20" value={newSlot.endTime} onChange={e => setNewSlot({...newSlot, endTime: e.target.value})} />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Dur (m)</label>
                    <input type="number" required className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold outline-none ring-1 ring-slate-100 focus:ring-blue-500/20" value={newSlot.consultationDurationInminutes} onChange={e => setNewSlot({...newSlot, consultationDurationInminutes: e.target.value})} />
                  </div>
                  <button disabled={isSubmitting} className="bg-blue-600 text-white px-6 h-[46px] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center mt-auto">
                    {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : 'Generate'}
                  </button>
                </div>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(schedule).map(([date, slots]) => (
                <div key={date} className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-xs font-black text-blue-600 mb-4 flex items-center gap-2 uppercase tracking-tighter"><CalendarDays size={14}/> {date}</h4>
                  <div className="space-y-2">
                    {slots.map(s => (
                      <div key={s.id} className="group flex justify-between items-center bg-slate-50 p-3 rounded-xl hover:bg-white border border-transparent hover:border-slate-100 transition-all">
                        <span className="text-[10px] font-bold text-slate-600">{s.startTime.slice(0,5)} - {s.endTime.slice(0,5)}</span>
                        <button onClick={() => handleDeleteSlot(s.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={14}/></button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}