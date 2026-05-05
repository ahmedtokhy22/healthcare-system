import React, { useState, useRef, useMemo } from 'react';
import { 
  Calendar, Clock, MapPin, TestTube, Search, Activity, 
  Home, Users, CheckCircle, Upload, FileText, X, Filter, Trash2, Save
} from "lucide-react";

export default function LabAppointments() {
  const [activeSubTab, setActiveSubTab] = useState('All Appointments');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);
  const [uploadingFor, setUploadingFor] = useState(null);

  // ربط البيانات بالـ JSON الخاص بالمواعيد (items)
  const [appointments, setAppointments] = useState([
    { 
      id: "019d6a64-f57e-7911-9b3a-a2ae3557b0e3", 
      patientName: "تامر السباعى", 
      status: "Pending", 
      date: "2026-04-15", 
      startTime: "18:00:00", 
      appointmentType: "HomeVisit", 
      tests: ["Fasting Blood Sugar (FBS)"], 
      address: "9 عمارة يعقوب شارع الجلاله النزهة" 
    },
    { 
      id: "019d4eb3-0c08-7823-a16d-bb467a75933d", 
      patientName: "patientser", 
      status: "ResultsDone", 
      date: "2026-04-04", 
      startTime: "00:00:00", 
      appointmentType: "HomeVisit", 
      tests: ["Fasting Blood Sugar (FBS)"], 
      address: "7 شارع مصر والسودان" 
    }
  ]);

  // ربط أوقات العمل من الـ JSON (workingDays & times)
  const [labSettings, setLabSettings] = useState({
    openingTime: "07:00:00",
    closingTime: "23:00:00",
    homeVisitFee: "350",
    workingDays: {
      isSaturdayOpen: false,
      isSundayOpen: true,
      isMondayOpen: true,
      isTuesdayOpen: true,
      isWednesdayOpen: true,
      isThursdayOpen: true,
      isFridayOpen: false
    }
  });

  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => 
      app.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, appointments]);

  const handleUploadClick = (id) => { setUploadingFor(id); fileInputRef.current.click(); };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && uploadingFor) {
      setAppointments(prev => prev.map(app => 
        app.id === uploadingFor ? { ...app, status: 'ResultsDone' } : app
      ));
      setUploadingFor(null);
    }
  };

  const toggleDay = (dayKey) => {
    setLabSettings(prev => ({
      ...prev,
      workingDays: { ...prev.workingDays, [dayKey]: !prev.workingDays[dayKey] }
    }));
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-700 font-sans p-2">
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf" />

      {/* Header */}
      <div className="flex justify-between items-end gap-6 flex-wrap">
        <div className="text-left">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Lab Management</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic">Dashboard & Schedule Controls</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="bg-slate-100/50 p-1.5 rounded-[1.5rem] flex w-full md:w-fit gap-2 border border-slate-100">
        <button 
          onClick={() => setActiveSubTab('All Appointments')} 
          className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'All Appointments' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          All Appointments
        </button>
        <button 
          onClick={() => setActiveSubTab('Schedule')} 
          className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'Schedule' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Working Hours
        </button>
      </div>

      {/* 1. All Appointments View */}
      {activeSubTab === 'All Appointments' && (
        <div className="space-y-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text" 
              placeholder="Search by patient name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all"
            />
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm space-y-4">
            {filteredAppointments.map(app => (
              <div key={app.id} className="p-6 border border-slate-50 rounded-[2rem] hover:border-blue-100 transition-all bg-white shadow-sm">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-400 text-sm">{app.patientName[0]}</div>
                    <div className="text-left">
                      <h5 className="font-black text-slate-700">{app.patientName}</h5>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase ${app.status === 'ResultsDone' ? 'bg-blue-600 text-white' : 'bg-orange-100 text-orange-600'}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {app.status === 'Pending' && (
                      <button onClick={() => handleUploadClick(app.id)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase flex items-center gap-2 hover:bg-blue-700">
                        <Upload size={12}/> Upload
                      </button>
                    )}
                    <div className="text-slate-400 text-[10px] font-black bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 flex items-center gap-2">
                      <Clock size={12}/> {app.startTime}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left border-t border-slate-50 pt-6">
                  <InfoItem label="Date" value={app.date} icon={<Calendar size={14}/>} />
                  <InfoItem label="Test" value={app.tests.join(', ')} icon={<TestTube size={14}/>} />
                  <InfoItem label="Type" value={app.appointmentType} icon={app.appointmentType === 'HomeVisit' ? <Home size={14}/> : <Activity size={14}/>} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Schedule View (Settings) */}
      {activeSubTab === 'Schedule' && (
        <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm space-y-10 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Times Selection */}
            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-left">General Availability</h4>
              <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                <div className="flex items-center justify-between">
                   <div className="text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Opening Time</p>
                      <input type="time" value={labSettings.openingTime} onChange={(e) => setLabSettings({...labSettings, openingTime: e.target.value})} className="bg-white border border-slate-200 rounded-xl px-4 py-2 font-black text-sm outline-none focus:border-blue-500" />
                   </div>
                   <div className="text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Closing Time</p>
                      <input type="time" value={labSettings.closingTime} onChange={(e) => setLabSettings({...labSettings, closingTime: e.target.value})} className="bg-white border border-slate-200 rounded-xl px-4 py-2 font-black text-sm outline-none focus:border-blue-500" />
                   </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase mb-2 text-left">Home Visit Fee (EGP)</p>
                   <input type="number" value={labSettings.homeVisitFee} onChange={(e) => setLabSettings({...labSettings, homeVisitFee: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-black text-sm outline-none" />
                </div>
              </div>
              <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                <Save size={16}/> Save Settings
              </button>
            </div>

            {/* Days Selection */}
            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-left">Working Days</h4>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(labSettings.workingDays).map(([dayKey, isOpen]) => (
                  <div key={dayKey} onClick={() => toggleDay(dayKey)} className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${isOpen ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-slate-50 opacity-60 hover:opacity-100'}`}>
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{dayKey.replace('is', '').replace('Open', '')}</span>
                    {isOpen ? <CheckCircle size={18} className="text-blue-600" /> : <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-200" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const InfoItem = ({ label, value, icon }) => (
  <div className="space-y-1">
    <p className="text-[9px] font-black text-slate-300 uppercase flex items-center gap-1.5">{icon} {label}</p>
    <p className="text-[11px] font-black text-slate-600">{value}</p>
  </div>
);