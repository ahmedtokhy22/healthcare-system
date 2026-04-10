import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function ChangePassword() {
  return (
    <div className="p-8 bg-[#f8f9fa] min-h-screen flex items-center justify-center font-sans">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50 text-right" dir="rtl">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-2xl font-black mb-8 text-center text-slate-800">تغيير كلمة المرور</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 mr-2">كلمة المرور الحالية</label>
            <input type="password" placeholder="••••••••" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 mr-2">كلمة المرور الجديدة</label>
            <input type="password" placeholder="••••••••" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button className="w-full bg-[#1e5af2] text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-blue-100 hover:bg-[#1647c7] transition-all">تحديث كلمة المرور</button>
        </div>
      </div>
    </div>
  );
}