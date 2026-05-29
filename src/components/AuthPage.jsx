import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, Mail, Eye, EyeOff, Loader2, AlertCircle, 
  HeartPulse, KeyRound, ArrowLeft, ShieldCheck, 
  RefreshCw, CheckCircle2, MailCheck 
} from "lucide-react";
import axios from 'axios';

const API_BASE_URL = "https://healthcare52.runasp.net";

export default function AuthPage() {
  const navigate = useNavigate();
  
  // States لإدارة التنقل بين الشاشات: 'login' | 'forgot' | 'otp' | 'reset'
  const [view, setView] = useState('login');
  
  // بيانات النموذج
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // حالات التحميل والرسائل
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [timer, setTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const otpInputs = useRef([]);

  // مؤقت الـ OTP
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // التحكم بزر العودة الذكي للخلف خطوة بخطوة
  const handleBack = () => {
    setError("");
    setSuccessMsg("");
    if (view === 'forgot') setView('login');
    else if (view === 'otp') setView('forgot');
    else if (view === 'reset') setView('otp');
  };

  // --- 1. منطق تسجيل الدخول (Login) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_BASE_URL}/api/Auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('id', res.data.id);
      navigate(res.data.role === 'Admin' ? '/admin/dashboard' : `/${res.data.role.toLowerCase()}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || "خطأ في البريد أو كلمة المرور");
    } finally { setLoading(false); }
  };

  // --- 2. منطق نسيان كلمة المرور (Forgot Password) ---
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API_BASE_URL}/api/Auth/forgot-password`, { email });
      setTimer(30);
      setView('otp');
    } catch (err) {
      setError(err.response?.data?.message || "Email not found or server error.");
    } finally { setLoading(false); }
  };

  // --- 3. منطق التحقق من الـ OTP والانتقال لصفحة التعيين ---
  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) return setError("Enter 6-digit code.");
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API_BASE_URL}/api/Auth/verify-reset-otp`, { email, otp: code });
      setSuccessMsg("Code Verified Successfully!");
      setTimeout(() => {
        setSuccessMsg("");
        setView('reset');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired code.");
    } finally { setLoading(false); }
  };

  // --- 4. منطق إعادة إرسال الكود (نفس الـ Endpoint) ---
  const handleResendOtp = async () => {
    if (timer > 0) return;
    setResending(true);
    setError("");
    try {
      await axios.post(`${API_BASE_URL}/api/Auth/forgot-password`, { email });
      setTimer(60);
      setSuccessMsg("New code sent successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch { 
      setError("Failed to resend code."); 
    } finally { setResending(false); }
  };

  // --- 5. منطق تعيين كلمة المرور الجديدة النهائي ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }
    setLoading(true);
    setError("");
    try {
      const code = otp.join('');
      await axios.post(`${API_BASE_URL}/api/Auth/reset-password`, {
        email,
        otp: code,
        newPassword
      });
      setSuccessMsg("Password Reset Successfully! Redirecting...");
      setTimeout(() => {
        setSuccessMsg("");
        setView('login');
        // تفريغ البيانات القديمة
        setNewPassword("");
        setConfirmPassword("");
        setOtp(['', '', '', '', '', '']);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset password failed. Try again.");
    } finally { setLoading(false); }
  };

  // مساعدات واجهة الـ OTP لنقل الفوكس تلقائياً
  const handleOtpChange = (val, i) => {
    if (isNaN(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val.substring(val.length - 1);
    setOtp(newOtp);
    if (val && i < 5) otpInputs.current[i + 1].focus();
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center p-4 font-sans" dir="ltr">
      <div className="w-full max-w-[460px] bg-white rounded-[3.5rem] shadow-2xl p-10 md:p-14 border border-blue-50 relative overflow-hidden transition-all duration-500">
        
        {/* Back Button */}
        {view !== 'login' && (
          <button onClick={handleBack} className="absolute top-10 left-10 text-slate-400 hover:text-cyan-500 transition-colors cursor-pointer z-30">
            <ArrowLeft size={20} />
          </button>
        )}

        {/* Header Section */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-cyan-50 rounded-[2.2rem] mb-5 shadow-inner">
            {view === 'login' && <HeartPulse className="w-10 h-10 text-cyan-500 animate-pulse" />}
            {view === 'forgot' && <KeyRound className="w-10 h-10 text-blue-500" />}
            {view === 'otp' && <ShieldCheck className="w-10 h-10 text-emerald-500" />}
            {view === 'reset' && <Lock className="w-10 h-10 text-cyan-500" />}
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            {view === 'login' ? 'InCare' : view === 'forgot' ? 'Reset Access' : view === 'otp' ? 'Security Check' : 'New Password'}
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
            {view === 'login' ? 'Healthcare Platform' : view === 'forgot' ? 'Recover your account' : view === 'otp' ? 'Verify your identity' : 'Create secure password'}
          </p>
        </div>

        {/* Global Messages */}
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-[11px] font-bold border border-red-100 animate-shake"><AlertCircle size={16}/> {error}</div>}
        {successMsg && <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center gap-3 text-[11px] font-bold border border-emerald-100 animate-in zoom-in"><CheckCircle2 size={16}/> {successMsg}</div>}

        {/* View Switching Logic */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-5 animate-in slide-in-from-right duration-500">
            <InputField label="Email" icon={<Mail size={18}/>} type="email" placeholder="name@healthcare.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <div className="space-y-2">
              <div className="flex justify-between px-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-500" size={18} />
                <input type={showPassword ? "text" : "password"} className="w-full pl-14 pr-14 py-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] outline-none focus:bg-white focus:border-cyan-200 font-bold text-sm" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-cyan-500 cursor-pointer">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
              </div>
            </div>
            <SubmitButton loading={loading} text="Login To InCare" />
          </form>
        )}

        {view === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-6 animate-in slide-in-from-left duration-500 text-left">
            <InputField label="Recovery Email" icon={<Mail size={18}/>} type="email" placeholder="Enter registered email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <SubmitButton loading={loading} text="Send Reset Code" icon={<MailCheck size={18}/>} />
          </form>
        )}

        {view === 'otp' && (
          <div className="space-y-8 animate-in zoom-in duration-500">
            <p className="text-center text-slate-400 text-sm font-medium leading-relaxed">Code sent to <span className="text-slate-800 font-bold">{email}</span></p>
            <div className="flex justify-center gap-2" dir="ltr">
              {otp.map((val, i) => (
                <input key={i} ref={el => otpInputs.current[i] = el} type="text" maxLength="1" className="w-11 h-16 border-2 border-slate-100 bg-slate-50 rounded-2xl text-center text-xl font-black text-cyan-600 focus:border-cyan-500 focus:bg-white outline-none transition-all" value={val} onChange={(e) => handleOtpChange(e.target.value, i)} onKeyDown={(e) => e.key === 'Backspace' && !otp[i] && i > 0 && otpInputs.current[i-1].focus()} />
              ))}
            </div>
            <SubmitButton onClick={handleVerifyOtp} loading={loading} text="Verify Code" />
            <div className="text-center pt-4 border-t border-slate-50">
              <button onClick={handleResendOtp} disabled={timer > 0 || resending} className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 mx-auto cursor-pointer ${timer > 0 ? 'text-slate-300' : 'text-cyan-600 hover:scale-105 transition-transform'}`}>
                {resending ? <Loader2 size={14} className="animate-spin"/> : <RefreshCw size={14}/>}
                {timer > 0 ? `Resend in ${timer}s` : "Resend Email"}
              </button>
            </div>
          </div>
        )}

        {view === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-5 animate-in slide-in-from-bottom duration-500">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">New Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-500" size={18} />
                <input type={showNewPassword ? "text" : "password"} className="w-full pl-14 pr-14 py-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] outline-none focus:bg-white focus:border-cyan-200 font-bold text-sm" placeholder="••••••••" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} required />
                <button type="button" onClick={()=>setShowNewPassword(!showNewPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-cyan-500 cursor-pointer">{showNewPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-500" size={18} />
                <input type={showNewPassword ? "text" : "password"} className="w-full pl-14 pr-14 py-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] outline-none focus:bg-white focus:border-cyan-200 font-bold text-sm" placeholder="••••••••" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required />
              </div>
            </div>

            <SubmitButton loading={loading} text="Reset Password" />
          </form>
        )}

        {/* Dynamic footer containing Login switcher */}
        <div className="mt-10 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
          {view === 'login' ? (
            <>
              Forgot Password?{' '}
              <button type="button" onClick={() => setView('forgot')} className="text-cyan-600 hover:underline font-black uppercase tracking-widest text-[11px] cursor-pointer">
                Reset From here
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => setView('login')} className="text-cyan-600 hover:underline font-black uppercase tracking-widest text-[11px] cursor-pointer">
                Back to Login
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

const InputField = ({ label, icon, ...props }) => (
  <div className="space-y-2 text-left">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{label}</label>
    <div className="relative group">
      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-500 transition-colors">{icon}</span>
      <input {...props} className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] outline-none focus:ring-4 focus:ring-cyan-500/10 focus:bg-white focus:border-cyan-200 transition-all font-bold text-sm text-slate-700" required />
    </div>
  </div>
);

const SubmitButton = ({ loading, text, icon, onClick }) => (
  <button onClick={onClick} disabled={loading} className="w-full py-5 bg-cyan-500 text-white rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-cyan-100 hover:bg-cyan-600 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:bg-slate-200 cursor-pointer">
    {loading ? <Loader2 className="animate-spin" size={18} /> : <>{text} {icon}</>}
  </button>
);