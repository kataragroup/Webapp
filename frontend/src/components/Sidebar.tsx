import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Home, User, CreditCard, Clock, Settings, LogOut, Shield, Car, Heart, BarChart3, MapPin
} from 'lucide-react';
import { authService } from '../services/authService';

export function Sidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    switch (user?.role) {
      case 'driver':
        return [
          { icon: Home, label: 'Radar', path: '/driver' },
          { icon: Shield, label: 'KYC', path: '/driver/kyc' },
          { icon: CreditCard, label: 'Wallet', path: '/driver/wallet' },
          { icon: Heart, label: 'Ratings', path: '/driver/ratings' },
        ];
      case 'owner':
        return [
          { icon: Home, label: 'Dashboard', path: '/owner' },
          { icon: Car, label: 'Fleet', path: '/owner' },
          { icon: User, label: 'Drivers', path: '/owner' },
          { icon: CreditCard, label: 'Earnings', path: '/owner' },
        ];
      default:
        return [
          { icon: Home, label: 'Home', path: '/user' },
          { icon: MapPin, label: 'Endpoints', path: '/user/address-book' },
          { icon: Clock, label: 'History', path: '/user/history' },
          { icon: CreditCard, label: 'Wallet', path: '/user/wallet' },
          { icon: Settings, label: 'Settings', path: '/user/settings' },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white/5 backdrop-blur-3xl border-r border-white/10 z-50 transform transition-transform duration-500 ease-out shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col relative overflow-hidden">
          {/* Decorative background for sidebar */}
          <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-[#00E054]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#00E054]/10 border border-[#00E054]/20 rounded-xl flex items-center justify-center text-[#00E054]">
                <Car size={24} />
              </div>
              <div>
                <span className="text-xl font-black italic uppercase tracking-tighter block leading-none">Go-Yatree</span>
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1 block">Network Node</span>
              </div>
            </div>
            <button onClick={onClose} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={() => { navigate(item.path); onClose(); }}
                className="w-full h-14 flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#00E054]/10 transition-colors">
                  <item.icon size={18} className="text-white/20 group-hover:text-[#00E054]" />
                </div>
                <span className="font-black italic uppercase text-[10px] tracking-widest text-white/30 group-hover:text-white transition-colors">
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 p-4 rounded-2xl text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all font-black uppercase text-[10px] tracking-widest border border-transparent hover:border-red-500/10 h-14"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/5 flex items-center justify-center">
              <LogOut size={18} />
            </div>
            Logout Sequence
          </button>
        </div>
      </div>
    </>
  );
}
