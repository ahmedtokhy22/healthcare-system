import React from 'react';
import { Stethoscope, ChevronLeft } from 'lucide-react';

const SpecialtyGrid = ({ specialties }) => {
  // لو الـ Response لسه بيحمل
  if (!specialties || specialties.length === 0) {
    return <div className="p-10 text-center text-gray-400">لا توجد تخصصات متاحة حالياً...</div>;
  }

  return (
    <div className="p-6 bg-[#f8fafc]" dir="rtl">
      <h2 className="text-2xl font-black text-gray-800 mb-8 px-4 border-r-4 border-[#1e5af2] mr-2">
        التخصصات الطبية
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {specialties.map((item) => (
          <div 
            key={item.id} 
            className="group bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 cursor-pointer"
          >
            <div className="flex flex-col items-center text-center">
              {/* أيقونة التخصص - ثابتة لكل التخصصات أو متغيرة */}
              <div className="w-16 h-16 bg-blue-50 text-[#1e5af2] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Stethoscope size={32} />
              </div>
              
              <h3 className="font-bold text-gray-800 text-lg mb-2">{item.name}</h3>
              <p className="text-xs text-gray-400 mb-6">كود التخصص: {item.id.slice(0, 8)}</p>
              
              <button className="flex items-center justify-center gap-2 text-sm font-bold text-[#1e5af2] group-hover:gap-4 transition-all">
                عرض الأطباء <ChevronLeft size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialtyGrid;