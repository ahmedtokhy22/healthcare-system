import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, MessageSquare, Heart, User, Trash2, Edit,
  X, Loader2, AlertCircle, Share2, Send, Image as ImageIcon
} from "lucide-react";

export default function DoctorPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // حالة جديدة للتمييز بين الإضافة والتعديل
  const [editMode, setEditMode] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);

  const [newPost, setNewPost] = useState({ 
    Title: '', 
    Content: '', 
    SpecialtyId: '019d7ceb-a5b0-7cd0-ad35-49a001a1916f', 
    AttachmentFile: null 
  });

  const API_BASE = 'https://healthcare52.runasp.net/api/Posts';
  const token = localStorage.getItem('token');
  
  const headers = { 
    'Authorization': `Bearer ${token}`,
    'ngrok-skip-browser-warning': 'true'
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/me`, { headers });
      const data = res.data?.items || [];
      setPosts(data);
    } catch (err) {
      setError("تعذر جلب المنشورات.");
    } finally {
      setLoading(false);
    }
  };

  // --- وظيفة فتح المودال للتعديل ---
  const openEditModal = (post) => {
    setEditMode(true);
    setCurrentPostId(post.id);
    setNewPost({
      Title: post.title,
      Content: post.content,
      SpecialtyId: post.specialtyId || '019d7ceb-a5b0-7cd0-ad35-49a001a1916f',
      AttachmentFile: null // الملف يظل نل إلا لو المستخدم اختار صورة جديدة
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
        // طلب التعديل (PUT)
        await axios.put(`${API_BASE}/${currentPostId}`, formData, { headers });
      } else {
        // طلب الإضافة (POST)
        await axios.post(API_BASE, formData, { headers });
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
    setNewPost({ Title: '', Content: '', SpecialtyId: '019d7ceb-a5b0-7cd0-ad35-49a001a1916f', AttachmentFile: null });
    setIsModalOpen(false);
    setEditMode(false);
    setCurrentPostId(null);
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("حذف المقال؟")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`, { headers });
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert("فشل الحذف.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FBFC] p-4 md:p-12 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-right">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
              Blog <span className="text-cyan-500">Center</span>
            </h1>
          </div>
          
          <button 
            onClick={() => { setEditMode(false); setIsModalOpen(true); }}
            className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-cyan-600 transition-all shadow-xl"
          >
            <Plus size={18} /> منشور جديد
          </button>
        </div>

        {/* Posts Feed */}
        <div className="grid gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-[3rem] p-8 md:p-10 shadow-sm border border-slate-50 hover:shadow-2xl transition-all duration-500 group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-500 overflow-hidden">
                    {post.doctorProfilePicture ? <img src={post.doctorProfilePicture} alt="dr" className="w-full h-full object-cover" /> : <User size={24} />}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800">{post.doctorName || "دكتور متخصص"}</h4>
                    <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-md">{post.specialtyName}</span>
                  </div>
                </div>

                {/* أزرار التحكم: تعديل وحذف */}
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(post)} className="p-3 text-slate-200 hover:text-cyan-500 hover:bg-cyan-50 rounded-xl transition-all">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDeletePost(post.id)} className="p-3 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-4">{post.title}</h2>
              <p className="text-slate-500 leading-relaxed mb-8">{post.content}</p>

              {post.isContainsMedia && post.attachmentUrl && (
                <div className="mb-8 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner">
                  <img src={post.attachmentUrl} alt="post content" className="w-full max-h-96 object-cover" />
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Modal الإضافة والتعديل */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                  {editMode ? "Update" : "Draft"} <span className="text-cyan-500">Post</span>
                </h2>
                <button onClick={resetForm} className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><X size={20} /></button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                <input 
                  type="text" 
                  value={newPost.Title}
                  onChange={(e) => setNewPost({...newPost, Title: e.target.value})}
                  placeholder="عنوان المقال" 
                  className="w-full px-6 py-4 bg-slate-50 rounded-[1.2rem] outline-none font-bold text-slate-700"
                  required
                />
                <textarea 
                  rows="5"
                  value={newPost.Content}
                  onChange={(e) => setNewPost({...newPost, Content: e.target.value})}
                  placeholder="اكتب خبرتك الطبية هنا..." 
                  className="w-full px-6 py-4 bg-slate-50 rounded-[1.2rem] outline-none font-bold text-slate-700 resize-none"
                  required
                />
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 mr-2 uppercase tracking-widest">تحديث الصورة (اختياري)</label>
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-[1.2rem] border-2 border-dashed border-slate-200">
                      <ImageIcon className="text-slate-400" />
                      <input 
                          type="file" 
                          onChange={(e) => setNewPost({...newPost, AttachmentFile: e.target.files[0]})}
                          className="text-[10px] font-bold text-slate-500"
                      />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-slate-900 text-white py-4 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest hover:bg-cyan-600 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : (editMode ? "تحديث الآن" : "نشر المقال")}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}