import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function StaffRegistration() {
  const [specialties, setSpecialties] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({ name: "", role: "doctor", specialty_id: "", city_id: "" });

  useEffect(() => {
    // جلب التخصصات والمدن عند تحميل الصفحة
    axios.get('http://your-api.com/api/specialties').then(res => setSpecialties(res.data));
    axios.get('http://your-api.com/api/locations/cities').then(res => setCities(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://your-api.com/api/users/medical-staff-registeration', formData); //
    alert("Staff Registered!");
  };

  return (
    <form onSubmit={handleSubmit} className="p-10 bg-white rounded-[40px] space-y-6 shadow-sm max-w-xl mx-auto">
      <h2 className="text-2xl font-black mb-4">Register New Staff</h2>
      <input type="text" placeholder="Name" className="w-full p-4 bg-slate-50 rounded-2xl" onChange={e => setFormData({...formData, name: e.target.value})} />
      
      <select className="w-full p-4 bg-slate-50 rounded-2xl" onChange={e => setFormData({...formData, role: e.target.value})}>
        <option value="doctor">Doctor</option>
        <option value="nurse">Nurse</option>
      </select>

      {/* لو Role دكتور يظهر اختيار التخصص */}
      {formData.role === 'doctor' && (
        <select className="w-full p-4 bg-slate-50 rounded-2xl" onChange={e => setFormData({...formData, specialty_id: e.target.value})}>
          {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      )}

      <select className="w-full p-4 bg-slate-50 rounded-2xl" onChange={e => setFormData({...formData, city_id: e.target.value})}>
        {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <button className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black shadow-lg">Register Staff</button>
    </form>
  );
}