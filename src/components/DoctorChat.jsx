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

  // Effect 1: Build the connection once
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

  // Effect 2: Start the connection
  useEffect(() => {
    if (!connection) return;
    connection.start()
      .then(() => setIsConnected(true))
      .catch((err) => console.error("SignalR Connection Error:", err));
    return () => { connection.stop(); };
  }, [connection]);

  // Effect 3: Register ReceiveMessage handler — working, do not touch
  useEffect(() => {
    if (!connection) return;

    connection.off("ReceiveMessage");
    connection.on("ReceiveMessage", (message) => {
      const currentChat = activeChatRef.current;
      if (!currentChat) return;

      const isFromPatient = message.senderName === currentChat.name;
      const isFromMe = String(message.senderId) === String(currentUserId);

      if (isFromPatient || isFromMe) {
        setMessages((prev) => [...prev, message]);

        // Update chat list last message and order
        setChats((prev) =>
          prev.map((c) =>
            c.id === currentChat.id
              ? { ...c, lastMessage: message.content, lastMessageAt: message.createdAt }
              : c
          )
        );
      }
    });
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

  // الدالة المعدلة: تم إزالة الـ Optimistic Update لكي تتولى الـ SignalR الإضافة فوراً وبدون تكرار
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !isConnected || !activeChat) return;

    const textToSend = messageInput;
    setMessageInput("");

    try {
      // إرسال الرسالة للهاب، وبمجرد استلامها السيرفر سيعمل Broadcast للـ Effect 3 ليضيفها للستيت
      await connection.invoke("SendMessage", activeChat.id, textToSend);
    } catch (err) {
      console.error("Send Error:", err);
      // في حالة الفشل فقط، نعيد النص للمدخل حتى لا يضيع على المستخدم
      setMessageInput(textToSend);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sort chats by most recent message
  const filteredChats = chats
    .filter((chat) => chat.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));

  return (
    <div className="flex h-[88vh] bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.18)] overflow-hidden mx-auto max-w-[1450px] my-4 border border-slate-100">

      {/* Sidebar */}
      <div className="w-[360px] border-r border-slate-200 bg-[#f8fafc] flex flex-col z-20">
        <div className="p-8">
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter mb-6 uppercase italic">
            <span className="text-blue-600">Health</span>Care
          </h2>
          <div className="relative group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
            <input
              placeholder="البحث عن مريض..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pr-11 pl-4 text-xs font-bold text-slate-700 outline-none focus:ring-2 ring-blue-500/10 shadow-sm transition-all text-right"
              dir="rtl"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-blue-600" /></div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatSelection(chat)}
                className={`flex items-center gap-4 p-4 mb-3 cursor-pointer rounded-2xl transition-all ${
                  activeChat?.id === chat.id
                    ? "bg-white shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-blue-100"
                    : "hover:bg-white hover:shadow-sm"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-sm ${activeChat?.id === chat.id ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-500 border border-slate-200"}`}>
                  {chat.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden text-right" dir="rtl">
                  <h4 className={`font-black text-[13px] truncate ${activeChat?.id === chat.id ? "text-blue-900" : "text-slate-800"}`}>{chat.name}</h4>
                  <p className={`text-[10px] font-bold truncate mt-0.5 ${activeChat?.id === chat.id ? "text-blue-600" : "text-slate-500"}`}>{chat.lastMessage || "ابدأ المحادثة..."}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-white border-t border-slate-200 flex items-center gap-4 flex-row-reverse shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
          <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-200">
            {userName?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-right">
            <p className="text-xs font-black text-slate-900">{userName || "طبيب"}</p>
            <p className="text-[10px] font-black text-emerald-600 flex items-center gap-1.5 justify-end">
              <Circle size={8} fill="currentColor" className="animate-pulse" /> متصل الآن
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#fcfcfd] relative">
        {activeChat ? (
          <>
            <header className="px-10 py-5 bg-white/90 backdrop-blur-md flex justify-between items-center z-10 border-b border-slate-200 shadow-sm flex-row-reverse">
              <div className="flex items-center gap-5 flex-row-reverse">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-blue-600 border border-slate-200">
                  {activeChat.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-right">
                  <h3 className="font-black text-slate-900 text-[15px]">{activeChat.name}</h3>
                  <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-0.5">Patient Status • Active</p>
                </div>
              </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 z-10 flex flex-col custom-scrollbar">
              {historyLoading ? (
                <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-blue-600" /></div>
              ) : (
                messages.map((msg, i) => {
                  const isMe = String(msg.senderId).trim() === String(currentUserId).trim();
                  return (
                    <div key={i} className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                        <div className={`px-6 py-3.5 text-sm font-bold ${
                          isMe
                            ? "bg-blue-600 text-white rounded-[1.8rem] rounded-tr-none shadow-[0_5px_15px_rgba(37,99,235,0.3)]"
                            : "bg-white text-slate-800 rounded-[1.8rem] rounded-tl-none border border-slate-200 shadow-sm"
                        }`}>
                          <p dir="auto" className="text-right leading-relaxed">{msg.content}</p>
                        </div>
                        <div className={`flex items-center gap-2 mt-2 px-1 ${isMe ? "flex-row-reverse" : ""}`}>
                          <span className="text-[9px] font-black text-slate-400 uppercase">
                            {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {isMe && <CheckCheck size={12} className="text-blue-500" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={scrollRef} />
            </div>

            {/* Footer */}
            <footer className="p-8 bg-white border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
              <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex items-center gap-4 bg-white p-2 rounded-3xl border border-slate-200 shadow-[0_5px_15px_rgba(0,0,0,0.05)] focus-within:border-blue-500 focus-within:shadow-blue-50 transition-all">
                <input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 bg-transparent px-5 py-3 text-[14px] font-bold text-slate-900 outline-none text-right placeholder:text-slate-400"
                  placeholder="اكتب رسالتك الطبية هنا..."
                  dir="rtl"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95 disabled:opacity-30 shadow-blue-200"
                >
                  <Send size={20} />
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 z-10 text-center px-10">
            <div className="w-28 h-28 bg-white rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-100 shadow-xl">
              <MessageSquare size={48} className="text-slate-100" fill="currentColor" />
            </div>
            <h3 className="text-2xl font-black text-slate-400 tracking-tighter">Secure Communication</h3>
            <p className="text-[10px] font-black text-slate-300 mt-3 uppercase tracking-[0.3em]">Select patient record to view history</p>
          </div>
        )}
      </div>
    </div>
  );
}