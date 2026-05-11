import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, Search, MapPin, TestTube, 
  Eye, CheckCircle2, ChevronDown, 
  Activity, Beaker, DollarSign, Save, Clock, Plus, Home, Building2, Loader2
} from "lucide-react";

const API_BASE_URL = "https://healthcare52.runasp.net/api";

export default function LabManagement() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("Appointments");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // 1. Appointments & Pagination State
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  // 2. Schedule State
  const [labSettings, setLabSettings] = useState({
    homeVisitFee: 0,
    openingTime: "09:00:00",
    closingTime: "21:00:00",
    isSaturdayOpen: true,
    isSundayOpen: true,
    isMondayOpen: true,
    isTuesdayOpen: true,
    isWednesdayOpen: true,
    isThursdayOpen: true,
    isFridayOpen: false
  });

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  // Fetch Appointments with Pagination Logic
  const fetchAppointments = useCallback(async (isLoadMore = false) => {
    setLoading(true);
    try {
      const pageToFetch = isLoadMore ? pagination.currentPage + 1 : 1;
      const statusParam = statusFilter !== "All" ? `&status=${statusFilter}` : "";
      const searchParam = searchTerm ? `&searchTerm=${searchTerm}` : "";
      
      const res = await axios.get(
        `${API_BASE_URL}/lab-appointments/me?page=${pageToFetch}&pageSize=20${statusParam}${searchParam}`,
        getAuthHeader()
      );

      setAppointments(prev => isLoadMore ? [...prev, ...res.data.items] : res.data.items);
      setPagination({ 
        currentPage: res.data.pageNumber, 
        totalPages: res.data.totalPages 
      });
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm, pagination.currentPage]);

  // Fetch Schedule
  const fetchSchedule = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Labs/me/schedule`, getAuthHeader());
      if (res.data) setLabSettings(res.data);
    } catch (err) {
      console.error("Error fetching schedule:", err);
    }
  }, []);

  // Effect for Tab switching and Initial Load
  useEffect(() => {
    if (tab === "Appointments") {
      fetchAppointments(false); // Reset to page 1 when filters/search change
    } else {
      fetchSchedule();
    }
  }, [tab, statusFilter, searchTerm, fetchSchedule]);

  const handleUpdateSchedule = async () => {
    setSubmitting(true);
    try {
      await axios.put(`${API_BASE_URL}/Labs/me/schedule`, labSettings, getAuthHeader());
      alert("✅ Pricing & Schedule updated successfully!");
    } catch (err) {
      alert("Update failed. Please check your data.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans py-10 px-4" dir="ltr">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <Beaker className="text-blue-600" size={32} /> Lab Management
            </h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 ml-11">
              Control center for patient tests and lab availability
            </p>
          </div>

          <div className="flex bg-slate-200/50 p-1.5 rounded-[2rem] w-full md:w-80 shadow-inner">
            {["Appointments", "Schedule"].map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-3 rounded-[1.5rem] text-[10px] font-black transition-all ${tab === t ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}>
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {tab === "Appointments" ? (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input type="text" placeholder="Search by patient..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-6 py-4 bg-slate-50 border-0 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div className="relative w-full md:w-64">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-6 pr-12 py-4 bg-blue-50 text-blue-700 rounded-[1.5rem] text-[10px] font-black uppercase appearance-none outline-none cursor-pointer">
                  <option value="All">All Appointments</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Decliend">Decliend</option>
                  <option value="noShow">No Show</option>
                  <option value="ResultsDone">Results Done</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" size={18} />
              </div>
            </div>

            {/* List */}
            <div className="grid gap-6">
              {appointments.map((apt) => (
                <div key={apt.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col lg:flex-row justify-between gap-8 hover:border-blue-200 transition-all group">
                  <div className="flex-1 space-y-6 text-left">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-500 text-xl">{apt.patientName?.[0] || "P"}</div>
                      <div>
                        <h3 className="text-xl font-black text-slate-800">{apt.patientName}</h3>
                        <div className="flex gap-2 mt-1">
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${apt.status === 'ResultsDone' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                            {apt.status === 'ResultsDone' ? 'Results Available' : apt.status}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase flex items-center gap-1 ${apt.appointmentType === 'HomeVisit' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
                            {apt.appointmentType === 'HomeVisit' ? <><Home size={10}/> Home Visit</> : <><Building2 size={10}/> In-Lab</>}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <InfoBox icon={<TestTube size={14} className="text-blue-500"/>} label="Tests Count" value={`${apt.testsCount || 0} Tests`} />
                      <InfoBox icon={<Clock size={14} className="text-amber-500"/>} label="Start Time" value={apt.startTime?.slice(0, 5) || "N/A"} />
                      <InfoBox icon={<Calendar size={14} className="text-indigo-500"/>} label="Date" value={new Date(apt.date).toLocaleDateString('en-GB')} />
                      <InfoBox 
                        icon={<MapPin size={14} className="text-rose-500"/>} 
                        label="Address / Location" 
                        value={apt.appointmentType === "HomeVisit" ? (apt.address || "No Address Provided") : "Visit to Lab"} 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-3 lg:w-64 lg:pl-8 lg:border-l border-slate-100">
                    {apt.status === 'ResultsDone' && (
                      <div className="bg-emerald-50 text-emerald-600 py-3 rounded-2xl text-center font-black text-[9px] uppercase border border-emerald-100 flex items-center justify-center gap-2">
                        <CheckCircle2 size={14}/> Result Completed
                      </div>
                    )}
                    <button onClick={() => navigate(`/lab/appointment-details/${apt.id}`)} className="bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-lg shadow-blue-50">
                      <Eye size={16}/> View Details
                    </button>
                  </div>
                </div>
              ))}

              {/* Pagination Button */}
              {pagination.currentPage < pagination.totalPages && (
                <div className="flex justify-center mt-10">
                  <button 
                    onClick={() => fetchAppointments(true)} 
                    className="flex items-center gap-3 bg-white border-2 border-blue-600 text-blue-600 px-12 py-4 rounded-full text-[11px] font-black hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-blue-50 uppercase tracking-tighter"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18}/> : <Plus size={18}/>}
                    LOAD MORE
                  </button>
                </div>
              )}

              {!loading && appointments.length === 0 && (
                <div className="bg-white p-20 rounded-[2.5rem] text-center border border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold">No appointments found matching your filters.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* --- Schedule Section --- */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-2">
              <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><DollarSign size={24} /></div>
                  <h2 className="text-lg font-black uppercase tracking-widest text-slate-800">Pricing & Hours</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 text-left">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Home Visit Fee (EGP)</label>
                    <div className="flex items-center bg-slate-50 border border-slate-100 p-5 rounded-[1.5rem] focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <span className="text-xl font-black text-blue-600 mr-3">£</span>
                        <input type="number" value={labSettings.homeVisitFee} onChange={(e) => setLabSettings({...labSettings, homeVisitFee: e.target.value})} 
                         className="bg-transparent w-full text-slate-900 font-black text-xl outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Opening</label>
                      <input type="time" value={labSettings.openingTime} onChange={(e) => setLabSettings({...labSettings, openingTime: e.target.value})}
                        className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-black text-sm outline-none" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Closing</label>
                      <input type="time" value={labSettings.closingTime} onChange={(e) => setLabSettings({...labSettings, closingTime: e.target.value})}
                        className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-black text-sm outline-none" />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleUpdateSchedule} 
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-blue-50 flex items-center justify-center gap-3"
                >
                  {submitting ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                  Update Lab Policy
                </button>
              </section>
            </div>

            <div className="lg:col-span-1">
              <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 h-full text-left">
                <div className="flex items-center gap-3 mb-8">
                  <Clock size={20} className="text-slate-400" />
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Availability</h4>
                </div>
                
                <div className="space-y-3">
                  {["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => {
                    const key = `is${day}Open`;
                    return (
                      <div key={day} onClick={() => setLabSettings({...labSettings, [key]: !labSettings[key]})}
                        className={`p-4 rounded-2xl border cursor-pointer flex justify-between items-center transition-all ${labSettings[key] ? 'bg-blue-50 border-blue-100' : 'bg-white border-slate-50 opacity-40'}`}>
                        <span className="text-[11px] font-black text-slate-700 uppercase">{day}</span>
                        {labSettings[key] ? <CheckCircle2 size={18} className="text-blue-600" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-200" />}
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const InfoBox = ({ icon, label, value }) => (
  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
    <p className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2">{icon} {label}</p>
    <p className="text-[11px] font-bold text-slate-700 break-words uppercase">{value}</p>
  </div>
);