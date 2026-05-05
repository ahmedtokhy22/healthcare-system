import React, { useState, useEffect } from "react";
import { 
  Calendar, Clock, MapPin, Phone, Home, 
  X, Plus, DollarSign, Trash2
} from "lucide-react";

export default function NurseStation() {
  const [tab, setTab] = useState("Appointments");
  const [appointments, setAppointments] = useState([]);
  const [shifts, setShifts] = useState([]);
  
  // State لإضافة ميعاد جديد
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [newTime, setNewTime] = useState({ start: "09:00", end: "14:00" });

  useEffect(() => {
    // البيانات الأولية (Initial Data) من الريسبونس الخاص بك
    const endpointResponse = {
      appointments: [
        {
          id: 1,
          patientName: "Bob Johnson",
          date: "Wed, Feb 4",
          time: "09:00-14:00",
          type: "Home Visit",
          phone: "+1 555-0103",
          address: "789 Elm Street, Unit 5, Springfield",
          notes: "Regular blood pressure monitoring",
          status: "confirmed"
        },
        {
          id: 2,
          patientName: "Sarah Williams",
          date: "Wed, Feb 4",
          time: "16:00-21:00",
          type: "Home Visit",
          phone: "+1 555-0104",
          address: "321 Pine Road, Springfield",
          notes: "Diabetes management and insulin injection",
          status: "confirmed"
        }
      ],
      shifts: [
        { id: 1, day: "Monday 2/9/2026", times: ["09:00-14:00", "16:00-21:00"] },
        { id: 2, day: "Tuesday 2/10/2026", times: ["09:00-14:00", "16:00-21:00"] },
        { id: 3, day: "Wednesday 2/11/2026", times: ["09:00-14:00"] },
        { id: 4, day: "Thursday 2/12/2026", times: ["09:00-14:00", "16:00-21:00"] },
        { id: 5, day: "Friday 2/13/2026", times: ["09:00-14:00"] },
      ]
    };

    setAppointments(endpointResponse.appointments);
    setShifts(endpointResponse.shifts);
  }, []);

  // 1. حذف ميعاد محدد من يوم
  const removeTimeSlot = (dayId, timeIndex) => {
    setShifts(prevShifts => prevShifts.map(shift => {
      if (shift.id === dayId) {
        const newTimes = shift.times.filter((_, index) => index !== timeIndex);
        return { ...shift, times: newTimes };
      }
      return shift;
    }));
  };

  // 2. حذف يوم كامل
  const removeFullDay = (dayId) => {
    setShifts(prevShifts => prevShifts.filter(shift => shift.id !== dayId));
  };

  // 3. إضافة ميعاد جديد
  const addTimeSlot = () => {
    const timeRange = `${newTime.start}-${newTime.end}`;
    setShifts(prevShifts => prevShifts.map(shift => {
      if (shift.id === selectedDayId) {
        return { ...shift, times: [...shift.times, timeRange] };
      }
      return shift;
    }));
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-left py-12 px-4 relative">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#1e293b]">Appointment Management</h1>
          <p className="text-slate-500 mt-2">Manage your appointments and schedule</p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-[#eff3f6] p-1 rounded-xl mb-8 w-full max-w-4xl mx-auto">
          <button onClick={() => setTab("Appointments")} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${tab === "Appointments" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}>Appointments</button>
          <button onClick={() => setTab("My Schedule")} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${tab === "My Schedule" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}>My Schedule</button>
        </div>

        {/* Content Area */}
        <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
          
          {tab === "Appointments" && (
            <div>
              <h2 className="text-slate-500 font-semibold mb-6">Confirmed Appointments</h2>
              <div className="space-y-4">
                {appointments.map(apt => (
                  <div key={apt.id} className="border border-slate-100 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-lg font-bold text-slate-800">{apt.patientName}</span>
                      <span className="bg-emerald-500 text-white text-[10px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider">{apt.status}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-12 text-[13px] text-slate-500 font-medium">
                      <div className="flex items-center gap-2.5"><Calendar size={15} /> {apt.date}</div>
                      <div className="flex items-center gap-2.5"><Clock size={15} /> {apt.time}</div>
                      <div className="flex items-center gap-2.5"><Home size={15} /> {apt.type}</div>
                      <div className="flex items-center gap-2.5"><Phone size={15} /> {apt.phone}</div>
                      <div className="flex items-center gap-2.5 md:col-span-2"><MapPin size={15} /> {apt.address}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "My Schedule" && (
            <div className="space-y-10">
              <section>
                <h2 className="text-slate-500 font-semibold mb-4">Service Pricing</h2>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 max-w-xs">
                  <p className="text-xs font-bold text-slate-800 mb-3">Home Visit Service Price</p>
                  <div className="flex items-center gap-1.5 text-slate-600 font-bold">
                    <DollarSign size={16} /> <span className="text-xl">50</span>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-slate-500 font-semibold mb-4">My Shifts</h2>
                <div className="space-y-6">
                  {shifts.map(shift => (
                    <div key={shift.id} className="space-y-3 border-b border-slate-50 pb-6 last:border-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[13px] font-bold text-slate-700">{shift.day}</h3>
                        <button 
                          onClick={() => removeFullDay(shift.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {shift.times.map((t, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-[#eef2ff] text-blue-600 px-3 py-1.5 rounded-lg text-[11px] font-bold border border-blue-50 group">
                            <Clock size={13} /> {t}
                            <button 
                              onClick={() => removeTimeSlot(shift.id, idx)}
                              className="text-blue-300 hover:text-red-500 transition-colors"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => { setSelectedDayId(shift.id); setIsModalOpen(true); }}
                          className="p-1.5 border border-dashed border-slate-200 rounded-lg text-slate-300 hover:border-blue-200 hover:text-blue-400 transition-all"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* Modal بسيط لإضافة الوقت */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Add New Shift Slot</h3>
            <div className="space-y-4 mb-8">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">From</label>
                <input type="time" value={newTime.start} onChange={e => setNewTime({...newTime, start: e.target.value})} className="w-full p-3 bg-slate-50 border-0 rounded-xl font-bold outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">To</label>
                <input type="time" value={newTime.end} onChange={e => setNewTime({...newTime, end: e.target.value})} className="w-full p-3 bg-slate-50 border-0 rounded-xl font-bold outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500/20" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
              <button onClick={addTimeSlot} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Add Slot</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}