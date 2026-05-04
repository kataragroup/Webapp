import React from 'react';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

interface MetricStat {
  label: string;
  count: number;
  color: string;
}

interface NodeMetricsProps {
  stats: MetricStat[];
  total: number;
  strokeDashoffset: number;
}

export const NodeMetrics: React.FC<NodeMetricsProps> = ({ stats, total, strokeDashoffset }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-black uppercase italic underline underline-offset-8 decoration-blue-500">
        Node Metrics
      </h3>
      <Card className="p-8 bg-zinc-50 border-zinc-100 rounded-[32px]">
        <div className="flex items-center gap-10">
          <div className="relative shrink-0 flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-zinc-200"
              />
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-blue-600"
                strokeDasharray="364"
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Total</span>
              <span className="text-2xl font-black italic">{total}</span>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className={cn('w-2 h-2 rounded-full', s.color)}></div>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-black transition-colors">
                    {s.label}
                  </span>
                </div>
                <span className="text-sm font-black italic">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
