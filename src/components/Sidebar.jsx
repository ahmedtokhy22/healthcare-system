import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, CalendarCheck2, FileText, 
  UserCircle, Settings, LogOut, Stethoscope, Users 
} from "lucide-react";

export default function Sidebar() {
  // 1. جلب الرول من التخزين (افترضنا أنك بتخزنه باسم userRole عند تسجيل الدخول)
  const userRole = localStorage.getItem('userRole')?.toLowerCase() || 'doctor'; 

  // 2. تعريف كل اللينكات الممكنة مع تحديد مين مسموح له يشوف إيه
  const allMenuItems = [
    { 
      name: "Dashboard", 
      icon: <LayoutDashboard size={22} />, 
      path: "/admin/dashboard",
      roles: ['admin', 'doctor', 'nurse', 'lab'] // الكل بيشوفها
    },
    { 
      name: "Users List", 
      icon: <Users size={22} />, 
      path: "/admin/users", 
      roles: ['admin'] // الأدمن بس اللي بيشوف قائمة المستخدمين
    },
    { 
      name: "Appointments", 
      icon: <CalendarCheck2 size={22} />, 
      path: "/admin/appointments",
      roles: ['admin', 'doctor'] 
    },
    { 
      name: "My Posts", 
      icon: <FileText size={22} />, 
      path: "/admin/posts",
      roles: ['doctor'] // الدكتور بس اللي بينزل بوستات
    },
    { 
      name: "Profile", 
      icon: <UserCircle size={22} />, 
      path: userRole === 'doctor' ? "/doctor/profile" : "/admin/profile", 
      roles: ['doctor', 'nurse', 'lab'] 
    },
  ];

  // 3. تصفية اللينكات بناءً على رول المستخدم الحالي
  const filteredMenu = allMenuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="h-screen w-72 bg-white border-r border-slate-100 flex flex-col p-6 fixed left-0 top-0 shadow-sm" dir="ltr">
      
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <Stethoscope size={24} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-slate-800 leading-tight">HealthCare</h1>
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{userRole} Portal</span>
        </div>
      </div>

      {/* Navigation Links - الروابط المفلترة ذكياً */}
      <nav className="flex-1 space-y-3">
        {filteredMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-5 py-4 rounded-[1.5rem] font-bold transition-all duration-300
              ${isActive 
                ? "bg-blue-600 text-white shadow-xl shadow-blue-100 translate-x-[8px]" 
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}
            `}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-slate-50 space-y-2">
        <button className="flex items-center gap-4 px-5 py-4 w-full text-slate-400 font-bold hover:text-blue-600 transition-colors group">
          <Settings size={22} className="group-hover:rotate-90 transition-transform duration-500" />
          <span>Settings</span>
        </button>
        <button 
          onClick={() => { localStorage.clear(); window.location.href = '/'; }}
          className="flex items-center gap-4 px-5 py-4 w-full text-red-400 font-bold hover:bg-red-50 rounded-2xl transition-all"
        >
          <LogOut size={22} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}