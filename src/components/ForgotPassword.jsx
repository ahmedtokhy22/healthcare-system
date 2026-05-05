import React, { useState } from 'react';
import { KeyRound, ArrowLeft, Loader2, MailCheck } from "lucide-react";
import axios from "axios";

const API_BASE_URL = "https://healthcare52.runasp.net";

export default function ForgotPasswordPage({ onNext, onBack }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // طلب إرسال الكود إلى البريد الإلكتروني
      // ملاحظة: تأكد من المسار الصحيح (Endpoint) في الـ Backend الخاص بك
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
      
      if (onNext) {
        onNext({ email }); 
      }
    } catch (err) {
      console.error("Forgot Password Error:", err);
      setError(err.response?.data?.message || "Something went wrong. Please check your email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8faff] p-4 font-sans" dir="ltr">
      <div className="w-full max-w-[480px] bg-white rounded-[40px] shadow-2xl p-10 md:p-14 text-center animate-in zoom-in duration-500 border border-slate-50">
        
        {/* Icon Container */}
        <div className="flex justify-center mb-8 text-blue-600 bg-blue-50 w-24 h-24 items-center rounded-[2rem] mx-auto shadow-inner">
          <KeyRound size={45} strokeWidth={1.5} />
        </div>

        <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Forgot Password?</h2>
        <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed px-2">
          No worries! Enter your email address below and we will send you a verification code.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold animate-shake">
            {error}
          </div>
        )}

        <form className="space-y-6 text-left" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                placeholder="ahmed@example.com" 
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-slate-700" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#1e5af2] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>Send Reset Code <MailCheck size={18}/></>}
          </button>
        </form>

        <button 
          type="button"
          onClick={onBack || (() => window.history.back())} 
          className="mt-10 flex items-center justify-center gap-2 w-full text-slate-400 text-xs font-black uppercase tracking-widest hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
        </button>
      </div>
    </div>
  );
}