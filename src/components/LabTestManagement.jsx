import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { TestTube, Plus, Trash2, Edit3, Loader2, CheckCircle, Search, X, AlertCircle } from "lucide-react";

const API_BASE_URL = "http://localhost:5173/api";

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-2xl shadow-lg z-[200] flex items-center gap-3 animate-in slide-in-from-right`}>
      {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      <span className="font-medium text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80"><X size={16} /></button>
    </div>
  );
};

export default function LabTestsManagement() {
  const [myTests, setMyTests] = useState([]); 
  const [systemTests, setSystemTests] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [updatePrice, setUpdatePrice] = useState({ id: null, price: "" });
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");
  
  const api = useMemo(() => {
    return axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
  }, [token]);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

  const fetchData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      const [myRes, systemRes] = await Promise.all([
        api.get('/labs/me/LabTests'),
        api.get('/Tests')
      ]);
      setMyTests(Array.isArray(myRes.data) ? myRes.data : []);
      setSystemTests(Array.isArray(systemRes.data) ? systemRes.data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      showToast('Failed to load tests', 'error');
    } finally {
      setLoading(false);
    }
  }, [api, token, showToast]);

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  const handleAddTest = async (targetTestId) => {
    setProcessingId(targetTestId);
    try {
      await api.post('/labs/me/LabTests', { testId: targetTestId });
      showToast('Test added successfully!', 'success');
      setShowAddModal(false);
      await fetchData(); 
    } catch (err) {
      showToast(err.response?.data?.message || 'Error adding test', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleUpdatePrice = async (mappingId) => {
    if (!updatePrice.price || parseFloat(updatePrice.price) < 0) {
      showToast('Please enter a valid price', 'error');
      return;
    }
    setProcessingId(mappingId);
    try {
      await api.put(`/labs/me/LabTests/${mappingId}`, { 
        price: parseFloat(updatePrice.price) 
      });
      showToast('Price updated successfully!', 'success');
      setUpdatePrice({ id: null, price: "" });
      fetchData();
    } catch (err) {
      showToast('Failed to update price', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (mappingId) => {
    if (!window.confirm("Are you sure you want to remove this test?")) return;
    setProcessingId(mappingId);
    try {
      await api.delete(`/labs/me/LabTests/${mappingId}`);
      showToast('Test removed successfully!', 'success');
      fetchData();
    } catch (err) {
      showToast('Failed to delete test', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredTests = myTests.filter(test => 
    test.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 text-left" dir="ltr">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800">My Lab Services</h2>
          <p className="text-slate-400 text-sm mt-1">{filteredTests.length} active services</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Add New Service
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search your tests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500"
        />
      </div>

      {/* Tests Grid */}
      {filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((item) => (
            <div key={item.id} className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <TestTube size={24} />
                </div>
                <button 
                  onClick={() => handleDelete(item.id)} 
                  className="p-2 text-slate-200 hover:text-red-500 transition-colors"
                  disabled={processingId === item.id}
                >
                  {processingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={18} />}
                </button>
              </div>
              <h5 className="font-black text-slate-800 text-lg mb-2">{item.name}</h5>
              <p className="text-slate-400 text-xs mb-4 line-clamp-2">{item.description || 'No description'}</p>
              
              <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                <span className="font-black text-blue-600 text-xl">{item.price?.toFixed(2)} <small className="text-slate-400 text-xs">EGP</small></span>
                {updatePrice.id === item.id ? (
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      step="0.01"
                      min="0"
                      value={updatePrice.price}
                      onChange={(e) => setUpdatePrice({...updatePrice, price: e.target.value})}
                      className="w-20 p-2 bg-slate-50 rounded-xl text-sm outline-blue-500 text-right"
                      autoFocus
                    />
                    <button 
                      onClick={() => handleUpdatePrice(item.id)} 
                      className="bg-slate-900 text-white px-3 rounded-xl text-xs font-bold"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setUpdatePrice({id: item.id, price: item.price.toString()})} 
                    className="text-[10px] font-black text-slate-400 uppercase underline hover:text-blue-600"
                  >
                    Edit Price
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-[3rem] border-2 border-dashed border-slate-200">
          <TestTube className="mx-auto text-slate-200 mb-4" size={48} />
          <p className="text-slate-400 font-black italic">No tests found. Click "Add New Service" to start.</p>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl animate-in zoom-in-95 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800">System Test Catalog</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900">
                <X size={24} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-3 bg-slate-50/50 flex-1">
              {systemTests.filter(t => !myTests.some(myT => myT.testId === t.id)).map(t => (
                <div key={t.id} className="flex items-center justify-between p-4 rounded-2xl border border-white bg-white shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <TestTube size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">{t.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Base: {t.price?.toFixed(2)} EGP</p>
                    </div>
                  </div>
                  <button 
                    disabled={processingId === t.id}
                    onClick={() => handleAddTest(t.id)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      processingId === t.id 
                        ? 'bg-slate-100 text-slate-400' 
                        : 'bg-slate-900 text-white hover:bg-blue-600'
                    }`}
                  >
                    {processingId === t.id ? <Loader2 size={12} className="animate-spin" /> : 'Select'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}