import React, { useState, useRef, useEffect, useCallback } from 'react';
import { User, Mail, Phone, MapPin, Upload, Save, X, Globe, Loader2, CheckCircle } from "lucide-react";
import axios from 'axios';

const API_BASE_URL = "http://localhost:5173/api";

export default function LabProfile() {
  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    bio: "",
    profilePictureUrl: null,
    rawFile: null // لتخزين ملف الصورة الجديد قبل الرفع
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  // 1. جلب بيانات البروفايل من الداتا بيز
  const fetchProfile = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Labs/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // ندمج البيانات القادمة مع الـ State
      setProfile(prev => ({
        ...prev,
        ...response.data,
        rawFile: null // نصفر الملف الخام عند كل تحميل جديد
      }));
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // 2. تحديث الحقول النصية
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // 3. التعامل مع اختيار صورة جديدة
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // عرض تجريبي للصورة المختارة قبل الرفع
      const previewUrl = URL.createObjectURL(file);
      setProfile(prev => ({ 
        ...prev, 
        profilePictureUrl: previewUrl, 
        rawFile: file 
      }));
    }
  };

  // 4. حفظ التغييرات (PUT Request)
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('id', profile.id);
      formData.append('name', profile.name);
      formData.append('phoneNumber', profile.phoneNumber);
      formData.append('address', profile.address);
      formData.append('city', profile.city);
      formData.append('bio', profile.bio);
      
      // نرسل الصورة فقط إذا قام المستخدم بتغييرها
      if (profile.rawFile) {
        formData.append('ProfilePicture', profile.rawFile);
      }

      await axios.put(`${API_BASE_URL}/Labs/profile`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        }
      });

      alert("تم تحديث بيانات المعمل بنجاح! 🎉");
      fetchProfile(); // إعادة جلب البيانات للتأكد من المزامنة
    } catch (error) {
      console.error("Update failed:", error);
      alert("حدث خطأ أثناء تحديث البيانات، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Loading Profile Details...</p>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto p-4 text-left" dir="ltr">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Account Settings</h2>
          <p className="text-slate-400 text-xs font-bold mt-2 italic flex items-center gap-2">
            <CheckCircle size={14} className="text-green-500" /> Update your laboratory's public identity
          </p>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-50 shadow-xl shadow-slate-100/50 p-8 md:p-12 space-y-12">
          
          {/* Section 1: Branding */}
          <section className="space-y-8">
            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] flex items-center gap-3">
              <User size={14}/> Visual Branding
            </h4>
            
            <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-50/50 p-8 rounded-[2.5rem] border border-dashed border-slate-200">
              <div className="relative group">
                <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center text-slate-200 border-4 border-white shadow-xl overflow-hidden transition-transform group-hover:scale-105 duration-500">
                  {profile.profilePictureUrl ? (
                    <img src={profile.profilePictureUrl} alt="Lab Logo" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} />
                  )}
                </div>
                {profile.rawFile && (
                   <div className="absolute -top-2 -right-2 bg-blue-600 text-white p-1.5 rounded-full shadow-lg animate-bounce">
                      <Save size={12} />
                   </div>
                )}
              </div>
              
              <div className="space-y-3 text-center md:text-left">
                <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*" />
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
                >
                  <Upload size={16} /> Replace Logo
                </button>
                <p className="text-[10px] text-slate-400 font-bold italic">Recommended: Square PNG or JPG, Max 2MB</p>
              </div>
            </div>
          </section>

          {/* Section 2: Details */}
          <section className="space-y-8">
            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] flex items-center gap-3">
              <Globe size={14}/> Information & Location
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField 
                label="Laboratory Name" 
                icon={<User size={18}/>} 
                name="name"
                value={profile.name} 
                onChange={handleChange} 
              />
              <InputField 
                label="Email Address" 
                icon={<Mail size={18}/>} 
                name="email"
                value={profile.email} 
                readOnly 
              />
              <InputField 
                label="Contact Phone" 
                icon={<Phone size={18}/>} 
                name="phoneNumber"
                value={profile.phoneNumber} 
                onChange={handleChange} 
                placeholder="e.g. 010XXXXXXXX" 
              />
              <InputField 
                label="Operating City" 
                icon={<MapPin size={18}/>} 
                name="city"
                value={profile.city} 
                onChange={handleChange} 
              />
              <div className="md:col-span-2">
                <InputField 
                    label="Full Physical Address" 
                    icon={<Globe size={18}/>} 
                    name="address"
                    value={profile.address} 
                    onChange={handleChange} 
                    placeholder="Street, Building, Floor..." 
                />
              </div>
            </div>
            
            <div className="space-y-3">
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Laboratory Bio</label>
               <textarea 
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows="4" 
                  className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold text-slate-600 text-sm placeholder:text-slate-300 shadow-inner resize-none" 
                  placeholder="Describe your laboratory expertise..."
               ></textarea>
            </div>
          </section>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-slate-50">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 hover:bg-blue-700 disabled:bg-slate-300 transition-all"
            >
              {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {isSaving ? "Synchronizing..." : "Save All Changes"}
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-10 py-5 bg-white border border-slate-100 text-slate-400 rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all"
            >
              <X size={20} className="inline mr-2" /> Discard
            </button>
          </div>
        </div>
    </div>
  );
}

// Sub-component for Input Fields
function InputField({ label, icon, value, placeholder, onChange, name, readOnly = false }) {
  return (
    <div className="space-y-3">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-blue-500">{icon}</div>
        <input 
          type="text" 
          name={name}
          value={value || ""} 
          onChange={onChange} 
          disabled={readOnly}
          placeholder={placeholder} 
          className={`w-full pl-16 pr-8 py-5 border rounded-[1.5rem] outline-none transition-all font-bold text-sm shadow-sm
            ${readOnly 
              ? 'bg-slate-100 text-slate-400 border-transparent cursor-not-allowed italic' 
              : 'bg-slate-50 border-slate-100 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 text-slate-700 placeholder:text-slate-200'}
          `} 
        />
      </div>
    </div>
  );
}