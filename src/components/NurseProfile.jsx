import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { User, MessageSquare, Phone, MapPin, Camera, Save, X, CheckCircle, Briefcase, Loader2, Mail } from "lucide-react";

const NurseProfile = () => {
  // بيانات الـ Initial State فاضية عشان نمليها من الـ API
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    city: "",
    address: "",
    bio: "",
    gender: ""
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const fileInputRef = useRef(null);

  const API_BASE = "http://localhost:5173/api/Nurses/profile"; // تأكد من الـ URL الصح لبروجكتك

  // 1. جلب البيانات من الـ API عند فتح الصفحة
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(API_BASE, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = res.data;
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          city: data.city || "",
          address: data.address || "",
          bio: data.bio || "",
          gender: data.gender || ""
        });
        if (data.profilePictureUrl) setProfileImage(data.profilePictureUrl);
      } catch (err) {
        console.error("Fetch error:", err);
        setStatus({ type: 'error', msg: 'Failed to load profile data' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  // 2. تحديث البيانات (PUT Request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setStatus({ type: '', msg: '' });

    try {
      const token = localStorage.getItem('token');
      
      // بنستخدم FormData عشان لو في صورة هتترفع
      const dataToSend = new FormData();
      dataToSend.append('Name', formData.name);
      dataToSend.append('PhoneNumber', formData.phoneNumber);
      dataToSend.append('City', formData.city);
      dataToSend.append('Address', formData.address);
      dataToSend.append('Bio', formData.bio);
      dataToSend.append('Gender', formData.gender);
      if (imageFile) dataToSend.append('ProfilePicture', imageFile);

      await axios.put(API_BASE, dataToSend, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setStatus({ type: 'success', msg: 'Profile Updated Successfully' });
      setTimeout(() => setStatus({ type: '', msg: '' }), 4000);
    } catch (error) {
      setStatus({ type: 'error', msg: error.response?.data?.message || 'Update failed' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-700 bg-[#fcfcfd]">
      <header className="mb-10 flex justify-between items-end">
        <div className="text-left">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Edit Profile</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Update your professional details</p>
        </div>
        
        {status.msg && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl animate-in zoom-in shadow-sm ${
            status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
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
                <div className="text-blue-500 font-black text-4xl">{formData.name?.charAt(0)}</div>
              )}
            </div>
            <button 
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-2xl shadow-lg hover:bg-blue-700 hover:scale-105 transition-all"
            >
              <Camera size={20} />
            </button>
            <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Picture</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="Name" icon={<User size={16}/>} />
            <InputGroup label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="01..." icon={<Phone size={16}/>} />
            <InputGroup label="Email Address" name="email" value={formData.email} disabled={true} placeholder="Read only" icon={<Mail size={16}/>} />
            <InputGroup label="City" name="city" value={formData.city} onChange={handleChange} placeholder="Cairo" icon={<MapPin size={16}/>} />
            
            <div className="md:col-span-2">
              <InputGroup label="Specific Address" name="address" value={formData.address} onChange={handleChange} placeholder="Street, Building..." icon={<MapPin size={16}/>} />
            </div>
            
            <div className="md:col-span-2 space-y-3 text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Professional Bio</label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] text-xs font-bold text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-200 transition-all min-h-[120px]"
                placeholder="Tell us about your experience..."
              />
            </div>
          </div>

          <div className="flex gap-4 pt-8 border-t border-slate-50">
            <button 
              type="submit"
              disabled={updating}
              className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] shadow-xl hover:bg-blue-600 transition-all flex items-center gap-3 disabled:opacity-70 group"
            >
              {updating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} className="group-hover:scale-110 transition-transform" />}
              {updating ? "Updating..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputGroup = ({ label, name, value, onChange, placeholder, icon, disabled = false }) => (
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
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full pl-12 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-200 transition-all ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      />
    </div>
  </div>
);

export default NurseProfile;