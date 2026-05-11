import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, FileText, Loader2 } from 'lucide-react';

export default function PostManagement() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('pending'); 
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = 'https://healthcare52.runasp.net/api';
  const token = localStorage.getItem('token');
  const headers = { 
    'Authorization': `Bearer ${token}`,
    'ngrok-skip-browser-warning': 'true' 
  };

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // جلب البوستات بناءً على الفلتر (Pending = false / Published = true)
      const isPublished = filter === 'published';
      const res = await axios.get(`${API_BASE}/Posts?IsPublished=${isPublished}`, { headers });
      setPosts(res.data?.items || []);
    } catch (err) {
      console.error("Error fetching posts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (postId, action) => {
    try {
      // الـ Endpoints في الـ Backend للقبول أو الرفض
      const endpoint = action === 'publish' ? 'Accept' : 'Reject';
      await axios.put(`${API_BASE}/Posts/${postId}/${endpoint}`, {}, { headers });
      
      // إزالة البوست من القائمة الحالية بعد اتخاذ إجراء
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      alert("حدث خطأ أثناء تحديث حالة المنشور");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1e293b]">إدارة المنشورات</h2>
          <p className="text-[#64748b] text-sm mt-1">مراجعة المنشورات الطبية قبل العرض للعامة</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-[#e2e8f0] shadow-sm font-sans">
          <button 
            onClick={() => setFilter('pending')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'pending' ? 'bg-[#3b82f6] text-white shadow-md' : 'text-[#64748b] hover:bg-gray-50'}`}
          >
            قيد الانتظار
          </button>
          <button 
            onClick={() => setFilter('published')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'published' ? 'bg-[#3b82f6] text-white shadow-md' : 'text-[#64748b] hover:bg-gray-50'}`}
          >
            تم النشر
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-blue-600" size={40} /></div>
        ) : posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl border border-[#e2e8f0] p-6 hover:shadow-lg transition-all group">
              <div className="flex justify-between items-start">
                <div className="flex gap-4 text-right">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1e293b] text-lg">{post.title}</h3>
                    <p className="text-[#94a3b8] text-xs mt-1">بواسطة: د. {post.doctorName || "طبيب متخصص"} • {post.specialtyName}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {filter === 'pending' && (
                    <>
                      <button onClick={() => handleAction(post.id, 'publish')} className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors">
                        <CheckCircle size={24} />
                      </button>
                      <button onClick={() => handleAction(post.id, 'reject')} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                        <XCircle size={24} />
                      </button>
                    </>
                  )}
                  <button onClick={() => setExpandedId(expandedId === post.id ? null : post.id)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl">
                    {expandedId === post.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {expandedId === post.id && (
                <div className="mt-6 pt-6 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300 text-right">
                  <p className="text-[#475569] leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  {post.attachmentUrl && (
                    <img src={post.attachmentUrl} className="mt-4 rounded-xl max-h-60 object-cover" alt="attachment" />
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 font-bold">لا يوجد منشورات في هذا القسم</div>
        )}
      </div>
    </div>
  );
}