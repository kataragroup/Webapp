import React, { useState } from 'react';
import { Menu, Bell, User, Settings, LogOut, ShieldAlert, MessageSquare, ChevronLeft } from 'lucide-react';
import { Logo } from '../Logo';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onMenuClick: () => void;
  showBack?: boolean;
  onBackClick?: () => void;
  showNotification?: boolean;
  title?: string;
  subtitle?: string;
  theme?: 'light' | 'dark';
}

export const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  showBack = false,
  onBackClick,
  showNotification = true,
  title,
  subtitle,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const user = authService.getCurrentUser();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <header className={`flex items-center justify-between p-6 pt-8 backdrop-blur-2xl fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
      isDark ? 'bg-black/40 border-white/10' : 'bg-white/70 border-zinc-100/50'
    }`}>
      <div className="flex items-center">
        {showBack ? (
          <button
            onClick={onBackClick || (() => navigate(-1))}
            className={`p-2 transition-all active:scale-90 ${
              isDark ? 'text-white' : 'text-black'
            }`}
          >
            <ChevronLeft size={28} />
          </button>
        ) : (
          <button
            onClick={onMenuClick}
            className={`p-2 transition-colors ${
              isDark ? 'text-white' : 'text-black'
            }`}
          >
            <Menu size={28} />
          </button>
        )}
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <Logo size="sm" />
      </div>

      <div className="relative flex items-center">
        <button 
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className={`p-2 transition-colors ${
            isDark ? 'text-white' : 'text-black'
          }`}
        >
          <Bell size={24} />
        </button>

        <AnimatePresence>
          {showProfileMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`absolute right-0 top-16 w-64 rounded-3xl border shadow-2xl p-4 overflow-hidden z-50 backdrop-blur-3xl ${
                isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white/90 border-zinc-100 text-black'
              }`}
            >
              <div className="p-4 border-b border-white/10 mb-2">
                <p className="text-xs font-black italic uppercase tracking-tighter">{user?.name || 'Authorized Client'}</p>
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest font-mono mt-1">ID: {user?.id?.slice(0, 8)}</p>
              </div>
              
              <div className="space-y-1">
                <button 
                  onClick={() => { navigate('/user/profile'); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors text-[10px] font-black uppercase tracking-widest"
                >
                  <User size={16} className="text-[#00E054]" /> Profile Node
                </button>
                <button 
                  onClick={() => { navigate('/user/settings'); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors text-[10px] font-black uppercase tracking-widest"
                >
                  <Settings size={16} className="text-blue-500" /> Control Panel
                </button>
                <button 
                  onClick={() => { navigate('/user/complaints'); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors text-[10px] font-black uppercase tracking-widest"
                >
                  <ShieldAlert size={16} className="text-red-500" /> Security Report
                </button>
                <button 
                  onClick={() => { navigate('/user/feedback'); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors text-[10px] font-black uppercase tracking-widest"
                >
                  <MessageSquare size={16} className="text-orange-500" /> Network Feedback
                </button>
                <div className="h-px bg-white/5 my-2" />
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-500/10 transition-colors text-[10px] font-black uppercase tracking-widest text-red-500"
                >
                  <LogOut size={16} /> Disconnect Sequence
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
