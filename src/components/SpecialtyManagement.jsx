import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Search, Loader2, X } from "lucide-react";

export default function SpecialtyManagement() {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSpecName, setNewSpecName] = useState(""); // Simplified state

  const API_BASE = 'https://healthcare52.runasp.net/api';
  const token = localStorage.getItem('token');
  const headers = { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json' // Set to JSON
  };

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/Specialties`, { headers });
      setSpecialties(res.data);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Sending as a simple JSON object in the body
    try {
      await axios.post(`${API_BASE}/Specialties`, 
        { name: newSpecName }, 
        { headers }
      );
      
      setIsModalOpen(false);
      setNewSpecName(""); // Reset input
      fetchData();
    } catch (err) { 
      alert(err.response?.data?.message || "Error adding specialty"); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this specialty?")) {
      try {
        await axios.delete(`${API_BASE}/Specialties/${id}`, { headers });
        fetchData();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Specialties</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Manage medical departments</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-11 pr-4 py-3 bg-white border-none shadow-sm rounded-xl font-bold text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
          >
            + Add Specialty
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={40}/></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {specialties
            .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(spec => (
              <div key={spec.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-center group hover:border-blue-200 transition-all">
                <div>
                  <span className="font-black text-slate-800 text-sm uppercase tracking-tight">{spec.name}</span>
                </div>
                <button 
                  onClick={() => handleDelete(spec.id)} 
                  className="text-slate-300 hover:text-rose-500 p-2 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <Trash2 size={18}/>
                </button>
              </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">New Specialty</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Specialty Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Cardiology" 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all" 
                  value={newSpecName}
                  onChange={e => setNewSpecName(e.target.value)} 
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 p-4 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                >
                  Save Specialty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}