import React, { useState } from 'react';
import { Eye, Edit3, Trash2, Plus, MessageSquare, Clock, X, Search } from "lucide-react";

export default function DoctorPosts() {
  const [posts, setPosts] = useState([
    { 
      id: 1, 
      title: "Understanding Heart Health: 5 Essential Tips for a Stronger Heart", 
      views: "1.2k", 
      comments: "42", 
      date: "Mar 15, 2024", 
      category: "Cardiology",
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=300&h=300&fit=crop"
    },
    { 
      id: 2, 
      title: "Managing Diabetes: A Comprehensive Guide for Daily Wellness", 
      views: "980", 
      comments: "18", 
      date: "Mar 10, 2024", 
      category: "Endocrinology",
      image: "https://images.unsplash.com/photo-1511174511562-5f7f185854c8?w=300&h=300&fit=crop"
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newPost, setNewPost] = useState({ title: '', category: '', image: '' });
  
  // 1. إضافة State لمعرفة البوست اللي بنعدله
  const [editingPost, setEditingPost] = useState(null);

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this article?")) {
      setPosts(posts.filter(post => post.id !== id));
    }
  };

  // 2. دالة لفتح المودال في وضع التعديل
  const openEditModal = (post) => {
    setEditingPost(post);
    setNewPost({ title: post.title, category: post.category, image: post.image });
    setIsModalOpen(true);
  };

  // 3. تعديل دالة الحفظ (إضافة وتعديل)
  const handleSavePost = (e) => {
    e.preventDefault();
    
    if (editingPost) {
      // وضع التعديل: نحدث البيانات في المصفوفة
      setPosts(posts.map(p => p.id === editingPost.id ? { ...p, ...newPost } : p));
    } else {
      // وضع الإضافة: نضيف بوست جديد
      const postToAdd = {
        id: posts.length + 1,
        ...newPost,
        views: "0",
        comments: "0",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image: newPost.image || "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=300&h=300&fit=crop"
      };
      setPosts([postToAdd, ...posts]);
    }

    // إغلاق المودال وتصفير البيانات
    setIsModalOpen(false);
    setEditingPost(null);
    setNewPost({ title: '', category: '', image: '' });
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-10 bg-[#f8fafc] min-h-screen animate-in fade-in duration-700 text-left">
      
      {/* Header & Search */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Medical Expertise</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">Manage your published health articles</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-cyan-50 transition-all font-bold text-slate-600 shadow-sm"
            />
          </div>
          
          <button 
            onClick={() => { setEditingPost(null); setNewPost({ title: '', category: '', image: '' }); setIsModalOpen(true); }}
            className="bg-slate-800 text-white px-8 py-4 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl shadow-slate-200 hover:bg-cyan-500 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={16} strokeWidth={3}/> New Article
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 gap-6 max-w-6xl mx-auto">
        {filteredPosts.map(post => (
          <div key={post.id} className="bg-white p-5 rounded-[2.5rem] border border-slate-50 flex flex-col md:flex-row items-center gap-8 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 group">
            <div className="w-full md:w-44 h-40 bg-slate-100 rounded-[2rem] overflow-hidden flex-shrink-0">
              <img src={post.image} alt="post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>

            <div className="flex-1 space-y-4">
              <span className="bg-cyan-50 text-cyan-500 px-4 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border border-cyan-100 inline-block">
                {post.category}
              </span>
              <h3 className="text-xl font-black text-slate-800 leading-snug group-hover:text-cyan-500 transition-colors cursor-pointer line-clamp-2">
                {post.title}
              </h3>
              <div className="flex items-center gap-6">
                <Stat icon={<Eye size={14}/>} text={`${post.views} Views`} />
                <Stat icon={<MessageSquare size={14}/>} text={`${post.comments} Comments`} />
                <div className="h-4 w-px bg-slate-100"></div>
                <Stat icon={<Clock size={14}/>} text={post.date} color="text-slate-300" />
              </div>
            </div>

            <div className="flex md:flex-col gap-2 p-2">
              {/* تفعيل زر التعديل هنا */}
              <button 
                onClick={() => openEditModal(post)}
                className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-cyan-50 hover:text-cyan-500 transition-all"
              >
                <Edit3 size={18}/>
              </button>
              <button onClick={() => handleDelete(post.id)} className="p-4 bg-red-50/50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                <Trash2 size={18}/>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 text-left">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 relative animate-in zoom-in-95 duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-800"><X /></button>
            <h2 className="text-2xl font-black text-slate-800 mb-8">
              {editingPost ? "Edit Article" : "Publish New Article"}
            </h2>
            
            <form onSubmit={handleSavePost} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Article Title</label>
                <input 
                  required
                  type="text" 
                  value={newPost.title}
                  placeholder="e.g., The Future of Telemedicine"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-50 font-bold text-slate-700"
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Category</label>
                <select 
                  required
                  value={newPost.category}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-50 font-bold text-slate-700 appearance-none"
                  onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                >
                  <option value="">Select Specialty</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="General Health">General Health</option>
                </select>
              </div>

              <button type="submit" className="w-full py-5 bg-cyan-500 text-white rounded-[1.8rem] font-black shadow-lg shadow-cyan-100 hover:bg-cyan-600 transition-all uppercase text-[11px] tracking-widest mt-4">
                {editingPost ? "Save Changes" : "Publish Article"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ icon, text, color = "text-slate-400" }) {
  return (
    <div className={`flex items-center gap-2 ${color}`}>
      <span className="text-cyan-400">{icon}</span>
      <span className="text-[11px] font-bold">{text}</span>
    </div>
  );
}