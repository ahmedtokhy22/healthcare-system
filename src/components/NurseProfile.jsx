import React from 'react';
import { Mail, Phone, MapPin, UserCheck, Info } from 'lucide-react';

const NurseProfileTemplate = ({ data }) => {
  if (!data) return <div className="p-10 text-center">جارٍ تحميل بيانات الممرض...</div>;

  return (
    <div className="p-6 bg-[#f0f2f5] min-h-screen" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden mb-6 border border-gray-100">
          <div className="h-32 bg-gradient-to-r from-[#1e5af2] to-[#4e73df]"></div>
          <div className="px-8 pb-8 text-right">
            <div className="relative flex justify-between items-end -mt-16">
              <img 
                src={data.profilePictureUrl || 'https://via.placeholder.com/120'} 
                className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg object-cover bg-gray-100"
                alt="Nurse"
              />
              <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold mb-4">نشط الآن</span>
            </div>
            <h2 className="text-2xl font-black text-gray-800 mt-6">{data.name}</h2>
            <p className="text-[#1e5af2] font-bold">{data.gender === "Male" ? "ممرض" : "ممرضة"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2 border-b pb-3">بيانات التواصل</h3>
            <div className="space-y-4">
              <p className="text-xs text-gray-400 font-bold uppercase">البريد الإلكتروني</p>
              <p className="text-sm font-medium text-gray-700 mb-4">{data.email}</p>
              <p className="text-xs text-gray-400 font-bold uppercase">رقم الهاتف</p>
              <p className="text-sm font-medium text-gray-700">{data.phoneNumber}</p>
            </div>
          </div>
          <div className="md:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center gap-2">
              <Info size={22} className="text-[#1e5af2]" /> السيرة المهنية (Bio)
            </h3>
            <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-600 leading-relaxed text-right italic font-medium">"{data.bio}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseProfileTemplate;