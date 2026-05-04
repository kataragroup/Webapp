import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { ShieldAlert, Send, User, MessageSquare, AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Input } from '../../components/ui/Input';

export default function Complaint() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    driverId: '',
    rideId: '',
    category: 'Safety',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0D1B1E] text-white flex items-center justify-center p-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/5 border border-white/10 p-12 rounded-[48px] text-center space-y-8 max-w-md shadow-2xl backdrop-blur-3xl"
        >
           <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-[40px] flex items-center justify-center mx-auto">
              <ShieldAlert size={48} />
           </div>
           <div className="space-y-3">
              <h3 className="text-3xl font-black italic uppercase italic text-white/90 leading-none">Report Transmitted</h3>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] leading-relaxed font-mono">Security protocol sequence initiated. Our nodes are analyzing the data.</p>
           </div>
           <button 
             onClick={() => navigate('/user')}
             className="w-full h-18 bg-[#00E054] text-black rounded-[32px] font-black italic uppercase tracking-[0.2em] text-[10px] shadow-2xl active:scale-95 transition-all"
           >
             Return to Dashboard
           </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1B1E] text-white pb-32 font-sans overflow-x-hidden">
      <Header onMenuClick={() => {}} showBack={true} theme="dark" title="Security Report" />

      <div className="px-6 space-y-12 mt-10 container mx-auto lg:max-w-3xl">
        <div className="space-y-4">
           <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Incident Log</h2>
           <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] leading-none">Report anomalies in the network timeline</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] font-mono pl-4">Pilot Identification (Optional)</label>
                 <div className="relative group">
                    <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#00E054] transition-colors" />
                    <Input 
                       placeholder="Enter Pilot ID"
                       value={formData.driverId}
                       onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                       className="bg-black/40 border-white/10 text-white h-16 rounded-[28px] pl-14 focus:border-[#00E054]/50 focus:ring-0 placeholder:text-white/10"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] font-mono pl-4">Transit Sequence ID</label>
                 <div className="relative group">
                    <AlertTriangle size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-500 transition-colors" />
                    <Input 
                       placeholder="Enter Ride ID"
                       value={formData.rideId}
                       onChange={(e) => setFormData({ ...formData, rideId: e.target.value })}
                       className="bg-black/40 border-white/10 text-white h-16 rounded-[28px] pl-14 focus:border-orange-500/50 focus:ring-0 placeholder:text-white/10"
                    />
                 </div>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] font-mono pl-4">Protocol Violation Category</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {['Safety', 'Behavior', 'Charges', 'Technics'].map((cat) => (
                   <button
                     key={cat}
                     type="button"
                     onClick={() => setFormData({ ...formData, category: cat })}
                     className={`h-14 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                       formData.category === cat 
                         ? 'bg-red-500/10 border-red-500/50 text-red-500' 
                         : 'bg-white/5 border-white/5 text-white/20 hover:text-white/40'
                     }`}
                   >
                      {cat}
                   </button>
                 ))}
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] font-mono pl-4">Detailed Incident Analysis</label>
              <div className="relative group">
                 <MessageSquare size={18} className="absolute left-5 top-6 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                 <textarea 
                    placeholder="Provide a detailed log of the anomaly..."
                    className="w-full bg-black/40 border border-white/10 text-white min-h-[200px] rounded-[32px] p-6 pl-14 focus:outline-none focus:border-blue-500/50 transition-all text-xs font-black uppercase tracking-wider placeholder:text-white/10"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                 />
              </div>
           </div>

           <button 
             type="submit"
             disabled={loading || !formData.description}
             className="w-full h-20 bg-red-500 text-white rounded-[32px] font-black italic uppercase tracking-[0.4em] text-[10px] shadow-[0_20px_40px_rgba(239,68,68,0.2)] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
           >
              {loading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
              {loading ? 'Transmitting Data...' : 'Broadcast Security Alert'}
           </button>
        </form>
      </div>
    </div>
  );
}
