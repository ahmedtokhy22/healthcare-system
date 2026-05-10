import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, User, Trash2, Edit, X, Loader2, 
  Image as ImageIcon, ChevronDown, Filter
} from "lucide-react";

export default function DoctorPosts() {
  const [posts, setPosts] = useState([]);
  const [specialties, setSpecialties] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [editMode, setEditMode] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);

  const [newPost, setNewPost] = useState({ 
    Title: '', 
    Content: '', 
    SpecialtyId: '', 
    AttachmentFile: null 
  });

  const API_BASE = 'https://healthcare52.runasp.net/api';
  const token = localStorage.getItem('token');
  
  const headers = { 
    'Authorization': `Bearer ${token}`,
    'ngrok-skip-browser-warning': 'true'
  };

  useEffect(() => {
    fetchPosts();
    fetchSpecialties();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/Posts/me`, { headers });
      setPosts(res.data?.items || []);
    } catch (err) {
      setError("تعذر جلب المنشورات.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const res = await axios.get(`${API_BASE}/Specialties`, { headers });
      const data = res.data || [];
      setSpecialties(data);
      if (data.length > 0 && !newPost.SpecialtyId) {
        setNewPost(prev => ({ ...prev, SpecialtyId: data[0].id }));
      }
    } catch (err) {
      console.error("فشل جلب التخصصات", err);
    }
  };

  const openEditModal = (post) => {
    setEditMode(true);
    setCurrentPostId(post.id);
    setNewPost({
      Title: post.title,
      Content: post.content,
      SpecialtyId: post.specialtyId,
      AttachmentFile: null 
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('Title', newPost.Title.trim());
      formData.append('Content', newPost.Content.trim());
      formData.append('SpecialtyId', newPost.SpecialtyId);
      if (newPost.AttachmentFile) {
        formData.append('AttachmentFile', newPost.AttachmentFile);
      }

      if (editMode) {
        await axios.put(`${API_BASE}/Posts/${currentPostId}`, formData, { headers });
      } else {
        await axios.post(`${API_BASE}/Posts`, formData, { headers });
      }
      
      resetForm();
      fetchPosts();
    } catch (err) {
      alert(`فشل العملية: ${err.response?.data?.message || "تأكد من البيانات"}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewPost({ 
        Title: '', 
        Content: '', 
        SpecialtyId: specialties[0]?.id || '', 
        AttachmentFile: null 
    });
    setIsModalOpen(false);
    setEditMode(false);
    setCurrentPostId(null);
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المقال؟")) return;
    try {
      await axios.delete(`${API_BASE}/Posts/${id}`, { headers });
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert("فشل الحذف.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FBFC] p-4 md:p-12 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-right">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
              Blog <span className="text-cyan-500">Center</span>
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2 mr-1">Manage your medical articles</p>
          </div>
          
          <button 
            onClick={() => { setEditMode(false); setIsModalOpen(true); }}
            className="flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-cyan-600 hover:shadow-cyan-200 transition-all shadow-2xl"
          >
            <Plus size={18} /> منشور جديد
          </button>
        </div>

        {/* POSTS FEED */}
        <div className="grid gap-10">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article key={post.id} className="bg-white rounded-[3.5rem] p-8 md:p-12 shadow-sm border border-slate-50 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-500 overflow-hidden border border-cyan-100 shadow-inner">
                      {post.doctorProfilePicture ? <img src={post.doctorProfilePicture} alt="dr" className="w-full h-full object-cover" /> : <User size={28} />}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-lg">{post.doctorName || "دكتور متخصص"}</h4>
                      <span className="text-[9px] font-black text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full uppercase tracking-wider">{post.specialtyName}</span>
                    </div>
                  </div>

                  {/* ACTION BUTTONS (EDIT & DELETE) */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEditModal(post)} 
                      className="p-3.5 text-slate-300 hover:text-cyan-500 hover:bg-cyan-50 rounded-2xl transition-all duration-300 border border-transparent hover:border-cyan-100"
                    >
                      <Edit size={20} />
                    </button>
                    <button 
                      onClick={() => handleDeletePost(post.id)} 
                      className="p-3.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all duration-300 border border-transparent hover:border-rose-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <h2 className="text-3xl font-black text-slate-900 mb-5 leading-tight">{post.title}</h2>
                <p className="text-slate-500 leading-relaxed text-lg mb-10">{post.content}</p>

                {post.isContainsMedia && post.attachmentUrl && (
                  <div className="rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm group-hover:shadow-md transition-shadow">
                    <img src={post.attachmentUrl} alt="post content" className="w-full max-h-[500px] object-cover" />
                  </div>
                )}
              </article>
            ))
          ) : (
            <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
               <Loader2 className={`mx-auto text-slate-200 mb-4 ${loading ? 'animate-spin' : ''}`} size={48} />
               <p className="text-slate-400 font-black uppercase text-xs tracking-widest">
                 {loading ? "جاري تحميل المقالات..." : "لا يوجد منشورات حالياً"}
               </p>
            </div>
          )}
        </div>

        {/* MODAL (ADD & EDIT) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 md:p-14 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                  {editMode ? "تعديل" : "إنشاء"} <span className="text-cyan-500">مقال</span>
                </h2>
                <button onClick={resetForm} className="p-3 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                {/* SPECIALTY SELECT BOX */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 mr-4 uppercase tracking-[0.2em]">تخصص الموضوع</label>
                  <div className="relative">
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-cyan-500 pointer-events-none">
                      <Filter size={18} />
                    </div>
                    <select 
                      value={newPost.SpecialtyId}
                      onChange={(e) => setNewPost({...newPost, SpecialtyId: e.target.value})}
                      className="w-full px-14 py-5 bg-slate-50 rounded-[1.5rem] outline-none font-bold text-slate-700 appearance-none focus:bg-white focus:ring-4 ring-cyan-500/5 border border-transparent focus:border-cyan-100 transition-all cursor-pointer"
                      required
                    >
                      {specialties.map((spec) => (
                        <option key={spec.id} value={spec.id}>
                          {spec.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                  </div>
                </div>

                <input 
                  type="text" 
                  value={newPost.Title}
                  onChange={(e) => setNewPost({...newPost, Title: e.target.value})}
                  placeholder="ما هو عنوان المقال؟" 
                  className="w-full px-8 py-5 bg-slate-50 rounded-[1.5rem] outline-none font-bold text-slate-700 focus:bg-white focus:ring-4 ring-cyan-500/5 border border-transparent focus:border-cyan-100 transition-all"
                  required
                />
                
                <textarea 
                  rows="6"
                  value={newPost.Content}
                  onChange={(e) => setNewPost({...newPost, Content: e.target.value})}
                  placeholder="شارك خبرتك الطبية مع المرضى..." 
                  className="w-full px-8 py-5 bg-slate-50 rounded-[1.5rem] outline-none font-bold text-slate-700 resize-none focus:bg-white focus:ring-4 ring-cyan-500/5 border border-transparent focus:border-cyan-100 transition-all"
                  required
                />
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 mr-4 uppercase tracking-[0.2em]">إرفاق صورة</label>
                  <label className="flex items-center gap-4 bg-slate-50 p-6 rounded-[1.5rem] border-2 border-dashed border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                      <ImageIcon className="text-cyan-500" />
                      <span className="text-sm font-bold text-slate-500">
                        {newPost.AttachmentFile ? newPost.AttachmentFile.name : "اختر صورة جذابة للمقال"}
                      </span>
                      <input 
                          type="file" 
                          hidden
                          onChange={(e) => setNewPost({...newPost, AttachmentFile: e.target.files[0]})}
                      />
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-slate-900 text-white py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-cyan-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (editMode ? "حفظ التعديلات" : "نشر المقال الآن")}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}