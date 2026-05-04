import { useState, useEffect } from 'react';
import { Search, Clock, CreditCard as WalletIcon, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { PromoBanner } from '../../components/dashboard/PromoBanner';
import { Footer } from '../../components/layout/Footer';
import { rideService } from '../../services/rideService';
import { Ride } from '../../types';
import { Button } from '../../components/ui/Button';
import { DashboardRideCard } from './components/DashboardRideCard';
import { CancelRideModal } from './components/CancelRideModal';

export default function UserDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActiveRide = async () => {
      const history = await rideService.getHistory();
      // Find the most recent ride that isn't completed or cancelled
      const active = history.find(ride => ride.status === 'placed' || ride.status === 'confirmed' || ride.status === 'ongoing');
      if (active) {
        setActiveRide(active);
      } else {
        // Fallback for demo/initial state if no real history exists
        // This keeps the UI testable even if API returns empty
        setActiveRide({
          id: '1',
          userId: 'user1',
          pickup: 'Current Location',
          drop: 'Destination',
          fare: 53.48,
          status: 'placed',
          date: '21 March 2025',
          time: '11:49 AM',
          vehicleType: 'SUV'
        });
      }
    };

    fetchActiveRide();
  }, []);

  const handleCancelRide = async () => {
    if (!activeRide) return;
    
    setIsCancelling(true);
    try {
      await rideService.updateStatus(activeRide.id, 'cancelled');
      setActiveRide(null);
      setShowCancelModal(false);
    } catch (error) {
      console.error("Failed to cancel ride", error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-10 font-sans overflow-x-hidden">
      <Header onMenuClick={() => setIsSidebarOpen(true)} theme="dark" />

      <div className="px-6 space-y-8 mt-4 container mx-auto">
        {/* Search Bar */}
        <div 
          onClick={() => navigate('/user/select')}
          className="relative group cursor-pointer w-full active:scale-[0.98] transition-transform"
        >
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20">
            <Search size={24} />
          </div>
          <div className="w-full bg-[#1A1A1A] rounded-full py-4 pl-16 pr-6 text-white/30 font-medium text-base">
            Where to?
          </div>
        </div>

        {/* Promo Banner */}
        <PromoBanner />

        {/* Global Booking Node */}
        <div className="grid grid-cols-1 gap-4">
           <motion.div 
             whileHover={{ scale: 1.01 }}
             whileTap={{ scale: 0.99 }}
             onClick={() => navigate('/user/select')}
             className="bg-white text-black rounded-[40px] p-10 flex flex-col justify-between h-56 cursor-pointer group shadow-[0_32px_64px_rgba(255,255,255,0.05)] relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 w-64 h-64 bg-black/5 -mr-20 -mt-20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="flex justify-between items-start relative z-10">
                 <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center">
                    <Search size={28} className="text-[#00E054]" />
                 </div>
                 <div className="bg-black/5 px-4 py-2 rounded-xl">
                    <span className="text-[10px] font-black uppercase tracking-widest">Active Fleet: 24/7</span>
                 </div>
              </div>
              <div className="relative z-10">
                 <h2 className="text-4xl font-black italic uppercase italic tracking-tighter leading-none mb-2">Initiate <br/> Transit</h2>
                 <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Global Interface • Book a Ride</p>
              </div>
           </motion.div>
        </div>

        {/* Bento Grid Features */}
        <div className="grid grid-cols-2 gap-4">
           <motion.div 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={() => navigate('/user/history')}
             className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex flex-col justify-between h-40 cursor-pointer group"
           >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                 <Clock size={24} />
              </div>
              <div>
                 <p className="text-xs font-black italic uppercase tracking-widest text-white/30">Past Triggers</p>
                 <p className="text-lg font-black italic uppercase tracking-tighter">History</p>
              </div>
           </motion.div>

           <motion.div 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={() => navigate('/user/wallet')}
             className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex flex-col justify-between h-40 cursor-pointer group"
           >
              <div className="w-12 h-12 rounded-2xl bg-[#FF8A00]/10 flex items-center justify-center text-[#FF8A00] group-hover:bg-[#FF8A00] group-hover:text-black transition-all">
                 <WalletIcon size={24} />
              </div>
              <div>
                 <p className="text-xs font-black italic uppercase tracking-widest text-white/30">Wallet Node</p>
                 <p className="text-lg font-black italic uppercase tracking-tighter">Settlement</p>
              </div>
           </motion.div>

           <motion.div 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={() => navigate('/user/select')}
             className="bg-gradient-to-br from-emerald-500/20 to-emerald-400/5 border border-emerald-500/10 rounded-[32px] p-6 flex flex-col justify-between h-40 cursor-pointer group"
           >
              <div className="w-12 h-12 rounded-2xl bg-[#00E054]/20 flex items-center justify-center text-[#00E054] group-hover:bg-[#00E054] group-hover:text-black transition-all">
                 <Car size={24} />
              </div>
              <div>
                 <p className="text-xs font-black italic uppercase tracking-widest text-[#00E054]/40">Daily Rentals</p>
                 <p className="text-lg font-black italic uppercase tracking-tighter text-white">Full/Half Day</p>
              </div>
           </motion.div>
        </div>

        {/* Network Monitor */}
        <div className="bg-gradient-to-br from-[#00E054]/5 to-blue-500/5 border border-white/5 rounded-[40px] p-8 space-y-6 relative overflow-hidden backdrop-blur-3xl">
           <div className="flex justify-between items-center">
             <span className="text-[10px] font-black italic uppercase tracking-[0.4em] text-white/20">Network Status</span>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00E054] animate-pulse shadow-[0_0_10px_#00E054]"></div>
                <span className="text-[10px] font-black italic uppercase tracking-widest text-[#00E054]">Active</span>
             </div>
           </div>
           
           <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-2xl font-black italic uppercase tracking-tighter"> Lucknow, IN</p>
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">Current Sector</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black italic uppercase tracking-tighter"> 2.4k+</p>
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">Active Pilots</p>
              </div>
           </div>
        </div>

        {/* Your Rides Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white px-2">Your rides</h2>
          
          <AnimatePresence mode="wait">
            {activeRide ? (
              <DashboardRideCard 
                ride={activeRide} 
                onCancelClick={() => setShowCancelModal(true)} 
              />
            ) : (
              <div className="text-center py-12 bg-white/5 rounded-[28px] border border-dashed border-white/10">
                <p className="text-white/40">No active rides at the moment</p>
                <Button 
                  onClick={() => navigate('/user/select')}
                  variant="ghost" 
                  className="mt-4 text-[#00E054]"
                >
                  Book a new ride
                </Button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <CancelRideModal 
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelRide}
        isCancelling={isCancelling}
      />

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <Footer />
    </div>
  );
}
