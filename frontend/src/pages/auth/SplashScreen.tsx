import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/Logo';
import { motion } from 'motion/react';

export default function SplashScreen() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => navigate('/welcome'), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Logo size="lg" />
      </motion.div>

      <div className="absolute bottom-20 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.5em]">Initializing</span>
        </div>
        
        <div className="w-48 h-[2px] bg-zinc-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-1/2 h-full bg-orange-500" 
          />
        </div>
      </div>
    </div>
  );
}
