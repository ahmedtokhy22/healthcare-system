import React, { useState, useEffect } from "react";
import axios from "axios";
import { Beaker, Plus, Settings2, Trash2 } from "lucide-react";

export default function AdminTestsManagement() {
  const [tests, setTests] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // GET /api/Tests
    axios.get("http://localhost:5173/api/Tests", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setTests(res.data));
  }, []);

  const handleDelete = async (id) => {
    if(window.confirm("حذف هذا التحليل نهائياً؟")) {
      try {
        // DEL /api/Tests/{id}
        await axios.delete(`http://localhost:5173/api/Tests/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTests(tests.filter(t => t.id !== id));
      } catch (err) { alert("خطأ في الحذف"); }
    }
  };

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-800">قائمة التحاليل المتاحة</h1>
            <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">نظام Healthcare الشامل</p>
          </div>
          <button className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
            <Plus size={16} className="inline ml-2" /> إضافة تحليل جديد للمنظومة
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div key={test.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group hover:shadow-2xl hover:shadow-blue-50 transition-all">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Beaker size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-2">{test.name}</h3>
              <p className="text-slate-400 text-xs font-bold mb-6">BASE PRICE: {test.basePrice} EGP</p>
              
              <div className="flex gap-3 mt-4 border-t border-slate-50 pt-6">
                <button className="flex-1 bg-slate-50 text-slate-600 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all">
                  تعديل السعر
                </button>
                <button 
                  onClick={() => handleDelete(test.id)}
                  className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}