import React from 'react';

export function RegistrationPage1({ onNext, onBack }) {
  // 1. تعريف قائمة المحافظات داخل المكون
  const governorates = [
    "Cairo", "Giza", "Alexandria", "Port Said", "Suez", "Luxor", "Aswan", 
    "Assiut", "Beheira", "Beni Suef", "Dakahlia", "Damietta", "Faiyum", 
    "Gharbia", "Ismailia", "Kafr El Sheikh", "Matrouh", "Minya", "Monufia", 
    "New Valley", "North Sinai", "Qalyubia", "Qena", "Red Sea", "Sharqia", 
    "Sohag", "South Sinai"
  ];

  return (
    <div className="animate-in slide-in-from-right-4 duration-500 text-left">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Create Your Account</h2>
        <p className="text-slate-400 text-sm mt-1 font-medium">Step 1 of 2 - Personal Information</p>
      </div>

      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onNext({}); }}>
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
          <input type="text" placeholder="John Doe" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Date of Birth</label>
            <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium" required />
          </div>
          <div className="p-1 space-y-3">
            <label className="text-sm font-bold text-slate-700 block text-center">Gender</label>
            <div className="flex justify-center gap-8">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-600">
                <input type="radio" name="g" className="w-4 h-4 accent-blue-600" defaultChecked /> Male
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-600">
                <input type="radio" name="g" className="w-4 h-4 accent-blue-600" /> Female
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Address</label>
            <input placeholder="123 Main Street" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">المحافظة</label>
            <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-slate-700 appearance-none cursor-pointer" required defaultValue="">
              <option value="" disabled>اختر المحافظة</option>
              {governorates.map((gov, i) => (
                <option key={i} value={gov}>{gov}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <input type="email" placeholder="name@example.com" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
            <input type="tel" placeholder="+20 123 456 7890" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all" required />
          </div>
        </div>

        <div className="flex gap-4">
           <button type="button" onClick={onBack} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all mt-4">Back</button>
           <button type="submit" className="flex-[2] bg-[#1e5af2] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all mt-4">Next Step</button>
        </div>
      </form>
    </div>
  );
}