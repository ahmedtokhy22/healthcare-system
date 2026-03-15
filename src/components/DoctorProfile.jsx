import React from 'react';

const DoctorProfile = () => {
  const appointments = [
    { id: 1, patient: "هيثم إبراهيم", time: "10:00 AM", type: "كشف جديد" },
    { id: 2, patient: "أحمد علي", time: "11:30 AM", type: "استشارة" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8" dir="rtl">
      {/* Header */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-10 bg-white p-6 rounded-[2rem] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">👨‍⚕️</div>
          <div>
            <h1 className="text-xl font-black text-slate-800">د. محمد أحمد</h1>
            <p className="text-slate-500 text-sm">استشاري جراحة القلب</p>
          </div>
        </div>
        <button className="bg-red-50 text-red-500 px-6 py-2 rounded-xl font-bold text-sm">تسجيل خروج</button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="bg-[#1e5af2] p-6 rounded-[2rem] text-white shadow-xl shadow-blue-100">
          <p className="text-blue-100 text-sm">إجمالي الكشوفات اليوم</p>
          <h2 className="text-4xl font-black mt-2">12</h2>
        </div>

        {/* Appointments List */}
        <div className="md:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-800 mb-6">جدول المواعيد القادمة</h3>
          <div className="space-y-4">
            {appointments.map(app => (
              <div key={app.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="font-bold text-slate-800">{app.patient}</p>
                  <p className="text-xs text-slate-400">{app.type}</p>
                </div>
                <div className="text-left">
                  <p className="text-[#1e5af2] font-black">{app.time}</p>
                  <button className="text-[10px] bg-white px-3 py-1 rounded-lg border mt-1">تفاصيل</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;