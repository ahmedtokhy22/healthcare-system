import React, { useState, useRef, useMemo } from 'react';
import { 
  Calendar, Clock, MapPin, TestTube, Search, Activity, 
  Home, Users, CheckCircle, Upload, FileText, X, Filter, Trash2
} from "lucide-react";

export default function LabAppointments() {
  const [activeSubTab, setActiveSubTab] = useState('All Appointments');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const fileInputRef = useRef(null);
  const [uploadingFor, setUploadingFor] = useState(null);

  const [appointments, setAppointments] = useState([
    { id: "P001", name: "John Doe", status: "Confirmed", date: "2/4/2026", time: "08:00-13:00", type: "In-Lab", tests: "Blood Test, CBC", resultsUploaded: false },
    { id: "P002", name: "Jane Smith", status: "Confirmed", date: "2/4/2026", time: "14:00-18:00", type: "In-Lab", tests: "X-Ray, Chest", resultsUploaded: false },
    { id: "P003", name: "Bob Johnson", status: "Confirmed", date: "2/5/2026", time: "08:00-13:00", type: "Home Visit", tests: "Blood Test", location: "123 Main St, Springfield", resultsUploaded: false },
    { id: "P004", name: "Sarah Williams", status: "Completed", date: "2/3/2026", time: "08:00-13:00", type: "In-Lab", tests: "Blood Test, Lipid Panel", resultsUploaded: true },
  ]);

  const [globalHours, setGlobalHours] = useState({ from: "10:00 AM", to: "01:00 PM" });
  const [schedule, setSchedule] = useState([
    { day: "Monday", active: true }, { day: "Tuesday", active: true },
    { day: "Wednesday", active: true }, { day: "Thursday", active: true },
    { day: "Friday", active: true }, { day: "Saturday", active: true },
    { day: "Sunday", active: false },
  ]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || app.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'All' || app.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filterType, appointments]);

  const handleUploadClick = (id) => { setUploadingFor(id); fileInputRef.current.click(); };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && uploadingFor) {
      setAppointments(prev => prev.map(app => app.id === uploadingFor ? { ...app, resultsUploaded: true, status: 'Completed' } : app));
      setUploadingFor(null);
    }
  };
  const toggleDay = (dayName) => setSchedule(schedule.map(d => d.day === dayName ? { ...d, active: !d.active } : d));

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-700 font-sans p-2">
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.png,.jpg" />

      <div className="flex justify-between items-end gap-6 flex-wrap">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Lab Management</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic">Control appointments & results</p>
        </div>
      </div>

      {activeSubTab !== 'Schedule' && (
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search patient..." className="pl-12 pr-6 py-3 bg-slate-50 border border-transparent rounded-2xl text-xs font-bold outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all w-full md:w-64" />
          </div>
          <div className="bg-slate-100/50 p-1 rounded-2xl flex gap-1 border border-slate-100 h-fit">
            {['All', 'In-Lab', 'Home Visit'].map((type) => (
              <button key={type} onClick={() => setFilterType(type)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filterType === type ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{type}</button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-slate-100/50 p-1.5 rounded-[1.5rem] flex w-full md:w-fit gap-2 border border-slate-100">
        {['All Appointments', 'Pending Results', 'Schedule'].map((tab) => (
          <button key={tab} onClick={() => setActiveSubTab(tab)} className={`px-8 py-3 rounded-xl flex-1 md:flex-none text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeSubTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
            {tab}
            {tab === 'Pending Results' && appointments.filter(a => !a.resultsUploaded).length > 0 && (
              <span className="bg-red-500 text-white w-4 h-4 rounded-full text-[8px] flex items-center justify-center font-bold">{appointments.filter(a => !a.resultsUploaded).length}</span>
            )}
          </button>
        ))}
      </div>

      {activeSubTab === 'All Appointments' && (
        <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm space-y-6">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={14}/> {filterType} Appointments ({filteredAppointments.length})</h4>
          <div className="space-y-4">
            {filteredAppointments.map(app => <AppointmentCard key={app.id} {...app} />)}
          </div>
        </div>
      )}

      {activeSubTab === 'Pending Results' && (
        <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm space-y-8">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Upload size={14}/> Waiting for Results</h4>
          <div className="space-y-4">
            {appointments.filter(a => !a.resultsUploaded).map(app => (
              <div key={app.id} className="p-6 border border-slate-50 rounded-[2rem] flex justify-between items-center bg-white shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black">{app.name[0]}</div>
                  <div><h5 className="font-black text-slate-700">{app.name}</h5><p className="text-[10px] text-slate-400 font-bold uppercase">{app.tests}</p></div>
                </div>
                <button onClick={() => handleUploadClick(app.id)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-50">Upload Result</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'Schedule' && (
        <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm space-y-8 animate-in fade-in">
          <div className="bg-[#f0f9ff]/50 p-8 rounded-[2.5rem] border border-[#bae6fd]">
            <h4 className="font-black text-slate-700 mb-2">Operating Hours</h4>
            <div className="mt-6 flex flex-wrap gap-4 items-center">
              <input type="text" value={globalHours.from} onChange={(e) => setGlobalHours({...globalHours, from: e.target.value})} className="px-4 py-2 bg-white border border-slate-100 rounded-lg text-sm font-black w-32 text-center" />
              <span className="text-slate-400 font-black">To</span>
              <input type="text" value={globalHours.to} onChange={(e) => setGlobalHours({...globalHours, to: e.target.value})} className="px-4 py-2 bg-white border border-slate-100 rounded-lg text-sm font-black w-32 text-center" />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase ml-auto">Update Schedule</button>
            </div>
          </div>
          <div className="space-y-2">
            {schedule.map((day, i) => (
              <div key={i} className={`p-5 rounded-xl flex justify-between items-center border ${day.active ? 'bg-white border-slate-50 shadow-sm' : 'bg-slate-50/50 border-slate-100 opacity-60'}`}>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={day.active} onChange={() => toggleDay(day.day)} className="w-5 h-5 accent-blue-600 cursor-pointer" />
                  <span className="text-sm font-black text-slate-700">{day.day}</span>
                </div>
                <span className="text-sm text-slate-400 font-bold">{day.active ? `${globalHours.from} - ${globalHours.to}` : 'Closed'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const AppointmentCard = ({ name, id, status, date, time, type, tests, resultsUploaded }) => (
  <div className="p-8 border border-slate-50 rounded-[2.5rem] hover:border-blue-100 transition-all duration-300 bg-white">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3 text-left">
        <h5 className="font-black text-slate-700 text-lg">{name}</h5>
        <span className={`${status === 'Completed' ? 'bg-blue-600' : 'bg-green-500'} text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase`}>{status}</span>
      </div>
      <div className="text-slate-400 text-xs font-black bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-2"><Clock size={14}/> {time}</div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
      <InfoBox label="Date" value={date} icon={<Calendar size={14}/>} />
      <InfoBox label="Tests" value={tests} icon={<TestTube size={14}/>} />
      <InfoBox label="Type" value={type} icon={type === 'Home Visit' ? <Home size={14}/> : <Activity size={14}/>} />
      <InfoBox label="ID" value={id} icon={<Users size={14}/>} />
    </div>
  </div>
);

const InfoBox = ({ label, value, icon }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-black text-slate-300 uppercase flex items-center gap-1.5">{icon} {label}</p>
    <p className="text-sm font-black text-slate-600 tracking-tight">{value}</p>
  </div>
);