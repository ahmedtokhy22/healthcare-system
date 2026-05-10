import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Calendar, Clock, MapPin, Search, Plus, DollarSign, 
  Trash2, X, ChevronDown, ChevronLeft, ChevronRight, Loader2, Filter,
  AlertCircle
} from "lucide-react";

const API_BASE_URL = "http://localhost:5173/api";

export default function NurseStation() {
  const [tab, setTab] = useState("Appointments");
  const [loading, setLoading] = useState(false);
  
  const [appointments, setAppointments] = useState([]);
  const [scheduleData, setScheduleData] = useState({ homeVisitFee: 0, hourPrice: 0, shifts: [] });
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  useEffect(() => {
    fetchAppointments();
    fetchSchedule();
  }, [statusFilter, pagination.currentPage]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const statusParam = statusFilter !== "All" ? `&status=${statusFilter}` : "";
      const res = await axios.get(
        `${API_BASE_URL}/nurse-appointments/me?pageNumber=${pagination.currentPage}${statusParam}`,
        getAuthHeader()
      );
      setAppointments(res.data.items || []);
      setPagination({ currentPage: res.data.pageNumber, totalPages: res.data.totalPages });
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchSchedule = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/nurses/me/schedule`, getAuthHeader());
      setScheduleData(res.data);
    } catch (err) { console.error(err); }
  };

  // --- Functions for Deletion ---
  const deleteShift = async (shiftId) => {
    if (!window.confirm("Delete this specific shift?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/nurses/me/shifts/${shiftId}`, getAuthHeader());
      fetchSchedule();
    } catch (err) { alert("Error deleting shift"); }
  };

  const deleteFullDay = async (date) => {
    if (!window.confirm(`Are you sure you want to delete ALL shifts for ${date}?`)) return;
    try {
      await axios.delete(`${API_BASE_URL}/nurses/me/schedule/day/${date}`, getAuthHeader());
      fetchSchedule();
    } catch (err) { alert("Error deleting day"); }
  };

  const updatePrices = async () => {
    try {
      await axios.put(`${API_BASE_URL}/nurses/me/pricing`, {
        homeVisitFee: scheduleData.homeVisitFee,
        hourPrice: scheduleData.hourPrice
      }, getAuthHeader());
      alert("Prices Updated!");
    } catch (err) { alert("Update failed"); }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans py-10 px-4 text-left" dir="ltr">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex bg-slate-200/50 p-1.5 rounded-[2rem] w-full max-w-md shadow-inner border border-slate-200/50">
            {["Appointments", "Schedule"].map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-3 rounded-[1.5rem] text-[11px] font-black transition-all ${tab === t ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {tab === "Appointments" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Search by patient name..." className="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-[1.5rem] text-xs font-bold outline-none" onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="relative w-full md:w-56">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={16} />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full pl-11 pr-10 py-4 bg-blue-50/50 text-blue-700 border-0 rounded-[1.5rem] text-xs font-black appearance-none outline-none">
                  <option value="All">ALL STATUS</option>
                  <option value="Pending">PENDING</option>
                  <option value="Confirmed">CONFIRMED</option>
                  <option value="Completed">COMPLETED</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
              </div>
            </div>

            <div className="grid gap-6">
              {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" /></div> : 
                appointments.map(apt => (
                  <div key={apt.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 group transition-all">
                    <div className="flex-1 space-y-4 w-full text-left">
                       <h3 className="text-xl font-black text-slate-800">{apt.patientName}</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[12px] font-bold text-slate-400">
                        <div className="flex items-center gap-2"><Calendar size={14}/> {apt.date}</div>
                        <div className="flex items-center gap-2"><Clock size={14}/> {apt.appointmentStartTime}</div>
                      </div>
                    </div>
                    <div className="text-right border-l pl-10 border-slate-100">
                      <p className="text-[9px] font-black text-slate-300 uppercase">{apt.serviceType}</p>
                      <p className="text-3xl font-black text-slate-900">${apt.serviceType === 'HourlyStay' ? (apt.hours * scheduleData.hourPrice) : scheduleData.homeVisitFee}</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {tab === "Schedule" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            
            {/* COMPACT PRICING HEADER */}
            <section className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><DollarSign size={20} /></div>
                <div>
                  <h2 className="text-xs font-black text-slate-800 uppercase tracking-tight">Service Pricing</h2>
                  <p className="text-[9px] text-slate-400 font-bold italic">Adjust your rates</p>
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <div className="flex-1 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                  <label className="text-[8px] font-black text-slate-400 uppercase block">Quick Visit</label>
                  <div className="flex items-center gap-1 font-black text-sm text-slate-800">
                    $ <input type="number" value={scheduleData.homeVisitFee} onChange={(e) => setScheduleData({...scheduleData, homeVisitFee: e.target.value})} className="bg-transparent w-16 outline-none" />
                  </div>
                </div>
                <div className="flex-1 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                  <label className="text-[8px] font-black text-slate-400 uppercase block">Hourly Price</label>
                  <div className="flex items-center gap-1 font-black text-sm text-slate-800">
                    $ <input type="number" value={scheduleData.hourPrice} onChange={(e) => setScheduleData({...scheduleData, hourPrice: e.target.value})} className="bg-transparent w-16 outline-none" />
                  </div>
                </div>
                <button onClick={updatePrices} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[10px] font-black hover:bg-blue-600 transition-all">SAVE</button>
              </div>
            </section>

            {/* SHIFTS MANAGEMENT */}
            <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                  <Clock size={18} className="text-emerald-500" /> ACTIVE SCHEDULE
                </h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:bg-blue-700 flex items-center gap-2">
                  <Plus size={14} /> ADD DAY
                </button>
              </div>

              <div className="divide-y divide-slate-50">
                {scheduleData.shifts?.length > 0 ? scheduleData.shifts.map((dayGroup, idx) => (
                  <div key={idx} className="p-6 group hover:bg-slate-50/30 transition-all">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black rounded-md uppercase">{dayGroup.day}</span>
                        <span className="text-[11px] font-bold text-slate-400">{dayGroup.date}</span>
                      </div>
                      <button onClick={() => deleteFullDay(dayGroup.date)} className="text-slate-300 hover:text-red-500 p-2 transition-colors" title="Delete whole day">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {dayGroup.shifts.map(shift => (
                        <div key={shift.id} className={`flex items-center gap-3 pl-4 pr-2 py-2 rounded-xl text-[10px] font-black border transition-all ${shift.isBooked ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-white border-blue-100 text-blue-600'}`}>
                          <Clock size={12} className={shift.isBooked ? 'opacity-30' : 'text-blue-400'} />
                          {shift.startTime.slice(0,5)} - {shift.endTime.slice(0,5)}
                          {!shift.isBooked && (
                            <button onClick={() => deleteShift(shift.id)} className="ml-1 p-1 hover:bg-red-50 hover:text-red-500 rounded-md">
                              <X size={14}/>
                            </button>
                          )}
                          {shift.isBooked && <span className="text-[7px] bg-slate-200 text-white px-1.5 py-0.5 rounded ml-1 tracking-tighter">BOOKED</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center flex flex-col items-center gap-2">
                    <AlertCircle size={32} className="text-slate-200" />
                    <p className="text-xs font-bold text-slate-300 uppercase italic">No shifts found</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}