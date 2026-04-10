import React, { useState } from 'react';
import api from '../api/axios';

export default function CreateUser() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "Doctor" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/Admin/create-user', formData);
      alert("User Created Successfully! ✅");
    } catch (err) { alert("Error creating user ❌"); }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-[2rem] shadow-xl border border-slate-100">
      <h2 className="text-xl font-black mb-6">Create New System User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Full Name" className="w-full p-4 bg-slate-50 rounded-xl outline-none" onChange={(e)=>setFormData({...formData, name: e.target.value})} />
        <input placeholder="Email Address" className="w-full p-4 bg-slate-50 rounded-xl outline-none" onChange={(e)=>setFormData({...formData, email: e.target.value})} />
        <input type="password" placeholder="Password" className="w-full p-4 bg-slate-50 rounded-xl outline-none" onChange={(e)=>setFormData({...formData, password: e.target.value})} />
        <select className="w-full p-4 bg-slate-50 rounded-xl outline-none" onChange={(e)=>setFormData({...formData, role: e.target.value})}>
          <option value="Doctor">Doctor</option>
          <option value="Nurse">Nurse</option>
          <option value="Lab">Laboratory</option>
        </select>
        <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-xs">Create Account</button>
      </form>
    </div>
  );
}