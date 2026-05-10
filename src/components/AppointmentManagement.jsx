import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Video, Home, Calendar, Clock, Loader2, Search,
  Trash2, ChevronDown, Stethoscope, Plus, Info, X, Filter
} from "lucide-react";

const API_BASE = "https://healthcare52.runasp.net/api";

export default function AppointmentManagement() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [activeTab, setActiveTab] = useState("appointments");
  const [statusFilter, setStatusFilter] = useState("All"); 
  const [appointments, setAppointments] = useState([]);
  const [schedule, setSchedule] = useState({
    clinicFee: 0, homeVisitFee: 0, onlineFee: 0, slots: []
  });

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newSlot, setNewSlot] = useState({
    startDate: "", endDate: "", startTime: "", endTime: "", consultationDurationInminutes: 20
  });

  // =========================
  // FETCH DATA
  // =========================
  const fetchAppointments = async (page, isLoadMore = false) => {
    try {
      isLoadMore ? setLoadingMore(true) : setLoading(true);
      const res = await axios.get(`${API_BASE}/doctor-appointments/me?pageNumber=${page}&pageSize=6`, { headers });
      const newItems = res.data.items || [];
      setAppointments(prev => isLoadMore ? [...prev, ...newItems] : newItems);
      setHasMore(newItems.length === 6);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); setLoadingMore(false); }
  };

  const fetchSchedule = async () => {
    try {
      const res = await axios.get(`${API_BASE}/Doctors/me/schedule`, { headers });
      setSchedule(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchAppointments(1);
    fetchSchedule();
  }, []);

  const handleLoadMore = () => {
    const nextPage = pageNumber + 1;
    setPageNumber(nextPage);
    fetchAppointments(nextPage, true);
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const requestData = {
        ...newSlot,
        endDate: newSlot.endDate || newSlot.startDate,
        startTime: `${newSlot.startTime}:00`,
        endTime: `${newSlot.endTime}:00`,
        consultationDurationInminutes: Number(newSlot.consultationDurationInminutes)
      };
      await axios.post(`${API_BASE}/doctors/me/slots`, requestData, { headers });
      alert("Generated Successfully");
      setNewSlot({ startDate: "", endDate: "", startTime: "", endTime: "", consultationDurationInminutes: 20 });
      fetchSchedule();
    } catch (err) { alert(err.response?.data?.message || "Failed"); } 
    finally { setIsSubmitting(false); }
  };

  const handleDeleteSlot = async (id) => {
    if(!window.confirm("حذف هذا الموعد؟")) return;
    try {
      await axios.delete(`${API_BASE}/doctors/me/slots/${id}`, { headers });
      fetchSchedule();
    } catch (err) { alert("Failed to delete slot"); }
  };

  const handleDeleteDay = async (slots) => {
    if(!window.confirm("حذف جميع مواعيد هذا اليوم؟")) return;
    try {
      await Promise.all(slots.map(s => axios.delete(`${API_BASE}/doctors/me/slots/${s.id}`, { headers })));
      fetchSchedule();
    } catch (err) { alert("Failed to delete day"); }
  };

  const groupedSlots = schedule.slots?.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 px-4 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        {/* TOP BAR / LOGO */}
        <div className="py-8 flex justify-between items-center">
          <h1 className="text-2xl font-black text-blue-600 tracking-tighter italic">Flow.</h1>
          <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            <button onClick={() => setActiveTab("appointments")} className={`px-10 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "appointments" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"}`}>
              Appointments
            </button>
            <button onClick={() => setActiveTab("schedule")} className={`px-10 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "schedule" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"}`}>
              My Schedule
            </button>
          </div>
        </div>

        {activeTab === "appointments" ? (
          <div className="space-y-6">
            {/* SEARCH & LIST BOX FILTER SECTION */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="relative group flex-1 w-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search patients name..."
                  className="w-full bg-white border border-slate-200 rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-medium outline-none focus:ring-4 ring-blue-500/5 focus:border-blue-200 transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status List Box (Dropdown) */}
              <div className="relative w-full md:w-64">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Filter size={18} />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-12 pr-10 text-sm font-bold text-slate-700 outline-none appearance-none focus:ring-4 ring-blue-500/5 transition-all shadow-sm cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Complete">Complete</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              </div>
            </div>

            {loading && pageNumber === 1 ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
            ) : (
              <div className="grid gap-4">
                {appointments
                  .filter(appt => {
                    const matchesSearch = appt.patientName?.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesStatus = statusFilter === "All" || appt.status === statusFilter;
                    return matchesSearch && matchesStatus;
                  })
                  .map((appt) => (
                    <div key={appt.id} className="bg-white border border-slate-100 rounded-3xl p-5 flex items-center gap-6 shadow-sm hover:shadow-md transition-all group">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${appt.appointmentType === "Online" ? "bg-blue-50 text-blue-600" : "bg-indigo-50 text-indigo-600"}`}>
                        {appt.appointmentType === "Online" ? <Video size={28} /> : <Home size={28} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-slate-800">{appt.patientName}</h3>
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${
                            appt.status === "Confirmed" ? "bg-blue-50 text-blue-600" :
                            appt.status === "Complete" ? "bg-green-50 text-green-600" :
                            appt.status === "Cancelled" ? "bg-slate-100 text-slate-500" :
                            appt.status === "Rejected" ? "bg-red-50 text-red-600" :
                            "bg-amber-50 text-amber-600"
                          }`}>
                            {appt.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-slate-400 font-semibold text-[11px] uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-500"/> {appt.date}</span>
                          <span className="flex items-center gap-1.5"><Clock size={14} className="text-blue-500"/> {appt.startTime?.slice(0, 5)}</span>
                        </div>
                      </div>
                      <button onClick={() => navigate(`/doctor/appointment-details/${appt.id}`)} className="bg-slate-50 text-slate-900 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-slate-100">
                        View details
                      </button>
                    </div>
                  ))}
                
                {/* EMPTY STATE MESSAGE */}
                {appointments.filter(appt => {
                  const matchesSearch = appt.patientName?.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesStatus = statusFilter === "All" || appt.status === statusFilter;
                  return matchesSearch && matchesStatus;
                }).length === 0 && (
                  <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                    <Info className="mx-auto text-slate-200 mb-2" size={40} />
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No {statusFilter !== "All" ? statusFilter : ""} results found</p>
                  </div>
                )}

                {hasMore && (
                  <button onClick={handleLoadMore} disabled={loadingMore} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold text-sm hover:bg-white hover:border-blue-300 hover:text-blue-500 transition-all flex items-center justify-center gap-2">
                    {loadingMore ? <Loader2 className="animate-spin" size={18} /> : <ChevronDown size={18} />}
                    Load more appointments
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-10 animate-in fade-in duration-500">
            {/* FEES OVERVIEW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeeCard icon={<Stethoscope size={20}/>} label="Clinic" price={schedule.clinicFee} color="blue" />
              <FeeCard icon={<Home size={20}/>} label="Home" price={schedule.homeVisitFee} color="indigo" />
              <FeeCard icon={<Video size={20}/>} label="Online" price={schedule.onlineFee} color="purple" />
            </div>

            {/* GENERATE BOX */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <Plus size={20} />
                </div>
                <h2 className="text-lg font-black tracking-tight">Generate New Slots</h2>
              </div>
              <form onSubmit={handleAddSlot} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <InputGroup label="Start Date" type="date" value={newSlot.startDate} onChange={(val) => setNewSlot({...newSlot, startDate: val})} />
                <InputGroup label="End Date" type="date" value={newSlot.endDate} onChange={(val) => setNewSlot({...newSlot, endDate: val})} />
                <InputGroup label="Start Time" type="time" value={newSlot.startTime} onChange={(val) => setNewSlot({...newSlot, startTime: val})} />
                <InputGroup label="End Time" type="time" value={newSlot.endTime} onChange={(val) => setNewSlot({...newSlot, endTime: val})} />
                <div className="lg:col-span-3">
                  <InputGroup label="Duration (Minutes)" type="number" value={newSlot.consultationDurationInminutes} onChange={(val) => setNewSlot({...newSlot, consultationDurationInminutes: val})} />
                </div>
                <div className="flex items-end">
                  <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white h-[54px] rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50">
                    {isSubmitting ? "Generating..." : "Apply Slots"}
                  </button>
                </div>
              </form>
            </div>

            {/* SLOTS GRID */}
            <div className="space-y-8">
              {groupedSlots && Object.entries(groupedSlots).length > 0 ? (
                Object.entries(groupedSlots).map(([date, slots]) => (
                  <div key={date} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm group hover:border-blue-100 transition-all">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tighter capitalize leading-none mb-2">
                          {new Date(date).toLocaleDateString("en-US", { weekday: "long" })}
                        </h3>
                        <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">{date}</p>
                      </div>
                      <button onClick={() => handleDeleteDay(slots)} className="w-12 h-12 rounded-2xl border border-slate-100 text-slate-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all flex items-center justify-center">
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                      {slots.map((slot) => (
                        <div key={slot.id} className="bg-[#E8F8FB] border border-[#D1F1F7] rounded-2xl pl-6 pr-3 py-3.5 flex items-center gap-3 transition-all hover:border-[#b4e6ef]">
                          <span className="font-bold text-[#1CB5BD] text-[14px] whitespace-nowrap">
                            {slot.startTime?.slice(0, 5)} ({slot.consultationDurationInminutes}min)
                          </span>
                          <button onClick={() => handleDeleteSlot(slot.id)} className="w-6 h-6 rounded-full flex items-center justify-center text-[#1CB5BD] hover:bg-white hover:text-red-500 transition-all">
                            <X size={14} strokeWidth={3} />
                          </button>
                        </div>
                      ))}
                      <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-200 cursor-pointer hover:border-blue-200 hover:text-blue-400 transition-all">
                         <Plus size={24} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-[3rem]">
                   <Info className="mx-auto text-slate-200 mb-4" size={48} />
                   <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No slots available for this week</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// UI HELPERS
function FeeCard({ icon, label, price, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100"
  };
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 flex items-center gap-5 shadow-sm">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label} Visit Fee</p>
        <p className="text-xl font-black text-slate-800">{price} <span className="text-[10px] text-slate-400 ml-1">EGP</span></p>
      </div>
    </div>
  );
}

function InputGroup({ label, type, value, onChange }) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-[11px] font-black text-slate-500 uppercase tracking-tighter ml-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required
        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 ring-blue-500/5 transition-all" />
    </div>
  );
}