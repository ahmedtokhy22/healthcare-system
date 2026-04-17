import React, { useState } from 'react';
import { 
  Users, UserPlus, ShieldAlert, ShieldCheck, 
  Stethoscope, Microscope, HeartPulse, Trash2, Search, X 
} from "lucide-react";

export default function AdminPanel() {
  // 1. الداتا الأساسية (المفروض تيجي من Laravel بعدين)
  const [users, setUsers] = useState([
    { id: "D-742", name: "Dr. Ahmed Ibrahim", role: "Doctor", status: "Active", email: "ahmed@health.com" },
    { id: "L-901", name: "Modern Lab Services", role: "Lab", status: "Active", email: "contact@modernlab.com" },
    { id: "N-112", name: "Soraia Mohamed", role: "Nursing", status: "Blocked", email: "soraia.m@care.com" },
    { id: "D-550", name: "Dr. Sara Younis", role: "Doctor", status: "Active", email: "sara.y@clinic.com" }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // حالة الفورم لإضافة عضو جديد
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Doctor', password: '' });

  // --- الوظائف الفعالة (Logic) ---

  // إضافة حساب جديد
  const handleCreateAccount = (e) => {
    e.preventDefault();
    const prefix = newUser.role === 'Doctor' ? 'D' : newUser.role === 'Lab' ? 'L' : 'N';
    const id = `${prefix}-${Math.floor(Math.random() * 900) + 100}`;
    
    setUsers([{ ...newUser, id, status: 'Active' }, ...users]);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: 'Doctor', password: '' }); // تصفير الفورم
  };

  // عمل Block أو Unblock
  const toggleStatus = (id) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: u.status === 'Active' ? 'Blocked' : 'Active' } : u
    ));
  };

  // حذف نهائي
  const deleteUser = (id) => {
    if(window.confirm("Are you sure you want to delete this account permanently?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Modal: نافذة إضافة حساب جديد */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300 relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition-colors">
                <X size={24}/>
            </button>
            
            <div className="mb-8">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Create New Member</h3>
              <p className="text-slate-400 text-xs font-bold mt-1 uppercase italic">System Management</p>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-5">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Select Account Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Doctor', 'Lab', 'Nursing'].map(role => (
                    <button 
                      key={role} type="button"
                      onClick={() => setNewUser({...newUser, role})}
                      className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${newUser.role === role ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'}`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <input type="text" placeholder="Full Name" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 font-bold text-sm" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                <input type="email" placeholder="Email Address" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 font-bold text-sm" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                <input type="password" placeholder="Assign Password" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 font-bold text-sm" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all mt-4">
                Confirm & Create
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-end flex-wrap gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter">System Access</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic flex items-center gap-2">
            <ShieldCheck size={14} className="text-blue-500"/> Administrative Control Panel
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-10 py-5 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.15em] flex items-center gap-3 shadow-2xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all"
        >
          <UserPlus size={20} /> New Account
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <StatCard label="Doctors" value={users.filter(u => u.role === 'Doctor').length} icon={<Stethoscope size={22}/>} color="text-blue-500" />
        <StatCard label="Lab Centers" value={users.filter(u => u.role === 'Lab').length} icon={<Microscope size={22}/>} color="text-green-500" />
        <StatCard label="Nursing" value={users.filter(u => u.role === 'Nursing').length} icon={<HeartPulse size={22}/>} color="text-purple-500" />
      </div>

      {/* Main Table Container */}
      <div className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm space-y-10">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-3">
            <Users size={16} className="text-blue-500"/> Registered Members ({users.length})
          </h4>
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Quick search by name..." 
              className="pl-14 pr-8 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold w-80 outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all shadow-inner"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead>
              <tr className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                <th className="px-8 py-2 text-center">ID</th>
                <th className="px-8 py-2">Full Name & Email</th>
                <th className="px-8 py-2">Account Type</th>
                <th className="px-8 py-2">Status</th>
                <th className="px-8 py-2 text-right pr-12">Controls</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map((user) => (
                <tr key={user.id} className="group hover:translate-x-1 transition-all duration-300">
                  <td className="bg-slate-50/50 px-6 py-6 rounded-l-[2rem] border-y border-l border-slate-50 text-center">
                    <span className="text-[10px] font-black text-slate-400 bg-white px-3 py-2 rounded-xl border border-slate-100 shadow-sm">{user.id}</span>
                  </td>
                  <td className="bg-white px-8 py-6 border-y border-slate-50 shadow-sm">
                    <p className="text-[15px] font-black text-slate-700 tracking-tight">{user.name}</p>
                    <p className="text-[11px] text-slate-400 font-bold mt-0.5">{user.email}</p>
                  </td>
                  <td className="bg-white px-8 py-6 border-y border-slate-50 shadow-sm">
                    <span className={`text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-tighter ${
                      user.role === 'Doctor' ? 'bg-blue-50 text-blue-600' : 
                      user.role === 'Lab' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="bg-white px-8 py-6 border-y border-slate-50 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                      <span className={`text-[11px] font-black uppercase ${user.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{user.status}</span>
                    </div>
                  </td>
                  <td className="bg-white px-8 py-6 rounded-r-[2rem] border-y border-r border-slate-50 shadow-sm text-right pr-10">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button 
                        onClick={() => toggleStatus(user.id)}
                        className={`p-3 rounded-2xl transition-all shadow-sm ${user.status === 'Active' ? 'bg-amber-50 text-amber-500 hover:bg-amber-500 hover:text-white' : 'bg-green-50 text-green-500 hover:bg-green-500 hover:text-white'}`}
                      >
                        {user.status === 'Active' ? <ShieldAlert size={18}/> : <ShieldCheck size={18}/>}
                      </button>
                      <button 
                        onClick={() => deleteUser(user.id)}
                        className="p-3 bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm shadow-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-20 text-slate-200 font-black italic text-xl uppercase tracking-widest">No Members Found</div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm flex justify-between items-center hover:shadow-2xl hover:shadow-slate-200/40 hover:-translate-y-1 transition-all duration-500 group">
      <div className="space-y-1">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
        <h3 className="text-4xl font-black text-slate-800 tracking-tighter leading-none">{value}</h3>
      </div>
      <div className={`p-5 bg-slate-50 rounded-[1.5rem] ${color} group-hover:scale-110 transition-all duration-500 shadow-inner`}>
        {icon}
      </div>
    </div>
  );
}