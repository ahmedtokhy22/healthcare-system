import React, { useState } from 'react';
import { 
  Activity, User, DollarSign, Star, 
  HeartPulse, Bell, Search, ChevronRight 
} from "lucide-react";

export default function DoctorDashboard() {
  const stats = [
    { label: "Today's Appts", value: "12", icon: <Activity />, color: "text-cyan-500", bg: "bg-cyan-50" },
    { label: "Total Patients", value: "284", icon: <User />, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Monthly Revenue", value: "$8,450", icon: <DollarSign />, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Avg Rating", value: "4.8", icon: <Star />, color: "text-amber-500", bg: "bg-amber-50" }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10" dir="ltr">
      {/* 1. Header Section - مطابق للصورة */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-cyan-500 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-cyan-100">
              <HeartPulse className="text-white" size={30} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Doctor Dashboard</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">Welcome back, Dr. Ahmed Ibrahim</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Search patient..." 
                className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-cyan-50 w-64 font-bold"
              />
            </div>
            <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-cyan-500 transition-all relative">
              <Bell size={20} />
              <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </div>

        {/* 2. Stats Grid - الكروت الأربعة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.8rem] border border-slate-50 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-cyan-100/20 transition-all duration-500 group">
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {React.cloneElement(stat.icon, { size: 24 })}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</h3>
              <div className="mt-4 flex items-center gap-2">
                <span className="w-8 h-1 bg-cyan-100 rounded-full overflow-hidden">
                  <span className="block w-2/3 h-full bg-cyan-500"></span>
                </span>
                <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest italic">Live Update</span>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Bottom Section - Recent Activity & Schedule Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black text-slate-800">Today's Schedule</h2>
              <button className="text-cyan-500 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                View All <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { name: "Eman nouh", time: "09:30 AM", type: "Restoration", color: "blue" },
                { name: "Ahmed Tokhy", time: "11:00 AM", type: "General", color: "cyan" }
              ].map((patient, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.8rem] border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-${patient.color}-100 rounded-xl flex items-center justify-center font-black text-${patient.color}-600`}>
                      {patient.name[0]}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-sm">{patient.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{patient.type} Visit</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-800 text-sm">{patient.time}</p>
                    <p className="text-[10px] text-cyan-500 font-black uppercase">Confirmed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-cyan-500 p-10 rounded-[3rem] shadow-xl shadow-cyan-100 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-xl font-black mb-4">Quick Tip</h2>
              <p className="text-cyan-50 text-sm font-bold leading-relaxed opacity-90">
                Regularly updating your availability helps patients find you faster. Check your schedule for next week.
              </p>
              <button className="mt-8 w-full py-4 bg-white text-cyan-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cyan-50 transition-all">
                Manage Weekly Slots
              </button>
            </div>
            <HeartPulse className="absolute -bottom-10 -right-10 text-cyan-400/20" size={200} />
          </div>
        </div>
      </div>
    </div>
  );
}