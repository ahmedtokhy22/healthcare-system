import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Calendar, ClipboardList, 
  UserCircle, LogOut, HeartPulse, Shield, Settings, Stethoscope
} from "lucide-react";

export default function Navbar({ role, showDropdown, setShowDropdown }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  // --- تحديث اللينكات لترتبط بملفاتك الحقيقية ---
  const navLinks = {
    Admin: [
      { name: 'Control Panel', path: '/admin/dashboard', icon: <Shield size={18}/> },
      { name: 'Users List', path: '/admin/users', icon: <Users size={18}/> },
    ],
// داخل Navbar.jsx
Doctor: [
  { name: 'Dashboard', path: '/doctor/dashboard', icon: <LayoutDashboard size={18}/> },
  { name: 'Appointments', path: '/doctor/appointments', icon: <Calendar size={18}/> },
  { name: 'My Posts', path: '/doctor/posts', icon: <ClipboardList size={18}/> }, // عدل المسار هنا لـ posts
],
    Lab: [
      { name: 'Overview', path: '/lab/dashboard', icon: <LayoutDashboard size={18}/> },
      { name: 'Appointments', path: '/lab/appointments', icon: <Calendar size={18}/> },
      { name: 'Tests Info', path: '/lab/tests', icon: <Stethoscope size={18}/> },
    ],
    Nurse: [
      { name: 'Dashboard', path: '/nurse/dashboard', icon: <LayoutDashboard size={18}/> },
      { name: 'Manage Appts', path: '/nurse/manage-appointments', icon: <Calendar size={18}/> },
    ]
  };

  const currentLinks = navLinks[role] || [];

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-100">
            <HeartPulse size={24} />
          </div>
          <span className="font-black text-slate-800 tracking-tighter text-xl hidden sm:block">
            Health<span className="text-blue-600">Care</span>
          </span>
        </div>

        {/* Navigation Links - الروابط النشطة تظهر بشكل مميز */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-[1.5rem]">
          {currentLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  isActive
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-100'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                {link.icon}
                <span className="hidden lg:block">{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-1.5 pr-4 bg-slate-50 rounded-full hover:bg-slate-100 transition-all border border-slate-100"
          >
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xs uppercase shadow-md">
              {role ? role[0] : 'U'}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-[9px] font-black text-slate-800 leading-tight uppercase tracking-tighter">{role} Account</p>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Online</p>
              </span>
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-50 p-3 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-2 border-b border-slate-50 mb-2">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Manage Account</p>
              </div>
              <Link to={`/${role?.toLowerCase()}/profile`} className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest">
                <UserCircle size={18} className="text-blue-500" /> My Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest mt-1"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}