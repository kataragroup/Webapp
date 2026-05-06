import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { Logo } from '../../components/Logo';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { rideService } from '../../services/rideService';
import { authService } from '../../services/authService';
import { Header } from '../../components/layout/Header';
import { EarningsCard } from '../../components/dashboard/EarningsCard';
import { 
  ShieldAlert, Car, Star, TrendingUp, 
  MapPin, Clock, PhoneCall, HelpCircle,
  ChevronRight, ArrowUpRight, Wallet,
  Activity, Zap, User
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { IncomingRequestModal } from '../../components/dashboard/IncomingRequestModal';
import { cn } from '../../lib/utils';

const LIBRARIES: any = ['places'];
const MAP_CENTER = { lat: 28.6139, lng: 77.2090 };
const MAP_OPTIONS = {
  disableDefaultUI: true,
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  ],
};

export default function DriverDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [incomingRide, setIncomingRide] = useState<any>(null);

  const user = authService.getCurrentUser();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: LIBRARIES
  });

  useEffect(() => {
    if (isOnline) {
      const interval = setInterval(async () => {
        const rides = await rideService.getHistory();
        const pending = rides.find(r => r.status === 'placed');
        if (pending && !incomingRide) {
          setIncomingRide(pending);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isOnline, incomingRide]);

  const handleAccept = async () => {
    if (!incomingRide || !user) return;
    await rideService.acceptRide(incomingRide.id, {
      driverId: user.id,
      driverDetails: {
        name: user.name,
        photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
        vehicleNumber: 'DL 2C B 5678',
        vehicleModel: 'Maruti Suzuki Dzire (White)',
        rating: 4.8
      }
    });
    setIncomingRide(null);
  };

  const performanceMetrics = [
    { label: 'Rating', value: '4.9', icon: <Star size={16} />, color: 'text-amber-500' },
    { label: 'Acceptance', value: '98%', icon: <TrendingUp size={16} />, color: 'text-blue-500' },
    { label: 'Cancellation', value: '2%', icon: <Zap size={16} />, color: 'text-red-500' },
  ];

  if (!user?.isVerified) {
    return (
      <div className="min-h-screen bg-[#0D1B1E] text-white p-6 flex flex-col items-center justify-center relative overflow-hidden font-sans">
        <Logo size="md" className="mb-12" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ffffff05_1px,_transparent_1px)] bg-[size:40px_40px] opacity-40" />
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-md bg-white/5 border border-white/10 rounded-[48px] p-10 text-center space-y-10 shadow-2xl relative z-10 backdrop-blur-3xl"
        >
          <div className="w-24 h-24 bg-orange-500/10 rounded-[32px] flex items-center justify-center text-orange-500 mx-auto shadow-2xl border border-orange-500/20">
             <ShieldAlert size={40} />
          </div>
          
          <div className="space-y-4">
             <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white/90 leading-none">Awaiting Clearance</h2>
             <p className="text-[9px] font-black text-white/20 leading-relaxed px-8 uppercase tracking-[0.3em] font-mono italic">
               Your pilot authentication is pending verification. Complete the node protocol to begin operations.
             </p>
          </div>

          <div className="space-y-4">
            <button 
               onClick={() => navigate('/driver/kyc')}
               className="w-full h-16 rounded-2xl bg-orange-500 text-black font-black uppercase tracking-[0.2em] italic text-xs active:scale-95 transition-all shadow-xl shadow-orange-500/20"
            >
               Begin Synchronization
            </button>
            <button 
              onClick={() => { authService.logout(); navigate('/login'); }}
              className="text-[9px] font-black text-white/15 hover:text-white uppercase tracking-[0.3em] transition-colors font-mono"
            >
              Terminate Session
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1B1E] text-white pb-20 lg:pb-0 relative font-sans overflow-x-hidden">
      {/* Background Map Overlay */}
      {isOnline && isLoaded && (
        <div className="absolute inset-0 z-0 opacity-40">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={MAP_CENTER}
            zoom={13}
            options={{
              ...MAP_OPTIONS,
              styles: [
                { elementType: 'geometry', stylers: [{ color: '#0D1B1E' }] },
                { elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
                { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e2a2c' }] },
                { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#091517' }] },
              ]
            }}
          >
             <Marker position={MAP_CENTER} />
          </GoogleMap>
          <div className="absolute inset-0 bg-linear-to-b from-[#0D1B1E] via-[#0D1B1E]/60 to-[#0D1B1E] pointer-events-none"></div>
        </div>
      )}

      <Header onMenuClick={() => setIsSidebarOpen(true)} theme="dark" />

      <main className="container mx-auto px-6 pt-24 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Column: Profile & Duty Control */}
        <div className="lg:col-span-4 space-y-8">
          {/* Driver Profile Summary */}
          <Card className="bg-white/5 border-white/10 rounded-[40px] p-8 backdrop-blur-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <User size={80} />
             </div>
             
             <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-orange-500 border-4 border-white/10 shadow-2xl flex items-center justify-center relative overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} className="w-full h-full object-cover" alt="Profile" />
                </div>
                <div>
                   <h2 className="text-xl font-black italic uppercase tracking-tight text-white/90 leading-none mb-1">{user?.name}</h2>
                   <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] font-mono italic">Verified Pilot Node</p>
                </div>
             </div>

             <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
                {performanceMetrics.map((m, i) => (
                   <div key={i} className="text-center">
                      <div className={cn("mx-auto mb-2 flex items-center justify-center", m.color)}>
                         {m.icon}
                      </div>
                      <p className="text-lg font-black italic leading-none text-white">{m.value}</p>
                      <p className="text-[8px] font-black uppercase text-white/20 tracking-widest mt-1">{m.label}</p>
                   </div>
                ))}
             </div>
          </Card>

          {/* Duty Control Terminal */}
          <Card className={cn(
             "rounded-[40px] p-10 border transition-all duration-700 relative overflow-hidden",
             isOnline ? "bg-emerald-500/10 border-emerald-500/20 shadow-2xl shadow-emerald-500/5" : "bg-white/5 border-white/10"
          )}>
             <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                   <h3 className="font-black italic uppercase tracking-tight text-lg text-white">Duty Terminal</h3>
                   <p className="text-[9px] font-black uppercase tracking-widest text-white/30 italic">Lattice Status Control</p>
                </div>
                <div className={cn(
                   "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                   isOnline ? "bg-emerald-500 text-[#0D1B1E] animate-pulse shadow-lg shadow-emerald-500/20" : "bg-white/5 text-white/20"
                )}>
                   <Activity size={24} />
                </div>
             </div>

             <div className="space-y-6">
                <div className="text-center py-4">
                   <p className={cn(
                      "text-4xl font-black italic uppercase leading-none mb-2 transition-colors",
                      isOnline ? "text-emerald-500" : "text-white/20"
                   )}>
                      {isOnline ? 'Online' : 'Offline'}
                   </p>
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] font-mono">
                      {isOnline ? 'Scanning Neural Lattice...' : 'Inactive. Awaiting Authorization.'}
                   </p>
                </div>

                <button 
                  onClick={() => setIsOnline(!isOnline)}
                  className={cn(
                    "w-full h-18 rounded-2xl font-black uppercase tracking-[0.2em] italic text-xs transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-4 border",
                    isOnline 
                      ? "bg-white/5 text-white/50 border-white/10 hover:bg-white/10" 
                      : "bg-emerald-500 text-[#0D1B1E] border-emerald-500/50 shadow-emerald-500/20"
                  )}
                >
                  {isOnline ? 'Shift to Standby' : 'Go Live Now'}
                </button>
             </div>
          </Card>
        </div>

        {/* Right Column: Earnings & Activity */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <EarningsCard amount="₹ 45,240.50" onClick={() => navigate('/driver/wallet')} theme="dark" />
             
             <Card className="bg-white/5 border-white/10 rounded-[40px] p-8 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-xl font-black italic uppercase text-white/90">Quick Links</h3>
                   <Zap size={20} className="text-white/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <button 
                    onClick={() => navigate('/driver/support')}
                    className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
                   >
                      <HelpCircle className="text-blue-500 group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] font-black uppercase text-white/50 tracking-widest">Support</span>
                   </button>
                   <button 
                    onClick={() => navigate('/driver/ratings')}
                    className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
                   >
                      <Star className="text-amber-500 group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] font-black uppercase text-white/50 tracking-widest">Reviews</span>
                   </button>
                </div>
             </Card>
          </div>

          {/* Recent Trips Lattice */}
          <Card className="bg-white/5 border-white/10 rounded-[40px] p-10">
             <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                   <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white/90">Trip Lattice</h3>
                   <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] font-mono italic">Historical Node Performance</p>
                </div>
                <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline flex items-center gap-2">
                   Export Data <ArrowUpRight size={12} />
                </button>
             </div>

             <div className="space-y-4">
                {[
                  { time: '14:20', addr: 'DLF Cyber City, Phase 2', earning: '₹ 450.00', status: 'completed' },
                  { time: '12:05', addr: 'IGI Airport, Terminal 3', earning: '₹ 890.50', status: 'completed' },
                  { time: '10:15', addr: 'Ambience Mall, Vasant Kunj', earning: '₹ 0.00', status: 'rejected' },
                ].map((trip, i) => (
                   <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                      <div className="flex items-center gap-6">
                         <div className="w-12 h-12 rounded-2xl bg-[#0D1B1E] border border-white/5 flex flex-col items-center justify-center font-mono text-[8px] font-black text-white/40">
                            <span>{trip.time.split(':')[0]}</span>
                            <span className="text-white/20">{trip.time.split(':')[1]}</span>
                         </div>
                         <div>
                            <p className="text-xs font-black italic uppercase text-white group-hover:text-amber-500 transition-colors tracking-tight mb-0.5">{trip.addr}</p>
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest font-mono">ID: NODE-X-0{i+1}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-black italic text-white mb-0.5">{trip.earning}</p>
                         <p className={cn(
                            "text-[8px] font-black uppercase tracking-widest italic",
                            trip.status === 'completed' ? 'text-emerald-500' : 'text-red-500'
                         )}>{trip.status}</p>
                      </div>
                   </div>
                ))}
             </div>
          </Card>
        </div>
      </main>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <AnimatePresence>
        {incomingRide && (
          <IncomingRequestModal 
            ride={incomingRide}
            onAccept={handleAccept}
            onDecline={() => setIncomingRide(null)}
          />
        )}
      </AnimatePresence>

      {/* Persistent Bottom Bar for Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#0D1B1E] border-t border-white/10 z-50 flex items-center justify-around px-4">
         <button onClick={() => navigate('/driver')} className="flex flex-col items-center gap-1 text-emerald-500">
            <Activity size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">Lattice</span>
         </button>
         <button onClick={() => navigate('/driver/wallet')} className="flex flex-col items-center gap-1 text-white/30">
            <Wallet size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">Fiscal</span>
         </button>
         <button onClick={() => setIsSidebarOpen(true)} className="flex flex-col items-center gap-1 text-white/30">
            <Zap size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">Nodes</span>
         </button>
      </div>
    </div>
  );
}
