import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { TestTube, Home, DollarSign, Activity, TrendingUp, Star, CheckCircle, Clock, User, Calendar } from "lucide-react";

const API_BASE_URL = "http://localhost:5173/api";

export default function LabDashboard() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/Labs/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApiData(res.data);
        setIsLoaded(true);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [token]);

  // حساب إجمالي الحجوزات
  const totalBookings = useMemo(() => {
    if (!apiData) return 0;
    return apiData.homeAppointmentsCount + apiData.onsiteAppointmentsCount;
  }, [apiData]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
      <Activity className="text-blue-500 animate-spin mb-4" size={40} />
      <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Syncing Dashboard Data...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans p-2">
      
      {/* Header */}
      <div className="flex justify-between items-center text-left">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Lab Overview</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2 italic flex items-center gap-2">
            <Activity size={14} className="text-blue-500"/> Real-time Analytics
          </p>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Appointments" 
          value={totalBookings} 
          sub={`${apiData.onsiteAppointmentsCount} On-site / ${apiData.homeAppointmentsCount} Home`} 
          icon={<Calendar size={20}/>} 
          color="text-blue-500" 
        />
        <StatCard 
          title="Lab Rating" 
          value={apiData.rate.toFixed(1)} 
          sub={`Based on ${apiData.rateNumber} reviews`} 
          icon={<Star size={20}/>} 
          color="text-orange-500" 
        />
        <StatCard 
          title="Revenue (30d)" 
          value={`${apiData.revenueLast30Days.toLocaleString()} EGP`} 
          sub="Earnings since last month" 
          icon={<DollarSign size={20}/>} 
          color="text-purple-500" 
        />
        <StatCard 
          title="Completed" 
          value={apiData.completedAppointmentsLast30Days} 
          sub="Results delivered" 
          icon={<CheckCircle size={20}/>} 
          color="text-green-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Most Booked Tests */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm lg:col-span-1 text-left">
          <div className="flex justify-between items-center mb-10">
            <h4 className="font-black text-slate-700 flex items-center gap-2 underline decoration-blue-100 decoration-4 underline-offset-8">
                Most Booked
            </h4>
            <TrendingUp size={16} className="text-slate-300" />
          </div>
          <div className="space-y-8">
            {apiData.mostBookedTests.map((test, index) => (
              <ProgressBar 
                key={index}
                label={test.testName} 
                value={test.bookingCount} 
                color={index === 0 ? "bg-blue-600" : "bg-indigo-400"} 
                percentage={isLoaded ? `${(test.bookingCount / totalBookings) * 100}%` : '0%'} 
              />
            ))}
          </div>
        </div>

        {/* Today's Schedule - New Section from JSON */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm text-left">
           <h4 className="font-black text-slate-700 mb-8 flex items-center gap-2 underline decoration-green-100 decoration-4 underline-offset-8">
              Today's Schedule
           </h4>
           <div className="space-y-4">
              {apiData.todayAppointments.length > 0 ? (
                apiData.todayAppointments.map((app, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] hover:bg-slate-100 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-2xl shadow-sm group-hover:text-blue-600 transition-colors">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-sm">{app.patientName}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{app.tests.join(', ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="text-right">
                          <div className="flex items-center gap-1 text-blue-600 font-black text-xs">
                             <Clock size={12} /> {app.startTime.substring(0, 5)}
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-widest ${app.status === 'Confirmed' ? 'text-green-500' : 'text-orange-500'}`}>
                            {app.status}
                          </span>
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 opacity-30">
                  <Calendar size={40} className="mx-auto mb-2" />
                  <p className="text-sm font-black italic">No appointments for today</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}

// Components remain similar but optimized for alignment
const StatCard = ({ title, value, sub, icon, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col justify-between h-52 hover:shadow-xl transition-all duration-500 group text-left">
    <div className="flex justify-between items-start">
      <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</span>
      <div className={`p-4 bg-slate-50 rounded-[1.2rem] ${color} group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
    </div>
    <div className="space-y-1">
      <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{value}</h3>
      <p className="text-slate-400 text-[9px] font-bold italic">{sub}</p>
    </div>
  </div>
);

const ProgressBar = ({ label, value, color, percentage }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-end">
      <span className="text-[11px] font-black text-slate-600">{label}</span>
      <span className="text-[12px] font-black text-slate-400">{value} <span className="text-[9px] opacity-50 uppercase">booked</span></span>
    </div>
    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} style={{ width: percentage }}></div>
    </div>
  </div>
);