import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegistrationPage1 } from "./RegistrationPage1";
import { RegistrationPage2 } from "./RegistrationPage2";
import { OTPPage } from "./OTPPage"; 
import { ForgotPasswordPage } from "./ForgotPasswordPage"; 
import { ResetPasswordPage } from "./ResetPasswordPage"; 
import { Heart, Stethoscope } from "lucide-react";

export default function AuthPage() {
  const [view, setView] = useState("login"); 
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isForgotPass, setIsForgotPass] = useState(false);
  const [resetStep, setResetStep] = useState(1); 
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
     
      const response = await fetch('https://unalterably-unasphalted-felton.ngrok-free.dev/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Login Success:", result);
       
        navigate('/doctor');
      } else {
        alert("خطأ في تسجيل الدخول: " + (result.message || "تأكد من البيانات"));
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("تعذر الاتصال بالسيرفر عبر ngrok. تأكد أن الـ Tunnel شغال.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotNext = (data) => {
    setFormData({ ...formData, email: data?.email });
    setResetStep(2);
  };

  const handleRegisterComplete = (data) => {
    setFormData({ ...formData, ...data });
    setStep(3);
  };

  if (isForgotPass) {
    if (resetStep === 1) return <ForgotPasswordPage onNext={handleForgotNext} onBack={() => setIsForgotPass(false)} />;
    if (resetStep === 2) return <OTPPage email={formData.email} onVerify={() => setResetStep(3)} onBack={() => setResetStep(1)} />;
    if (resetStep === 3) return <ResetPasswordPage onReset={() => { setIsForgotPass(false); setView("login"); }} onBack={() => setResetStep(2)} />;
  }

  if (view === "register" && step === 3) {
    return <OTPPage email={formData.email} onVerify={() => { setView("login"); setStep(1); }} onBack={() => setStep(2)} />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8faff] p-4">
      <div className="w-full max-w-[550px] bg-white rounded-[32px] shadow-2xl p-10">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex gap-2 mb-4">
            <Heart className="text-blue-500" fill="#3b82f6" size={35} />
            <Stethoscope className="text-blue-600" size={35} />
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">HealthCare System</h1>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
          <button onClick={() => { setView("login"); setStep(1); }} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${view === "login" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}>Login</button>
          <button onClick={() => { setView("register"); setStep(1); }} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${view === "register" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}>Register</button>
        </div>

        {view === "login" ? (
          <form className="space-y-6" onSubmit={handleLoginSubmit}>
            <div className="space-y-2 text-left">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <input type="email" placeholder="doctor@healthcare.com" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all" required />
            </div>
            <div className="space-y-2 text-left">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <input type="password" placeholder="••••••••" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all" required />
            </div>
            <div className="text-right">
              <button type="button" onClick={() => { setIsForgotPass(true); setResetStep(1); }} className="text-[11px] text-blue-500 font-bold hover:underline">Forgot Password?</button>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-[#1e5af2] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all ${loading ? "opacity-70" : ""}`}
            >
              {loading ? "Connecting..." : "Login to System"}
            </button>
          </form>
        ) : (
          <div className="w-full">
            {step === 1 && <RegistrationPage1 onNext={(data) => { setFormData({...formData, ...data}); setStep(2); }} onBack={() => setView("login")} />}
            {step === 2 && <RegistrationPage2 onBack={() => setStep(1)} onComplete={handleRegisterComplete} />}
          </div>
        )}
      </div>
    </div>
  );
}