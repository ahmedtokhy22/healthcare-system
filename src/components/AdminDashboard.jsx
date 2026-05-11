import React from "react";
import { Activity, Users, Beaker, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Users", value: "1,284", icon: <Users />, color: "bg-blue-500" },
    { label: "Active Tests", value: "452", icon: <Beaker />, color: "bg-emerald-500" },
    { label: "Appointments", value: "89", icon: <Activity />, color: "bg-amber-500" },
    { label: "Revenue", value: "12,400 EGP", icon: <TrendingUp />, color: "bg-rose-500" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
            <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-inherit/20`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-2">System Status: Optimal</h3>
          <p className="text-slate-400 text-sm max-w-md">All server clusters are responding within 40ms. Database synchronization is active.</p>
        </div>
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Activity size={150} />
        </div>
      </div>
    </div>
  );
}