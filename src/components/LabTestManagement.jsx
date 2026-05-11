import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { TestTube, Plus, Trash2, Edit3, Loader2, CheckCircle, Search, X, AlertCircle, Home, Ban } from "lucide-react";

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

// Edit Modal Component
const EditModal = ({ item, onClose, onSave, processing }) => {
  const [price, setPrice] = useState(item.price?.toString() || "");
  const [isAvailableAtHome, setIsAvailableAtHome] = useState(item.isAvailableAtHome ?? false);

  const handleSubmit = () => {
    if (!price || parseFloat(price) < 0) return;
    onSave(item.id, { price: parseFloat(price), isAvailableAtHome });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-slate-800">Edit Service</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-semibold">{item.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Price Field */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
              Price (EGP)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-bold"
              autoFocus
              placeholder="Enter price..."
            />
          </div>

          {/* Home Visit Toggle */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
              Home Visit Availability
            </label>
            <button
              type="button"
              onClick={() => setIsAvailableAtHome(prev => !prev)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all font-bold text-sm ${
                isAvailableAtHome
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-slate-200 bg-slate-50 text-slate-500'
              }`}
            >
              <span className="flex items-center gap-3">
                {isAvailableAtHome
                  ? <><Home size={18} className="text-green-500" /> Available at Home</>
                  : <><Ban size={18} className="text-slate-400" /> Not Available at Home</>
                }
              </span>
              {/* Toggle pill */}
              <span className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAvailableAtHome ? 'bg-green-500' : 'bg-slate-300'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isAvailableAtHome ? 'translate-x-6' : 'translate-x-1'}`} />
              </span>
            </button>
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-black text-sm hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={processing || !price || parseFloat(price) < 0}
            className="flex-1 py-3 rounded-2xl bg-slate-900 text-white font-black text-sm hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// Add Test Modal Component
const AddTestModal = ({ systemTests, myTests, onClose, onAdd, processingId }) => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [price, setPrice] = useState("");
  const [isAvailableAtHome, setIsAvailableAtHome] = useState(false);
  const [search, setSearch] = useState("");

  const available = systemTests.filter(
    t => !myTests.some(myT => myT.testId === t.id) &&
      t.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (test) => {
    setSelectedTest(test);
    setPrice(test.price?.toString() || "");
    setIsAvailableAtHome(false);
  };

  const handleSubmit = () => {
    if (!selectedTest || !price || parseFloat(price) < 0) return;
    onAdd({
      testId: selectedTest.id,
      price: parseFloat(price),
      isAvailableAtHome,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl animate-in zoom-in-95 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800">Add New Service</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
          {/* Left — test catalog */}
          <div className="flex-1 flex flex-col border-r border-slate-100 overflow-hidden">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="overflow-y-auto flex-1 px-4 pb-4 space-y-2">
              {available.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-8">No tests available to add.</p>
              ) : available.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleSelect(t)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all ${
                    selectedTest?.id === t.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-transparent bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    selectedTest?.id === t.id ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
                  }`}>
                    <TestTube size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800">{t.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Base: {t.price?.toFixed(2)} EGP</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right — configuration */}
          <div className="w-full md:w-64 p-5 flex flex-col justify-between bg-slate-50/50">
            {selectedTest ? (
              <>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Selected</p>
                    <p className="font-black text-slate-800 text-sm leading-tight">{selectedTest.name}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                      Your Price (EGP)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 font-bold"
                      placeholder="Set price..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                      Home Visit
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAvailableAtHome(prev => !prev)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border-2 transition-all text-sm font-bold ${
                        isAvailableAtHome
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-slate-200 bg-white text-slate-500'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isAvailableAtHome
                          ? <><Home size={15} className="text-green-500" /> Available</>
                          : <><Ban size={15} className="text-slate-400" /> Not Available</>
                        }
                      </span>
                      <span className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isAvailableAtHome ? 'bg-green-500' : 'bg-slate-300'}`}>
                        <span className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform ${isAvailableAtHome ? 'translate-x-5' : 'translate-x-1'}`} />
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={processingId === selectedTest.id || !price || parseFloat(price) < 0}
                  className="mt-6 w-full py-3 rounded-2xl bg-slate-900 text-white font-black text-sm hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingId === selectedTest.id
                    ? <Loader2 size={16} className="animate-spin" />
                    : <Plus size={16} />
                  }
                  Add Service
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 py-8">
                <TestTube size={32} className="mb-3 text-slate-200" />
                <p className="text-xs font-black">Select a test from the list to configure it.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function LabTestsManagement() {
  const [myTests, setMyTests] = useState([]);
  const [systemTests, setSystemTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  const api = useMemo(() => axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  }), [token]);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

  const fetchData = useCallback(async () => {
    if (!token) { setLoading(false); return; }
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

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddTest = async ({ testId, price, isAvailableAtHome }) => {
    setProcessingId(testId);
    try {
      await api.post('/labs/me/LabTests', { testId, price, isAvailableAtHome });
      showToast('Test added successfully!', 'success');
      setShowAddModal(false);
      await fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error adding test', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleUpdate = async (mappingId, { price, isAvailableAtHome }) => {
    setProcessingId(mappingId);
    try {
      await api.put(`/labs/me/LabTests/${mappingId}`, { price, isAvailableAtHome });
      showToast('Service updated successfully!', 'success');
      setEditItem(null);
      fetchData();
    } catch (err) {
      showToast('Failed to update service', 'error');
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

      {/* Search */}
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
            <div key={item.id} className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow flex flex-col">
              {/* Card Header */}
              <div className="flex justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <TestTube size={24} />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditItem(item)}
                    className="p-2 text-slate-300 hover:text-blue-500 transition-colors"
                    disabled={processingId === item.id}
                    title="Edit service"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    disabled={processingId === item.id}
                    title="Remove service"
                  >
                    {processingId === item.id
                      ? <Loader2 size={16} className="animate-spin" />
                      : <Trash2 size={16} />
                    }
                  </button>
                </div>
              </div>

              {/* Test Info */}
              <h5 className="font-black text-slate-800 text-lg mb-1 leading-tight">{item.name}</h5>
              <p className="text-slate-400 text-xs mb-4 line-clamp-2">{item.description || 'No description'}</p>

              {/* Prerequisites */}
              {item.preRequisites && (
                <p className="text-[10px] text-amber-600 bg-amber-50 rounded-xl px-3 py-1.5 mb-4 font-semibold line-clamp-2">
                  {item.preRequisites}
                </p>
              )}

              {/* Footer */}
              <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                <span className="font-black text-blue-600 text-xl">
                  {item.price?.toFixed(2)} <small className="text-slate-400 text-xs font-bold">EGP</small>
                </span>

                {/* Home availability badge */}
                <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide px-3 py-1.5 rounded-xl ${
                  item.isAvailableAtHome
                    ? 'bg-green-50 text-green-600'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {item.isAvailableAtHome
                    ? <><Home size={11} /> Home Visit</>
                    : <><Ban size={11} /> Lab Only</>
                  }
                </span>
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

      {/* Edit Modal */}
      {editItem && (
        <EditModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onSave={handleUpdate}
          processing={processingId === editItem.id}
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AddTestModal
          systemTests={systemTests}
          myTests={myTests}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddTest}
          processingId={processingId}
        />
      )}
    </div>
  );
}