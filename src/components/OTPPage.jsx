import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, RefreshCw, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import axios from "axios";

const API_BASE_URL = "https://healthcare52.runasp.net";

export function OTPPage({ email, onVerify, onBack }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  // استخدام Refs للتحكم في الـ Focus بشكل أدق
  const inputs = useRef([]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e, i) => {
    const val = e.target.value;
    if (isNaN(val)) return;

    const newOtp = [...otp];
    newOtp[i] = val.substring(val.length - 1); // التأكد من أخذ رقم واحد فقط
    setOtp(newOtp);

    // الانتقال للمربع التالي
    if (val && i < 5) {
      inputs.current[i + 1].focus();
    }
  };

  const handleKeyDown = (e, i) => {
    // الرجوع للمربع السابق عند ضغط Backspace والمربع فارغ
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      inputs.current[i - 1].focus();
    }
  };

  // دالة التأكيد (Verification)
  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) return setError("Please enter the full 6-digit code.");
    
    setIsLoading(true);
    setError("");
    
    try {
      // استبدل هذا المسار بالمسار الحقيقي من الـ Swagger لديك
      const response = await axios.post(`${API_BASE_URL}/api/auth/verify-email`, {
        email: email,
        code: code
      });
      
      // إذا كان الكود صحيحاً ننتقل للخطوة التالية
      if (onVerify) onVerify(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // دالة إعادة الإرسال (Resend)
  const handleResend = async () => {
    if (timer > 0) return;
    
    setIsResending(true);
    setError("");
    setSuccessMsg("");
    
    try {
      await axios.post(`${API_BASE_URL}/api/auth/resend-code`, { email });
      setTimer(60); // زيادة الوقت قليلاً عند إعادة الإرسال
      setSuccessMsg("A new code has been sent to your inbox.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setError("Failed to resend code. Please try again later.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8faff] p-4 font-sans">
      <div className="w-full max-w-[480px] bg-white rounded-[40px] shadow-2xl border border-slate-50 p-10 md:p-14 text-center animate-in zoom-in duration-500">
        
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-blue-600 mb-8 transition-all group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform"/> Back to Info
        </button>
        
        <div className="flex justify-center mb-8 text-blue-600 bg-blue-50 w-24 h-24 items-center rounded-[2.5rem] mx-auto shadow-inner border border-blue-100/50">
          <ShieldCheck size={45} strokeWidth={1.5} />
        </div>

        <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Verify Email</h2>
        <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed px-4">
          Verification code sent to:<br/>
          <span className="text-blue-600 font-black italic">{email}</span>
        </p>

        {/* Feedback Messages */}
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black border border-red-100 animate-shake">{error}</div>}
        {successMsg && <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-black border border-emerald-100 flex items-center justify-center gap-2">
            <CheckCircle2 size={16}/> {successMsg}
        </div>}

        {/* OTP Inputs */}
        <div className="flex justify-center gap-2 md:gap-3 mb-10" dir="ltr">
          {otp.map((val, i) => (
            <input 
              key={i} 
              ref={el => inputs.current[i] = el}
              type="text" 
              maxLength="1" 
              className="w-11 h-16 md:w-12 md:h-20 border-2 border-slate-100 bg-slate-50/50 rounded-2xl text-center text-2xl font-black text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none" 
              value={val} 
              onChange={e => handleChange(e, i)} 
              onKeyDown={e => handleKeyDown(e, i)}
            />
          ))}
        </div>

        <button 
          onClick={handleVerify} 
          disabled={isLoading}
          className="w-full bg-[#1e5af2] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98] mb-8 flex items-center justify-center gap-3 disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20}/> : "Verify & Register"}
        </button>

        {/* Resend Section */}
        <div className="pt-8 border-t border-slate-50">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3 text-center">Didn't receive the code?</p>
          <button 
            onClick={handleResend}
            disabled={timer > 0 || isResending}
            className={`flex items-center justify-center gap-2 mx-auto font-black text-xs uppercase tracking-widest transition-all ${timer > 0 ? 'text-slate-300' : 'text-blue-600 hover:text-blue-800 hover:scale-105'}`}
          >
            {isResending ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={14} />}
            {timer > 0 ? `Resend Available in ${timer}s` : "Resend Verification Code"}
          </button>
        </div>
      </div>
    </div>
  );
}