import React from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/Card';

interface SystemMetric {
  label: string;
  value: string;
  percent: number;
  color: string;
}

const metrics: SystemMetric[] = [
  { label: 'Network Latency', value: '24ms', percent: 85, color: 'bg-emerald-500' },
  { label: 'Database Load', value: '42%', percent: 42, color: 'bg-orange-500' },
  { label: 'API Uptime', value: '99.9%', percent: 99, color: 'bg-blue-500' },
];

export const SystemHealthCard: React.FC = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-black italic uppercase underline underline-offset-8 decoration-emerald-500">
        System Health
      </h2>
      <Card className="p-8 border-zinc-100 bg-zinc-50 rounded-[40px] space-y-8">
        {metrics.map((metric, i) => (
          <div key={i} className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                {metric.label}
              </span>
              <span className={`text-xs font-black italic ${metric.color.replace('bg-', 'text-')}`}>
                {metric.value}
              </span>
            </div>
            <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metric.percent}%` }}
                className={`h-full ${metric.color} rounded-full`}
              />
            </div>
          </div>
        ))}
      </Card>
    </section>
  );
};
