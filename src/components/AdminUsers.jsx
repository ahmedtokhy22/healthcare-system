import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Trash2, UserPlus, Search } from "lucide-react";
import api from '../api/axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // جلب كل المستخدمين
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await api.get('/api/Admin/all-users'); // الـ Endpoint من الـ Swagger بتاعك
        setUsers(res.data);
      } catch (err) { console.error("Error fetching users"); }
    };
    getUsers();
  }, []);

  // وظيفة البلوك
  const handleToggleBlock = async (userId, isBlocked) => {
    try {
      await api.post(`/api/Admin/${isBlocked ? 'unblock' : 'block'}/${userId}`);
      setUsers(users.map(u => u.id === userId ? {...u, isBlocked: !isBlocked} : u));
    } catch (err) { alert("Failed to change status"); }
  };

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-slate-800">System Users</h1>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2">
          <UserPlus size={16}/> Add New User
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-5 text-[10px] font-black uppercase text-slate-400">User Details</th>
              <th className="p-5 text-[10px] font-black uppercase text-slate-400">Role</th>
              <th className="p-5 text-[10px] font-black uppercase text-slate-400">Status</th>
              <th className="p-5 text-[10px] font-black uppercase text-slate-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50">
                <td className="p-5">
                  <p className="font-bold text-slate-700">{u.name}</p>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </td>
                <td className="p-5">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase">{u.role}</span>
                </td>
                <td className="p-5">
                  {u.isBlocked ? <span className="text-red-500 font-bold text-xs">Blocked</span> : <span className="text-emerald-500 font-bold text-xs">Active</span>}
                </td>
                <td className="p-5">
                  <button 
                    onClick={() => handleToggleBlock(u.id, u.isBlocked)}
                    className={`p-2 rounded-lg ${u.isBlocked ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}
                  >
                    {u.isBlocked ? <ShieldCheck size={18}/> : <ShieldAlert size={18}/>}
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