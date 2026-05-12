import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Image as ImageIcon, Search, Loader2, Activity } from "lucide-react";

export default function SpecialtyManagement() {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSpec, setNewSpec] = useState({ name: "", image: null });

  const API_BASE = 'https://healthcare52.runasp.net/api';
  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}` };

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/Specialties`, { headers });
      setSpecialties(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Name", newSpec.name);
    if (newSpec.image) formData.append("Image", newSpec.image);
    try {
      await axios.post(`${API_BASE}/Specialties`, formData, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' }
      });
      setIsModalOpen(false);
      fetchData();
    } catch (err) { alert("Error adding specialty"); }
  };

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black">Specialties</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">
          + Add Specialty
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {specialties.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(spec => (
          <div key={spec.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-center">
            <span className="font-bold">{spec.name}</span>
            <button onClick={() => {
               if(window.confirm("Delete?")) axios.delete(`${API_BASE}/Specialties/${spec.id}`, {headers}).then(()=>fetchData())
            }} className="text-red-500"><Trash2 size={18}/></button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md">
            <h2 className="text-xl font-black mb-6">New Specialty</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Name" className="w-full p-4 bg-slate-50 rounded-xl border" onChange={e => setNewSpec({...newSpec, name: e.target.value})} />
              <input type="file" className="w-full" onChange={e => setNewSpec({...newSpec, image: e.target.files[0]})} />
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={()=>setIsModalOpen(false)} className="flex-1 p-4 font-bold">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white rounded-xl font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}