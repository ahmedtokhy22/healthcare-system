import React, { useState, useEffect } from 'react';
import { Heart, User, Phone, MapPin, FileText, Upload, Save, Briefcase, ChevronDown } from "lucide-react";
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function DoctorProfile() {
  const [profileData, setProfileData] = useState({
    Name: "", Title: "", Specialty: "", Bio: "", PhoneNumber: "", Address: "", AddressUrl: "string", City: ""
  });

  const specialties = ["Cardiology", "Dermatology", "Neurology", "Pediatrics", "Orthopedics", "Ophthalmology", "Internal Medicine", "Surgery"];
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/Doctors/profile');
        const data = response.data;
        setProfileData({
          Name: data.name || "", Title: data.title || "", Specialty: data.specialty || "",
          Bio: data.bio || "", PhoneNumber: data.phoneNumber || "", Address: data.address || "",
          AddressUrl: data.addressUrl || "string", City: data.city || ""
        });
        if (data.profilePicture) setImagePreview(data.profilePicture);
      } catch (err) { console.error("Fetch error:", err); }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const formData = new FormData();
    Object.keys(profileData).forEach(key => formData.append(key, profileData[key]));
    if (selectedFile) formData.append('ProfilePicture', selectedFile);

    try {
      await api.put('/api/Doctors/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert("Profile Updated Successfully! ✅");
    } catch (err) { alert("فشل التحديث ❌"); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]" dir="ltr">
      <div className="max-w-5xl mx-auto py-12 px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Profile Settings</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Manage your professional presence</p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-50 p-12 relative overflow-hidden">
          {/* خلفية جمالية علوية */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
          
          <div className="flex flex-col md:flex-row gap-12 items-start">
            {/* الصورة الشخصية بتصميم الـ Avatar اللي في الداشبورد */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] border-4 border-white shadow-xl flex items-center justify-center overflow-hidden group relative">
                {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <User size={48} className="text-slate-200" />}
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Upload className="text-white" size={24} />
                  <input type="file" hidden onChange={(e) => {
                    const file = e.target.files[0];
                    if(file) { setSelectedFile(file); setImagePreview(URL.createObjectURL(file)); }
                  }} />
                </label>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor Avatar</span>
            </div>

            <div className="flex-1 w-full space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CustomInput name="Name" label="Full Name" value={profileData.Name} onChange={handleChange} icon={<User size={16}/>} />
                <CustomInput name="Title" label="Professional Title" value={profileData.Title} onChange={handleChange} icon={<Briefcase size={16}/>} placeholder="e.g. Senior Consultant" />
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Medical Specialty</label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500"><FileText size={18}/></div>
                    <select name="Specialty" value={profileData.Specialty} onChange={handleChange}
                      className="w-full pl-14 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none appearance-none focus:ring-4 focus:ring-cyan-50/50 transition-all cursor-pointer">
                      <option value="">Select Specialty</option>
                      {specialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18}/>
                  </div>
                </div>

                <CustomInput name="PhoneNumber" label="Contact Number" value={profileData.PhoneNumber} onChange={handleChange} icon={<Phone size={16}/>} />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Clinic Address & Bio</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500" size={18}/>
                  <input name="Address" value={profileData.Address} onChange={handleChange} className="w-full pl-14 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-cyan-50/50 transition-all" placeholder="Clinic location details..." />
                </div>
                <textarea name="Bio" value={profileData.Bio} onChange={handleChange} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-bold outline-none min-h-[150px] focus:ring-4 focus:ring-cyan-50/50 transition-all" placeholder="Tell us about your medical journey..." />
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={handleSave} disabled={loading} className="bg-cyan-500 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-cyan-600 shadow-xl shadow-cyan-100 transition-all disabled:bg-slate-200">
                  {loading ? "Updating..." : <><Save size={18}/> Save Profile</>}
                </button>
                <button className="text-slate-400 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
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
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500">{icon}</div>
        <input name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full pl-14 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-cyan-50/50 transition-all" />
      </div>
    </div>
  );
}