import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, Clock, Search, Plus, DollarSign, 
  Trash2, Loader2, Filter, Eye, CheckCircle2, Timer, ChevronDown, Activity
} from "lucide-react";

const API_BASE_URL = "https://healthcare52.runasp.net/api";

export default function NurseStation() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("Appointments");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [appointments, setAppointments] = useState([]);
  const [scheduleData, setScheduleData] = useState({ homeVisitFee: 0, hourPrice: 0, shifts: [] });
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [newSlot, setNewSlot] = useState({ startDate: "", endDate: "", startTime: "", endTime: "" });

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  const fetchAppointments = useCallback(async (isLoadMore = false) => {
    setLoading(true);
    try {
      const pageToFetch = isLoadMore ? pagination.currentPage + 1 : 1;
      const statusParam = statusFilter !== "All" ? `&status=${statusFilter}` : "";
      const searchParam = searchTerm ? `&searchTerm=${searchTerm}` : "";
      const res = await axios.get(
        `${API_BASE_URL}/nurse-appointments/me?page=${pageToFetch}&pageSize=20${statusParam}${searchParam}`,
        getAuthHeader()
      );
      setAppointments(prev => isLoadMore ? [...prev, ...res.data.items] : res.data.items);
      setPagination({ currentPage: res.data.pageNumber, totalPages: res.data.totalPages });
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [statusFilter, searchTerm, pagination.currentPage]);

  const fetchSchedule = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/nurses/me/schedule`, getAuthHeader());
      setScheduleData(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchAppointments(false); }, [statusFilter, searchTerm]);
  useEffect(() => { fetchSchedule(); }, []);

const handleApplySlots = async () => {
  if (!newSlot.startDate || !newSlot.startTime || !newSlot.endTime) {
    alert("Please fill required fields (Start Date, Start Time, End Time)");
    return;
  }

  setSubmitting(true);

  // Create a copy of the data to clean it
  const payload = {
    ...newSlot,
    endDate: newSlot.endDate === "" ? null : newSlot.endDate // Convert empty string to null
  };

  try {
    // Send the cleaned payload instead of newSlot
    await axios.post(`${API_BASE_URL}/nurses/me/shifts`, payload, getAuthHeader());
    
    alert("✅ Slots generated successfully!");
    setNewSlot({ startDate: "", endDate: "", startTime: "", endTime: "" });
    fetchSchedule();
  } catch (err) {
    // Printing the specific error body as you requested before
    const errorBody = err.response?.data;
    console.error("Shift Generation Error:", errorBody);
    alert(errorBody?.message || "Failed to generate slots");
  } finally {
    setSubmitting(false);
  }
};

  const handleDeleteShift = async (shiftId) => {
    if (!window.confirm("Delete this shift?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/nurses/me/shifts/${shiftId}`, getAuthHeader());
      fetchSchedule();
    } catch (err) { alert("Cannot delete a booked shift."); }
  };

  const handleUpdatePrices = async () => {
    try {
      await axios.put(`${API_BASE_URL}/nurses/me/pricing`, {
        homeVisitFee: Number(scheduleData.homeVisitFee),
        hourPrice: Number(scheduleData.hourPrice)
      }, getAuthHeader());
      alert("✅ Pricing updated!");
    } catch (err) { alert("Update failed."); }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans py-10 px-4" dir="ltr">
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

        {tab === "Schedule" ? (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 text-left">
            {/* PRICING SECTION */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><DollarSign size={24} /></div>
                <h2 className="text-lg font-black uppercase tracking-tight text-slate-800">Pricing Policy</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 space-y-2 w-full">
                  <label className="text-[10px] font-black text-slate-400 uppercase px-1">Home Visit Fee</label>
                  <div className="flex items-center bg-slate-50 border border-slate-100 p-4 rounded-2xl focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <span className="text-xl font-black text-blue-600 mr-2">$</span>
                    <input type="number" value={scheduleData.homeVisitFee} onChange={(e) => setScheduleData({...scheduleData, homeVisitFee: e.target.value})} className="bg-transparent w-full text-slate-900 font-black outline-none text-xl" />
                  </div>
                </div>
                <div className="flex-1 space-y-2 w-full">
                  <label className="text-[10px] font-black text-slate-400 uppercase px-1">Hourly Price</label>
                  <div className="flex items-center bg-slate-50 border border-slate-100 p-4 rounded-2xl focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <span className="text-xl font-black text-blue-600 mr-2">$</span>
                    <input type="number" value={scheduleData.hourPrice} onChange={(e) => setScheduleData({...scheduleData, hourPrice: e.target.value})} className="bg-transparent w-full text-slate-900 font-black outline-none text-xl" />
                  </div>
                </div>
                <button onClick={handleUpdatePrices} className="bg-blue-600 hover:bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-[11px] transition-all w-full md:w-auto shadow-lg shadow-blue-50 uppercase">UPDATE</button>
              </div>
            </section>

            {/* GENERATE NEW SLOTS */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Plus size={24} /></div>
                <div>
                  <h2 className="text-lg font-black text-slate-800">Generate New Slots</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">End date and end time are optional</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Start Date *</label>
                  <input type="date" className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100" 
                    value={newSlot.startDate} onChange={(e) => setNewSlot({...newSlot, startDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase">End Date</label>
                  <input type="date" className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100" 
                    value={newSlot.endDate} onChange={(e) => setNewSlot({...newSlot, endDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Start Time *</label>
                  <input type="time" className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100" 
                    value={newSlot.startTime} onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase">End Time *</label>
                  <input type="time" className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100" 
                    value={newSlot.endTime} onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})} />
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={handleApplySlots}
                  disabled={submitting}
                  className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black text-[11px] shadow-lg shadow-blue-100 hover:bg-slate-900 transition-all flex items-center gap-2 uppercase"
                >
                  {submitting ? <Loader2 className="animate-spin" size={16}/> : <CheckCircle2 size={16}/>}
                  APPLY SLOTS
                </button>
              </div>
            </section>

            {/* ACTIVE SHIFTS LIST */}
            <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-md font-black text-slate-800 flex items-center gap-2"><Clock size={20} className="text-emerald-500" /> CURRENT SCHEDULE</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {scheduleData.shifts?.length > 0 ? scheduleData.shifts.map((dayGroup, idx) => (
                  <div key={idx} className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl uppercase">{dayGroup.day}</span>
                      <span className="text-[12px] font-black text-slate-400">{dayGroup.date}</span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {dayGroup.shifts.map(shift => (
                        <div key={shift.id} className={`group flex items-center gap-4 pl-5 pr-3 py-3 rounded-2xl text-[11px] font-black border transition-all ${shift.isBooked ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'}`}>
                          <Clock size={14} className={shift.isBooked ? 'text-emerald-500' : 'text-blue-500'} />
                          {shift.startTime.slice(0,5)} - {shift.endTime.slice(0,5)}
                          {!shift.isBooked ? (
                            <button onClick={() => handleDeleteShift(shift.id)} className="opacity-0 group-hover:opacity-100 ml-2 p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-all">
                              <Trash2 size={16}/>
                            </button>
                          ) : (
                            <span className="flex items-center gap-1 text-[9px] bg-emerald-100 px-2 py-1 rounded-md ml-2"><CheckCircle2 size={10}/> BOOKED</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center text-slate-300 font-black text-xs uppercase italic">No shifts found</div>
                )}
              </div>
            </section>
          </div>
        ) : (
          /* Appointments Tab */
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 text-left">
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by patient name..." 
                  className="w-full pl-14 pr-4 py-4 bg-slate-50 border-0 rounded-[1.5rem] text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
              <div className="relative w-full md:w-48">
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)} 
                  className="w-full pl-6 pr-10 py-4 bg-blue-50 text-blue-700 border-0 rounded-[1.5rem] text-xs font-black appearance-none outline-none cursor-pointer"
                >
                  <option value="All">ALL STATUS</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Decliend">Decliend</option>
                  <option value="noShow">No Show</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="grid gap-6">
              {appointments.map(apt => (
                <div key={apt.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 group hover:shadow-md transition-all">
                  <div className="flex-1 space-y-4 w-full text-left">
                    <div className="flex items-center justify-between lg:justify-start gap-4">
                      <h3 className="text-xl font-black text-slate-800 tracking-tight">{apt.patientName}</h3>
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        apt.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 
                        apt.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {apt.status}
                      </span>
                    </div>

                    <p className="text-[11px] font-bold text-slate-500 bg-slate-50 inline-block px-3 py-1 rounded-lg border border-slate-100">
                      📍 {apt.address}
                    </p>

                    <div className="flex flex-wrap gap-3 text-[10px] font-black">
                      <div className="flex items-center gap-2 bg-blue-50/50 text-blue-700 px-3 py-2 rounded-xl border border-blue-100">
                        <Calendar size={14} /> 
                        {new Date(apt.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2 bg-blue-50/50 text-blue-700 px-3 py-2 rounded-xl border border-blue-100">
                        <Clock size={14} /> 
                        {apt.appointmentStartTime?.slice(0, 5)}
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                        apt.serviceType === 'HourlyStay' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      }`}>
                        <Activity size={14} />
                        {apt.serviceType === 'HourlyStay' ? 'HOURLY STAY' : 'QUICK VISIT'}
                      </div>
                      {apt.serviceType === 'HourlyStay' && apt.hours && (
                        <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-2 rounded-xl border border-amber-100">
                          <Timer size={14} /> {apt.hours} HOURS
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                        Assigned Shift: {apt.shiftStartTime?.slice(0, 5)} - {apt.shiftEndTime?.slice(0, 5)}
                      </span>
                    </div>
                  </div>

                  <div className="w-full lg:w-auto border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-8 border-slate-100">
                    <button 
                      onClick={() => navigate(`/nurse/appointment-details/${apt.id}`)} 
                      className="flex items-center justify-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] hover:bg-slate-900 transition-all shadow-lg shadow-blue-100 uppercase tracking-widest w-full"
                    >
                      <Eye size={16}/> View Record
                    </button>
                  </div>
                </div>
              ))}

              {appointments.length === 0 && !loading && (
                <div className="py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 text-center">
                  <p className="text-slate-300 font-black text-xs uppercase italic tracking-widest">No appointments found</p>
                </div>
              )}
            </div>

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
          </div>
        )}
      </div>
    </div>
  );
}