import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { MessageSquare, Star, Send, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Feedback() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
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
           <div className="w-24 h-24 bg-[#00E054]/10 text-[#00E054] rounded-[40px] flex items-center justify-center mx-auto">
              <Sparkles size={48} />
           </div>
           <div className="space-y-3">
              <h3 className="text-3xl font-black italic uppercase italic text-white/90 leading-none">Transmission Received</h3>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] leading-relaxed font-mono">Your perspective has been synchronized with the core network. Evolution initiated.</p>
           </div>
           <button 
             onClick={() => navigate('/user')}
             className="w-full h-18 bg-[#00E054] text-black rounded-[32px] font-black italic uppercase tracking-[0.2em] text-[10px] shadow-2xl active:scale-95 transition-all"
           >
             Return to Base
           </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1B1E] text-white pb-32 font-sans overflow-x-hidden">
      <Header onMenuClick={() => {}} showBack={true} theme="dark" title="Network Feedback" />

      <div className="px-6 space-y-12 mt-10 container mx-auto lg:max-w-3xl">
        <div className="text-center space-y-4">
           <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Experience Protocol</h2>
           <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] leading-none text-center">Quantify your interaction with the Go-Yatree infrastructure</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-10 rounded-[48px] space-y-12 backdrop-blur-3xl shadow-2xl">
           <div className="flex flex-col items-center gap-6">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] font-mono leading-none">Satisfaction Metric</p>
              <div className="flex gap-4">
                 {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(s)}
                      className={`transition-all duration-300 transform ${
                        (hoverRating || rating) >= s ? 'scale-125 text-[#00E054] drop-shadow-[0_0_15px_rgba(0,224,84,0.5)]' : 'text-white/10 scale-100'
                      }`}
                    >
                       <Star size={40} fill={(hoverRating || rating) >= s ? 'currentColor' : 'none'} strokeWidth={3} />
                    </button>
                 ))}
              </div>
           </div>

           <div className="space-y-4">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] font-mono leading-none text-center">Qualitative Feedback</p>
              <textarea 
                 placeholder="Synchronize your thoughts with the network development team..."
                 className="w-full bg-black/40 border border-white/10 text-white min-h-[180px] rounded-[32px] p-8 focus:outline-none focus:border-[#00E054]/50 transition-all text-xs font-black uppercase tracking-wider placeholder:text-white/5"
                 value={comment}
                 onChange={(e) => setComment(e.target.value)}
              />
           </div>

           <button 
             onClick={handleSubmit}
             disabled={loading || rating === 0}
             className="w-full h-20 bg-[#00E054] text-black rounded-[32px] font-black italic uppercase tracking-[0.4em] text-[10px] shadow-[0_20px_40px_rgba(0,224,84,0.2)] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-20"
           >
              {loading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
              {loading ? 'Transmitting Perspective...' : 'Execute Submission'}
           </button>
        </div>
      </div>
    </div>
  );
}
