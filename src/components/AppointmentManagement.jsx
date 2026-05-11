import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Video, Home, Calendar, Clock, Loader2, Search,
  Trash2, ChevronDown, Stethoscope, Plus, Info, X, Filter, Edit2, Check, MapPin
} from "lucide-react";

const API_BASE = "https://healthcare52.runasp.net/api";

export default function AppointmentManagement() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [activeTab, setActiveTab] = useState("appointments");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [appointments, setAppointments] = useState([]);
  const [schedule, setSchedule] = useState({
    clinicFee: 0, homeVisitFee: 0, onlineFee: 0,
    homeVisit: false, onlineConsultation: false, slots: []
  });

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    clinicFee: 0, homeFee: 0, onlineFee: 0,
    allowHomeVisit: false, allowOnlineConsultation: false
  });

  const [newSlot, setNewSlot] = useState({
    startDate: "", endDate: "", startTime: "", endTime: "",
    consultationDurationInminutes: 20
  });

  // =========================
  // FETCH DATA
  // =========================
  const fetchAppointments = async (page, isLoadMore = false) => {
    try {
      isLoadMore ? setLoadingMore(true) : setLoading(true);
      
      // Use the 'page' parameter passed directly to the function
      const res = await axios.get(`${API_BASE}/doctor-appointments/me?page=${page}&pageSize=20`, { headers });
      
      const newItems = res.data.items || [];
      const hasNext = res.data.hasNextPage;

      setAppointments(prev => isLoadMore ? [...prev, ...newItems] : newItems);
      setHasMore(hasNext);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
      setLoadingMore(false); 
    }
  };

  const fetchSchedule = async () => {
    try {
      const res = await axios.get(`${API_BASE}/Doctors/me/schedule`, { headers });
      setSchedule(res.data);
      setSettingsForm({
        clinicFee: res.data.clinicFee || 0,
        homeFee: res.data.homeVisitFee || 0,
        onlineFee: res.data.onlineFee || 0,
        allowHomeVisit: res.data.homeVisit || false,
        allowOnlineConsultation: res.data.onlineConsultation || false,
      });
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchAppointments(1);
    fetchSchedule();
  }, []);

  // FIXED: Correctly incrementing and passing the page number
  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    
    const nextPage = pageNumber + 1;
    setPageNumber(nextPage); // Update state for next time
    fetchAppointments(nextPage, true); // Use the locally calculated nextPage immediately
  };

  // =========================
  // UPDATE CONSULTATION SETTINGS
  // =========================
  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setIsUpdatingSettings(true);
    try {
      await axios.put(`${API_BASE}/Doctors/me/consultation-settings`, {
        clinicFee: Number(settingsForm.clinicFee),
        homeFee: Number(settingsForm.homeFee),
        onlineFee: Number(settingsForm.onlineFee),
        allowHomeVisit: settingsForm.allowHomeVisit,
        allowOnlineConsultation: settingsForm.allowOnlineConsultation,
      }, { headers });
      await fetchSchedule();
      alert("Settings updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update settings");
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  // =========================
  // GENERATE SLOTS
  // =========================
  const handleAddSlot = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const requestData = {
        startDate: newSlot.startDate,
        endDate: newSlot.endDate || null,
        startTime: `${newSlot.startTime}:00`,
        endTime: newSlot.endTime ? `${newSlot.endTime}:00` : null,
        consultationDurationInminutes: Number(newSlot.consultationDurationInminutes)
      };
      await axios.post(`${API_BASE}/doctors/me/slots`, requestData, { headers });
      alert("Generated Successfully");
      setNewSlot({ startDate: "", endDate: "", startTime: "", endTime: "", consultationDurationInminutes: 20 });
      fetchSchedule();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // DELETE HANDLERS
  // =========================
  const handleDeleteSlot = async (id) => {
    if (!window.confirm("حذف هذا الموعد؟")) return;
    try {
      await axios.delete(`${API_BASE}/doctors/me/slots/${id}`, { headers });
      fetchSchedule();
    } catch (err) { alert("Failed to delete slot"); }
  };

  const handleDeleteDay = async (date) => {
    if (!window.confirm("حذف جميع مواعيد هذا اليوم؟")) return;
    try {
      await axios.delete(`${API_BASE}/doctors/me/slots`, {
        headers,
        params: { date }
      });
      fetchSchedule();
    } catch (err) { alert("Failed to delete day"); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 px-4 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        {/* TOP BAR */}
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
            <div className="flex flex-col md:flex-row gap-4 items-center">
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

              <div className="relative w-full md:w-56">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Plus size={18} />
                </div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-12 pr-10 text-sm font-bold text-slate-700 outline-none appearance-none focus:ring-4 ring-blue-500/5 transition-all shadow-sm cursor-pointer"
                >
                  <option value="All">All Types</option>
                  <option value="HomeVisit">Home Visit</option>
                  <option value="OnSiteVisit">On Site</option>
                  <option value="Online">Online</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              </div>

              <div className="relative w-full md:w-56">
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
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Decliend">Decliend</option>
                  <option value="noShow">No Show</option>
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
                    const matchesType = typeFilter === "All" || appt.appointmentType === typeFilter;
                    return matchesSearch && matchesStatus && matchesType;
                  })
                  .map((appt) => (
                    <div key={appt.id} className="bg-white border border-slate-100 rounded-3xl p-5 flex items-center gap-6 shadow-sm hover:shadow-md transition-all group">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${appt.appointmentType === "Online" ? "bg-blue-50 text-blue-600" : "bg-indigo-50 text-indigo-600"}`}>
                        {appt.appointmentType === "Online" ? <Video size={28} /> : (appt.appointmentType === "HomeVisit" ? <Home size={28} /> : <MapPin size={28}/>)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-slate-800">{appt.patientName}</h3>
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${
                            appt.status === "Confirmed" ? "bg-blue-50 text-blue-600" :
                            appt.status === "Completed" ? "bg-green-50 text-green-600" :
                            appt.status === "Cancelled" ? "bg-slate-100 text-slate-500" :
                            appt.status === "Decliend" ? "bg-red-50 text-red-600" :
                            "bg-amber-50 text-amber-600"
                          }`}>
                            {appt.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-slate-400 font-semibold text-[11px] uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-500"/> {appt.date}</span>
                          <span className="flex items-center gap-1.5"><Clock size={14} className="text-blue-500"/> {appt.startTime?.slice(0, 5)}</span>
                          <span className="flex items-center gap-1.5 text-slate-500 font-black tracking-normal">[{appt.appointmentType}]</span>
                        </div>
                      </div>
                      <button onClick={() => navigate(`/doctor/appointment-details/${appt.id}`)} className="bg-slate-50 text-slate-900 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-slate-100">
                        View details
                      </button>
                    </div>
                  ))}
                
                {appointments.filter(appt => {
                  const matchesSearch = appt.patientName?.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesStatus = statusFilter === "All" || appt.status === statusFilter;
                  const matchesType = typeFilter === "All" || appt.appointmentType === typeFilter;
                  return matchesSearch && matchesStatus && matchesType;
                }).length === 0 && (
                  <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                    <Info className="mx-auto text-slate-200 mb-2" size={40} />
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No results found</p>
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
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                  <Edit2 size={18} />
                </div>
                <h2 className="text-lg font-black tracking-tight">Consultation Settings</h2>
              </div>

              <form onSubmit={handleUpdateSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-tighter ml-1">Clinic Fee (EGP)</label>
                    <div className="relative">
                      <Stethoscope size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" />
                      <input
                        type="number" min="0"
                        value={settingsForm.clinicFee}
                        onChange={(e) => setSettingsForm({ ...settingsForm, clinicFee: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-10 pr-4 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 ring-blue-500/5 transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-tighter ml-1">Home Visit Fee (EGP)</label>
                    <div className="relative">
                      <Home size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
                      <input
                        type="number" min="0"
                        value={settingsForm.homeFee}
                        onChange={(e) => setSettingsForm({ ...settingsForm, homeFee: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-10 pr-4 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 ring-blue-500/5 transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-tighter ml-1">Online Fee (EGP)</label>
                    <div className="relative">
                      <Video size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                      <input
                        type="number" min="0"
                        value={settingsForm.onlineFee}
                        onChange={(e) => setSettingsForm({ ...settingsForm, onlineFee: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 pl-10 pr-4 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 ring-blue-500/5 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <ToggleCard
                    label="Allow Home Visits"
                    icon={<Home size={18} />}
                    color="indigo"
                    checked={settingsForm.allowHomeVisit}
                    onChange={(val) => setSettingsForm({ ...settingsForm, allowHomeVisit: val })}
                  />
                  <ToggleCard
                    label="Allow Online Consultations"
                    icon={<Video size={18} />}
                    color="purple"
                    checked={settingsForm.allowOnlineConsultation}
                    onChange={(val) => setSettingsForm({ ...settingsForm, allowOnlineConsultation: val })}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdatingSettings}
                    className="bg-slate-900 text-white px-10 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] hover:bg-blue-600 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
                  >
                    {isUpdatingSettings ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    Save Settings
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <Plus size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight">Generate New Slots</h2>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">End date and end time are optional</p>
                </div>
              </div>
              <form onSubmit={handleAddSlot} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <InputGroup label="Start Date *" type="date" value={newSlot.startDate} required onChange={(val) => setNewSlot({ ...newSlot, startDate: val })} />
                <InputGroup label="End Date" type="date" value={newSlot.endDate} onChange={(val) => setNewSlot({ ...newSlot, endDate: val })} />
                <InputGroup label="Start Time *" type="time" value={newSlot.startTime} required onChange={(val) => setNewSlot({ ...newSlot, startTime: val })} />
                <InputGroup label="End Time" type="time" value={newSlot.endTime} onChange={(val) => setNewSlot({ ...newSlot, endTime: val })} />
                <div className="lg:col-span-3">
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-tighter ml-1">Duration (Minutes) *</label>
                    <select
                      value={newSlot.consultationDurationInminutes}
                      onChange={(e) => setNewSlot({ ...newSlot, consultationDurationInminutes: Number(e.target.value) })}
                      required
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 ring-blue-500/5 transition-all appearance-none cursor-pointer"
                    >
                      {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((min) => (
                        <option key={min} value={min}>{min} minutes</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-end">
                  <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white h-[54px] rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50">
                    {isSubmitting ? "Generating..." : "Apply Slots"}
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-8">
              {schedule.slots && schedule.slots.length > 0 ? (
                schedule.slots.map(({ date, day, slots }) => (
                  <div key={date} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm group hover:border-blue-100 transition-all">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tighter capitalize leading-none mb-2">
                          {day}
                        </h3>
                        <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">{date}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteDay(date)}
                        className="w-12 h-12 rounded-2xl border border-slate-100 text-slate-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all flex items-center justify-center"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                      {slots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`border rounded-2xl pl-6 pr-3 py-3.5 flex items-center gap-3 transition-all ${
                            slot.isBooked
                              ? "bg-slate-50 border-slate-200"
                              : "bg-[#E8F8FB] border-[#D1F1F7] hover:border-[#b4e6ef]"
                          }`}
                        >
                          <span className={`font-bold text-[14px] whitespace-nowrap ${slot.isBooked ? "text-slate-400" : "text-[#1CB5BD]"}`}>
                            {slot.startTime?.slice(0, 5)}
                            {slot.isBooked && (
                              <span className="ml-2 text-[9px] font-black uppercase tracking-wider bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">Booked</span>
                            )}
                          </span>
                          {!slot.isBooked && (
                            <button
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-[#1CB5BD] hover:bg-white hover:text-red-500 transition-all"
                            >
                              <X size={14} strokeWidth={3} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-[3rem]">
                  <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No slots available</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ToggleCard({ label, icon, color, checked, onChange }) {
  const colors = {
    indigo: { active: "bg-indigo-600 border-indigo-600", icon: "text-indigo-600 bg-indigo-50" },
    purple: { active: "bg-purple-600 border-purple-600", icon: "text-purple-600 bg-purple-50" },
  };
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`flex-1 flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all select-none ${
        checked ? `${colors[color].active} text-white` : "border-slate-100 bg-slate-50 text-slate-600"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${checked ? "bg-white/20" : colors[color].icon}`}>
          {icon}
        </div>
        <span className="font-black text-[12px] uppercase tracking-wider">{label}</span>
      </div>
      <div className={`w-12 h-6 rounded-full transition-all relative ${checked ? "bg-white/30" : "bg-slate-200"}`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${checked ? "left-6" : "left-0.5"}`} />
      </div>
    </div>
  );
}

function InputGroup({ label, type, value, onChange, required = false }) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-[11px] font-black text-slate-500 uppercase tracking-tighter ml-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 px-4 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 ring-blue-500/5 transition-all"
      />
    </div>
  );
}