import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Edit3, TestTube, AlertCircle, X, CheckCircle2, Loader2 } from "lucide-react";

export default function TestManagement() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState(null); // للبيانات اللي بنعدلها
  const [newTest, setNewTest] = useState({ name: "", description: "", prerequisites: "" });

  const API = "https://healthcare52.runasp.net/api/Tests";
  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  useEffect(() => { fetchTests(); }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API, { headers });
      setTests(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error("Error fetching tests", err); }
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API, newTest, { headers });
      setNewTest({ name: "", description: "", preRequisites: "" });
      fetchTests();
      alert("Test added successfully!");
    } catch (err) { alert("Failed to add test"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      try {
        await axios.delete(`${API}/${id}`, { headers });
        fetchTests();
      } catch (err) { alert("Delete failed"); }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/${currentTest.id}`, currentTest, { headers });
      setIsEditModalOpen(false);
      fetchTests();
    } catch (err) { alert("Update failed"); }
  };

  const openEditModal = (test) => {
    setCurrentTest(test);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black flex items-center gap-4 tracking-tighter text-slate-800 uppercase">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
            <TestTube size={28} />
          </div>
          Laboratory Tests Management
        </h1>
      </div>

      {/* Add Test Form */}
      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 mb-12">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-6 flex items-center gap-2">
          <Plus size={14} /> Register New Analysis
        </h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Test Name</label>
            <input 
              placeholder="e.g. Glucose Test" 
              required 
              className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-none text-sm focus:ring-2 focus:ring-blue-500 transition-all" 
              value={newTest.name} 
              onChange={e => setNewTest({...newTest, name: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Description</label>
            <input 
              placeholder="What is this test for?" 
              className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-none text-sm focus:ring-2 focus:ring-blue-500 transition-all" 
              value={newTest.description} 
              onChange={e => setNewTest({...newTest, description: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">preRequisites</label>
            <input 
              placeholder="e.g. Fasting 12 hours" 
              className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-none text-sm focus:ring-2 focus:ring-blue-500 transition-all" 
              value={newTest.preRequisites} 
              onChange={e => setNewTest({...newTest, preRequisites: e.target.value})} 
            />
          </div>
          <button className="md:col-span-3 bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all mt-2">
            Confirm & Save Test
          </button>
        </form>
      </div>

      {/* Tests List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
           <div className="col-span-2 flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={40}/></div>
        ) : tests.map(test => (
          <div key={test.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 flex justify-between items-start group shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all duration-300">
            <div className="space-y-3">
              <div>
                <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest">Lab Test</span>
                <h3 className="font-black text-slate-800 uppercase text-lg tracking-tighter mt-2">{test.name}</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs">{test.description || "No description provided for this test."}</p>
              <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-xl w-fit">
                <AlertCircle size={14} />
                <span className="text-[10px] font-black uppercase">{test.preRequisites || "No specific instructions"}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
              <button onClick={() => openEditModal(test)} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                <Edit3 size={18}/>
              </button>
              <button onClick={() => handleDelete(test.id)} className="p-4 bg-rose-50 text-rose-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                <Trash2 size={18}/>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <h2 className="font-black uppercase tracking-widest text-sm">Update Test Details</h2>
              <button onClick={() => setIsEditModalOpen(false)}><X /></button>
            </div>
            <form onSubmit={handleUpdate} className="p-10 space-y-6">
              <input 
                className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-none" 
                value={currentTest.name} 
                onChange={e => setCurrentTest({...currentTest, name: e.target.value})} 
              />
              <textarea 
                placeholder="Description"
                className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-none h-32" 
                value={currentTest.description} 
                onChange={e => setCurrentTest({...currentTest, description: e.target.value})} 
              />
              <input 
                placeholder="preRequisites"
                className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-none" 
                value={currentTest.preRequisites} 
                onChange={e => setCurrentTest({...currentTest, preRequisites: e.target.value})} 
              />
              <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-100">
                Update Analysis
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}