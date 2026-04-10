import React from 'react';
import { Eye, Edit3, Trash2, Plus, MessageSquare, Clock } from "lucide-react";

export default function DoctorPosts() {
  const posts = [
    { 
      id: 1, 
      title: "Understanding Heart Health: 5 Essential Tips for a Stronger Heart", 
      views: "1.2k", comments: "42", date: "Mar 15, 2024", category: "Cardiology",
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=300&h=300&fit=crop"
    },
    { 
      id: 2, 
      title: "Managing Diabetes: A Comprehensive Guide for Daily Wellness", 
      views: "980", comments: "18", date: "Mar 10, 2024", category: "Endocrinology",
      image: "https://images.unsplash.com/photo-1511174511562-5f7f185854c8?w=300&h=300&fit=crop"
    }
  ];

  return (
    <div className="p-10 bg-[#f8fafc] min-h-screen" dir="ltr">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Medical Expertise</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">Manage your published health articles</p>
        </div>
        <button className="bg-slate-800 text-white px-8 py-4 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl shadow-slate-200 hover:bg-cyan-500 transition-all active:scale-95">
          <Plus size={16} strokeWidth={3}/> New Article
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-6xl mx-auto">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-5 rounded-[2.5rem] border border-slate-50 flex flex-col md:flex-row items-center gap-8 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 group">
            
            <div className="w-full md:w-44 h-40 bg-slate-100 rounded-[2rem] overflow-hidden flex-shrink-0">
               <img src={post.image} alt="post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
            </div>

            <div className="flex-1 space-y-4">
              <span className="bg-cyan-50 text-cyan-500 px-4 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border border-cyan-100 inline-block">
                {post.category}
              </span>
              
              <h3 className="text-xl font-black text-slate-800 leading-snug group-hover:text-cyan-500 transition-colors cursor-pointer">
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
              <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-cyan-50 hover:text-cyan-500 transition-all">
                <Edit3 size={18}/>
              </button>
              <button className="p-4 bg-red-50/50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                <Trash2 size={18}/>
              </button>
            </div>
          </div>
        ))}
      </div>
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