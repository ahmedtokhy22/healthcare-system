import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, UserPlus, Stethoscope, FlaskConical, Activity, DollarSign, TrendingUp, Syringe, PieChart, Globe } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  useEffect(() => {
    axios.get("https://healthcare52.runasp.net/api/Admin/dashboard", { headers })
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <div className="p-10 text-center font-black text-slate-400">Loading Dashboard...</div>;

  // Standard User Count Cards
  const userCards = [
    { label: "Total Users", value: stats.totalUsers, icon: <Users />, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "New Users This Month", value: stats.newUsersThisMonth, icon: <UserPlus />, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Patients", value: stats.patientsCount, icon: <Activity />, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Doctors", value: stats.doctorsCount, icon: <Stethoscope />, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Nurses", value: stats.nursesCount, icon: <Syringe />, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Labs", value: stats.labsCount, icon: <FlaskConical />, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  // Revenue Breakdown items including the Online Revenue
  const revenueDetails = [
    { label: "Total Online Revenue", value: stats.totalOnlineRevenueLast30Days, isTotal: true },
    { label: "Doctor Revenue", value: stats.totalDoctorRevenueLast30Days },
    { label: "Lab Revenue", value: stats.totalLabRevenueLast30Days },
    { label: "Nurse Revenue", value: stats.totalNurseRevenueLast30Days },
  ];

  return (
    <div className="p-8 space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tighter uppercase text-slate-800">System Analytics</h1>
        <p className="text-slate-400 font-bold text-sm">Healthcare monitoring dashboard</p>
      </div>
      
      {/* User Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userCards.map((card, i) => (
          <div key={i} className={`${card.bg} p-6 rounded-[2rem] border border-white shadow-sm flex items-center gap-5`}>
            <div className={`${card.color} w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm`}>{card.icon}</div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-tight">{card.label}</p>
              <h3 className="text-xl font-black text-slate-800">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Breakdown - Updated Header and Online Revenue included */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-black flex items-center gap-2 text-slate-800 uppercase tracking-tight">
               <PieChart className="text-emerald-600" /> Revenue Breakdown
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-7">Last 30 Days</p>
          </div>

          <div className="space-y-6">
            {revenueDetails.map((rev, i) => (
              <div key={i} className={`flex flex-col gap-2 ${rev.isTotal ? "pb-4 border-b border-slate-50" : ""}`}>
                <div className="flex justify-between items-end px-1">
                  <span className={`uppercase font-black tracking-tight ${rev.isTotal ? "text-blue-600 text-xs" : "text-slate-500 text-[10px]"}`}>
                    {rev.label}
                  </span>
                  <span className={`font-black ${rev.isTotal ? "text-lg text-slate-800" : "text-sm text-slate-600"}`}>
                    {rev.value} <span className="text-[10px]">EGP</span>
                  </span>
                </div>
                {!rev.isTotal && (
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${(rev.value / stats.totalOnlineRevenueLast30Days) * 100 || 0}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top Specialties */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-800 uppercase tracking-tight">
             <TrendingUp className="text-blue-600" /> Top Specialties
          </h2>
          <div className="space-y-3">
            {stats.topSpecialties.map((spec, i) => (
              <div key={i} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="font-black text-slate-700 uppercase text-xs tracking-tight">{spec.specialtyName}</span>
                <span className="bg-white px-4 py-2 rounded-xl text-xs font-black text-blue-600 shadow-sm border border-slate-100">
                  {spec.appointmentsCount} Appointments
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}