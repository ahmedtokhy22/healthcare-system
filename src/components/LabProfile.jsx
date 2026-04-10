import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, FlaskConical, Save, Upload, Activity } from "lucide-react";
import api from '../api/axios'; 

export default function LabProfile() {
  const [profileData, setProfileData] = useState({
    Name: "",
    Title: "",      
    Specialty: "",   
    Bio: "",
    PhoneNumber: "",
    Address: "",
    City: ""
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/Labs/profile'); 
        const d = response.data;
        setProfileData({
          Name: d.name || "",
          Title: d.title || "",
          Specialty: d.specialty || "",
          Bio: d.bio || "",
          PhoneNumber: d.phoneNumber || "",
          Address: d.address || "",
          City: d.city || ""
        });
        if (d.profilePicture) setImagePreview(d.profilePicture);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const formData = new FormData();
  
    formData.append('name', profileData.Name);
    formData.append('title', profileData.Title);
    formData.append('specialty', profileData.Specialty);
    formData.append('bio', profileData.Bio);
    formData.append('phoneNumber', profileData.PhoneNumber);
    formData.append('address', profileData.Address);
    formData.append('city', profileData.City);
    formData.append('addressUrl', "string");

    if (selectedFile) formData.append('ProfilePicture', selectedFile);

    try {
      await api.put('/api/Labs/profile', formData);
      alert("Lab Profile Updated Successfully! ✅");
    } catch (err) {
      alert("Update Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8" dir="ltr">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-12 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
           <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center">
              <FlaskConical className="text-white" size={20} />
           </div>
           <h1 className="text-2xl font-black text-slate-800">Laboratory Profile</h1>
        </div>
        
        <div className="mb-12 flex items-center gap-8">
          <div className="w-24 h-24 bg-slate-50 rounded-full overflow-hidden border border-slate-100 flex items-center justify-center">
            {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <Activity size={40} className="text-slate-200" />}
          </div>
          <input type="file" id="lab-img" hidden onChange={(e) => {
            const file = e.target.files[0];
            if(file) { setSelectedFile(file); setImagePreview(URL.createObjectURL(file)); }
          }} />
          <button onClick={() => document.getElementById('lab-img').click()} className="px-6 py-2.5 border border-cyan-100 text-cyan-600 rounded-xl text-xs font-black hover:bg-cyan-50">
            <Upload size={14} className="inline mr-2"/> Update Lab Logo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CustomInput label="Lab Name" value={profileData.Name} onChange={(e)=>setProfileData({...profileData, Name: e.target.value})} icon={<FlaskConical size={16}/>} />
          <CustomInput label="Lab Title / Subtitle" value={profileData.Title} onChange={(e)=>setProfileData({...profileData, Title: e.target.value})} icon={<Activity size={16}/>} />
          <CustomInput label="Phone Number" value={profileData.PhoneNumber} onChange={(e)=>setProfileData({...profileData, PhoneNumber: e.target.value})} icon={<Phone size={16}/>} />
          <CustomInput label="Location (City)" value={profileData.City} onChange={(e)=>setProfileData({...profileData, City: e.target.value})} icon={<MapPin size={16}/>} />
          
          <div className="md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Lab Services & About</label>
            <textarea 
              value={profileData.Bio} 
              onChange={(e)=>setProfileData({...profileData, Bio: e.target.value})} 
              className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none min-h-[120px] focus:ring-2 focus:ring-cyan-50"
              placeholder="Describe your lab services..."
            />
          </div>
        </div>

        <div className="mt-10">
          <button onClick={handleSave} disabled={loading} className="bg-cyan-600 text-white px-10 py-4 rounded-xl font-black text-xs hover:bg-cyan-700 shadow-xl shadow-cyan-100 transition-all">
            {loading ? "Saving..." : "Save Lab Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomInput({ label, value, onChange, icon }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>
        <input value={value} onChange={onChange} className="w-full pl-12 p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-50" />
      </div>
    </div>
  );
}