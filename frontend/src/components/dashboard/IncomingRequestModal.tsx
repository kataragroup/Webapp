import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navigation, MapPin, X, Check } from 'lucide-react';

interface IncomingRequestModalProps {
  ride: any;
  onAccept: () => void;
  onDecline: () => void;
}

export const IncomingRequestModal: React.FC<IncomingRequestModalProps> = ({ ride, onAccept, onDecline }) => {
  if (!ride) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          className="w-full max-w-sm bg-white border border-zinc-200 rounded-[40px] p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500 animate-pulse" />

          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 border border-emerald-100">
              <Navigation size={40} className="animate-bounce" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-2xl font-black italic uppercase tracking-tight">Rapid Request</h3>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] animate-pulse">
                Incoming Signal Detected
              </p>
            </div>

            <div className="w-full space-y-4 pt-4 border-t border-zinc-100">
              <div className="flex gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <div className="w-0.5 h-8 border-l-2 border-zinc-100" />
                  <MapPin size={14} className="text-red-500" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Origin</p>
                    <p className="text-xs font-black italic line-clamp-1 text-zinc-600">{ride.pickup}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Target Terminal</p>
                    <p className="text-xs font-black italic line-clamp-1 text-zinc-600">{ride.drop}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 pt-4">
              <button
                onClick={onDecline}
                className="h-16 rounded-2xl bg-zinc-50 text-zinc-400 border border-zinc-100 font-bold active:scale-95 transition-all"
              >
                <X size={24} className="mx-auto" />
              </button>
              <button
                onClick={onAccept}
                className="h-16 rounded-2xl bg-linear-to-r from-emerald-600 to-emerald-400 text-white shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Check size={24} className="mx-auto" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
