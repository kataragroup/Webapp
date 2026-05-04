import React from 'react';
import { BarChart3 } from 'lucide-react';

export const FleetReportCard: React.FC = () => {
  return (
    <div className="mb-8 p-8 bg-zinc-50 border border-zinc-100 rounded-[40px] relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-2xl font-black italic uppercase">Fleet Report: Optimal</h2>
        <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mt-1">
          Status Synchronized • Live Feed Active
        </p>
      </div>
      <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
        <BarChart3 size={120} />
      </div>
    </div>
  );
};
