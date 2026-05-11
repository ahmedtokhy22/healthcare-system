import React, { useState, useEffect } from "react";
import axios from "axios";
import { Stethoscope, Plus, Trash2 } from "lucide-react";

export default function AdminSpecialties() {
  const [specialties, setSpecialties] = useState([]);
  const [newName, setNewName] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = () => {
    axios.get("http://localhost:5173/api/Specialties").then(res => setSpecialties(res.data));
  };

  const handleAdd = async () => {
    if(!newName) return;
    try {
      await axios.post("http://localhost:5173/api/Admin/Specialties", { name: newName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewName("");
      fetchSpecialties();
    } catch (err) { alert("Error adding specialty"); }
  };

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-black text-slate-800 mb-8 uppercase tracking-widest">إدارة التخصصات الطبية</h1>
        
        {/* Add Section */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8 flex gap-4">
          <input 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="اسم التخصص الجديد..."
            className="flex-1 bg-slate-50 border-none rounded-2xl px-6 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
          <button onClick={handleAdd} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-100">
            <Plus size={18} className="inline ml-2"/> إضافة
          </button>
        </div>

        {/* List Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {specialties.map((spec) => (
            <div key={spec.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex justify-between items-center hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Stethoscope size={20}/></div>
                <span className="font-black text-slate-700">{spec.name}</span>
              </div>
              <button className="p-3 text-slate-300 hover:text-rose-500 transition-all"><Trash2 size={18}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}