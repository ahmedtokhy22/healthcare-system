import React, { useState } from 'react';

export function RegistrationPage2({ onComplete, onBack }) {
  const [otherChronic, setOtherChronic] = useState(false);

 
  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(); // هنا بننقل اليوزر لصفحة الـ OTP أو الـ Login
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-500 text-left">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Medical Information</h2>
        <p className="text-slate-400 text-sm mt-1 font-medium">Step 2 of 2 - Health Status</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Blood Pressure */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 block ml-1">Blood Pressure (ضغط الدم)</label>
          <p className="text-xs text-slate-400 font-medium italic mb-2">Do you have high blood pressure?</p>
          <div className="flex gap-8 ml-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
              <input type="radio" name="bp" className="w-4 h-4 accent-blue-600" /> Yes
            </label>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
              <input type="radio" name="bp" className="w-4 h-4 accent-blue-600" defaultChecked /> No
            </label>
          </div>
        </div>

        {/* Diabetes */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 block ml-1">Diabetes (السكري)</label>
          <p className="text-xs text-slate-400 font-medium italic mb-2">Do you have diabetes?</p>
          <div className="flex gap-8 ml-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
              <input type="radio" name="db" className="w-4 h-4 accent-blue-600" /> Yes
            </label>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
              <input type="radio" name="db" className="w-4 h-4 accent-blue-600" defaultChecked /> No
            </label>
          </div>
        </div>

        {/* Chronic Diseases Grid */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-700 block ml-1">Chronic Diseases (الأمراض المزمنة)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
            {[
              { id: 'heart', label: 'Heart Disease', ar: '(أمراض القلب)' },
              { id: 'asthma', label: 'Asthma', ar: '(الربو)' },
              { id: 'arthritis', label: 'Arthritis', ar: '(التهاب المفاصل)' },
              { id: 'kidney', label: 'Kidney Disease', ar: '(أمراض الكلى)' },
              { id: 'liver', label: 'Liver Disease', ar: '(أمراض الكبد)' },
              { id: 'thyroid', label: 'Thyroid Disorders', ar: '(الغدة الدرقية)' },
              { id: 'cancer', label: 'Cancer', ar: '(السرطان)' },
              { id: 'other', label: 'Other', ar: '(أخرى)' }
            ].map((item) => (
              <div key={item.id} className="flex items-center gap-2.5">
                <input 
                  type="checkbox" 
                  id={item.id} 
                  className="w-4 h-4 accent-blue-600 cursor-pointer" 
                  onChange={(e) => item.id === 'other' && setOtherChronic(e.target.checked)} 
                />
                <label htmlFor={item.id} className="text-[12px] font-bold text-slate-600 cursor-pointer">
                  {item.label} <span className="text-[10px] text-slate-400 font-normal">{item.ar}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {otherChronic && (
          <input 
            placeholder="Please specify other chronic diseases..." 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm animate-in fade-in slide-in-from-top-2" 
          />
        )}

        {/* Weight */}
        <div className="relative space-y-2">
          <label className="text-sm font-bold text-slate-700 block ml-1">Weight (Optional) - الوزن</label>
          <div className="relative">
             <input type="number" placeholder="70" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm focus:border-blue-500 transition-all" />
             <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">kg</span>
          </div>
        </div>

        {/* Buttons Group */}
        <div className="flex gap-4 pt-4">
          <button 
            type="button" 
            onClick={onBack} 
            className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all"
          >
            Back
          </button>
          <button 
            type="submit" 
            className="flex-[2] bg-[#1e5af2] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
          >
            Complete Registration
          </button>
        </div>
      </form>
    </div>
  );
}