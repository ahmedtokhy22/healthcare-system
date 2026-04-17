import React, { useState } from 'react';
import { TestTube, Home, DollarSign, Plus, Edit2, Trash2, Save, X } from "lucide-react";

export default function LabTestManagement() {
  // 1. الحالة (State) لقائمة التحاليل
  const [tests, setTests] = useState([
    { id: 1, name: "Complete Blood Count (CBC)", desc: "Measures different components of blood", price: "45", pre: "Fasting not required" },
    { id: 2, name: "Lipid Panel", desc: "Checks cholesterol levels", price: "65", pre: "12-hour fasting required" },
    { id: 3, name: "HbA1c (Diabetes Test)", desc: "Measures average blood sugar levels", price: "55", pre: "No fasting required" }
  ]);

  // 2. الحالة لسعر الزيارة المنزلية
  const [homeVisitPrice, setHomeVisitPrice] = useState(50);
  const [isEditingHomeVisit, setIsEditingHomeVisit] = useState(false);

  // 3. الحالة لإضافة/تعديل تحليل جديد (Modal State)
  const [showModal, setShowModal] = useState(false);
  const [currentTest, setCurrentTest] = useState({ name: '', desc: '', price: '', pre: '' });
  const [isEditingTest, setIsEditingTest] = useState(null); // يحمل الـ ID لو بنعدل

  // --- الوظائف (Functions) ---

  // حذف تحليل
  const deleteTest = (id) => {
    if(window.confirm("Are you sure you want to delete this test?")) {
        setTests(tests.filter(t => t.id !== id));
    }
  };

  // فتح المودال للإضافة
  const openAddModal = () => {
    setIsEditingTest(null);
    setCurrentTest({ name: '', desc: '', price: '', pre: '' });
    setShowModal(true);
  };

  // فتح المودال للتعديل
  const openEditModal = (test) => {
    setIsEditingTest(test.id);
    setCurrentTest(test);
    setShowModal(true);
  };

  // حفظ التحليل (إضافة أو تعديل)
  const saveTest = () => {
    if(isEditingTest) {
        setTests(tests.map(t => t.id === isEditingTest ? { ...currentTest } : t));
    } else {
        setTests([...tests, { ...currentTest, id: Date.now() }]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-700 relative">
      
      {/* Modal - نافذة الإضافة والتعديل */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
                <h3 className="text-xl font-black text-slate-800">{isEditingTest ? 'Edit Test' : 'Add New Test'}</h3>
                <div className="space-y-4">
                    <input type="text" placeholder="Test Name" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 font-bold text-sm" 
                           value={currentTest.name} onChange={e => setCurrentTest({...currentTest, name: e.target.value})} />
                    <input type="text" placeholder="Description" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 font-bold text-sm"
                           value={currentTest.desc} onChange={e => setCurrentTest({...currentTest, desc: e.target.value})} />
                    <input type="number" placeholder="Price ($)" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 font-bold text-sm"
                           value={currentTest.price} onChange={e => setCurrentTest({...currentTest, price: e.target.value})} />
                    <input type="text" placeholder="Prerequisites" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 font-bold text-sm"
                           value={currentTest.pre} onChange={e => setCurrentTest({...currentTest, pre: e.target.value})} />
                </div>
                <div className="flex gap-3">
                    <button onClick={saveTest} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">Save</button>
                    <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 text-slate-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                </div>
            </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Test Management</h2>
          <p className="text-slate-400 text-xs font-bold mt-1 italic">Manage available lab tests and pricing</p>
        </div>
        <button onClick={openAddModal} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
          <Plus size={16} /> Add Test
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="Available Tests" value={tests.length} icon={<TestTube size={20}/>} color="text-blue-500" />
        <StatCard label="Home Visit Price" value={`$${homeVisitPrice}`} icon={<Home size={20}/>} color="text-green-500" />
        <StatCard label="Avg. Test Price" value={`$${tests.length ? Math.round(tests.reduce((acc, t) => acc + Number(t.price), 0) / tests.length) : 0}`} icon={<DollarSign size={20}/>} color="text-purple-500" />
      </div>

      {/* Home Visit Pricing Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="space-y-1">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Home Visit Pricing</h4>
            <p className="text-slate-400 text-xs font-medium">Set your home visit service fee (applies to all tests)</p>
          </div>
          <button 
            onClick={() => setIsEditingHomeVisit(!isEditingHomeVisit)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-100 rounded-xl text-[10px] font-black text-blue-600 uppercase hover:bg-slate-50 transition-all"
          >
            {isEditingHomeVisit ? <><Save size={14} /> Save</> : <><Edit2 size={14} /> Edit Fee</>}
          </button>
        </div>
        
        {isEditingHomeVisit ? (
            <input 
              type="number" 
              value={homeVisitPrice} 
              onChange={(e) => setHomeVisitPrice(e.target.value)}
              className="text-2xl font-black text-blue-600 bg-slate-50 border border-blue-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 w-32"
            />
        ) : (
            <div className="flex items-center gap-3 text-slate-700 font-bold bg-slate-50/50 p-4 rounded-2xl w-fit border border-slate-100">
              <div className="text-green-500 bg-white p-2.5 rounded-lg shadow-sm">
                <Home size={18} />
              </div>
              <span className="text-sm tracking-tight">${homeVisitPrice} per home visit</span>
            </div>
        )}
      </div>

      {/* Test Catalog */}
      <div className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm space-y-6">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest underline decoration-blue-100 decoration-4">
            Your Test Catalog ({tests.length})
        </h4>
        <div className="space-y-4">
          {tests.map((test) => (
            <div key={test.id} className="p-6 border border-slate-50 rounded-[2rem] flex justify-between items-center group hover:border-blue-100 hover:bg-blue-50/10 transition-all duration-300 gap-4 flex-wrap md:flex-nowrap">
              <div className="space-y-1 flex-grow">
                <h5 className="font-black text-slate-700 tracking-tight">{test.name}</h5>
                <p className="text-slate-400 text-xs font-medium">{test.desc}</p>
                <div className="flex gap-4 mt-2.5 flex-wrap">
                  <p className="text-[11px] font-black text-slate-600">Price: <span className="text-blue-600">${test.price}</span></p>
                  <p className="text-[10px] font-bold text-slate-300 italic">Prerequisites: {test.pre}</p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <button onClick={() => openEditModal(test)} className="p-3 bg-white border border-slate-100 text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => deleteTest(test.id)} className="p-3 bg-white border border-slate-100 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {tests.length === 0 && (
            <div className="text-center py-10 text-slate-300 font-bold italic">No tests found. Add your first test!</div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm flex justify-between items-center">
      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5">{label}</p>
        <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{value}</h3>
      </div>
      <div className={`p-4 bg-slate-50 rounded-2xl ${color}`}>
        {icon}
      </div>
    </div>
  );
}