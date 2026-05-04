import React from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/Card';
import { Car, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Ride } from '../../types';

interface RideHistoryProps {
  rides: Ride[];
}

export const RideHistory: React.FC<RideHistoryProps> = ({ rides }) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-black tracking-tight uppercase italic underline underline-offset-8 decoration-emerald-500 text-white/90">
          Ride History
        </h2>
        <button className="text-emerald-500 font-bold text-xs hover:underline uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full">
          Archive
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rides.map((ride, idx) => (
          <motion.div
            key={ride.id || (ride as any)._id || idx}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => navigate(`/user/ride/${ride.id || (ride as any)._id}`)}
          >
            <Card className="p-6 border border-white/5 hover:border-white/10 hover:shadow-2xl transition-all cursor-pointer group bg-black/20 rounded-[32px] backdrop-blur-sm h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-widest font-mono">
                    {ride.date} | {ride.time}
                  </span>
                  <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter ${
                    ride.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                  }`}>
                    {ride.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl group-hover:bg-emerald-500/10 transition-colors">
                      <Car size={32} className="text-emerald-500" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-lg font-black block italic uppercase text-white/90">
                        {ride.vehicleType}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-tighter">
                        <MapPin size={12} className="text-emerald-500" /> Location Synchronized
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black block text-white">₹ {ride.fare}</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {rides.length === 0 && (
          <div className="text-center py-16 space-y-6 bg-white/5 rounded-[40px] border border-white/5">
            <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto">
              <Car size={40} className="text-white/10" />
            </div>
            <p className="font-black uppercase text-xs text-white/20 tracking-[0.3em] font-mono">No Node History Found</p>
          </div>
        )}
      </div>
    </div>
  );
};
