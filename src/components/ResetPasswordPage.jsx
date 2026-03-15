import React, { useState } from 'react';
import { LockKeyhole, Eye, EyeOff } from "lucide-react";

export function ResetPasswordPage({ onReset, onBack }) {
  const [showPass, setShowPass] = useState(false);
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("Passwords do not match!");
      return;
    }
    onReset(passwords.new);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8faff] p-4 font-sans">
      <div className="w-full max-w-[480px] bg-white rounded-[35px] shadow-2xl p-12 text-center animate-in zoom-in duration-500">
        <div className="flex justify-center mb-6 text-blue-500 bg-blue-50 w-20 h-20 items-center rounded-full mx-auto">
          <LockKeyhole size={40} strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Create New Password</h2>
        <p className="text-slate-400 text-sm font-medium mb-10 px-4">Your identity is verified. Set a new secure password.</p>
        <form className="space-y-6 text-left" onSubmit={handleSubmit}>
          <div className="space-y-2 relative">
            <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
            <input 
              type={showPass ? "text" : "password"}
              placeholder="••••••••" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium" 
              onChange={(e) => setPasswords({...passwords, new: e.target.value})}
              required 
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-[46px] text-slate-400">
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
            <input 
              type="password"
              placeholder="••••••••" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium" 
              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              required 
            />
          </div>
          <button type="submit" className="w-full bg-[#1e5af2] text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-blue-700 transition-all">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}