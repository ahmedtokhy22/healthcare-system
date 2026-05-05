import React, { useState } from 'react';
import { TestTube, Home, DollarSign, Plus, Edit2, Trash2, Save, X, Info } from "lucide-react";

export default function LabTestManagement() {
  // 1. البيانات الأولية للتحاليل
  const [tests, setTests] = useState([
    { id: 1, name: "Complete Blood Count (CBC)", desc: "Measures different components of blood", price: "450", pre: "Fasting not required" },
    { id: 2, name: "Lipid Panel", desc: "Checks cholesterol levels", price: "650", pre: "12-hour fasting required" },
    { id: 3, name: "HbA1c (Diabetes Test)", desc: "Measures average blood sugar levels", price: "550", pre: "No fasting required" }
  ]);

  const [homeVisitPrice, setHomeVisitPrice] = useState(150);
  const [isEditingHomeVisit, setIsEditingHomeVisit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentTest, setCurrentTest] = useState({ name: '', desc: '', price: '', pre: '' });
  const [isEditingTest, setIsEditingTest] = useState(null);

  const deleteTest = (id) => {
    if(window.confirm("Are you sure you want to delete this test?")) {
        setTests(tests.filter(t => t.id !== id));
    }
  };

  const openAddModal = () => {
    setIsEditingTest(null);
    setCurrentTest({ name: '', desc: '', price: '', pre: '' });
    setShowModal(true);
  };

  const openEditModal = (test) => {
    setIsEditingTest(test.id);
    setCurrentTest(test);
    setShowModal(true);
  };

  const saveTest = () => {
    if (!currentTest.name || !currentTest.price) return alert("Please fill name and price");
    
    if(isEditingTest) {
        setTests(tests.map(t => t.id === isEditingTest ? { ...currentTest } : t));
    } else {
        setTests([...tests, { ...currentTest, id: Date.now() }]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-700 font-sans p-2">
      
      {/* Modal - Improved UI */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl space-y-6 animate-in zoom-in-95 duration-300 relative">
                <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-600">
                    <X size={20} />
                </button>
                
                <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                        {isEditingTest ? 'Edit Test' : 'Add New Test'}
                    </h3>
                    <p className="text-slate-400 text-xs font-bold italic">Enter test details below</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Test Name</label>
                        <input type="text" placeholder="e.g. Vitamin D" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 font-bold text-sm" 
                               value={currentTest.name} onChange={e => setCurrentTest({...currentTest, name: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Description</label>
                        <input type="text" placeholder="Short description" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 font-bold text-sm"
                               value={currentTest.desc} onChange={e => setCurrentTest({...currentTest, desc: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Price (EGP)</label>
                            <input type="number" placeholder="0.00" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 font-bold text-sm"
                                   value={currentTest.price} onChange={e => setCurrentTest({...currentTest, price: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Conditions</label>
                            <input type="text" placeholder="e.g. Fasting" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 font-bold text-sm"
                                   value={currentTest.pre} onChange={e => setCurrentTest({...currentTest, pre: e.target.value})} />
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 pt-4">
                    <button onClick={saveTest} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">Save Changes</button>
                    <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 text-slate-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                </div>
            </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center gap-4 flex-wrap text-left">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Test Management</h2>
          <p className="text-slate-400 text-xs font-bold mt-1 italic flex items-center gap-2">
            <Info size={14} className="text-blue-500" /> Control your catalog and service fees
          </p>
        </div>
        <button onClick={openAddModal} className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl hover:bg-blue-600 transition-all">
          <Plus size={16} /> Add New Test
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="Live Catalog" value={tests.length} icon={<TestTube size={20}/>} color="text-blue-500" />
        <StatCard label="Home Fee" value={`${homeVisitPrice} EGP`} icon={<Home size={20}/>} color="text-green-500" />
        <StatCard label="Avg. Rate" value={`${tests.length ? Math.round(tests.reduce((acc, t) => acc + Number(t.price), 0) / tests.length) : 0} EGP`} icon={<DollarSign size={20}/>} color="text-purple-500" />
      </div>

      {/* Home Visit Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
        <div className="space-y-1">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Home Visit Service Fee</h4>
          <p className="text-slate-400 text-xs font-medium italic">Fixed fee applied to any home service request</p>
        </div>
        
        <div className="flex items-center gap-4">
            {isEditingHomeVisit ? (
                <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={homeVisitPrice} 
                      onChange={(e) => setHomeVisitPrice(e.target.value)}
                      className="text-xl font-black text-blue-600 bg-slate-50 border border-blue-100 px-4 py-2 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 w-28"
                    />
                    <button onClick={() => setIsEditingHomeVisit(false)} className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 hover:scale-105 transition-all">
                        <Save size={18} />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-slate-700">{homeVisitPrice} <span className="text-xs text-slate-300 uppercase">EGP</span></span>
                    <button 
                        onClick={() => setIsEditingHomeVisit(true)}
                        className="px-4 py-2 border border-slate-100 rounded-xl text-[10px] font-black text-blue-600 uppercase hover:bg-blue-50 transition-all"
                    >
                        Change Fee
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Test Catalog List */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm space-y-8 text-left">
        <h4 className="font-black text-slate-700 flex items-center gap-2 underline decoration-blue-100 decoration-4 underline-offset-8">
            Current Test Catalog
        </h4>
        <div className="grid grid-cols-1 gap-4">
          {tests.map((test) => (
            <div key={test.id} className="p-8 border border-slate-50 rounded-[2.5rem] flex justify-between items-center group hover:border-blue-100 hover:bg-blue-50/10 transition-all duration-500 gap-6 flex-wrap md:flex-nowrap">
              <div className="space-y-2 flex-grow">
                <div className="flex items-center gap-3">
                    <h5 className="font-black text-slate-700 text-lg tracking-tight">{test.name}</h5>
                    <span className="px-3 py-1 bg-slate-100 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-tighter">{test.pre}</span>
                </div>
                <p className="text-slate-400 text-xs font-medium max-w-md">{test.desc}</p>
                <p className="text-lg font-black text-blue-600">{test.price} <span className="text-[10px] text-slate-300 uppercase tracking-widest">EGP</span></p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => openEditModal(test)} className="p-4 bg-slate-50 text-slate-400 rounded-[1.2rem] hover:bg-blue-600 hover:text-white hover:rotate-12 transition-all duration-300">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => deleteTest(test.id)} className="p-4 bg-slate-50 text-slate-400 rounded-[1.2rem] hover:bg-red-500 hover:text-white hover:-rotate-12 transition-all duration-300">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          
          {tests.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                <TestTube size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-black italic">Your catalog is empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex justify-between items-center text-left hover:shadow-lg transition-all duration-500">
      <div className="space-y-1">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{label}</p>
        <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{value}</h3>
      </div>
      <div className={`p-4 bg-slate-50 rounded-[1.2rem] ${color} shadow-inner`}>
        {icon}
      </div>
    </div>
  );
}