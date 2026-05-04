import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, User, Mail, Phone, MapPin, Save, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { authService } from '../../services/authService';
import { Header } from '../../components/layout/Header';
import { Input } from '../../components/ui/Input';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const user = authService.getCurrentUser();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || ''
  });

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await authService.updateProfile({
        name: formData.name,
        phone: formData.phone,
        avatar: formData.avatar
      });
      setMessage({ type: 'success', text: 'Identity sequence successfully updated in the network.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update protocol.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1B1E] text-white pb-32 font-sans overflow-x-hidden">
      <Header onMenuClick={() => {}} showBack={true} theme="dark" title="Profile Node" />

      <div className="px-6 space-y-12 mt-10 container mx-auto lg:max-w-4xl">
        <div className="relative flex flex-col items-center gap-6">
           <div className="relative group">
              <div className="w-32 h-32 rounded-[40px] bg-white/5 border border-white/10 overflow-hidden shadow-2xl transition-all group-hover:border-[#00E054]/50">
                 {formData.avatar ? (
                   <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-white/20">
                      <User size={48} />
                   </div>
                 )}
              </div>
              <label className="absolute -bottom-2 -right-2 p-3 bg-[#00E054] text-black rounded-2xl cursor-pointer shadow-2xl hover:scale-110 active:scale-95 transition-all">
                 <Camera size={20} />
                 <input 
                   type="text" 
                   className="sr-only" 
                   placeholder="Avatar URL"
                   value={formData.avatar}
                   onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                 />
              </label>
           </div>
           <div className="text-center space-y-1">
              <h2 className="text-2xl font-black italic uppercase italic text-white/90">{formData.name || 'Anonymous Node'}</h2>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] font-mono leading-none">Security Clearance ID: {user?.id?.slice(0, 12)}</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] font-mono pl-4">Identification Name</label>
                 <div className="relative group">
                    <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#00E054] transition-colors" />
                    <Input 
                       placeholder="Enter full name"
                       value={formData.name}
                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                       className="bg-black/40 border-white/10 text-white h-16 rounded-[28px] pl-14 focus:border-[#00E054]/50 focus:ring-0 placeholder:text-white/10"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] font-mono pl-4">Network Email (Read-Only)</label>
                 <div className="relative group opacity-50">
                    <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
                    <Input 
                       disabled
                       value={formData.email}
                       className="bg-black/40 border-white/10 text-white h-16 rounded-[28px] pl-14 font-mono text-[11px]"
                    />
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] font-mono pl-4">Contact Phone Protocol</label>
                 <div className="relative group">
                    <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                    <Input 
                       placeholder="+91 00000 00000"
                       value={formData.phone}
                       onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                       className="bg-black/40 border-white/10 text-white h-16 rounded-[28px] pl-14 focus:border-blue-500/50 focus:ring-0 placeholder:text-white/10"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] font-mono pl-4">Avatar Identifier URL</label>
                 <div className="relative group">
                    <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-500 transition-colors" />
                    <Input 
                       placeholder="https://image-node.url"
                       value={formData.avatar}
                       onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                       className="bg-black/40 border-white/10 text-white h-16 rounded-[28px] pl-14 focus:border-orange-500/50 focus:ring-0 placeholder:text-white/10"
                    />
                 </div>
              </div>
           </div>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-[28px] border text-[10px] font-black uppercase tracking-widest text-center italic ${
              message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        <div className="pt-10">
           <button 
             onClick={handleSave}
             disabled={loading}
             className="w-full h-18 bg-[#00E054] text-black rounded-[32px] font-black italic uppercase tracking-[0.4em] text-[10px] shadow-[0_20px_40px_rgba(0,224,84,0.2)] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
           >
             {loading ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
             {loading ? 'Processing Transaction...' : 'Commit Sequence Updates'}
           </button>
        </div>
      </div>
    </div>
  );
}
