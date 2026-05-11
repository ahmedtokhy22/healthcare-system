import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, CheckCircle2, Star, Clock, AlertCircle, TrendingUp, Loader2 } from "lucide-react";

const API_BASE_URL = "http://localhost:5173/api";

const NurseDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // دالة جلب البيانات من الـ API الفعلي
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/Nurses/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(res.data);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!dashboardData) return <div className="p-10 font-bold text-center">Failed to load dashboard.</div>;

  const stats = [
    { 
      label: "Rating", 
      value: dashboardData.rate?.toFixed(1) || "0.0", 
      sub: `${dashboardData.rateNumber || 0} Reviews`, 
      icon: <Star className="text-yellow-400" size={20}/> 
    },
    { 
      label: "Revenue (30d)", 
      value: `${dashboardData.revenueLast30Days?.toLocaleString() || 0} EGP`, 
      sub: "Monthly earnings", 
      icon: <TrendingUp className="text-green-500" size={20}/> 
    },
    { 
      label: "Hourly Stays", 
      value: dashboardData.hourlyStayCount || 0, 
      sub: "Total long visits", 
      icon: <Clock className="text-blue-500" size={20}/> 
    },
    { 
      label: "Quick Visits", 
      value: dashboardData.quickVisitCount || 0, 
      sub: "Completed visits", 
      icon: <AlertCircle className="text-purple-500" size={20}/> 
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 bg-[#fcfcfd]" dir="ltr">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Nurse Dashboard</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">
            You have <span className="text-blue-600 font-bold">{dashboardData.todayAppointments?.length || 0} tasks</span> for today
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <MapPin size={14} className="text-blue-500" />
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Station</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between text-slate-400 mb-4">
              <span className="text-[10px] font-black uppercase tracking-wider group-hover:text-blue-600 transition-colors">{s.label}</span>
              {s.icon}
            </div>
            <div className="text-2xl font-black text-slate-800 mb-1">{s.value}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Today's Schedule Section */}
      <section className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest">Today's Schedule</h2>
          </div>
          <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">
            {dashboardData.todayAppointments?.length || 0} Appointments
          </span>
        </div>

        <div className="space-y-4">
          {dashboardData.todayAppointments?.length > 0 ? (
            dashboardData.todayAppointments.map((item, i) => (
              <div key={i} className="group flex flex-col md:flex-row md:items-center justify-between p-6 rounded-[2rem] border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center justify-center bg-slate-900 text-white w-20 h-20 rounded-3xl shadow-lg shadow-slate-200">
                    <span className="text-[9px] font-black opacity-50 uppercase tracking-tighter">Start</span>
                    <span className="text-lg font-black">{item.startTime.substring(0, 5)}</span>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-xl tracking-tight">{item.patientName}</h4>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-100 text-slate-500 text-[11px] font-bold">
                        <Clock size={14} className="text-blue-500"/> {item.serviceType} 
                        {item.hours ? <span className="text-blue-600 ml-1">({item.hours} hrs)</span> : ''}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-slate-100">
                   <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm
                    ${item.status === 'Confirmed' ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-amber-500 text-white shadow-amber-100'}`}>
                    {item.status}
                  </span>
                  <button className="p-3 bg-white border border-slate-100 text-slate-300 hover:text-emerald-500 hover:border-emerald-100 rounded-2xl transition-all shadow-sm">
                    <CheckCircle2 size={24}/>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-slate-50 rounded-[2rem]">
              <div className="text-slate-300 font-black text-xs uppercase italic tracking-widest">
                No appointments scheduled for today.
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NurseDashboard;