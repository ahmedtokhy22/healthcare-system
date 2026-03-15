import React from 'react';
import { MapPin } from 'lucide-react';

const LocationSelect = ({ locations, onSelect }) => {
  // لو الداتا لسه مجاتش
  if (!locations || locations.length === 0) return null;

  return (
    <div className="w-full max-w-sm" dir="rtl">
      <label className="block text-sm font-bold text-gray-700 mb-2 mr-1 flex items-center gap-2">
        <MapPin size={18} className="text-[#1e5af2]" /> اختر المحافظة
      </label>
      
      <div className="relative">
        <select 
          onChange={(e) => onSelect(e.target.value)}
          className="w-full p-4 bg-white border border-gray-200 rounded-2xl shadow-sm appearance-none focus:ring-2 focus:ring-[#1e5af2] focus:outline-none font-medium text-gray-700 cursor-pointer hover:border-[#1e5af2] transition-colors"
        >
          <option value="">اختر من القائمة...</option>
          {locations.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>
        
        {/* سهم الـ Dropdown المخصص */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 text-gray-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LocationSelect;