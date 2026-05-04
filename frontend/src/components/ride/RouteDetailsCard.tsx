import React from 'react';
import { Card } from '../ui/Card';

interface RouteDetailsCardProps {
  pickup: string;
  drop: string;
}

export const RouteDetailsCard: React.FC<RouteDetailsCardProps> = ({ pickup, drop }) => {
  return (
    <Card className="bg-white/5 border-white/5 p-8 rounded-[40px] space-y-8 relative overflow-hidden backdrop-blur-xl">
      <div className="absolute left-[45px] top-[50px] bottom-[50px] w-0.5 border-l-2 border-dashed border-white/5"></div>

      <div className="flex gap-6 relative z-10">
        <div className="w-10 h-10 rounded-full border-2 border-emerald-500 bg-[#0D1B1E] flex items-center justify-center shrink-0 shadow-2xl shadow-emerald-500/20">
          <div className="w-3 h-3 bg-emerald-500 rounded-full" />
        </div>
        <div className="space-y-1 pt-1">
          <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] font-mono leading-none mb-1">Node Origin</h4>
          <p className="text-sm font-black italic uppercase italic leading-tight text-white/90">{pickup}</p>
        </div>
      </div>

      <div className="flex gap-6 relative z-10">
        <div className="w-10 h-10 rounded-full border-2 border-orange-500 bg-[#0D1B1E] flex items-center justify-center shrink-0 shadow-2xl shadow-orange-500/20">
          <div className="w-3 h-3 bg-orange-500 rounded-full" />
        </div>
        <div className="space-y-1 pt-1">
          <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] font-mono leading-none mb-1">Node Target</h4>
          <p className="text-sm font-black italic uppercase italic leading-tight text-white/90">{drop}</p>
        </div>
      </div>
    </Card>
  );
};
