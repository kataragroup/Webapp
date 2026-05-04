import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, ChevronLeft, MapPin, Clock, Star, Car } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { ride, driver } = location.state || {};

  if (!ride) {
    return (
      <div className="min-h-screen bg-[#0D1B1E] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-white/40 mb-6">Session Expired</p>
        <Button onClick={() => navigate('/user')}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1B1E] text-white font-sans overflow-y-auto no-scrollbar pb-32">
       {/* Animated Success Header */}
       <div className="bg-gradient-to-b from-[#00E054]/20 to-transparent pt-20 pb-10 px-6 flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="w-20 h-20 bg-[#00E054] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,224,84,0.4)] mb-6"
          >
             <CheckCircle2 size={40} className="text-black" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black italic uppercase tracking-tighter text-center"
          >
            Booking Confirmed
          </motion.h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Relay ID: {ride.id.slice(0, 12)}</p>
       </div>

       <div className="max-w-[500px] mx-auto px-6 space-y-6">
          {/* Driver Info Card */}
          {driver && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex items-center gap-6"
            >
              <div className="relative">
                <img src={driver.photo} alt={driver.name} className="w-16 h-16 rounded-2xl object-cover border border-white/10" />
                <div className="absolute -bottom-2 -right-2 bg-[#FF8A00] text-black text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
                   <Star size={10} fill="currentColor" /> {driver.rating}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black italic uppercase tracking-tight">{driver.name}</h3>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{driver.vehicleModel}</p>
                <div className="mt-2 text-[#00E054] text-[10px] font-black uppercase tracking-widest border border-[#00E054]/20 bg-[#00E054]/5 px-2 py-1 rounded-md w-fit">
                   {driver.vehicleNumber}
                </div>
              </div>
            </motion.div>
          )}

          {/* Ride Details Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6"
          >
             <div className="grid grid-cols-2 gap-8 border-b border-white/5 pb-6">
                <div>
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Vehicle Node</p>
                  <p className="text-xl font-black italic uppercase tracking-tighter mt-1">{ride.vehicleType}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Estimated ETA</p>
                  <p className="text-xl font-black italic uppercase tracking-tighter mt-1 text-[#00E054]">5 Mins</p>
                </div>
             </div>

             <div className="space-y-6">
                <div className="flex gap-4">
                   <div className="flex flex-col items-center gap-1">
                      <div className="w-4 h-4 rounded-full border-2 border-[#00E054] flex items-center justify-center p-0.5">
                         <div className="w-full h-full bg-[#00E054] rounded-full" />
                      </div>
                      <div className="flex-1 w-0.5 border-l border-dashed border-white/20 my-1"></div>
                      <MapPin size={16} className="text-[#FF8A00]" />
                   </div>
                   <div className="flex-1 space-y-4">
                      <div>
                         <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Pickup Signal</p>
                         <p className="text-sm font-bold leading-tight">{ride.pickup}</p>
                      </div>
                      <div>
                         <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Drop Endpoint</p>
                         <p className="text-sm font-bold leading-tight">{ride.drop}</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                <div>
                   <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Total Settlement</p>
                   <p className="text-2xl font-black italic uppercase tracking-tighter mt-1">$ {ride.fare}</p>
                </div>
                <div className="bg-white/5 px-4 py-2 rounded-xl flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#00E054] shadow-[0_0_10px_#00E054]" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-[#00E054]">Payment Confirmed</span>
                </div>
             </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="fixed bottom-10 inset-x-6 flex gap-4 max-w-[500px] mx-auto">
             <button 
                onClick={() => navigate('/user')}
                className="flex-1 h-16 rounded-[24px] bg-white text-black font-black italic uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 transition-all"
             >
                Return to Nexus
             </button>
             <button 
                onClick={() => navigate(`/user/ride/${ride.id}`)}
                className="flex-1 h-16 rounded-[24px] bg-white/5 border border-white/10 text-white font-black italic uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 transition-all"
             >
                Live Tracking
             </button>
          </div>
       </div>
    </div>
  );
}
