import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ArrowLeft, Banknote, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { rideService } from '../../services/rideService';
import { Logo } from '../../components/Logo';
import { cn } from '../../lib/utils';

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fare, vehicleType, pickup, drop, driver } = location.state || { fare: 0, vehicleType: 'Go SUV', pickup: '', drop: '' };
  const [selectedMethod, setSelectedMethod] = useState<'wallet' | 'cash' | 'card' | 'bank'>('cash');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      const ride = await rideService.bookRide({
        vehicleType,
        fare,
        pickup,
        drop,
        paymentMethod: selectedMethod,
        status: 'placed',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      
      setTimeout(() => {
        navigate('/user/booking-confirmation', { 
          state: { 
            ride, 
            driver 
          } 
        });
      }, 2000);
    } catch (error) {
      console.error('Ride booking failed', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-6 font-sans relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF8A00]"></div>

      <header className="flex justify-between items-center mb-10 pt-4 px-2">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">Payment</h1>
        <div className="text-right">
           <p className="text-lg font-bold">$ {fare}</p>
        </div>
      </header>

      <div className="space-y-4">
        {[
          { id: 'gpay', label: 'G - Pay', icon: 'G', color: '#00E054', bg: 'bg-[#00E054]/10' },
          { id: 'bank', label: 'Mobile Banking', icon: 'M', color: '#FF8A00', bg: 'bg-[#FF8A00]/10' },
          { id: 'card', label: 'Visa', icon: 'V', color: '#0047FF', bg: 'bg-[#0047FF]/10' },
          { id: 'cash', label: 'CASH', icon: 'C', color: '#FFFFFF', bg: 'bg-zinc-800' }
        ].map((method) => (
          <button
            key={method.id}
            onClick={() => setSelectedMethod(method.id as any)}
            className={cn(
              "w-full h-20 rounded-2xl flex items-center justify-between px-6 transition-all border",
              selectedMethod === method.id ? "border-white/20 bg-zinc-800" : "border-transparent bg-zinc-900"
            )}
          >
            <div className="flex items-center gap-6">
               <div className={cn("w-12 h-12 rounded-full flex items-center justify-center font-black text-xl", method.bg)} style={{ color: method.color }}>
                 {method.icon}
               </div>
               <span className="text-lg font-bold">{method.label}</span>
            </div>
            {selectedMethod === method.id && (
              <div className="w-6 h-6 bg-[#00E054] rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(0,224,84,0.5)]">
                 <ShieldCheck size={14} className="text-black" />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="fixed bottom-10 left-6 right-6">
        <button 
          onClick={handleConfirm}
          disabled={isProcessing}
          className="w-full bg-[#FF8A00] text-black h-16 rounded-full font-bold text-xl transition-all active:scale-95 disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Continue'}
        </button>
      </div>

      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 flex flex-col items-center justify-center p-8 text-center"
          >
             <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-8">
                <Logo size="sm" />
             </div>
             
             <div className="space-y-4">
              <h2 className="text-2xl font-bold">Searching...</h2>
              <p className="text-xs text-white/40 font-medium tracking-widest uppercase">Connecting to nearby pilots</p>
            </div>

            <div className="mt-12 w-full max-w-xs h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
               <motion.div 
                 initial={{ x: '-100%' }}
                 animate={{ x: '100%' }}
                 transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                 className="h-full w-1/3 bg-[#FF8A00] rounded-full"
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
