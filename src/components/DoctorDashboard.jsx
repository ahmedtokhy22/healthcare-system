import React, { useState, useEffect } from 'react';
import { 
  Activity, User, DollarSign, Star, HeartPulse, Bell, 
  Loader2, TrendingUp, Calendar, MapPin, Monitor, Home, ChevronRight
} from "lucide-react";
import axios from 'axios';

export default function DoctorDashboard() {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // الرابط الخاص بالسيرفر والبيانات الأمنية
  const API_BASE = 'https://healthcare52.runasp.net/api';
  const token = localStorage.getItem('token');
  const headers = { 
    'Authorization': `Bearer ${token}`,
    'ngrok-skip-browser-warning': 'true'
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${API_BASE}/Doctors/dashboard`, { headers });
        setStatsData(res.data);
      } catch (err) { 
        console.error("Dashboard Error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchDashboard();
  }, []);

  // مصفوفة الكروت العلوية (Stats)
  const mainStats = [
    { 
      label: "Revenue (30d)", 
      value: `$${statsData?.revenueLast30Days?.toLocaleString() || "0"}`, 
      sub: `Online: $${statsData?.onlineRevenueLast30Days?.toLocaleString() || "0"}`,
      icon: <DollarSign />, 
      color: "text-emerald-500", bg: "bg-emerald-50" 
    },
    { 
      label: "Completed Appts", 
      value: statsData?.completedAppointmentsLast30Days ?? "0", 
      sub: "Last 30 days",
      icon: <Activity />, 
      color: "text-cyan-500", bg: "bg-cyan-50" 
    },
    { 
      label: "Total Rating", 
      value: statsData?.rate?.toFixed(1) ?? "0.0", 
      sub: `${statsData?.rateNumber || 0} reviews`,
      icon: <Star />, 
      color: "text-amber-500", bg: "bg-amber-50" 
    },
    { 
      label: "Today's Schedule", 
      value: statsData?.todayAppointments?.length ?? "0", 
      sub: "Active bookings",
      icon: <Calendar />, 
      color: "text-indigo-500", bg: "bg-indigo-50" 
    }
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <Loader2 className="animate-spin text-cyan-500" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-slate-200">
              <HeartPulse className="text-cyan-400" size={32} />
            </div>
            <div>
              {/* عرض اسم الدكتور الأول في الترحيب */}
              <h1 className="text-4xl font-black tracking-tighter text-slate-800">
                Welcome, Dr. {statsData?.name?.split(' ')[0] || "Doctor"}
              </h1>
              <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live Performance Metrics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
                <p className="text-[10px] font-black text-slate-400 uppercase">Current Session</p>
                {/* عرض الاسم الكامل ديناميكيًا من السيرفر */}
                <p className="font-bold text-slate-700">
                  {statsData?.name || "Doctor Profile"}
                </p>
             </div>
             <button className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-cyan-500 transition-all relative">
                <Bell size={20} />
                <span className="absolute top-4 right-4 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
             </button>
          </div>
        </div>

        {/* --- Top Stats Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {mainStats.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</h3>
              <p className="text-xs font-bold text-slate-400 mt-2">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- Today's Appointments Table --- */}
          <div className="lg:col-span-2 bg-white rounded-[3rem] p-8 shadow-sm border border-slate-50">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
                 <Calendar className="text-cyan-500" /> Today's Appointments
               </h2>
               <span className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black text-slate-400 uppercase">
                 {statsData?.todayAppointments?.length || 0} Total
               </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50">
                    <th className="pb-4">Patient</th>
                    <th className="pb-4">Time</th>
                    <th className="pb-4">Type</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {statsData?.todayAppointments?.map((appt, idx) => (
                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-5 font-bold text-slate-700">{appt.patientName}</td>
                      <td className="py-5">
                        <span className="text-xs font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                          {appt.startTime.substring(0,5)} - {appt.endTime.substring(0,5)}
                        </span>
                      </td>
                      <td className="py-5">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          {appt.appointmentType === 'OnSiteVisit' ? <MapPin size={14} className="text-orange-400"/> : <Monitor size={14} className="text-blue-400"/>}
                          {appt.appointmentType}
                        </div>
                      </td>
                      <td className="py-5">
                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!statsData?.todayAppointments || statsData.todayAppointments.length === 0) && (
                    <tr>
                      <td colSpan="4" className="py-10 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
                        No appointments for today
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* --- Distribution & Types --- */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl shadow-slate-200 relative overflow-hidden">
               <TrendingUp className="absolute right-6 top-6 text-cyan-400 opacity-20" size={80} />
               <h2 className="text-xl font-black mb-8 relative z-10">Appointment Types</h2>
               
               <div className="space-y-6 relative z-10">
                  {[
                    { label: "Online", count: statsData?.onlineAppointmentsCount || 0, color: "bg-blue-400", icon: <Monitor size={14}/> },
                    { label: "On-Site", count: statsData?.onsiteAppointmentsCount || 0, color: "bg-orange-400", icon: <MapPin size={14}/> },
                    { label: "Home", count: statsData?.homeAppointmentsCount || 0, color: "bg-emerald-400", icon: <Home size={14}/> },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs font-black uppercase mb-2 tracking-widest">
                        <span className="flex items-center gap-2">{item.icon} {item.label}</span>
                        <span>{item.count}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color} transition-all duration-1000`} 
                          style={{ width: `${(item.count / (statsData?.onlineAppointmentsCount + statsData?.onsiteAppointmentsCount + statsData?.homeAppointmentsCount || 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-cyan-500 rounded-[2.5rem] p-6 text-white flex items-center justify-between group cursor-pointer hover:bg-cyan-600 transition-all">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Ready to work?</p>
                  <h3 className="font-black text-lg">Manage Schedule</h3>
               </div>
               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:translate-x-2 transition-transform">
                  <ChevronRight />
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}