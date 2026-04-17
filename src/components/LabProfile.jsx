import React, { useState, useRef } from 'react';
import { User, Mail, Phone, MapPin, Upload, Save, X } from "lucide-react";

export default function LabProfile() {
  // 1. الحالة (State) لبيانات الملف الشخصي
  const [profile, setProfile] = useState({
    fullName: 'Central Lab Services',
    email: 'lab@gmail.com',
    phone: '0123456789',
    location: 'Cairo, Egypt',
    bio: 'Experienced diagnostic laboratory providing high-quality testing services.',
    profilePic: null // لتخزين مسار الصورة المرفوعة
  });

  const fileInputRef = useRef(null);

  // 2. تحديث الحقول (Generic Change Handler)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // 3. التعامل مع رفع الصورة
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // تحويل الملف لرابط لعرضه
      setProfile(prev => ({ ...prev, profilePic: imageUrl }));
    }
  };

  // 4. وظيفة الحفظ (Submit)
  const handleSave = () => {
    console.log("Saving Data to Laravel API:", profile);
    alert("Profile Updated Successfully!");
    // هنا هتحط كود الـ axios.put الخاص بك
  };

  // 5. وظيفة الإلغاء (Reset)
  const handleCancel = () => {
    if(window.confirm("Are you sure you want to discard changes?")) {
        // يمكنك هنا إعادة البيانات الأصلية من الـ API
        window.location.reload(); 
    }
  };

  return (
    <div className="animate-in fade-in duration-700 max-w-5xl mx-auto p-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Edit Profile</h2>
          <p className="text-slate-400 text-xs font-bold mt-1 italic">Update your profile information</p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm p-10 space-y-10 mt-8">
          <section className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <User size={12}/> Profile Information
            </h4>
            
            {/* Profile Picture Section */}
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-700 block ml-1">Profile Picture</label>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 border border-slate-100 overflow-hidden">
                  {profile.profilePic ? (
                    <img src={profile.profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} />
                  )}
                </div>
                <div className="space-y-2">
                  <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-blue-600 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    <Upload size={14} /> Upload Photo
                  </button>
                  <p className="text-[10px] text-slate-400 font-bold italic">JPG, PNG or GIF (max. 2MB)</p>
                </div>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="Full Name *" 
                icon={<User size={16}/>} 
                name="fullName"
                value={profile.fullName} 
                onChange={handleChange} 
              />
              <InputField 
                label="Email *" 
                icon={<Mail size={16}/>} 
                name="email"
                value={profile.email} 
                onChange={handleChange} 
              />
              <InputField 
                label="Phone Number" 
                icon={<Phone size={16}/>} 
                name="phone"
                value={profile.phone} 
                onChange={handleChange} 
                placeholder="Enter your phone number" 
              />
              <InputField 
                label="Location" 
                icon={<MapPin size={16}/>} 
                name="location"
                value={profile.location} 
                onChange={handleChange} 
                placeholder="Enter your city" 
              />
            </div>
            
            {/* Bio */}
            <div className="space-y-2">
               <label className="text-[11px] font-black text-slate-700 block ml-1">Bio</label>
               <textarea 
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows="4" 
                  className="w-full pl-6 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold text-slate-600 text-sm placeholder:text-slate-300" 
                  placeholder="Tell us about your experience..."
               ></textarea>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-slate-50">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-50 hover:bg-blue-700 transition-all"
            >
              <Save size={16} /> Save Changes
            </button>
            <button 
              onClick={handleCancel}
              className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-100 text-blue-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
    </div>
  );
}

// مكون الحقل المدخل (أضفنا خاصية الـ name والـ onChange)
function InputField({ label, icon, value, placeholder, onChange, name }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black text-slate-700 block ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>
        <input 
          type="text" 
          name={name}
          value={value} 
          onChange={onChange} 
          placeholder={placeholder} 
          className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 font-bold text-slate-600 text-sm placeholder:text-slate-300 transition-all shadow-inner" 
        />
      </div>
    </div>
  );
}