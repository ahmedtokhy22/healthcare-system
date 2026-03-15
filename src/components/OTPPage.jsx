import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw } from "lucide-react";

export function OTPPage({ email, onVerify, onBack }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30); // عد تنازلي لإعادة الإرسال
  const [isResending, setIsResending] = useState(false);

  // منطق الـ Timer لمنع حرق الـ API بإرسال متكرر
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (el, i) => {
    if (isNaN(el.value)) return;
    const newOtp = [...otp.map((d, idx) => (idx === i ? el.value : d))];
    setOtp(newOtp);
    if (el.value !== '' && el.nextSibling) el.nextSibling.focus();
  };

  const handleResend = () => {
    if (timer > 0) return; // منع الإرسال قبل انتهاء الوقت
    
    setIsResending(true);
    console.log("Resending confirmation email to:", email);
    
    // محاكاة طلب الـ API
    setTimeout(() => {
      setIsResending(false);
      setTimer(30); // إعادة تشغيل العداد
      alert("A new code has been sent to your email!");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8faff] p-4">
      <div className="w-full max-w-[480px] bg-white rounded-[35px] shadow-2xl border border-slate-50 p-12 text-center animate-in zoom-in duration-500">
        
        <button onClick={onBack} className="text-slate-400 text-sm font-bold hover:text-blue-500 mb-8 underline underline-offset-4 decoration-2">
          Back to Personal Info
        </button>
        
        <div className="flex justify-center mb-6 text-blue-500 bg-blue-50 w-20 h-20 items-center rounded-full mx-auto shadow-inner">
          <ShieldCheck size={42} strokeWidth={1.5} />
        </div>

        <h2 className="text-2xl font-black text-slate-800 mb-2">Confirm Your Email</h2>
        <p className="text-slate-400 text-sm font-medium mb-10 px-4">
          We've sent a 6-digit verification code to <br/>
          <span className="text-slate-700 font-bold">{email || "your-email@example.com"}</span>
        </p>

        {/* مربعات الـ OTP */}
        <div className="flex justify-center gap-3 mb-10">
          {otp.map((val, i) => (
            <input 
              key={i} 
              type="text" 
              maxLength="1" 
              className="w-12 h-16 border-2 border-slate-100 bg-slate-50/50 rounded-2xl text-center text-2xl font-black text-blue-600 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none" 
              value={val} 
              onChange={e => handleChange(e.target, i)} 
            />
          ))}
        </div>

        <button 
          onClick={() => onVerify(otp.join(''))} 
          className="w-full bg-[#1e5af2] text-white py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98] mb-6"
        >
          Confirm Email
        </button>

        {/* جزء الـ Resend Confirmation */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-slate-400 text-sm font-medium mb-2">Didn't receive the code?</p>
          <button 
            onClick={handleResend}
            disabled={timer > 0 || isResending}
            className={`flex items-center justify-center gap-2 mx-auto font-bold text-sm transition-all ${timer > 0 ? 'text-slate-300 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
          >
            {isResending ? (
              <RefreshCw className="animate-spin" size={16} />
            ) : (
              <RefreshCw size={16} />
            )}
            {timer > 0 ? `Resend Code in ${timer}s` : "Resend Confirmation Email"}
          </button>
        </div>
      </div>
    </div>
  );
}