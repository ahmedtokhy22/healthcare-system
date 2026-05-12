import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  Check, X, ChevronDown, Loader2, 
  Trash2, AlertCircle, Clock, CheckCircle2 
} from "lucide-react";

export default function PostManagement() {
  const [posts, setPosts] = useState([]); 
  const [filter, setFilter] = useState("unpublished"); // unpublished (Pending) vs published (Approved)
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = "https://healthcare52.runasp.net/api/Posts";
  const token = localStorage.getItem("token");
  
  // Important: Headers must include the token for Admin actions
  const headers = { 
    Authorization: `Bearer ${token}`,
    'ngrok-skip-browser-warning': 'true'
  };

  // 1. Fetch posts from API based on current filter
  const fetchPosts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}?status=${filter}`, { headers });
      // Support for both direct array or paginated object (items)
      const data = Array.isArray(res.data) ? res.data : (res.data.items || []);
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setPosts([]); 
    } finally {
      setLoading(false);
    }
  }, [filter, token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 2. Approve/Publish or Unpublish a post
  const handleTogglePublish = async (id, shouldPublish) => {
    try {
      const action = shouldPublish ? 'publish' : 'unpublish';
      await axios.patch(`${API_BASE}/${id}/${action}`, {}, { headers });
      fetchPosts(); 
      setExpandedId(null);
    } catch (err) {
      alert("Action failed. Please verify Admin permissions.");
    }
  };

  // 3. Delete post permanently
  const handleDeletePost = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this post?")) {
      try {
        // We pass the headers here to fix the "Delete operation failed" issue
        await axios.delete(`${API_BASE}/${id}`, { headers });
        fetchPosts();
        alert("Post deleted successfully.");
      } catch (err) {
        console.error("Delete error:", err.response);
        alert(`Delete failed: ${err.response?.data?.message || "Check API permissions"}`);
      }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans" dir="ltr">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="text-left">
          <h1 className="text-4xl font-black tracking-tighter text-slate-800 uppercase">
            System <span className="text-blue-600">Posts</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Review and manage medical articles from doctors
          </p>
        </div>
        
        {/* Toggle Filters */}
        <div className="bg-slate-100 p-1.5 rounded-[2rem] flex shadow-inner border border-slate-200">
          <button 
            onClick={() => { setFilter("unpublished"); setExpandedId(null); }}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${
              filter === 'unpublished' ? 'bg-white text-orange-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Clock size={14} /> Pending
          </button>
          <button 
            onClick={() => { setFilter("published"); setExpandedId(null); }}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${
              filter === 'published' ? 'bg-white text-emerald-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <CheckCircle2 size={14} /> Published
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-300">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="text-[10px] font-black uppercase tracking-widest">Retrieving Posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[3.5rem] border-2 border-dashed border-slate-100">
          <AlertCircle className="mx-auto text-slate-100 mb-4" size={60} />
          <p className="text-slate-400 font-bold text-sm">No articles currently in this category.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {posts.map(post => (
            <div 
              key={post.id} 
              className={`bg-white rounded-[2.5rem] border transition-all duration-300 ${
                expandedId === post.id ? 'border-blue-200 shadow-2xl scale-[1.01]' : 'border-slate-50 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Post Header (Collapsed View) */}
              <div 
                className="p-6 md:p-8 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg transition-all ${
                    expandedId === post.id ? 'bg-blue-600 text-white rotate-6' : 'bg-slate-50 text-slate-400'
                  }`}>
                    {post.authorName ? post.authorName.charAt(0) : 'D'}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-xl tracking-tight">{post.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-md uppercase">
                        {post.specialtyName || "General"}
                      </span>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        Dr. {post.authorName || "Medical Staff"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={`transition-transform duration-500 ${expandedId === post.id ? 'rotate-180 text-blue-500' : 'text-slate-300'}`}>
                  <ChevronDown size={28} />
                </div>
              </div>
              
              {/* Expanded Post Details */}
              {expandedId === post.id && (
                <div className="px-8 pb-8 pt-2 animate-in slide-in-from-top-4 duration-500">
                  <div className="p-8 bg-slate-50 rounded-[2.5rem] text-slate-600 text-base leading-relaxed mb-8 border border-slate-100 whitespace-pre-wrap">
                    {post.content}
                    
                    {post.attachmentUrl && (
                      <div className="mt-8 rounded-[2rem] overflow-hidden border border-slate-200 shadow-inner bg-white p-2">
                        <img 
                          src={post.attachmentUrl} 
                          alt="Article Media" 
                          className="max-h-[500px] w-full object-cover rounded-[1.8rem]" 
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Admin Action Bar */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => handleTogglePublish(post.id, filter === "unpublished")} 
                      className={`flex-1 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95 ${
                        filter === "unpublished" 
                        ? 'bg-emerald-500 text-white shadow-emerald-100 hover:bg-emerald-600' 
                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200 shadow-none'
                      }`}
                    >
                      {filter === "unpublished" ? (
                        <><Check size={20}/> Approve & Publish</>
                      ) : (
                        <><X size={20}/> Take Down Post</>
                      )}
                    </button>

                    <button 
                      onClick={() => handleDeletePost(post.id)} 
                      className="px-12 py-5 bg-rose-50 text-rose-500 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 size={20}/> Delete Permanently
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}