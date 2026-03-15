import React from 'react';
import { Mail, Phone, MapPin, Calendar, Activity, Scale, AlertCircle } from 'lucide-react';

// هنا بنستقبل "data" كـ Prop، ودي اللي هتتغير من مريض للتاني
const PatientProfileTemplate = ({ data }) => {
  if (!data) return <div className="p-10 text-center text-gray-500 font-bold">جارٍ تحميل بيانات المريض...</div>;

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto">
        
        {/* Header الثابت لكل المرضى */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-8 flex flex-col md:flex-row items-center gap-6">
            {/* أول حرف من الاسم كـ Profile Picture افتراضية */}
            <div className="w-28 h-28 bg-[#1e5af2] rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-lg">
              {data.name?.charAt(0) || 'P'}
            </div>
            <div className="text-center md:text-right flex-1">
              <h2 className="text-3xl font-black text-gray-800">{data.name}</h2>
              <p className="text-gray-400 mt-1 flex items-center justify-center md:justify-start gap-2">
                <Calendar size={16} /> كود المريض: {data.id?.slice(0, 8)}
              </p>
            </div>
            <button className="bg-[#1e5af2] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#1647c7] transition-all">
              تعديل السجل
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* كروت البيانات الحيوية */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg text-[#1e5af2]"><Scale size={20} /></div>
                <span className="font-bold text-gray-700">القياسات الحيوية</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                  <span className="text-gray-500 text-sm">الوزن</span>
                  <span className="font-black text-[#1e5af2]">{data.weight} كجم</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                  <span className="text-gray-500 text-sm">تاريخ الميلاد</span>
                  <span className="font-bold text-gray-800">{data.dateOfBirth}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 px-2">
                <Phone size={18} className="text-[#1e5af2]" /> التواصل
              </h3>
              <div className="space-y-3 text-sm px-2">
                <p className="text-gray-500 leading-6">الهاتف: <span className="text-gray-800 font-medium block">{data.phoneNumber}</span></p>
                <p className="text-gray-500 leading-6">العنوان: <span className="text-gray-800 font-medium block">{data.address}, {data.city}</span></p>
              </div>
            </div>
          </div>

          {/* التاريخ الطبي الديناميكي */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center gap-2">
                <Activity size={22} className="text-red-500" /> الحالة الصحية المزمنة
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* هنا بنعرض الأمراض اللي قيمتها True بس */}
                {Object.keys(data).filter(key => key.startsWith('has') && data[key] === true).map(disease => (
                  <div key={disease} className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
                    <AlertCircle size={18} className="text-red-500" />
                    <span className="text-red-700 font-bold text-sm">
                      {disease.replace('has', '').replace(/([A-Z])/g, ' $1').trim()} 
                    </span>
                  </div>
                ))}
                
                {/* لو مفيش أي مرض قيمته True */}
                {Object.keys(data).filter(key => key.startsWith('has') && data[key] === true).length === 0 && (
                   <div className="col-span-2 text-center py-6 bg-green-50 text-green-600 rounded-2xl font-bold">
                      لا يوجد أمراض مزمنة مسجلة ✅
                   </div>
                )}
              </div>

              {data.otherMedicalConditions && (
                <div className="mt-6 p-5 bg-gray-50 rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-gray-700 mb-2 text-sm">ملاحظات طبية إضافية:</h4>
                  <p className="text-gray-600 italic">{data.otherMedicalConditions}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileTemplate;