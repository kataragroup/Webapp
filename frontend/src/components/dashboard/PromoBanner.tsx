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
      <div className="space-y-1">
        <p className="text-white text-sm font-medium">Weekend Special!</p>
        <h3 className="text-white text-xl font-bold leading-tight">
          Enjoy 30% off all rides this weekend
        </h3>
        <p className="text-[#FF8A00] text-sm font-medium italic">
          Make your weekend travels even better!
        </p>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        <div className="w-2.5 h-2.5 bg-[#FF8A00] rounded-full"></div>
        <div className="w-2.5 h-2.5 bg-zinc-600 rounded-full"></div>
      </div>
    </motion.div>
  );
};
