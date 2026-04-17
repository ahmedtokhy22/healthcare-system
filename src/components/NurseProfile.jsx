import React, { useState, useRef } from 'react';
import { User, MessageSquare, Phone, MapPin, Camera, Save, X, CheckCircle, Briefcase } from "lucide-react";

const NurseProfile = () => {
  // 1. البيانات تبدأ فاضية تماماً (Empty State)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    specialization: "",
    bio: ""
  });

  const [profileImage, setProfileImage] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (isSaved) setIsSaved(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // هنا يتم الربط مع الـ API الخاص بك
    console.log("Submitting to Laravel Backend...", formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCancel = () => {
    setFormData({ fullName: "", email: "", phone: "", location: "", specialization: "", bio: "" });
    setProfileImage(null);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-700">
      
      {/* Header - بنفس ستايل الداشبورد */}
      <header className="mb-10 flex justify-between items-end">
        <div className="text-left">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Edit Profile</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Setup your professional nursing presence</p>
        </div>
        {isSaved && (
          <div className="flex items-center gap-2 bg-cyan-50 text-cyan-600 px-4 py-2 rounded-2xl animate-in zoom-in">
            <CheckCircle size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Profile Updated</span>
          </div>
        )}
      </header>

      <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm">
        
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="relative group">
            <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] overflow-hidden flex items-center justify-center border-2 border-dashed border-slate-200 group-hover:border-cyan-400 transition-all">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-slate-300" />
              )}
            </div>
            <button 
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="absolute -bottom-2 -right-2 bg-cyan-500 text-white p-3 rounded-2xl shadow-lg shadow-cyan-100 hover:bg-cyan-600 hover:scale-110 transition-all"
            >
              <Camera size={20} />
            </button>
            <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Identity Photo</p>
        </div>

        {/* Form Fields - ألوان متناسقة مع السيان والأزرق السماوي */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup 
              label="Full Name" name="fullName" value={formData.fullName} 
              onChange={handleChange} placeholder="Enter your name" icon={<User size={16}/>} 
            />
            <InputGroup 
              label="Email Address" name="email" value={formData.email} 
              onChange={handleChange} placeholder="example@mail.com" icon={<MessageSquare size={16}/>} 
            />
            <InputGroup 
              label="Phone Number" name="phone" value={formData.phone} 
              onChange={handleChange} placeholder="01xxxxxxxxx" icon={<Phone size={16}/>} 
            />
            <InputGroup 
              label="Location / City" name="location" value={formData.location} 
              onChange={handleChange} placeholder="Egypt, Cairo" icon={<MapPin size={16}/>} 
            />
            <div className="md:col-span-2">
              <InputGroup 
                label="Specialization" name="specialization" value={formData.specialization} 
                onChange={handleChange} placeholder="e.g. Intensive Care, Pediatrics..." icon={<Briefcase size={16}/>} 
              />
            </div>
            
            <div className="md:col-span-2 space-y-3 text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Professional Bio</label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write a short summary about your experience..."
                className="w-full p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] text-xs font-bold text-slate-600 outline-none focus:ring-4 focus:ring-cyan-500/5 focus:bg-white focus:border-cyan-200 transition-all min-h-[120px]"
              />
            </div>
          </div>

          {/* Action Buttons - ألوان السيان والأبيض */}
          <div className="flex gap-4 pt-8 border-t border-slate-50">
            <button 
              type="submit"
              className="bg-cyan-500 text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] shadow-xl shadow-cyan-100 hover:bg-cyan-600 transition-all flex items-center gap-3"
            >
              <Save size={18}/> Complete Setup
            </button>
            <button 
              type="button"
              onClick={handleCancel}
              className="bg-white border border-slate-200 text-slate-400 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center gap-3"
            >
              <X size={18}/> Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputGroup = ({ label, name, value, onChange, placeholder, icon }) => (
  <div className="space-y-3 text-left">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{label}</label>
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-500 transition-colors">
        {icon}
      </div>
      <input 
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-12 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-cyan-500/5 focus:bg-white focus:border-cyan-200 transition-all"
      />
    </div>
  </div>
);

export default NurseProfile;