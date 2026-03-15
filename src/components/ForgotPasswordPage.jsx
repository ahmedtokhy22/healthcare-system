import React, { useState } from 'react';
import { KeyRound, ArrowLeft } from "lucide-react";

export function ForgotPasswordPage({ onNext, onBack }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ email }); 
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8faff] p-4">
      <div className="w-full max-w-[480px] bg-white rounded-[35px] shadow-2xl p-12 text-center animate-in zoom-in duration-500">
        <div className="flex justify-center mb-6 text-blue-500 bg-blue-50 w-20 h-20 items-center rounded-full mx-auto">
          <KeyRound size={40} strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Forgot Password?</h2>
        <p className="text-slate-400 text-sm font-medium mb-10 px-4">
          Enter your email address and we'll send you a code to reset your password.
        </p>
        <form className="space-y-6 text-left" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="w-full bg-[#1e5af2] text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-blue-700 transition-all">
            Send Reset Code
          </button>
        </form>
        <button onClick={onBack} className="mt-8 flex items-center justify-center gap-2 w-full text-slate-400 text-sm font-bold hover:text-blue-500 transition-colors">
          <ArrowLeft size={16} /> Back to Login
        </button>
      </div>
    </div>
  );
}