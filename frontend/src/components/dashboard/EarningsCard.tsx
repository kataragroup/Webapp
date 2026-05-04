import React from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/Card';
import { Coins } from 'lucide-react';

interface EarningsCardProps {
  amount: string;
  label?: string;
  onClick?: () => void;
  theme?: 'light' | 'dark';
}

export const EarningsCard: React.FC<EarningsCardProps> = ({ 
  amount, 
  label = "Total Earning", 
  onClick,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <Card
        onClick={onClick}
        className={`p-8 border-none flex items-center justify-between shadow-2xl cursor-pointer group rounded-[40px] ${
          isDark 
            ? 'bg-linear-to-r from-[#1E3A8A]/40 to-[#10B981]/40 border border-white/5 backdrop-blur-md shadow-emerald-500/10' 
            : 'bg-linear-to-r from-blue-600 via-blue-500 to-emerald-500 shadow-blue-500/20'
        }`}
      >
        <div className="space-y-4">
          <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">{label}</p>
          <h2 className="text-4xl font-black tracking-tight text-white italic">{amount}</h2>
        </div>
        <div className="bg-white/20 backdrop-blur-md p-5 rounded-3xl text-white group-hover:scale-110 transition-transform">
          <Coins size={40} strokeWidth={2} />
        </div>
      </Card>
    </motion.div>
  );
};
