import { motion } from 'motion/react';
import { Button } from '../../../components/ui/Button';
import { Ride } from '../../../types';
import { useNavigate } from 'react-router-dom';

interface DashboardRideCardProps {
  ride: Ride;
  onCancelClick: () => void;
}

export const DashboardRideCard = ({ ride, onCancelClick }: DashboardRideCardProps) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[28px] p-6 space-y-6 shadow-xl"
    >
      <div onClick={() => navigate('/user/ride/status')} className="cursor-pointer space-y-6">
        <div className="flex justify-between items-center text-sm">
          <span className="text-white/60 font-medium">{ride.date} | {ride.time}</span>
          <span className="text-white font-medium uppercase tracking-wider bg-white/10 border border-white/5 px-3 py-1 rounded-full text-[10px] backdrop-blur-md">
            {ride.status}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-10 bg-zinc-800 rounded-lg flex items-center justify-center p-1 overflow-hidden">
               <img src="https://cdn-icons-png.flaticon.com/512/3202/3202926.png" className="w-full object-contain" alt={ride.vehicleType} />
            </div>
            <span className="text-xl font-bold">{ride.vehicleType}</span>
          </div>
          <span className="text-xl font-bold">$ {ride.fare}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 flex gap-3">
         <Button 
          variant="outline" 
          className="flex-1 rounded-xl bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all h-12"
          onClick={onCancelClick}
         >
           Cancel Ride
         </Button>
         <Button 
          variant="outline" 
          className="flex-1 rounded-xl bg-white/5 border-white/10 text-white h-12"
          onClick={() => navigate('/user/ride/status')}
         >
           Track
         </Button>
      </div>
    </motion.div>
  );
};
