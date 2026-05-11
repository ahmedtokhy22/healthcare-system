import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserPlus, ShieldCheck, Trash2, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // جلب قائمة المستخدمين من الـ API
    axios.get("http://localhost:5173/api/Admin/Users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setUsers(res.data))
    .catch(err => console.error("Error fetching users"));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">إدارة الطاقم الطبي</h2>
          <p className="text-slate-400 text-sm">إدارة حسابات الأطباء، التمريض، وفنيي المختبر</p>
        </div>
        <Link to="/admin/users" className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-900 transition-all shadow-lg shadow-blue-100">
          <UserPlus size={18}/> إضافة حساب جديد
        </Link>
      </div>

      {/* شريط البحث */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
        <input 
          placeholder="ابحث بالاسم أو البريد الإلكتروني..." 
          className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:ring-2 focus:ring-blue-600 transition-all outline-none"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* جدول المستخدمين */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-right">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase">المستخدم</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase">الدور</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase">الحالة</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.filter(u => u.name.includes(searchTerm)).map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">{user.name[0]}</div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{user.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                    {user.role}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
                    <ShieldCheck size={14}/> نشط
                  </div>
                </td>
                <td className="p-6">
                  <button className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                    <Trash2 size={18}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}