import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Calendar, ClipboardList, 
  UserCircle, LogOut, HeartPulse, Shield, 
  Stethoscope, MessageSquare, Clock, UserPlus
} from "lucide-react";

export default function Navbar({ role, showDropdown, setShowDropdown }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  // تعريف الروابط بناءً على الأدوار مع إضافة أقسام الإدارة الجديدة
  const navLinks = {
    Admin: [
      { name: 'Control Panel', path: '/admin/dashboard', icon: <Shield size={18}/> },
      { name: 'Users List', path: '/admin/users', icon: <Users size={18}/> },
      {name: 'lab Tests', path: '/admin/tests', icon: <Stethoscope size={18}/> }, // جديد لإدارة التحاليل
      { name: 'Specialties', path: '/admin/specialties', icon: <Stethoscope size={18}/> }, // جديد لإدارة التخصصات
      { name: 'System Posts', path: '/admin/posts', icon: <ClipboardList size={18}/> }, // جديد لإدارة المنشورات
    ],
    Doctor: [
      { name: 'Dashboard', path: '/doctor/dashboard', icon: <LayoutDashboard size={18}/> },
      { name: 'Appointments', path: '/doctor/appointments', icon: <Calendar size={18}/> },
      { name: 'Requests', path: '/doctor/pending-requests', icon: <Clock size={18}/> },
      { name: 'My Posts', path: '/doctor/posts', icon: <ClipboardList size={18}/> },
      { name: 'Chat', path: '/doctor/chat', icon: <MessageSquare size={18}/> },
    ],
    Lab: [
      { name: 'Overview', path: '/lab/dashboard', icon: <LayoutDashboard size={18}/> },
      { name: 'Appointments', path: '/lab/appointments', icon: <Calendar size={18}/> },
      { name: 'Requests', path: '/lab/pending-requests', icon: <Clock size={18}/> },
      { name: 'Tests Info', path: '/lab/tests', icon: <Stethoscope size={18}/> }, //
    ],
    Nurse: [
      { name: 'Dashboard', path: '/nurse/dashboard', icon: <LayoutDashboard size={18}/> },
      { name: 'Requests', path: '/nurse/pending-requests', icon: <Clock size={18}/> },
      { name: 'Nurse Appointments', path: '/nurse/manage-appointments', icon: <Calendar size={18}/> }
    ]
  };

  const currentLinks = navLinks[role] || [];

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-100 transition-transform hover:scale-105">
            <HeartPulse size={24} />
          </div>
          <span className="font-black text-slate-800 tracking-tighter text-xl hidden sm:block">
            Health<span className="text-blue-600">Care</span>
          </span>
        </div>

        {/* Navigation Links - Dynamic based on Role */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-[1.5rem] border border-slate-100/50 overflow-x-auto no-scrollbar max-w-[60%] lg:max-w-none">
          {currentLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                  isActive
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-100 scale-105'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                }`}
              >
                {link.icon}
                <span className="hidden xl:block">{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* User Dropdown Profile Area */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-1.5 pr-4 bg-slate-50 rounded-full hover:bg-slate-100 transition-all border border-slate-100 active:scale-95"
          >
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xs uppercase shadow-md border-2 border-white">
              {role ? role[0] : 'U'}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-[9px] font-black text-slate-800 leading-tight uppercase tracking-tighter">
                {role || 'Guest'} Account
              </p>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Active Now</p>
              </span>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              <div className="fixed inset-0 z-[-1]" onClick={() => setShowDropdown(false)}></div>
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-50 p-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-slate-50 mb-2">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Account Settings</p>
                </div>
                
                <Link 
                  to={`/${role?.toLowerCase()}/profile`} 
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest group"
                >
                  <UserCircle size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" /> 
                  My Profile
                </Link>

                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest mt-1 group"
                >
                  <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> 
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}