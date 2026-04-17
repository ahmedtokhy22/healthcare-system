import React, { useState, useEffect } from 'react';
import { TestTube, Home, DollarSign, Activity, TrendingUp } from "lucide-react";

export default function LabDashboard() {
  // 1. محاكاة لبيانات قادمة من الـ Database
  const [statsData, setStatsData] = useState({
    totalTests: 1420,
    homeVisits: 86,
    revenue: 28400,
    uptime: "100%"
  });

  const [popularTests, setPopularTests] = useState([
    { name: "CBC (Blood Test)", count: 450, total: 600, color: "bg-blue-500" },
    { name: "Lipid Panel", count: 320, total: 600, color: "bg-green-500" },
    { name: "HbA1c", count: 280, total: 600, color: "bg-purple-500" },
  ]);

  // لإضافة تأثير حركة الـ Bars عند التحميل
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
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

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard 
          title="Tests Performed" 
          value={statsData.totalTests.toLocaleString()} 
          sub="+12% this month" 
          icon={<TestTube size={20}/>} 
          color="text-blue-500" 
          trend="up"
        />
        <StatCard 
          title="Home Visits" 
          value={statsData.homeVisits} 
          sub="+5 today" 
          icon={<Home size={20}/>} 
          color="text-green-500" 
          trend="up"
        />
        <StatCard 
          title="Lab Revenue" 
          value={`$${statsData.revenue.toLocaleString()}`} 
          sub="+8% increase" 
          icon={<DollarSign size={20}/>} 
          color="text-purple-500" 
          trend="up"
        />
        <StatCard 
          title="System Uptime" 
          value={statsData.uptime} 
          sub="No issues reported" 
          icon={<Activity size={20}/>} 
          color="text-cyan-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Popular Tests Chart Section */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm lg:col-span-1">
          <div className="flex justify-between items-center mb-10">
            <h4 className="font-black text-slate-700 flex items-center gap-2 underline decoration-blue-100 decoration-4 underline-offset-8">
                Popular Tests
            </h4>
            <TrendingUp size={16} className="text-slate-300" />
          </div>
          
          <div className="space-y-8">
            {popularTests.map((test, index) => (
              <ProgressBar 
                key={index}
                label={test.name} 
                value={test.count} 
                color={test.color} 
                // حساب النسبة المئوية آلياً
                percentage={isLoaded ? `${(test.count / test.total) * 100}%` : '0%'} 
              />
            ))}
          </div>
          
          <button className="w-full mt-10 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all">
            View Full Report
          </button>
        </div>

        {/* مساحة إضافية ممكن تحط فيها "Recent Activity" أو "Quick Actions" */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-xl shadow-blue-100">
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="space-y-4">
                    <h3 className="text-4xl font-black tracking-tighter">Welcome Back, <br/>Admin Panel</h3>
                    <p className="text-blue-100/70 text-sm font-medium max-w-xs">Everything is running smoothly. You have 3 pending test results to upload today.</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">New Report</button>
                    <button className="bg-blue-500/30 backdrop-blur-md border border-blue-400/30 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500/50 transition-all">Support</button>
                </div>
            </div>
            {/* زخرفة خلفية */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute top-0 right-0 p-10 opacity-20">
                <Activity size={150} />
            </div>
        </div>
      </div>
    </div>
  );
}

// Components مساعدة
const StatCard = ({ title, value, sub, icon, color, trend }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col justify-between h-52 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-500 group">
    <div className="flex justify-between items-start">
      <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">{title}</span>
      <div className={`p-4 bg-slate-50 rounded-[1.2rem] ${color} group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
        {icon}
      </div>
    </div>
    <div className="space-y-1">
      <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{value}</h3>
      <div className="flex items-center gap-1.5">
        {trend === 'up' && <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>}
        <p className="text-slate-400 text-[10px] font-bold italic">{sub}</p>
      </div>
    </div>
  </div>
);

const ProgressBar = ({ label, value, color, percentage }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-end">
      <span className="text-[11px] font-black text-slate-600 tracking-tight">{label}</span>
      <span className="text-[12px] font-black text-slate-400">{value} <span className="text-[9px] opacity-50">tests</span></span>
    </div>
    <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
      <div 
        className={`h-full ${color} rounded-full transition-all duration-1000 ease-out shadow-sm`} 
        style={{ width: percentage }}
      ></div>
    </div>
  </div>
);