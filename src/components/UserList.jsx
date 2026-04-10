import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Loader2, UserX, CheckCircle, Shield, Users, Search } from "lucide-react";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      // الـ endpoint ده بيجيب كل المسجلين في الداتابيز
      const response = await api.get('/admin/all-users'); 
      setUsers(response.data.data || response.data);
    } catch (err) {
      console.error("Failed to fetch all users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // دالة البحث (عشان الأدمن يوصل ليوزر معين بسرعة)
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800">System Users</h1>
          <p className="text-slate-500 font-bold">Manage all registered accounts across the platform</p>
        </div>
        <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-blue-100">
          <Users size={20}/> Total: {users.length}
        </div>
      </div>

      {/* شريط البحث */}
      <div className="relative mb-6">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by name or email..."
          className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-100 font-bold transition-all"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[35px] shadow-xl overflow-hidden border border-slate-50">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-6 font-black text-slate-400 uppercase text-xs tracking-wider">User Info</th>
              <th className="p-6 font-black text-slate-400 uppercase text-xs tracking-wider">Role</th>
              <th className="p-6 font-black text-slate-400 uppercase text-xs tracking-wider">Status</th>
              <th className="p-6 font-black text-slate-400 uppercase text-xs tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black">
                      {user.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{user.name}</div>
                      <div className="text-sm text-slate-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className={`px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-2 w-fit
                    ${user.role === 'Admin' ? 'bg-purple-100 text-purple-600' : 
                      user.role === 'Doctor' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                    <Shield size={14}/> {user.role}
                  </span>
                </td>
                <td className="p-6">
                  <div className={`flex items-center gap-2 font-bold text-sm ${user.isBlocked ? 'text-red-500' : 'text-green-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${user.isBlocked ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    {user.isBlocked ? 'Suspended' : 'Active'}
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex justify-center gap-2">
                    <button 
                      title={user.isBlocked ? "Unblock User" : "Block User"}
                      className={`p-3 rounded-xl transition-all ${user.isBlocked ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                    >
                      {user.isBlocked ? <CheckCircle size={18}/> : <UserX size={18}/>}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="p-20 text-center text-slate-400 font-bold">No users found matching your search.</div>
        )}
      </div>
    </div>
  );
}