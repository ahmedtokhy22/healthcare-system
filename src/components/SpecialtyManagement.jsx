import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Edit2, Search, Loader2, X } from "lucide-react";

export default function SpecialtyManagement() {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSpecName, setNewSpecName] = useState(""); 

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSpecName, setEditSpecName] = useState("");
  const [editSpecId, setEditSpecId] = useState(null);

  const API_BASE = 'https://healthcare52.runasp.net/api';
  const token = localStorage.getItem('token');
  const headers = { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json' 
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

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    // إغلاق النافذة فوراً لسرعة الاستجابة
    setIsAddModalOpen(false);
    
    try {
      await axios.post(`${API_BASE}/Specialties`, 
        { name: newSpecName }, 
        { headers }
      );
      setNewSpecName(""); 
      fetchData();
      alert("Specialty added successfully!");
    } catch (err) { 
      alert(err.response?.data?.message || "Error adding specialty"); 
    }
  };

  const openEditModal = (spec) => {
    setEditSpecId(spec.id);
    setEditSpecName(spec.name);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedName = editSpecName.trim();
    const currentId = editSpecId; // حفظ الـ ID لاستخدامه
    
    // 1. إغلاق النافذة فوراً دون انتظار السيرفر (استجابة لحظية)
    setIsEditModalOpen(false);
    
    // 2. تحديث الاسم في الشاشة فوراً
    setSpecialties(prevSpecs => 
      prevSpecs.map(spec => 
        spec.id === currentId ? { ...spec, name: updatedName } : spec
      )
    );
    
    try {
      // 3. إرسال الطلب للسيرفر في الخلفية
      await axios.put(`${API_BASE}/Specialties/${currentId}`, 
        { name: updatedName }, 
        { headers }
      );
      
      alert("Specialty updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
      fetchData(); // إذا فشل التحديث في السيرفر، نعيد جلب البيانات القديمة
    } finally {
      setEditSpecName("");
      setEditSpecId(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this specialty?")) {
      try {
        await axios.delete(`${API_BASE}/Specialties/${id}`, { headers });
        fetchData();
        alert("Specialty deleted successfully!");
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
            type="button"
            onClick={() => setIsAddModalOpen(true)} 
            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg cursor-pointer"
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
                <div className="flex gap-1">
                  
                  <button 
                    type="button"
                    onClick={() => openEditModal(spec)} 
                    className="text-slate-300 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                  >
                    <Edit2 size={16}/>
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => handleDelete(spec.id)} 
                    className="text-slate-300 hover:text-rose-500 p-2 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 size={18}/>
                  </button>
                  
                </div>
              </div>
          ))}
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">New Specialty</h2>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={20}/></button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-5">
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
                  onClick={() => setIsAddModalOpen(false)} 
                  className="flex-1 p-4 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all cursor-pointer"
                >
                  Save Specialty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Edit Specialty</h2>
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={20}/></button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Update Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Enter new name" 
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all" 
                  value={editSpecName}
                  onChange={e => setEditSpecName(e.target.value)} 
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="flex-1 p-4 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all cursor-pointer"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}