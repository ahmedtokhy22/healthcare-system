import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Upload, Save, Briefcase, Loader2 } from "lucide-react";
import axios from 'axios';

export default function DoctorProfile() {
  const [profileData, setProfileData] = useState({
    name: "", 
    title: "", 
    // تم حذف specialty من هنا
    bio: "", 
    phoneNumber: "", 
    address: "", 
    city: "",
    addressUrl: "" 
  });

  // تم حذف مصفوفة specialties لأنها لم تعد مطلوبة

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const API_BASE = 'https://healthcare52.runasp.net';
  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}` };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/Doctors/profile`, { headers });
      const data = response.data;
      
      setProfileData({
        name: data.name || "",
        title: data.title || "",
        // لا نقوم بتخزين التخصص هنا
        bio: data.bio || "",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
        city: data.city || "",
        addressUrl: data.addressUrl || ""
      });
      
      if (data.profilePictureUrl) {
        setImagePreview(data.profilePictureUrl);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const formData = new FormData();
    
    Object.keys(profileData).forEach(key => {
      formData.append(key, profileData[key]);
    });
    
    if (selectedFile) {
      formData.append('ProfilePicture', selectedFile);
    }

    try {
      await axios.put(`${API_BASE}/api/Doctors/profile`, formData, { 
        headers: { 
          ...headers,
          'Content-Type': 'multipart/form-data' 
        } 
      });
      alert("تم تحديث الملف الشخصي بنجاح! ✅");
    } catch (err) {
      console.error(err);
      alert("فشل التحديث ❌");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-10" dir="rtl">
      <div className="max-w-5xl mx-auto py-12 px-6 text-right">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">إعدادات الحساب</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.1em] mt-2">إدارة هويتك المهنية وتفاصيل العيادة</p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-50 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-l from-cyan-500 to-blue-500"></div>
          
          <div className="flex flex-col md:flex-row-reverse gap-12 items-start">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4 mx-auto md:mx-0">
              <div className="w-40 h-40 bg-slate-50 rounded-[2.5rem] border-4 border-white shadow-xl flex items-center justify-center overflow-hidden group relative transition-all hover:shadow-cyan-100">
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <User size={48} className="text-slate-200" />
                )}
                <label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-[2px]">
                  <Upload className="text-white" size={24} />
                  <input type="file" hidden accept="image/*" onChange={(e) => {
                    const file = e.target.files[0];
                    if(file) { 
                      setSelectedFile(file); 
                      setImagePreview(URL.createObjectURL(file)); 
                    }
                  }} />
                </label>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تحديث الصورة</span>
            </div>

            {/* Form Fields */}
            <div className="flex-1 w-full space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CustomInput name="name" label="الاسم الكامل" value={profileData.name} onChange={handleChange} icon={<User size={18}/>} />
                <CustomInput name="title" label="المسمى الوظيفي" value={profileData.title} onChange={handleChange} icon={<Briefcase size={18}/>} placeholder="مثلاً: رئيس قسم الأورام" />
                
                {/* تم حذف قسم التخصص (Specialty) من هنا بالكامل */}

                <CustomInput name="phoneNumber" label="رقم التواصل" value={profileData.phoneNumber} onChange={handleChange} icon={<Phone size={18}/>} />
                <CustomInput name="city" label="المدينة" value={profileData.city} onChange={handleChange} icon={<MapPin size={18}/>} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                 <CustomInput name="address" label="عنوان العيادة" value={profileData.address} onChange={handleChange} icon={<MapPin size={18}/>} />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mr-1">النبذة التعريفية (Bio)</label>
                <textarea name="bio" value={profileData.bio} onChange={handleChange} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-bold outline-none min-h-[150px] focus:ring-4 focus:ring-cyan-50/50 transition-all text-slate-700 leading-relaxed resize-none" placeholder="تكلم عن مسيرتك الطبية..." />
              </div>

              <div className="flex flex-col sm:flex-row-reverse gap-4 pt-4">
                <button onClick={handleSave} disabled={loading} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-cyan-600 shadow-xl shadow-slate-200 transition-all disabled:bg-slate-200">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18}/> حفظ التعديلات</>}
                </button>
                <button onClick={() => fetchProfile()} className="text-slate-400 px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all">إعادة تعيين</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomInput({ label, icon, name, value, onChange, placeholder }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mr-1">{label}</label>
      <div className="relative">
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-cyan-500">{icon}</div>
        <input name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full pr-14 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-cyan-50/50 transition-all text-slate-700" />
      </div>
    </div>
  );
}