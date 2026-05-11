import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Users, Beaker, 
  Settings, LogOut, Bell 
} from "lucide-react";

export default function AdminLayout() {
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/admin" },
    { icon: <Users size={20} />, label: "User Management", path: "/admin/users" },
    { icon: <Beaker size={20} />, label: "Global Tests", path: "/admin/tests" },
    { icon: <Settings size={20} />, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]" dir="ltr">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col fixed h-full z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 font-black">H</div>
          <span className="font-black text-slate-800 tracking-tighter text-xl">HEALTHCARE</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-100"
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-8 border-t border-slate-50">
          <button className="flex items-center gap-4 w-full px-6 py-4 text-rose-500 font-black text-[11px] uppercase tracking-widest hover:bg-rose-50 rounded-2xl transition-all">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-10">
          <h2 className="font-black text-slate-800 uppercase tracking-widest text-xs">System Administration</h2>
          <div className="flex items-center gap-4">
            <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><Bell size={20}/></button>
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200"></div>
          </div>
        </header>
        <div className="p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}