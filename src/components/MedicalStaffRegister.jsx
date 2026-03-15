import React from 'react';

const MedicalStaffRegister = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4ff]" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md border border-white">
        <h2 className="text-3xl font-black mb-8 text-center text-[#1e5af2]">إنشاء حساب طبي</h2>
        <div className="space-y-5">
          <input type="text" placeholder="اسم الدكتور / الممرض" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="email" placeholder="البريد الإلكتروني" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="password" placeholder="كلمة المرور" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
          <button className="w-full bg-[#1e5af2] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform">
            تسجيل الحساب
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalStaffRegister;