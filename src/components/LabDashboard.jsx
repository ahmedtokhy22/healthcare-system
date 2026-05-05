import React, { useState, useEffect, useMemo } from 'react';
import { TestTube, Home, DollarSign, Activity, TrendingUp, Star, CheckCircle } from "lucide-react";

export default function LabDashboard() {
  // 1. ربط البيانات القادمة من الـ API (الـ JSON اللي بعته)
  const [apiData] = useState({
    rate: 4.00,
    rateNumber: 1,
    completedAppointmentsLast30Days: 0,
    revenueLast30Days: 0.00,
    homeAppointmentsCount: 0,
    onsiteAppointmentsCount: 6,
    mostBookedTests: [
        { testName: "Fasting Blood Sugar (FBS)", bookingCount: 5 },
        { testName: "CBC", bookingCount: 2 }
    ]
  });

  // لإضافة تأثير حركة الـ Bars عند التحميل
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // حساب إجمالي الحجوزات
  const totalBookings = useMemo(() => apiData.homeAppointmentsCount + apiData.onsiteAppointmentsCount, [apiData]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans p-2">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="text-left">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Lab Overview</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2 italic flex items-center gap-2">
            <Activity size={14} className="text-blue-500"/> Performance Statistics
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-50 shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Live System Status</span>
        </div>
      </div>

      {/* 4 Stats Cards - Linked to API */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Appointments" 
          value={totalBookings} 
          sub={`${apiData.onsiteAppointmentsCount} On-site / ${apiData.homeAppointmentsCount} Home`} 
          icon={<TestTube size={20}/>} 
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
          sub="Last 30 days earnings" 
          icon={<DollarSign size={20}/>} 
          color="text-purple-500" 
        />
        <StatCard 
          title="Completed" 
          value={apiData.completedAppointmentsLast30Days} 
          sub="Tests successfully delivered" 
          icon={<CheckCircle size={20}/>} 
          color="text-green-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Popular Tests Section - Linked to mostBookedTests */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm lg:col-span-1">
          <div className="flex justify-between items-center mb-10">
            <h4 className="font-black text-slate-700 flex items-center gap-2 underline decoration-blue-100 decoration-4 underline-offset-8">
                Most Booked
            </h4>
            <TrendingUp size={16} className="text-slate-300" />
          </div>
          
          <div className="space-y-8 text-left">
            {apiData.mostBookedTests.map((test, index) => (
              <ProgressBar 
                key={index}
                label={test.testName} 
                value={test.bookingCount} 
                color={index === 0 ? "bg-blue-500" : "bg-indigo-400"} 
                // حساب النسبة بناءً على إجمالي الحجوزات
                percentage={isLoaded ? `${(test.bookingCount / totalBookings) * 100}%` : '0%'} 
              />
            ))}
          </div>
        </div>

        {/* Welcome Area */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 h-full flex flex-col justify-between text-left">
                <div className="space-y-4">
                    <h3 className="text-4xl font-black tracking-tighter">Welcome Back, <br/>Lab Administrator</h3>
                    <p className="text-slate-400 text-sm font-medium max-w-xs">Your laboratory is active. All systems are synchronized with the central database.</p>
                </div>
                <div className="flex gap-4 mt-8">
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all">Generate Report</button>
                    <button className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all">View Logs</button>
                </div>
            </div>
            {/* Decoration */}
            <div className="absolute top-0 right-0 p-10 opacity-10">
                <Activity size={180} />
            </div>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
const StatCard = ({ title, value, sub, icon, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col justify-between h-52 hover:shadow-xl transition-all duration-500 group text-left">
    <div className="flex justify-between items-start">
      <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">{title}</span>
      <div className={`p-4 bg-slate-50 rounded-[1.2rem] ${color} group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
    </div>
    <div className="space-y-1">
      <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{value}</h3>
      <p className="text-slate-400 text-[10px] font-bold italic">{sub}</p>
    </div>
  </div>
);

// Progress Bar Component
const ProgressBar = ({ label, value, color, percentage }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-end">
      <span className="text-[11px] font-black text-slate-600 tracking-tight">{label}</span>
      <span className="text-[12px] font-black text-slate-400">{value} <span className="text-[9px] opacity-50">bookings</span></span>
    </div>
    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} 
        style={{ width: percentage }}
      ></div>
    </div>
  </div>
);