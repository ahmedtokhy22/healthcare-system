import React, { useState } from 'react';
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";

// التعديل الأساسي: إضافة export default
export default function ResetPasswordPage({ onNext, onBack }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (onNext) {
      onNext({ password });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8faff] p-4">
      <div className="w-full max-w-[480px] bg-white rounded-[35px] shadow-2xl p-12 text-center animate-in zoom-in duration-500">
        <div className="flex justify-center mb-6 text-blue-500 bg-blue-50 w-20 h-20 items-center rounded-full mx-auto">
          <Lock size={40} strokeWidth={1.5} />
        </div>
        
        <h2 className="text-2xl font-black text-slate-800 mb-2">Reset Password</h2>
        <p className="text-slate-400 text-sm font-medium mb-10 px-4">
          Please enter your new password below to secure your account.
        </p>

        <form className="space-y-6 text-left" onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••" 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
            <input 
              type="password"
              placeholder="••••••••" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="w-full bg-[#1e5af2] text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-blue-700 transition-all">
            Update Password
          </button>
        </form>

        <button 
          type="button"
          onClick={onBack || (() => window.history.back())} 
          className="mt-8 flex items-center justify-center gap-2 w-full text-slate-400 text-sm font-bold hover:text-blue-500 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Login
        </button>
      </div>
    </div>
  );
}