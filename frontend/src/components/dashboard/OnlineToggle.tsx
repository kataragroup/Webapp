import React from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/Card';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '../../lib/utils';

interface OnlineToggleProps {
  isOnline: boolean;
  onToggle: () => void;
}

export const OnlineToggle: React.FC<OnlineToggleProps> = ({ isOnline, onToggle }) => {
  return (
    <motion.div layout>
      <Card
        className={cn(
          'p-10 text-center space-y-6 border-2 transition-all duration-500 rounded-[40px]',
          isOnline ? 'border-emerald-500/20 bg-emerald-50/30' : 'border-red-500/20 bg-red-50/30'
        )}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              'p-6 rounded-full shadow-inner',
              isOnline ? 'text-emerald-500 bg-white' : 'text-red-500 bg-white'
            )}
          >
            {isOnline ? <Wifi size={48} /> : <WifiOff size={48} />}
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black italic uppercase italic">Node {isOnline ? 'Active' : 'Standby'}</h3>
            <p className="text-[10px] font-black text-zinc-400 max-w-[200px] mx-auto leading-relaxed uppercase tracking-widest">
              {isOnline
                ? 'Signal broadcast enabled. Visible to all target riders.'
                : 'Broadcast suspended. Request acquisition unavailable.'}
            </p>
          </div>
        </div>

        <button
          onClick={onToggle}
          className={cn(
            'w-full h-16 rounded-[24px] text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95',
            isOnline
              ? 'bg-red-500 text-white shadow-red-500/20'
              : 'bg-linear-to-r from-emerald-600 to-emerald-400 text-white shadow-emerald-500/20'
          )}
        >
          {isOnline ? 'Go Standby' : 'Initialize Active Session'}
        </button>
      </Card>
    </motion.div>
  );
};
