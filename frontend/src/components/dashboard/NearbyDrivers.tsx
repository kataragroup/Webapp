import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const NearbyDrivers: React.FC = () => {
  const navigate = useNavigate();
  const VEHICLE_TYPES = ['Silver', 'Gold', 'Elite', 'Prime', 'Cargo', 'Bike'];
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-4">
        <div className="space-y-1">
          <h2 className="text-xl font-black italic tracking-tight flex items-center gap-3 uppercase text-white">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            </div>
            Active Pilots
          </h2>
          <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] font-mono leading-none">Sector Proximity: 2.4 KM Radius</p>
        </div>
        <button
          onClick={() => navigate('/user/select')}
          className="h-10 px-6 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-[#00E054] uppercase tracking-widest hover:bg-[#00E054] hover:text-black transition-all active:scale-95 shadow-2xl"
        >
          Express Launch
        </button>
      </div>

      <div className="flex overflow-x-auto pb-6 gap-4 px-4 no-scrollbar -mx-4 md:mx-0 snap-x">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={`driver-near-${i}`}
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(0, 224, 84, 0.25)"
            }}
            whileTap={{ scale: 0.98 }}
            className="flex-none w-64 bg-linear-to-br from-white/[0.08] to-emerald-500/[0.02] border border-white/5 rounded-[32px] p-6 flex flex-col gap-5 hover:border-[#00E054]/40 transition-all cursor-pointer group relative overflow-hidden snap-center backdrop-blur-xl"
            onClick={() => navigate('/user/select')}
          >
            {/* Holographic accent */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#00E054]/10 blur-[60px] group-hover:bg-[#00E054]/20 transition-all duration-500" />
            
            <div className="flex justify-between items-start relative z-10">
              <div className="relative">
                 <div className="w-16 h-16 rounded-[24px] bg-white/5 p-1 relative border border-white/10 group-hover:border-[#00E054]/30 transition-all duration-500 overflow-hidden">
                   <div className="absolute inset-0 bg-linear-to-tr from-[#00E054]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   <img
                     src={`https://api.dicebear.com/7.x/avataaars/svg?seed=PilotNode${i*13}`}
                     alt="driver"
                     className="w-full h-full rounded-[20px] bg-zinc-900 object-cover relative z-10"
                   />
                 </div>
                 <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0D1B1E] border border-white/10 rounded-lg flex items-center justify-center shadow-2xl group-hover:border-[#00E054]/40 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00E054] shadow-[0_0_10px_rgba(0,224,84,0.8)] animate-pulse" />
                 </div>
              </div>
              
              <div className="text-right">
                 <p className="text-lg font-black italic uppercase text-white/90 group-hover:text-[#00E054] transition-colors leading-none tracking-tighter">{i + 1}.{i*3} KM</p>
                 <p className="text-[7px] font-black text-[#00E054]/40 uppercase tracking-[0.3em] mt-1.5 font-mono">Range Locked</p>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex flex-col">
                <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.4em] font-mono leading-none">Authorization</span>
                <span className="text-[11px] font-black italic uppercase text-white mt-1.5 flex items-center gap-2">
                   PILOT_{i}77_X
                   <span className="w-1 h-1 rounded-full bg-white/20" />
                   <span className="text-[8px] text-[#00E054] normal-case tracking-normal">Online</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                 <div className="bg-white/5 border border-white/5 rounded-2xl p-3 group-hover:bg-white/[0.08] transition-colors">
                    <p className="text-[6px] font-black text-white/20 uppercase tracking-widest leading-none mb-1.5">Class</p>
                    <p className="text-[10px] font-black text-white italic uppercase">{VEHICLE_TYPES[i % 6]}</p>
                 </div>
                 <div className="bg-white/5 border border-white/5 rounded-2xl p-3 group-hover:bg-white/[0.08] transition-colors">
                    <p className="text-[6px] font-black text-white/20 uppercase tracking-widest leading-none mb-1.5">Rep</p>
                    <p className="text-[10px] font-black text-orange-400 italic uppercase">4.{9 - i} ★</p>
                 </div>
              </div>
            </div>

            <div className="h-px bg-white/5 w-full" />

            <div className="flex justify-between items-center relative z-10">
               <div className="flex flex-col">
                  <span className="text-[7px] font-black text-[#00E054] uppercase tracking-[0.3em] font-mono leading-none mb-1.5">Projection</span>
                  <span className="text-sm font-black text-white/90 uppercase italic tracking-tighter underline decoration-[#00E054]/30 underline-offset-4">{i + 1} Minute</span>
               </div>
               <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/10 group-hover:bg-[#00E054] group-hover:text-black group-hover:border-[#00E054] group-hover:shadow-[0_0_20px_rgba(0,224,84,0.4)] transition-all duration-300">
                  <ChevronRight size={18} />
               </div>
            </div>
            
            {/* Scanline overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#00E054]/5 to-transparent h-20 -top-20 group-hover:animate-[scan_3s_linear_infinite] pointer-events-none opacity-0 group-hover:opacity-100" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
