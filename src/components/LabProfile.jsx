import React from 'react';
import { Mail, Phone, MapPin, Beaker, Globe, info, Camera, Award } from 'lucide-react';

const LabProfileTemplate = ({ data }) => {
  // حالة التحميل لو الداتا لسه مصلتش من السيرفر
  if (!data) return <div className="p-10 text-center text-gray-500 font-bold">جارٍ تحميل بيانات المعمل...</div>;

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto">
        
        {/* الكارت العلوي - واجهة المعمل */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="h-40 bg-gradient-to-r from-[#0ea5e9] to-[#2563eb]"></div>
          <div className="px-10 pb-8">
            <div className="relative flex justify-between items-end -mt-16">
              <div className="relative">
                <img 
                  src={data.profilePictureUrl || 'https://via.placeholder.com/150'} 
                  alt="Lab Logo" 
                  className="w-36 h-36 rounded-3xl border-8 border-white shadow-xl object-cover bg-white"
                />
                <div className="absolute -bottom-2 -right-2 bg-blue-500 p-2 rounded-xl border-4 border-white text-white">
                  <Beaker size={20} />
                </div>
              </div>
              <div className="flex gap-3 mb-4">
                <button className="bg-[#1e5af2] text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-blue-200 transition-all">
                  تعديل بيانات المعمل
                </button>
              </div>
            </div>
            
            <div className="mt-6 text-right">
              <h2 className="text-3xl font-black text-gray-800">{data.name}</h2>
              <p className="text-blue-500 font-bold mt-1 flex items-center gap-2">
                <Award size={18} /> مركز تحاليل طبية معتمد
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* العمود الجانبي: معلومات التواصل والموقع */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-6 border-b pb-3">بيانات الاتصال</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-2xl text-[#1e5af2]"><Phone size={22} /></div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase">الخط الساخن / الهاتف</p>
                    <p className="text-sm font-bold text-gray-700">{data.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-2xl text-[#1e5af2]"><Mail size={22} /></div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase">البريد الإلكتروني</p>
                    <p className="text-sm font-bold text-gray-700">{data.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-2xl text-[#1e5af2]"><MapPin size={22} /></div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase">الموقع</p>
                    <p className="text-sm font-bold text-gray-700">{data.address}, {data.city}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* العمود الرئيسي: نبذة عن المعمل */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 h-full">
              <h3 className="font-bold text-2xl text-gray-800 mb-6 flex items-center gap-3">
                 وصف المعمل
              </h3>
              <div className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100">
                <p className="text-gray-700 text-lg leading-relaxed text-right italic">
                  "{data.bio}"
                </p>
              </div>
              
              {/* إحصائيات سريعة للمعمل */}
              <div className="mt-10 grid grid-cols-2 gap-6">
                <div className="p-6 bg-white border border-gray-100 rounded-[2rem] text-center">
                  <p className="text-gray-400 text-sm font-bold mb-2 uppercase">الفروع</p>
                  <p className="text-3xl font-black text-gray-800">Cairo HQ</p>
                </div>
                <div className="p-6 bg-white border border-gray-100 rounded-[2rem] text-center">
                  <p className="text-gray-400 text-sm font-bold mb-2 uppercase">الحالة</p>
                  <p className="text-3xl font-black text-green-500">متاح</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LabProfileTemplate;