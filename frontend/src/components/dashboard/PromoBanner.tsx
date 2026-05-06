import React from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/Card';

export const PromoBanner: React.FC = () => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="space-y-4 px-2"
    >
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[36px] shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF8A00]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        <div className="space-y-1 relative z-10">
          <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.4em]">Weekend Special!</p>
          <h3 className="text-white text-3xl font-black italic uppercase tracking-tighter leading-[0.9] mt-2 mb-4">
            Enjoy 30% off all rides <br/> this weekend
          </h3>
          <p className="text-[#FF8A00] text-xs font-bold uppercase tracking-widest">
            Promo Code: <span className="text-white">WEEKEND30</span>
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-2">
        <div className="w-2.5 h-2.5 bg-[#FF8A00] rounded-full"></div>
        <div className="w-2.5 h-2.5 bg-zinc-600 rounded-full"></div>
      </div>
    </motion.div>
  );
};
