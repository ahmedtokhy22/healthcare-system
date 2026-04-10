import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Loader2, User, Mail, MapPin } from 'lucide-react';

export default function ProfileManager({ role, endpoint }) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    address: ''
  });

  // 1. جلب البيانات (GET) عند تحميل المكون
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // ضروري لاستخدام الـ JWT
        const response = await axios.get(`http://your-api.com/api/${endpoint}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfileData(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [endpoint]);

  // 2. تحديث البيانات (PUT)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://your-api.com/api/${endpoint}/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`${role} Profile Updated Successfully!`);
    } catch (err) {
      alert("Update failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-[40px] shadow-sm">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black text-slate-800">{role} Profile</h2>
        <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest">
          Account Settings
        </span>
      </div>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400 ml-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-4 text-slate-300" size={20} />
            <input 
              type="text" 
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400 ml-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-300" size={20} />
            <input 
              type="email" 
              value={profileData.email}
              disabled // الإيميل غالباً لا يتعدل في الـ Profile
              className="w-full pl-12 pr-4 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-bold text-slate-400 ml-2">Bio / Experience</label>
          <textarea 
            value={profileData.bio}
            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
            className="w-full p-6 bg-slate-50 border-none rounded-[30px] font-bold h-40 focus:ring-2 focus:ring-blue-100 transition-all"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="md:col-span-2 flex justify-end gap-4 mt-6">
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
}