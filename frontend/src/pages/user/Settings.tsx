import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Header 
} from '../../components/layout/Header';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  MessageSquare, 
  ShieldAlert,
  ChevronRight,
  LogOut,
  MapPin
} from 'lucide-react';
import { authService } from '../../services/authService';

export default function Settings() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const MENU_ITEMS = [
    { 
      title: 'Identity node', 
      subtitle: 'Manage your network credentials', 
      icon: User, 
      color: 'text-[#00E054]',
      bg: 'bg-[#00E054]/5',
      path: '/user/profile'
    },
    { 
      title: 'Matrix Address Book', 
      subtitle: 'Manage saved target nodes', 
      icon: MapPin, 
      color: 'text-blue-400',
      bg: 'bg-blue-400/5',
      path: '/user/address-book'
    },
    { 
      title: 'Signal Notifications', 
      subtitle: 'Configure transmission alerts', 
      icon: Bell, 
      color: 'text-blue-500',
      bg: 'bg-blue-500/5',
      path: '#'
    },
    { 
      title: 'Security Protocols', 
      subtitle: 'Encryption & access control', 
      icon: Shield, 
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/5',
      path: '#'
    },
    { 
      title: 'Settlement Nodes', 
      subtitle: 'Manage financial trajectories', 
      icon: CreditCard, 
      color: 'text-orange-500',
      bg: 'bg-orange-500/5',
      path: '/user/wallet'
    },
    { 
      title: 'Global Interface', 
      subtitle: 'Region & language preference', 
      icon: Globe, 
      color: 'text-purple-500',
      bg: 'bg-purple-500/5',
      path: '#'
    },
  ];

  const SUPPORT_ITEMS = [
    { 
      title: 'Network Feedback', 
      subtitle: 'Transmit user experience data', 
      icon: MessageSquare, 
      color: 'text-blue-400',
      bg: 'bg-blue-400/5',
      path: '/user/feedback'
    },
    { 
      title: 'Security Complaint', 
      subtitle: 'Report protocol violations', 
      icon: ShieldAlert, 
      color: 'text-red-500',
      bg: 'bg-red-500/5',
      path: '/user/complaints'
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D1B1E] text-white pb-32 font-sans overflow-x-hidden">
      <Header onMenuClick={() => {}} showBack={true} theme="dark" title="Control Panel" />

      <div className="px-6 space-y-12 pt-24 mt-10 container mx-auto lg:max-w-4xl">
        <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-white/5 rounded-[40px] p-8 relative overflow-hidden backdrop-blur-3xl shadow-2xl">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <LogOut size={120} />
           </div>
           <div className="relative z-10 space-y-4">
              <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] font-mono leading-none">Data Stream: Active</h4>
              <div className="flex gap-10">
                 <div>
                    <p className="text-3xl font-black italic uppercase tracking-tighter">142.8 <small className="text-xs opacity-50">GB</small></p>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">Network Throughput</p>
                 </div>
                 <div>
                    <p className="text-3xl font-black italic uppercase tracking-tighter">0.4 <small className="text-xs opacity-50">ms</small></p>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">Latency Variance</p>
                 </div>
                 <div>
                    <p className="text-3xl font-black italic uppercase tracking-tighter">99.9 <small className="text-xs opacity-50">%</small></p>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">Uptime Integrity</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] font-mono pl-4 leading-none">Primary Configuration</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MENU_ITEMS.map((item, i) => (
                <button 
                  key={i}
                  onClick={() => item.path !== '#' && navigate(item.path)}
                  className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex items-center justify-between group hover:bg-white/10 hover:border-white/20 transition-all text-left"
                >
                   <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} shadow-lg`}>
                         <item.icon size={28} />
                      </div>
                      <div>
                         <p className="text-sm font-black italic uppercase italic text-white/90 group-hover:text-[#00E054] transition-colors">{item.title}</p>
                         <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">{item.subtitle}</p>
                      </div>
                   </div>
                   <ChevronRight size={20} className="text-white/10 group-hover:text-[#00E054] transition-all group-hover:translate-x-1" />
                </button>
              ))}
           </div>
        </div>

        <div className="space-y-6">
           <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] font-mono pl-4 leading-none">Network Support</h3>
           <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {SUPPORT_ITEMS.map((item, i) => (
                <button 
                  key={i}
                  onClick={() => navigate(item.path)}
                  className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex items-center justify-between group hover:bg-white/10 hover:border-white/20 transition-all text-left"
                >
                   <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} shadow-lg`}>
                         <item.icon size={28} />
                      </div>
                      <div>
                         <p className="text-sm font-black italic uppercase italic text-white/90 group-hover:text-[#00E054] transition-colors">{item.title}</p>
                         <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">{item.subtitle}</p>
                      </div>
                   </div>
                   <ChevronRight size={20} className="text-white/10 group-hover:text-[#00E054] transition-all group-hover:translate-x-1" />
                </button>
              ))}
           </div>
        </div>

        <div className="pt-10">
           <button 
             onClick={() => authService.logout().then(() => navigate('/login'))}
             className="w-full h-18 bg-white/5 border border-red-500/20 text-red-500 rounded-[32px] font-black italic uppercase tracking-[0.4em] text-[10px] hover:bg-red-500/10 active:scale-95 transition-all flex items-center justify-center gap-4"
           >
             <LogOut size={24} /> Terminate Current Session
           </button>
        </div>
      </div>
    </div>
  );
}
