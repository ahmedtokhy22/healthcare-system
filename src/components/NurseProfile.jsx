import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { User, MessageSquare, Phone, MapPin, Camera, Save, X, CheckCircle, Briefcase, Loader2 } from "lucide-react";

const NurseProfile = () => {
  // الربط مع بيانات الـ API المذكورة في الـ User Summary
  const [formData, setFormData] = useState({
    fullName: "Ahmed Ibrahim Tokhy Abdel Majeed", // من بيانات الـ CV
    email: "ahmed.tokhy@example.com", // افتراضي بناءً على الاسم
    phone: "01xxxxxxxxx", 
    location: "Qanater Khairyah, Qalyubia, Egypt", // من الـ User Summary
    specialization: "Fullstack Developer / Computer Science Student", // من الـ User Summary
    bio: "Computer Science student at El Shorouk Academy, expected graduation June 2026. Proficient in Arabic and English." // من الـ User Summary
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const fileInputRef = useRef(null);

  // تحديث البيانات لو الـ API بعت بيانات جديدة (Simulating Endpoint Response)
  useEffect(() => {
    // هنا ممكن تحط دالة fetch لو الداتا جاية من السيرفر
    // حالياً البيانات مربوطة بالـ User Summary الخاص بك
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (status.msg) setStatus({ type: '', msg: '' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (imageFile) data.append('image', imageFile);

      // الرابط ده اللي هتغيره لعنوان الـ Controller في لارافيل
      await axios.post('http://localhost:8000/api/nurse/profile-update', data);

      setStatus({ type: 'success', msg: 'Profile Updated Successfully' });
      setTimeout(() => setStatus({ type: '', msg: '' }), 4000);
    } catch (error) {
      setStatus({ type: 'error', msg: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-700">
      <header className="mb-10 flex justify-between items-end">
        <div className="text-left">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Edit Profile</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Manage your professional information</p>
        </div>
        
        {status.msg && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl animate-in zoom-in ${
            status.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            {status.type === 'success' ? <CheckCircle size={16} /> : <X size={16} />}
            <span className="text-[10px] font-black uppercase tracking-widest">{status.msg}</span>
          </div>
        )}
      </header>

      <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm">
        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="relative group">
            <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] overflow-hidden flex items-center justify-center border-2 border-dashed border-slate-200 group-hover:border-blue-400 transition-all shadow-inner">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="text-blue-500 font-black text-4xl">A</div> // الحرف الأول من Ahmed
              )}
            </div>
            <button 
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-2xl shadow-lg hover:bg-blue-700 transition-all"
            >
              <Camera size={20} />
            </button>
            <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest tracking-tight">Personal Photo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" icon={<User size={16}/>} />
            <InputGroup label="Email Address" name="email" value={formData.email} onChange={handleChange} placeholder="Email" icon={<MessageSquare size={16}/>} />
            <InputGroup label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" icon={<Phone size={16}/>} />
            <InputGroup label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="Location" icon={<MapPin size={16}/>} />
            
            <div className="md:col-span-2">
              <InputGroup label="Professional Specialization" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Specialization" icon={<Briefcase size={16}/>} />
            </div>
            
            <div className="md:col-span-2 space-y-3 text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">About You</label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] text-xs font-bold text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-200 transition-all min-h-[120px]"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-8 border-t border-slate-50">
            <button 
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-3 disabled:opacity-70"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18}/>}
              {loading ? "Updating..." : "Save Changes"}
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
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
        {icon}
      </div>
      <input 
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-12 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-200 transition-all"
      />
    </div>
  </div>
);

export default NurseProfile;