import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, UserPlus, Stethoscope, FlaskConical, Activity, DollarSign, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  useEffect(() => {
    axios.get("https://healthcare52.runasp.net/api/Admin/dashboard", { headers })
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <div className="p-10 text-center font-black text-slate-400">Loading Dashboard...</div>;

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: <Users />, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "New Users", value: stats.newUsersThisMonth, icon: <UserPlus />, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Patients", value: stats.patientsCount, icon: <Activity />, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Doctors", value: stats.doctorsCount, icon: <Stethoscope />, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Total Revenue", value: `${stats.totalOnlineRevenueLast30Days} EGP`, icon: <DollarSign />, color: "text-blue-700", bg: "bg-blue-100" },
  ];

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-4xl font-black tracking-tighter">System Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <div key={i} className={`${card.bg} p-8 rounded-[2.5rem] border border-white shadow-sm flex items-center gap-6`}>
            <div className={`${card.color} w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm`}>{card.icon}</div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{card.label}</p>
              <h3 className="text-2xl font-black text-slate-800">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
        <h2 className="text-xl font-black mb-8 flex items-center gap-2 text-slate-800">
           <TrendingUp className="text-blue-600" /> Top Performing Specialties
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.topSpecialties.map((spec, i) => (
            <div key={i} className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-black text-slate-700 uppercase text-sm">{spec.specialtyName}</span>
              <span className="bg-white px-4 py-2 rounded-xl text-xs font-black text-blue-600 shadow-sm border border-slate-100">
                {spec.appointmentsCount} Appts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}