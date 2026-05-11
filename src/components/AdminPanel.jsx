import React from "react";
import { Users, Beaker, FileText, Stethoscope, Activity } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminPanel() {
  const stats = [
    { label: "إدارة المستخدمين", value: "1,284", icon: <Users />, color: "bg-blue-500", path: "/admin/users" },
    { label: "التحاليل العامة", value: "452", icon: <Beaker />, color: "bg-emerald-500", path: "/admin/tests" },
    { label: "طلبات المنشورات", value: "12", icon: <FileText />, color: "bg-amber-500", path: "/admin/posts" },
    { label: "التخصصات الطبية", value: "24", icon: <Stethoscope />, color: "bg-rose-500", path: "/admin/specialties" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-black text-slate-800 tracking-tighter">لوحة تحكم النظام</h1>
        <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">إدارة شاملة للمستخدمين، التحاليل، والمحتوى الطبي</p>
      </header>

      {/* بطاقات الإحصائيات الـ Interactive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Link key={i} to={stat.path} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all group">
            <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
          </Link>
        ))}
      </div>

      {/* حالة النظام - System Status */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-2">حالة النظام: مثالية ✅</h3>
          <p className="text-slate-400 text-sm max-w-md">جميع السيرفرات تعمل بكفاءة. زمن الاستجابة الحالي 32ms. قاعدة البيانات متزامنة بالكامل.</p>
        </div>
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Activity size={150} />
        </div>
      </div>
    </div>
  );
}