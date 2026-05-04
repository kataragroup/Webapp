import React from 'react';
import { Card } from '../ui/Card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  trend: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color, bg, trend }) => {
  return (
    <Card className="p-8 border-zinc-100 bg-zinc-50 hover:bg-white hover:shadow-2xl transition-all group rounded-[40px]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-zinc-400 font-black uppercase text-[10px] tracking-widest mb-2">{label}</p>
          <h3 className="text-4xl font-black italic italic uppercase">{value}</h3>
        </div>
        <div className={`p-5 rounded-3xl ${bg} ${color} group-hover:scale-110 transition-transform shadow-sm`}>
          <Icon size={32} />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">
          {trend} from last cycle
        </span>
      </div>
    </Card>
  );
};
