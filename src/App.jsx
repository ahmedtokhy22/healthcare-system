import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { HeartPulse, User, LogOut, ChevronDown, LayoutDashboard, Calendar, FlaskConical, Users, ShieldCheck } from "lucide-react";

// استيراد المكونات (تأكد من المسارات)
import AuthPage from './components/AuthPage';
import DoctorDashboard from './components/DoctorDashboard';
import DoctorManageAppointments from './components/DoctorManageAppointments';
import DoctorPosts from './components/DoctorPosts';
import DoctorProfile from './components/DoctorProfile';

// مكون حماية المسارات (ProtectedRoute)
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // يتم تخزينه عند الـ Login (مثلاً: Doctor, Nurse, Lab, Admin)

  if (!token) return <Navigate to="/" replace />;
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to={`/${userRole.toLowerCase()}/dashboard`} replace />;
  }
  return children;
};

// مكون الـ Navbar الموحد
const Navbar = ({ role, showDropdown, setShowDropdown }) => {
  const location = useLocation();
  
  // وظيفة لتحديد اللينكات بناءً على الدور
  const getLinks = () => {
    switch (role) {
      case 'Doctor':
        return [
          { to: "/doctor/dashboard", label: "Dashboard" },
          { to: "/doctor/appointments", label: "Appointments" },
          { to: "/doctor/posts", label: "My Posts" },
        ];
      case 'Nurse':
        return [
          { to: "/nurse/dashboard", label: "Overview" },
          { to: "/nurse/patients", label: "Patients List" },
        ];
      case 'Lab':
        return [
          { to: "/lab/dashboard", label: "Test Requests" },
          { to: "/lab/results", label: "Upload Results" },
        ];
      case 'Admin':
        return [
          { to: "/admin/dashboard", label: "System Stats" },
          { to: "/admin/users", label: "Manage Staff" },
        ];
      default: return [];
    }
  };

  return (
    <nav className="bg-white border-b border-slate-100 px-8 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <HeartPulse className="text-cyan-500" size={28} />
          <span className="font-black text-slate-800 text-lg tracking-tight">HealthCare <span className="text-cyan-500 text-[10px] uppercase">{role}</span></span>
        </div>

        <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1">
          {getLinks().map(link => (
            <Link 
              key={link.to}
              to={link.to} 
              className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                location.pathname === link.to ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="relative">
          <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-black shadow-lg shadow-cyan-100">
              {role[0]}
            </div>
            <ChevronDown size={14} className={`text-slate-300 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-52 bg-white rounded-[2rem] shadow-xl border border-slate-50 py-2 z-50">
              <Link to={`/${role.toLowerCase()}/profile`} onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-5 py-3 text-slate-600 hover:bg-slate-50 text-[11px] font-black uppercase tracking-widest transition-colors">
                <User size={16} /> My Profile
              </Link>
              <button onClick={() => { localStorage.clear(); window.location.href="/"; }} className="w-full flex items-center gap-3 px-5 py-3 text-red-400 hover:bg-red-50 text-[11px] font-black uppercase tracking-widest transition-colors">
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  const [showDropdown, setShowDropdown] = useState(false);
  const userRole = localStorage.getItem('role'); // جلب الدور المخزن

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />

        {/* --- مجموعة مسارات الدكتور --- */}
        <Route path="/doctor/*" element={
          <ProtectedRoute allowedRole="Doctor">
            <div className="min-h-screen bg-[#f8fafc]">
              <Navbar role="Doctor" showDropdown={showDropdown} setShowDropdown={setShowDropdown} />
              <Routes>
                <Route path="dashboard" element={<DoctorDashboard />} />
                <Route path="appointments" element={<DoctorManageAppointments />} />
                <Route path="posts" element={<DoctorPosts />} />
                <Route path="profile" element={<DoctorProfile />} />
                <Route path="*" element={<Navigate to="dashboard" />} />
              </Routes>
            </div>
          </ProtectedRoute>
        } />

        {/* --- مجموعة مسارات الممرضة --- */}
        <Route path="/nurse/*" element={
          <ProtectedRoute allowedRole="Nurse">
            <div className="min-h-screen bg-[#f8fafc]">
              <Navbar role="Nurse" showDropdown={showDropdown} setShowDropdown={setShowDropdown} />
              <Routes>
                <Route path="dashboard" element={<div>Nurse Dashboard Page</div>} />
                <Route path="patients" element={<div>Patients Management</div>} />
                <Route path="*" element={<Navigate to="dashboard" />} />
              </Routes>
            </div>
          </ProtectedRoute>
        } />

        {/* --- مجموعة مسارات المعمل --- */}
        <Route path="/lab/*" element={
          <ProtectedRoute allowedRole="Lab">
            <div className="min-h-screen bg-[#f8fafc]">
              <Navbar role="Lab" showDropdown={showDropdown} setShowDropdown={setShowDropdown} />
              <Routes>
                <Route path="dashboard" element={<div>Laboratory Dashboard</div>} />
                <Route path="*" element={<Navigate to="dashboard" />} />
              </Routes>
            </div>
          </ProtectedRoute>
        } />

        {/* --- مجموعة مسارات الأدمن --- */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRole="Admin">
            <div className="min-h-screen bg-[#f8fafc]">
              <Navbar role="Admin" showDropdown={showDropdown} setShowDropdown={setShowDropdown} />
              <Routes>
                <Route path="dashboard" element={<div>Admin Control Panel</div>} />
                <Route path="*" element={<Navigate to="dashboard" />} />
              </Routes>
            </div>
          </ProtectedRoute>
        } />

        {/* أي مسار غير معروف يرجع للرئيسية */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;