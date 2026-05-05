import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Loader2,
  MessageSquare,
  Phone,
  Video,
  Search,
  CheckCheck,
  MoreVertical,
  Paperclip,
  Smile,
  User
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
  // Ref لمتابعة الشات النشط جوه الـ SignalR callback
  const activeChatRef = useRef(null);

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId"); 
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  // 1. جلب قائمة المحادثات
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

  // 2. إعداد SignalR
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

  // 3. استقبال الرسائل
  useEffect(() => {
    if (!connection) return;

    connection.start()
      .then(() => {
        setIsConnected(true);
        connection.on("ReceiveMessage", (message) => {
          // التأكد أن الرسالة تخص الشات المفتوح حالياً
          if (activeChatRef.current && String(message.chatId) === String(activeChatRef.current.id)) {
            setMessages((prev) => [...prev, message]);
          }
        });
      })
      .catch((err) => console.error("SignalR Connection Error:", err));

    return () => { connection.stop(); };
  }, [connection]);

  // 4. اختيار الشات وجلب التاريخ
  const handleChatSelection = async (chat) => {
    setActiveChat(chat);
    setMessages([]);
    setHistoryLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/Chats/${chat.id}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.items || []);
      
      if (isConnected) {
        await connection.invoke("JoinChat", chat.id);
      }
    } catch (err) {
      console.error("Load History Error:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  // 5. إرسال رسالة
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !isConnected || !activeChat) return;

    try {
      await connection.invoke("SendMessage", activeChat.id, messageInput);
      setMessageInput("");
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
    <div className="flex h-[90vh] bg-[#f0f2f5] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 mx-auto max-w-[1500px]">

      {/* Sidebar */}
      <div className="w-[400px] border-r bg-white flex flex-col">
        <div className="p-4 bg-[#f0f2f5] flex justify-between items-center border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
              {userName?.charAt(0).toUpperCase() || <User size={20}/>}
            </div>
            <span className="font-bold text-gray-700 text-sm">حسابي</span>
          </div>
          <div className="flex gap-5 text-gray-500">
            <MessageSquare size={20} className="cursor-pointer hover:text-emerald-600" />
            <MoreVertical size={20} className="cursor-pointer" />
          </div>
        </div>

        <div className="p-2 bg-white">
          <div className="flex items-center bg-[#f0f2f5] px-4 py-2 rounded-xl">
            <Search size={18} className="text-gray-400" />
            <input 
              placeholder="ابحث عن مريض..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mr-3 bg-transparent outline-none w-full text-sm text-right"
              dir="rtl"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-emerald-500" /></div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatSelection(chat)}
                className={`flex items-center gap-4 p-4 cursor-pointer border-b border-gray-50 transition-all ${
                  activeChat?.id === chat.id ? "bg-[#f0f2f5]" : "hover:bg-[#f9f9f9]"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-500 border-2 border-white">
                  {chat.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-right overflow-hidden" dir="rtl">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-[15px] text-gray-800">{chat.name}</h4>
                    <span className="text-[10px] text-gray-400">اليوم</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{chat.lastMessage || "بدء المحادثة..."}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 flex flex-col bg-[#efeae2] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" 
             style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundSize: '400px' }}></div>

        {activeChat ? (
          <>
            <header className="p-3 bg-[#f0f2f5] flex justify-between items-center z-10 border-b shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 border-2 border-white">
                  {activeChat.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">{activeChat.name}</h3>
                  <p className="text-[10px] text-emerald-600 font-bold">متصل الآن</p>
                </div>
              </div>
              <div className="flex gap-5 text-gray-500 mr-2">
                <Video size={20} className="cursor-pointer hover:text-emerald-600" />
                <Phone size={20} className="cursor-pointer hover:text-emerald-600" />
                <MoreVertical size={20} className="cursor-pointer" />
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 z-10 flex flex-col custom-scrollbar">
              {historyLoading ? (
                <div className="flex justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>
              ) : (
                messages.map((msg, i) => {
                  // المنطق الجوهري للفصل: 
                  // لو الـ senderId جاي من عندك يبقى يمين (True)، لو من المريض يبقى شمال (False)
                  const isMe = String(msg.senderId).trim() === String(currentUserId).trim();
                  
                  return (
                    <div key={i} className={`flex w-full ${isMe ? "justify-end" : "justify-start animate-in slide-in-from-left-2"}`}>
                      <div
                        className={`max-w-[70%] px-4 py-2 shadow-sm text-[14px] relative rounded-2xl ${
                          isMe
                            ? "bg-[#d9fdd3] text-gray-800 rounded-tr-none" 
                            : "bg-white text-gray-800 rounded-tl-none"
                        }`}
                      >
                        {/* عرض اسم المرسل فقط لو مش أنا */}
                        {!isMe && <span className="text-[10px] font-bold text-emerald-600 block mb-1">المريض</span>}
                        
                        <p className="text-right leading-relaxed" dir="auto">{msg.content}</p>
                        
                        <div className={`flex items-center gap-1 mt-1 opacity-60 ${isMe ? "justify-end" : "justify-start"}`}>
                          <span className="text-[9px]">
                            {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {isMe && <CheckCheck size={14} className="text-sky-500" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={scrollRef} />
            </div>

            <footer className="p-3 bg-[#f0f2f5] flex items-center gap-3 z-10 border-t">
              <Smile className="text-gray-500 cursor-pointer hover:text-emerald-600" />
              <Paperclip className="text-gray-500 cursor-pointer -rotate-45 hover:text-emerald-600" />
              <form onSubmit={sendMessage} className="flex-1 flex gap-3">
                <input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 bg-white rounded-xl px-5 py-3 text-sm outline-none shadow-sm text-right"
                  placeholder="اكتب رسالة..."
                  dir="rtl"
                />
                <button 
                  type="submit" 
                  disabled={!messageInput.trim()} 
                  className="bg-[#00a884] text-white p-3 rounded-full hover:bg-[#008f6f] shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 z-10 text-center px-10">
             <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
               <MessageSquare size={48} className="text-emerald-200" />
             </div>
             <h3 className="text-2xl font-black text-gray-700">الدردشة الطبية</h3>
             <p className="text-sm mt-3 bg-white/50 px-4 py-1 rounded-full">اختر مريضاً من القائمة الجانبية لمتابعة حالته الصحية</p>
          </div>
        )}
      </div>
    </div>
  );
}