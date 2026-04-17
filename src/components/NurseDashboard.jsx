import React from 'react';
import { MapPin, CheckCircle2, User, AlertCircle } from "lucide-react";

const NurseDashboard = () => {
  const stats = [
    { label: "Today's Visits", value: "6", sub: "Home visits scheduled", icon: <MapPin size={20}/> },
    { label: "Completed", value: "3", sub: "Visits completed today", icon: <CheckCircle2 size={20}/> },
    { label: "Total Patients", value: "48", sub: "This month", icon: <User size={20}/> },
    { label: "Requests", value: "2", sub: "Pending requests", icon: <AlertCircle size={20}/> }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-2xl font-black text-slate-800">Nurse Dashboard</h1>
        <p className="text-slate-400 text-sm font-medium">Welcome back, nurse</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between text-slate-400 mb-4">
              <span className="text-[10px] font-black uppercase tracking-wider">{s.label}</span>
              {s.icon}
            </div>
            <div className="text-3xl font-black text-slate-800 mb-1">{s.value}</div>
            <div className="text-[10px] text-slate-400 font-bold">{s.sub}</div>
          </div>
        ))}
      </div>

      <section className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-6">Today's Schedule</h2>
        <div className="space-y-2">
          {[
            { time: "9:00 AM", name: "John Smith", addr: "123 Main St", status: "Completed" },
            { time: "11:00 AM", name: "Mary Johnson", addr: "456 Oak Ave", status: "Completed" },
            { time: "2:00 PM", name: "Robert Williams", addr: "789 Pine Rd", status: "Completed" },
            { time: "4:00 PM", name: "Sarah Davis", addr: "321 Elm St", status: "Pending" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-5 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-6">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-black">{item.time}</span>
                <div>
                  <h4 className="font-bold text-slate-700">{item.name}</h4>
                  <div className="flex items-center gap-1 text-slate-400 text-[10px]"><MapPin size={10}/> {item.addr}</div>
                </div>
              </div>
              <span className={`px-4 py-1 rounded-lg text-[10px] font-black ${item.status === 'Completed' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default NurseDashboard;