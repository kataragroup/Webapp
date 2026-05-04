import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, Car, ShieldCheck, Map, CreditCard, BarChart3, 
  Bell, Headphones, LogOut, LayoutDashboard, EyeOff, ShieldAlert,
  ChevronRight, Search, Menu, X, Shield, Star, Inbox
} from 'lucide-react';
import { authService } from '../services/authService';
import { cn } from '../lib/utils';

export default function AdminLayout({ children, title }: { children: React.ReactNode, title?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isImpersonating, setIsImpersonating] = useState(authService.isImpersonating());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Force sidebar closed on mobile initialization
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }

    const interval = setInterval(() => {
      setIsImpersonating(authService.isImpersonating());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStopImpersonation = () => {
    authService.stopImpersonating();
    setIsImpersonating(false);
    navigate('/admin/users');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Car, label: 'Drivers', path: '/admin/drivers' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Inbox, label: 'Rides', path: '/admin/rides' },
    { icon: Map, label: 'Live Tracking', path: '/admin/tracking' },
    { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
    { icon: BarChart3, label: 'Earnings', path: '/admin/earnings' },
    { icon: Shield, label: 'Incentives', path: '/admin/incentives' },
    { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
    { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
    { icon: Headphones, label: 'Support', path: '/admin/support' },
    { icon: ShieldCheck, label: 'Settings', path: '/admin/settings' },
  ];

  const handleLogout = async () => {
    await authService.logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#0A1128] flex font-sans overflow-x-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "bg-[#0A1128] text-white flex flex-col transition-all duration-300 fixed lg:relative h-screen z-50 border-r border-white/5 shadow-2xl shadow-black/50 overflow-hidden",
        isSidebarOpen ? "w-64" : "w-0 lg:w-20",
        isMobileMenuOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 min-w-[256px]">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black shadow-lg shadow-blue-500/20 text-white">D</div>
             <div className="flex flex-col">
                <span className="font-black tracking-tight text-base leading-tight italic">DriveConnect</span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none">Admin Panel</span>
             </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-zinc-400 p-2 hover:bg-white/5 rounded-xl">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-hide min-w-[256px]">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isCollapsible = !isSidebarOpen && !isMobileMenuOpen;
            return (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3.5 p-3 rounded-xl transition-all font-bold text-sm group",
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                    : "text-zinc-400 hover:bg-white/5 hover:text-white",
                  isCollapsible && "justify-center px-0 w-14 mx-auto"
                )}
              >
                <item.icon size={20} className={cn(isActive ? "text-white" : "group-hover:text-blue-400 transition-colors")} />
                {(isSidebarOpen || isMobileMenuOpen) && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-4 min-w-[256px]">
          {isImpersonating && (isSidebarOpen || isMobileMenuOpen) && (
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl animate-pulse">
               <div className="flex items-center gap-2 mb-2 text-orange-500">
                  <ShieldAlert size={14} />
                  <span className="text-[10px] font-black uppercase">Active Proxy</span>
               </div>
               <button 
                 onClick={handleStopImpersonation}
                 className="w-full py-2 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition-all flex items-center justify-center gap-1.5 font-bold"
               >
                  <EyeOff size={14} /> Exit Proxy
               </button>
            </div>
          )}

          <button 
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-4 p-3 rounded-xl text-zinc-500 hover:bg-red-500/10 hover:text-red-500 transition-all font-black text-xs w-full uppercase tracking-widest italic",
              (!isSidebarOpen && !isMobileMenuOpen) && "justify-center px-0 w-14 mx-auto"
            )}
          >
            <LogOut size={18} />
            {(isSidebarOpen || isMobileMenuOpen) && <span>Safe Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-zinc-200/50 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3 lg:gap-6 flex-1 min-w-0">
             <button 
               onClick={() => {
                 if (window.innerWidth < 1024) {
                   setIsMobileMenuOpen(true);
                 } else {
                   setIsSidebarOpen(!isSidebarOpen);
                 }
               }}
               className="p-2.5 hover:bg-zinc-100 rounded-xl text-zinc-600 transition-all active:scale-95"
             >
                <Menu size={20} />
             </button>
             
             <div className="flex items-center gap-2 lg:gap-4 truncate">
                {location.pathname !== '/admin' && (
                  <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-[10px] lg:text-sm font-black text-blue-600 hover:gap-2 transition-all shrink-0"
                  >
                     <ChevronRight className="rotate-180" size={16} /> BACK
                  </button>
                )}
                <h1 className="text-sm lg:text-xl font-black tracking-tight text-[#0A1128] italic uppercase truncate">
                  {title || menuItems.find(m => m.path === location.pathname)?.label || 'Overview'}
                </h1>
             </div>

             <div className="hidden md:flex flex-1 max-w-xl ml-4 lg:ml-12 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search globally..."
                  className="w-full bg-zinc-100/50 border border-zinc-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all shadow-inner"
                />
             </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-5 ml-2 lg:ml-0">
             <div className="flex items-center gap-1 lg:gap-2">
                <button className="p-2 lg:p-2.5 text-zinc-500 hover:bg-zinc-100 rounded-xl lg:rounded-2xl transition-all relative">
                   <Bell size={20} />
                   <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm ring-1 ring-red-500/10"></span>
                </button>
                <button className="hidden sm:flex p-2.5 text-zinc-500 hover:bg-zinc-100 rounded-2xl transition-all">
                   <Shield size={20} />
                </button>
             </div>
             <div className="h-8 w-px bg-zinc-200 mx-1 lg:mx-2 hidden xs:block"></div>
             <div className="flex items-center gap-2 lg:gap-3 cursor-pointer group shrink-0">
                <div className="text-right hidden lg:block">
                   <p className="text-[11px] font-black uppercase tracking-widest text-[#0A1128]">Admin</p>
                   <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter italic group-hover:text-blue-600 transition-colors">Super Admin</p>
                </div>
                <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl lg:rounded-2xl bg-[#0A1128] border-2 lg:border-4 border-white shadow-xl flex items-center justify-center text-white ring-1 ring-zinc-100">
                   <span className="text-xs lg:text-base font-black italic uppercase">A</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Logout"
                >
                   <LogOut size={20} />
                </button>
             </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 pb-32 lg:pb-36 overflow-y-auto">
           {isImpersonating && (
              <div className="mb-6 lg:mb-8 p-4 lg:p-5 bg-gradient-to-r from-zinc-900 to-black text-white rounded-3xl lg:rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl border-l-[6px] border-orange-500">
                 <div className="flex items-center gap-4 lg:gap-5 w-full sm:w-auto">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-orange-500 flex items-center justify-center font-black italic text-xl lg:text-2xl shadow-lg shadow-orange-500/20 shrink-0">
                       {authService.getCurrentUser()?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="min-w-0">
                       <div className="flex items-center gap-2">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">PROXY ACTIVE</p>
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                       </div>
                       <p className="text-lg lg:text-2xl font-black italic tracking-tighter mt-0.5 truncate uppercase">Terminal: {authService.getCurrentUser()?.name}</p>
                    </div>
                 </div>
                 <button 
                   onClick={handleStopImpersonation}
                   className="w-full sm:w-auto px-6 lg:px-8 py-3 bg-white text-black hover:bg-orange-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
                 >
                    TERMINATE SESSION
                 </button>
              </div>
           )}
           <div className="max-w-[1600px] mx-auto w-full">
             {children}
           </div>
        </main>
      </div>
    </div>
  );
}
