import React, { useState } from 'react';
import { Calendar, Trash2, X, Plus } from "lucide-react";

export default function DoctorSchedule() {
  const [schedule, setSchedule] = useState([
    { day: "Monday 2/9/2026", slots: ["09:00", "09:30", "10:00", "10:30", "11:00"] },
    { day: "Tuesday 2/10/2026", slots: ["09:00", "09:30", "11:00"] }
  ]);

  const removeSlot = (dIdx, sIdx) => {
    const updated = [...schedule];
    updated[dIdx].slots.splice(sIdx, 1);
    setSchedule(updated);
  };

  const removeDay = (dIdx) => {
    setSchedule(schedule.filter((_, i) => i !== dIdx));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-black text-slate-800">Weekly Schedule</h2>
        <button className="bg-cyan-500 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-lg shadow-cyan-100">Repeat Previous Week</button>
      </div>

      <div className="space-y-6">
        {schedule.map((day, dIdx) => (
          <div key={dIdx} className="bg-white p-8 rounded-[3rem] border border-blue-50 shadow-sm relative group">
            <div className="flex justify-between items-center mb-6">
              <span className="font-black text-slate-700 uppercase text-xs tracking-widest">{day.day}</span>
              <button onClick={() => removeDay(dIdx)} className="text-red-300 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
            </div>
            <div className="flex flex-wrap gap-3">
              {day.slots.map((slot, sIdx) => (
                <div key={sIdx} className="bg-cyan-50 text-cyan-600 px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-3 border border-cyan-100">
                  {slot} (30min)
                  <button onClick={() => removeSlot(dIdx, sIdx)} className="hover:text-red-500"><X size={14}/></button>
                </div>
              ))}
              <button className="p-3 border-2 border-dashed border-slate-100 rounded-2xl text-slate-300 hover:border-cyan-200 transition-all"><Plus size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}