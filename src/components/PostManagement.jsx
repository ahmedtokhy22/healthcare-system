import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  ChevronDown, Loader2, AlertCircle, Clock, 
  CheckCircle2, RefreshCw, LayoutPanelLeft 
} from "lucide-react";

export default function PostManagement() {
  const [posts, setPosts] = useState([]); 
  const [pageNumber, setPageNumber] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isPendingFilter, setIsPendingFilter] = useState(true); 
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const API_BASE = "https://healthcare52.runasp.net/api/Posts";
  const token = localStorage.getItem("token");
  const headers = { 
    Authorization: `Bearer ${token}`,
    'ngrok-skip-browser-warning': 'true'
  };

  // Fetch logic modified for "Load More"
  const fetchPosts = useCallback(async (pageNum, isReset = false) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}?PendingPosts=${isPendingFilter}&page=${pageNum}`, 
        { headers }
      );
      
      const newItems = res.data.items || [];
      // If we are switching filters, replace posts. If loading more, append them.
      setPosts(prev => isReset ? newItems : [...prev, ...newItems]);
      setHasNextPage(res.data.hasNextPage);
    } catch (err) {
      console.error("Error fetching posts:", err);
      if (isReset) setPosts([]); 
    } finally {
      setLoading(false);
    }
  }, [isPendingFilter, token]);

  // Triggered when Filter changes
  useEffect(() => {
    setPageNumber(1);
    fetchPosts(1, true);
  }, [isPendingFilter]);

  const handleLoadMore = () => {
    const nextPage = pageNumber + 1;
    setPageNumber(nextPage);
    fetchPosts(nextPage, false);
  };

  const handleToggleStatus = async (id) => {
    setActionLoading(id);
    try {
      // Correct endpoint: /api/Posts/{id}/toggle-publish-status
      await axios.patch(`${API_BASE}/${id}/toggle-publish-status`, {}, { headers });
      
      // Remove the post from the current view since its status no longer matches the filter
      setPosts(prev => prev.filter(p => p.id !== id));
      setExpandedId(null);
    } catch (err) {
      alert("Failed to update post status.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="text-left">
          <h1 className="text-4xl font-black tracking-tighter text-slate-800 uppercase flex items-center gap-3">
            <LayoutPanelLeft className="text-blue-600" size={32} />
            System <span className="text-blue-600">Posts</span>
          </h1>
        </div>
        
        {/* Toggle Filters */}
        <div className="bg-slate-100 p-1.5 rounded-[2rem] flex border border-slate-200">
          <button 
            onClick={() => setIsPendingFilter(true)}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${
              isPendingFilter ? 'bg-white text-orange-500 shadow-sm' : 'text-slate-400'
            }`}
          >
            <Clock size={14} /> Pending
          </button>
          <button 
            onClick={() => setIsPendingFilter(false)}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${
              !isPendingFilter ? 'bg-white text-emerald-500 shadow-sm' : 'text-slate-400'
            }`}
          >
            <CheckCircle2 size={14} /> Published
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden transition-all hover:border-slate-200">
            <div 
              className="p-6 flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
            >
              <div className="flex items-center gap-5">
                <img 
                  src={post.doctorProfilePicture} 
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md"
                  alt="Dr."
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-800 text-lg tracking-tight leading-tight">{post.title}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${post.isPublished ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'}`}>
                        {post.isPublished ? "Published" : "Pending Review"}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                    Dr. {post.doctorName} • <span className="text-blue-500">{post.specialtyName}</span>
                  </p>
                </div>
              </div>
              <ChevronDown className={`transition-transform duration-300 ${expandedId === post.id ? 'rotate-180 text-blue-500' : 'text-slate-300'}`} />
            </div>
            
            {expandedId === post.id && (
              <div className="px-6 pb-6 animate-in slide-in-from-top-2">
                <div className="p-6 bg-slate-50 rounded-[2rem] text-slate-600 mb-6 whitespace-pre-wrap text-sm leading-relaxed border border-slate-100 shadow-inner">
                  {post.content}
                  {post.attachmentUrl && (
                    <img src={post.attachmentUrl} className="mt-6 rounded-[1.5rem] max-h-[450px] w-full object-cover border border-slate-200" alt="attachment" />
                  )}
                </div>
                
                <button 
                  onClick={() => handleToggleStatus(post.id)} 
                  disabled={actionLoading === post.id}
                  className={`w-full py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg ${
                    !post.isPublished 
                    ? 'bg-emerald-500 text-white shadow-emerald-100 hover:bg-emerald-600' 
                    : 'bg-rose-500 text-white shadow-rose-100 hover:bg-rose-600'
                  }`}
                >
                  {actionLoading === post.id ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : post.isPublished ? (
                    "Revoke Publication"
                  ) : (
                    "Approve & Publish"
                  )}
                </button>
              </div>
            )}
          </div>
        ))}

        {loading && pageNumber === 1 && (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
        )}

        {posts.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <AlertCircle className="mx-auto text-slate-100 mb-4" size={48} />
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No articles found in this category</p>
          </div>
        )}

        {/* Load More Pagination - Only displays if hasNextPage is true */}
        {hasNextPage && (
          <div className="flex justify-center mt-12 mb-8">
            <button 
              onClick={handleLoadMore}
              disabled={loading}
              className="px-10 py-5 bg-white border border-slate-100 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm flex items-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={16}/> : <RefreshCw size={16}/>}
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}