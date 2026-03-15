// src/components/ui/ChangePassword.jsx
import React from 'react';

const ChangePassword = () => {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold text-gray-800 mb-6">تغيير كلمة المرور</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الحالية</label>
          <input 
            type="password" 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e5af2] outline-none"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الجديدة</label>
          <input 
            type="password" 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e5af2] outline-none"
            placeholder="••••••••"
          />
        </div>

        <button className="w-full bg-[#1e5af2] text-white py-3 rounded-xl font-semibold hover:bg-[#1647c7] transition-all mt-4">
          تحديث كلمة المرور
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;