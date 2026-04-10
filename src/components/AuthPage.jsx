import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Lock, Mail, Eye, EyeOff, Loader2, AlertCircle, HeartPulse } from "lucide-react";
import api from '../api/axios'; 

export default function AuthPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post('/api/Auth/login', formData); 
      const { token, role } = response.data;
      
      // حفظ البيانات الأساسية
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // التوجيه الذكي بناءً على الرتبة (Universal Redirect)
      // ده هيحول المستخدم لـ /doctor/dashboard أو /nurse/dashboard أو /lab/dashboard أوتوماتيك
      const userRole = role.toLowerCase();
      
      // لو الدكتور عايز يفتح البروفايل أول ما يدخل ممكن تسيبها كده، 
      // بس الأفضل يروح للـ Dashboard عشان يشوف شغله الأول
      if (role === 'Doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate(`/${userRole}/dashboard`);
      }

    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center p-4" dir="ltr">
      {/* Login Card */}
      <div className="w-full max-w-[440px] bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(186,230,253,0.4)] p-12 border border-blue-50 relative overflow-hidden">
        
        {/* Background Glow */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-50 rounded-full blur-3xl opacity-60"></div>
        
        {/* Logo Section */}
        <div className="text-center mb-10 relative">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-cyan-50 rounded-[2.2rem] mb-5 group">
            <HeartPulse className="w-10 h-10 text-cyan-500 animate-pulse" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Health Portal</h1>
          <p className="text-cyan-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Medical System Access</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold border border-red-100 animate-in fade-in zoom-in">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" 
                required
                placeholder="doctor@healthcare.com"
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] outline-none focus:ring-4 focus:ring-cyan-50 focus:bg-white focus:border-cyan-200 transition-all font-bold text-sm text-slate-700"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder="••••••••"
                className="w-full pl-14 pr-14 py-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] outline-none focus:ring-4 focus:ring-cyan-50 focus:bg-white focus:border-cyan-200 transition-all font-bold text-sm text-slate-700"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-cyan-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-cyan-500 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-widest hover:bg-cyan-600 shadow-xl shadow-cyan-100 transition-all duration-300 flex items-center justify-center gap-3 mt-4 disabled:bg-slate-200"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Login To Portal"}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
            Authorized Medical Staff Only
          </p>
        </div>
      </div>
    </div>
  );
}