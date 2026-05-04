import { motion } from 'motion/react';
import { cn } from '../../../lib/utils';
import { useNavigate } from 'react-router-dom';

interface RideActionButtonsProps {
  status: string;
  isTracking: boolean;
  onTrack: () => void;
}

export const RideActionButtons = ({ status, isTracking, onTrack }: RideActionButtonsProps) => {
  const navigate = useNavigate();
  return (
    <div className="fixed bottom-0 inset-x-0 p-6 pt-10 bg-gradient-to-t from-[#0D1B1E] via-[#0D1B1E] to-transparent z-[100]">
      <div className="max-w-[500px] md:max-w-5xl mx-auto flex gap-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/user')}
          className="flex-1 h-16 rounded-[24px] bg-white/5 border border-white/10 text-red-500 font-black italic uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-red-500/10 backdrop-blur-3xl shrink-0"
        >
          {status === 'completed' ? 'Back Home' : 'Abort Mission'}
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex-[2] h-16 rounded-[24px] font-black italic uppercase tracking-[0.2em] shadow-2xl transition-all text-[10px] flex items-center justify-center gap-3",
            status === 'completed' ? "bg-white/5 text-white/40 border border-white/10" : "bg-orange-500 text-black shadow-[0_15px_40px_rgba(255,138,0,0.3)]"
          )}
          onClick={() => {
            if (status === 'completed') navigate('/user');
            else onTrack();
          }}
        >
          {status === 'completed' ? (
             'Sequence Terminated' 
          ) : (
             <>
               <div className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
               {isTracking ? 'Active Feed' : 'Track Ride'}
             </>
          )}
        </motion.button>
      </div>
    </div>
  );
};
