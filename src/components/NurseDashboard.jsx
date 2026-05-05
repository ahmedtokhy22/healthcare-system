import React, { useState, useEffect } from 'react';
import { MapPin, CheckCircle2, Star, Clock, AlertCircle, TrendingUp } from "lucide-react";

const NurseDashboard = () => {
  // 1. تعريف الحالة للبيانات القادمة من الـ API
  const [dashboardData, setDashboardData] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // محاكاة استدعاء الـ API بناءً على الـ JSON المرسل
    // في الكود الحقيقي، ستستخدم axios.get('url/dashboard')
    const mockDashboardResponse = {
      "rate": 5.00,
      "rateNumber": 1,
      "completedAppointmentsLast30Days": 0,
      "revenueLast30Days": 0.00,
      "quickVisitCount": 0,
      "hourlyStayCount": 1,
      "todayAppointments": [
        {
          "patientName": "patientser",
          "startTime": "12:00:00",
          "status": "Confirmed",
          "serviceType": "HourlyStay",
          "hours": 4
        }
      ]
    };

    const mockProfileResponse = {
      "name": "Nurse",
      "city": "Cairo"
    };

    setDashboardData(mockDashboardResponse);
    setProfile(mockProfileResponse);
  }, []);

  if (!dashboardData || !profile) return <div className="p-10 font-bold text-center">Loading...</div>;

  // 2. تحديث الإحصائيات بالبيانات الحقيقية
  const stats = [
    { 
      label: "Rating", 
      value: dashboardData.rate.toFixed(1), 
      sub: `${dashboardData.rateNumber} Reviews`, 
      icon: <Star className="text-yellow-400" size={20}/> 
    },
    { 
      label: "Revenue (30d)", 
      value: `${dashboardData.revenueLast30Days} EGP`, 
      sub: "Monthly earnings", 
      icon: <TrendingUp className="text-green-500" size={20}/> 
    },
    { 
      label: "Hourly Stays", 
      value: dashboardData.hourlyStayCount, 
      sub: "Total long visits", 
      icon: <Clock className="text-blue-500" size={20}/> 
    },
    { 
      label: "Quick Visits", 
      value: dashboardData.quickVisitCount, 
      sub: "Pending or completed", 
      icon: <AlertCircle className="text-purple-500" size={20}/> 
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 bg-[#fcfcfd]">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Nurse Dashboard</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">
            Welcome back, <span className="text-blue-600 font-bold">{profile.name}</span>
          </p>
        </div>
        <div className="text-[10px] font-black uppercase text-slate-300 tracking-widest">
          Location: {profile.city}
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between text-slate-400 mb-4">
              <span className="text-[10px] font-black uppercase tracking-wider">{s.label}</span>
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
          <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest">Today's Schedule</h2>
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold">
            {dashboardData.todayAppointments.length} Appointments
          </span>
        </div>

        <div className="space-y-3">
          {dashboardData.todayAppointments.length > 0 ? (
            dashboardData.todayAppointments.map((item, i) => (
              <div key={i} className="group flex items-center justify-between p-5 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center justify-center bg-slate-900 text-white w-16 h-16 rounded-2xl">
                    <span className="text-[10px] font-bold opacity-60 uppercase">Start</span>
                    <span className="text-xs font-black">{item.startTime.substring(0, 5)}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">{item.patientName}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-slate-400 text-[11px] font-medium">
                        <Clock size={12}/> {item.serviceType} {item.hours ? `(${item.hours} hrs)` : ''}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                   <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide
                    ${item.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                    {item.status}
                  </span>
                  <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                    <CheckCircle2 size={20}/>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400 font-medium italic">
              No appointments scheduled for today.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NurseDashboard;