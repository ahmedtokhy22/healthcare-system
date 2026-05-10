import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Loader2,
  MessageSquare,
  Search,
  CheckCheck,
  Circle
} from "lucide-react";
import * as signalR from "@microsoft/signalr";
import axios from "axios";

const API_BASE_URL = "https://healthcare52.runasp.net";

export default function ProfessionalDoctorChat() {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const scrollRef = useRef(null);
  const activeChatRef = useRef(null);

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("id");
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/Chats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChats(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch Chats Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchChats();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/healthcare-hub`, {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();
    setConnection(newConnection);
  }, [token]);

  useEffect(() => {
    if (!connection) return;
    connection.start()
      .then(() => {
        setIsConnected(true);
        connection.on("ReceiveMessage", (message) => {
          if (activeChatRef.current && String(message.chatId) === String(activeChatRef.current.id)) {
            setMessages((prev) => [...prev, message]);
          }
        });
      })
      .catch((err) => console.error("SignalR Connection Error:", err));
    return () => { connection.stop(); };
  }, [connection]);

  const handleChatSelection = async (chat) => {
    setActiveChat(chat);
    setMessages([]);
    setHistoryLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/Chats/${chat.id}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.items || []);
      if (isConnected) await connection.invoke("JoinChat", chat.id);
    } catch (err) {
      console.error("Load History Error:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !isConnected || !activeChat) return;

    const newMessage = {
      content: messageInput,
      senderId: currentUserId,
      chatId: activeChat.id,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, newMessage]);
    const textToSend = messageInput;
    setMessageInput("");

    try {
      await connection.invoke("SendMessage", activeChat.id, textToSend);
    } catch (err) {
      console.error("Send Error:", err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredChats = chats.filter((chat) =>
    chat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[88vh] bg-[#0f172a] rounded-[2.5rem] shadow-2xl overflow-hidden mx-auto max-w-[1450px] my-4 border border-slate-800">

      {/* Sidebar - Dark Glassmorphism */}
      <div className="w-[360px] border-r border-slate-800 bg-[#1e293b]/50 flex flex-col">
        <div className="p-8">
          <h2 className="text-2xl font-black text-white tracking-tighter mb-6 uppercase italic">Flow<span className="text-blue-500">.</span></h2>
          <div className="relative group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              placeholder="البحث عن مريض..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3 pr-11 pl-4 text-xs font-bold text-slate-300 outline-none focus:ring-2 ring-blue-500/20 transition-all text-right"
              dir="rtl"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-blue-500" /></div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatSelection(chat)}
                className={`flex items-center gap-4 p-4 mb-3 cursor-pointer rounded-2xl transition-all ${
                  activeChat?.id === chat.id 
                  ? "bg-blue-600 shadow-lg shadow-blue-900/20" 
                  : "hover:bg-slate-800/50"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-sm ${activeChat?.id === chat.id ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400 border border-slate-700"}`}>
                  {chat.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden text-right" dir="rtl">
                  <h4 className={`font-black text-[13px] truncate ${activeChat?.id === chat.id ? "text-white" : "text-slate-200"}`}>{chat.name}</h4>
                  <p className={`text-[10px] font-bold truncate mt-0.5 ${activeChat?.id === chat.id ? "text-blue-100" : "text-slate-500"}`}>{chat.lastMessage || "ابدأ المحادثة..."}</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-6 bg-slate-900/80 border-t border-slate-800 flex items-center gap-4 flex-row-reverse">
            <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-900/40">
                {userName?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-right">
                <p className="text-xs font-black text-white">{userName || "طبيب"}</p>
                <p className="text-[10px] font-black text-emerald-500 flex items-center gap-1.5 justify-end"><Circle size={8} fill="currentColor" className="animate-pulse"/> متصل</p>
            </div>
        </div>
      </div>

      {/* Main Chat - Deep Dark Theme */}
      <div className="flex-1 flex flex-col bg-[#0f172a] relative">
        {activeChat ? (
          <>
            <header className="px-10 py-5 bg-[#0f172a]/80 backdrop-blur-md flex justify-between items-center z-10 border-b border-slate-800 flex-row-reverse">
              <div className="flex items-center gap-5 flex-row-reverse">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-blue-500 border border-slate-700">
                  {activeChat.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-right">
                  <h3 className="font-black text-white text-[15px]">{activeChat.name}</h3>
                  <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mt-0.5">Patient Status • Active</p>
                </div>
              </div>
            </header>

            {/* Messages Area - No borders, only Bubbles */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 z-10 flex flex-col custom-scrollbar">
              {historyLoading ? (
                <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-blue-500" /></div>
              ) : (
                messages.map((msg, i) => {
                  const isMe = String(msg.senderId).trim() === String(currentUserId).trim();
                  return (
                    <div key={i} className={`flex w-full ${isMe ? "justify-end" : "justify-start animate-in slide-in-from-bottom-3"}`}>
                      <div className={`max-w-[70%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                        <div className={`px-6 py-3.5 text-sm font-bold shadow-2xl ${
                          isMe 
                          ? "bg-blue-600 text-white rounded-[1.8rem] rounded-tr-none shadow-blue-900/20" 
                          : "bg-slate-800 text-slate-100 rounded-[1.8rem] rounded-tl-none shadow-black/20"
                        }`}>
                          <p dir="auto" className="text-right leading-relaxed">{msg.content}</p>
                        </div>
                        <div className={`flex items-center gap-2 mt-2 px-1 ${isMe ? "flex-row-reverse" : ""}`}>
                          <span className="text-[9px] font-black text-slate-600 uppercase">
                            {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {isMe && <CheckCheck size={12} className="text-blue-500 opacity-80" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={scrollRef} />
            </div>

            {/* Modern Floating Footer */}
            <footer className="p-8 bg-transparent">
              <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex items-center gap-4 bg-slate-800/50 p-2 rounded-3xl border border-slate-700/50 backdrop-blur-xl focus-within:border-blue-500/50 transition-all">
                <input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 bg-transparent px-5 py-3 text-[14px] font-bold text-white outline-none text-right placeholder:text-slate-600"
                  placeholder="اكتب رسالتك الطبية هنا..."
                  dir="rtl"
                />
                <button 
                  type="submit" 
                  disabled={!messageInput.trim()} 
                  className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-500 transition-all active:scale-90 disabled:opacity-20 shadow-lg shadow-blue-900/40"
                >
                  <Send size={20} />
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-700 z-10 text-center px-10">
              <div className="w-28 h-28 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-800 shadow-2xl">
                <MessageSquare size={48} className="text-slate-800" fill="currentColor" />
              </div>
              <h3 className="text-2xl font-black text-slate-300 tracking-tighter">Secure Communication</h3>
              <p className="text-[10px] font-black text-slate-600 mt-3 uppercase tracking-[0.3em]">Select patient record to view history</p>
          </div>
        )}
      </div>
    </div>
  );
}