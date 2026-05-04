import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import MapComponent from '../../components/admin/MapComponent';
import { motion } from 'motion/react';
import { Navigation, Users, Car, AlertCircle, Radio, MapPin } from 'lucide-react';

export default function AdminTracking() {
  return (
    <AdminLayout title="Live Radar">
      <div className="space-y-6 lg:space-y-8 h-[calc(100vh-160px)] flex flex-col">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black italic uppercase tracking-tighter text-[#0A1128] leading-none">Node Radar</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2 lg:mt-3 font-mono italic">Real-Time Asset Geolocation Stream</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto no-scrollbar pb-2 sm:pb-0">
             <div className="px-5 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 shadow-md shrink-0">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse ring-4 ring-emerald-500/20" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">1,240 Nodes Active</span>
             </div>
             <button className="px-5 py-2.5 bg-[#0A1128] text-white rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-blue-900/10 shrink-0 italic">Broadcast Pulse</button>
          </div>
        </header>

        <div className="flex-1 relative rounded-2xl lg:rounded-[40px] overflow-hidden border border-zinc-200 bg-zinc-50 shadow-2xl overflow-hidden group">
           <MapComponent />

           {/* Dashboard Overlay - Desktop Only */}
           <div className="hidden lg:block absolute top-8 left-8 space-y-4 pointer-events-none">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-white/95 backdrop-blur-xl border border-zinc-100 p-6 rounded-[32px] shadow-2xl flex items-center gap-6 pointer-events-auto ring-1 ring-zinc-100/50"
              >
                 <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <Car size={24} />
                 </div>
                 <div>
                    <h4 className="text-sm font-black italic uppercase italic leading-none">Vehicle Nodes</h4>
                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Global Fleet Cluster</p>
                 </div>
                 <div className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-[10px] font-black italic shadow-lg shadow-blue-500/20">842</div>
              </motion.div>

              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white/95 backdrop-blur-xl border border-zinc-100 p-6 rounded-[32px] shadow-2xl flex items-center gap-6 pointer-events-auto ring-1 ring-zinc-100/50"
              >
                 <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <Users size={24} />
                 </div>
                 <div>
                    <h4 className="text-sm font-black italic uppercase italic leading-none">User Demand</h4>
                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Service Pressure Map</p>
                 </div>
                 <div className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black italic shadow-lg shadow-emerald-500/20">398</div>
              </motion.div>
           </div>

           {/* Status Overlay - Bottom Mobile/Desktop */}
           <div className="absolute bottom-4 lg:bottom-10 left-4 right-4 lg:left-auto lg:right-10 pointer-events-none">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-[#0A1128]/95 backdrop-blur-xl p-6 lg:p-8 rounded-3xl lg:rounded-[40px] shadow-2xl pointer-events-auto space-y-6 max-w-full lg:max-w-[340px] border border-white/5"
              >
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                       <AlertCircle size={24} />
                    </div>
                    <div>
                       <h4 className="text-sm lg:text-base font-black italic uppercase italic leading-none text-white">Alert Matrix</h4>
                       <p className="text-[9px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">Active System Warnings</p>
                    </div>
                 </div>
                 <div className="h-px bg-white/5 w-full" />
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Radio size={14} className="text-blue-500 animate-pulse" />
                          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Signal Latency</span>
                       </div>
                       <span className="text-[10px] font-black text-white italic tracking-tighter">14ms AVG</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <MapPin size={14} className="text-emerald-500" />
                          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">GPS Drift</span>
                       </div>
                       <span className="text-[10px] font-black text-white italic tracking-tighter">± 2.4m</span>
                    </div>
                 </div>
                 <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5 italic">
                    Open Advanced Console
                 </button>
              </motion.div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
