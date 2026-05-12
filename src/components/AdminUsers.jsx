import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, UserPlus, ToggleLeft, ToggleRight, X, Loader2, ChevronDown } from "lucide-react";

export default function UserManagement() {
  const [items, setItems] = useState([]); 
  const [pagination, setPagination] = useState({ pageNumber: 1, totalPages: 1 });
  const [query, setQuery] = useState({ pageNumber: 1, search: "", role: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  
  const [formData, setFormData] = useState({
    name: "", email: "", role: "Doctor", gender: "male", address: "", phoneNumber: "", city: "", specialityId: ""
  });

  const API = "https://healthcare52.runasp.net/api";
  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  useEffect(() => { 
    fetchUsers(query.pageNumber === 1); 
  }, [query]);

  const fetchUsers = async (isReset) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/Users?pageNumber=${query.pageNumber}&search=${query.search}&role=${query.role}`, { headers });
      
      if (isReset) {
        setItems(res.data.items);
      } else {
        setItems(prev => [...prev, ...res.data.items]); 
      }
      
      setPagination({ 
        pageNumber: res.data.pageNumber, 
        totalPages: res.data.totalPages 
      });
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleLoadMore = () => {
    if (query.pageNumber < pagination.totalPages) {
      setQuery(prev => ({ ...prev, pageNumber: prev.pageNumber + 1 }));
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(`${API}/Users/${id}/toggle-status`, {}, { headers });
      setItems(prev => prev.map(u => u.id === id ? { ...u, isDisabled: !u.isDisabled } : u));
    } catch (err) { alert("Action failed"); }
  };

  const openModal = async () => {
    try {
      const [cityRes, specRes] = await Promise.all([
        axios.get(`${API}/Locations/cities`),
        axios.get(`${API}/Specialties`)
      ]);
      setCities(cityRes.data);
      setSpecialties(specRes.data);
      setIsModalOpen(true);
    } catch (err) { alert("Could not load form data"); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // --- PHONE NUMBER VALIDATION ---
    const phoneRegex = /^[0-9]{11}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      alert("Phone number must be exactly 11 digits and contain only numbers.");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      address: formData.address,
      phoneNumber: formData.phoneNumber,
      city: formData.city,
      role: formData.role
    };

    if (formData.role !== "Lab") {
      payload.gender = formData.gender.toLowerCase();
    }

    if (formData.role === "Doctor") {
      payload.specialityId = formData.specialityId;
    }

    try {
      await axios.post(`${API}/Users/medical-staff-registeration`, payload, { headers });
      setIsModalOpen(false);
      setQuery({ ...query, pageNumber: 1 }); 
      alert("Staff registered successfully!");
      setFormData({ name: "", email: "", role: "Doctor", gender: "male", address: "", phoneNumber: "", city: "", specialityId: "" });
    } catch (err) { 
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Registration failed."); 
    }
  };

  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] border-none shadow-sm font-bold text-sm bg-white focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Search users..."
            onChange={e => setQuery({...query, search: e.target.value, pageNumber: 1})}
          />
        </div>
        <select 
          className="rounded-[1.5rem] border-none shadow-sm font-bold px-8 py-5 text-sm bg-white cursor-pointer appearance-none"
          onChange={e => setQuery({...query, role: e.target.value, pageNumber: 1})}
        >
          <option value="">All Roles</option>
          <option value="Patient">Patient</option>
          <option value="Doctor">Doctor</option>
          <option value="Nurse">Nurse</option>
          <option value="Lab">Lab</option>
        </select>
        <button onClick={openModal} className="bg-slate-900 text-white px-8 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl">
          <UserPlus size={18}/> Add Staff
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">User Details</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Role</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map(user => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-all">
                <td className="px-8 py-6">
                  <div className="font-black text-slate-800 text-sm">{user.name}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{user.email}</div>
                </td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase">{user.role}</span>
                </td>
                <td className="px-8 py-6">
                  <div className={`flex items-center gap-2 text-[10px] font-black uppercase ${user.isDisabled ? 'text-rose-500' : 'text-emerald-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${user.isDisabled ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    {user.isDisabled ? 'Disabled' : 'Active'}
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                  <button onClick={() => toggleStatus(user.id)} className={`transition-all ${user.isDisabled ? 'text-rose-500' : 'text-emerald-500 hover:scale-110'}`}>
                    {user.isDisabled ? <ToggleLeft size={38}/> : <ToggleRight size={38}/>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {loading && <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-500" size={30} /></div>}

        {!loading && query.pageNumber < pagination.totalPages && (
          <div className="p-8 flex justify-center">
            <button 
              onClick={handleLoadMore}
              className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all"
            >
              Load More Users <ChevronDown size={14}/>
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-widest">Register Staff</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleRegister} className="p-10 grid grid-cols-2 gap-5">
              <input placeholder="Full Name" required className="p-4 bg-slate-50 rounded-xl border-none font-bold text-sm" onChange={e => setFormData({...formData, name: e.target.value})} />
              <input placeholder="Email Address" type="email" required className="p-4 bg-slate-50 rounded-xl border-none font-bold text-sm" onChange={e => setFormData({...formData, email: e.target.value})} />
              
              {/* Added maxLength="11" to Phone Input */}
              <input 
                placeholder="Phone Number" 
                required 
                maxLength="11"
                className="p-4 bg-slate-50 rounded-xl border-none font-bold text-sm" 
                onChange={e => setFormData({...formData, phoneNumber: e.target.value})} 
              />
              
              <input placeholder="Address" required className="p-4 bg-slate-50 rounded-xl border-none font-bold text-sm" onChange={e => setFormData({...formData, address: e.target.value})} />
              
              <select className="p-4 bg-slate-50 rounded-xl border-none font-bold text-sm" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value, specialityId: ""})}>
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Lab">Lab</option>
              </select>

              {formData.role !== "Lab" && (
                <select className="p-4 bg-slate-50 rounded-xl border-none font-bold text-sm" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              )}

              <select 
                required 
                className="p-4 bg-slate-50 rounded-xl border-none font-bold text-sm" 
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
              >
                <option value="">Select City</option>
                {cities.map((cityName, index) => (
                  <option key={index} value={cityName}>{cityName}</option>
                ))}
              </select>

              {formData.role === "Doctor" && (
                <select required className="p-4 bg-slate-50 rounded-xl border-none font-bold text-sm" value={formData.specialityId} onChange={e => setFormData({...formData, specialityId: e.target.value})}>
                  <option value="">Select Specialty</option>
                  {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              )}

              <button className="col-span-2 bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] mt-4 hover:bg-blue-700 shadow-xl transition-all">
                Confirm Registration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}