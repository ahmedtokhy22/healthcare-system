import React from 'react';


export function Dashboard({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6" dir="rtl">
      {/* Header الـ Dashboard */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <img 
            src={user.profilePictureUrl} 
            alt="Profile" 
            className="w-12 h-12 rounded-full border-2 border-[#1e5af2] object-cover"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-800">مرحباً، {user.name} 👋</h1>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="px-5 py-2 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-all border border-red-100"
        >
          تسجيل الخروج
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* كارت المعلومات الأساسية */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">معلومات الحساب</h3>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">الجنس: <strong className="text-gray-900">{user.gender === "Male" ? "ذكر" : "أنثى"}</strong></p>
            <p className="text-sm text-gray-600">المدينة: <strong className="text-gray-900">{user.city}</strong></p>
            <p className="text-sm text-gray-600">العنوان: <strong className="text-gray-900">{user.address}</strong></p>
          </div>
        </div>

        {/* كارت الـ Bio */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">النبذة الشخصية (Bio)</h3>
          <p className="text-gray-600 italic leading-relaxed bg-blue-50 p-4 rounded-xl border border-blue-100">
            "{user.bio}"
          </p>
        </div>

      </div>

      {/* زرار سريع للوصول للبروفايل الكامل */}
      <div className="max-w-6xl mx-auto mt-8 text-center">
         <p className="text-gray-400 text-sm mb-4 font-medium">هل تريد رؤية البروفايل الكامل أو تعديل بياناتك؟</p>
         <button className="bg-[#1e5af2] text-white px-10 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-105 transition-transform">
            عرض الملف الشخصي الكامل
         </button>
      </div>
    </div>
  );
}