import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Clock, 
  MapPin, 
  Calendar, 
  ChevronRight,
  TrendingUp,
  Search,
  Filter
} from 'lucide-react';
import { motion } from 'motion/react';
import { authService } from '../../services/authService';
import { rideService } from '../../services/rideService';
import { Ride } from '../../types';
import { Header } from '../../components/layout/Header';

export default function RideHistoryPage() {
  const navigate = useNavigate();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await rideService.getHistory();
        setRides(data);
      } catch (err) {
        console.error('Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredRides = rides.filter(ride => 
    ride.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ride.drop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0D1B1E] text-white pb-32 font-sans overflow-x-hidden">
      <Header onMenuClick={() => {}} showBack={true} theme="dark" title="Transit Logs" />

      <div className="px-6 space-y-10 pt-24 mt-8 container mx-auto lg:max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="space-y-2">
              <h1 className="text-4xl font-black italic uppercase italic tracking-tighter leading-none">Transit History</h1>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] leading-none">Chronological Migration Logs</p>
           </div>
           
           <div className="relative w-full md:w-72">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
              <input 
                type="text" 
                placeholder="Search Logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-[10px] font-black uppercase tracking-widest focus:border-blue-500/50 outline-none transition-all placeholder:text-white/10 italic"
              />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {[
             { label: 'Total Rides', value: rides.length, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/5' },
             { label: 'Network Miles', value: (rides.length * 4.2).toFixed(1), icon: MapPin, color: 'text-[#00E054]', bg: 'bg-[#00E054]/5' },
             { label: 'Avg Frequency', value: '2.4 p/w', icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-500/5' },
           ].map((stat, i) => (
             <div key={i} className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                   <stat.icon size={24} />
                </div>
                <div>
                   <p className="text-xl font-black italic uppercase leading-none">{stat.value}</p>
                   <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
             </div>
           ))}
        </div>

        <div className="space-y-4">
           <div className="flex justify-between items-center px-4">
              <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] font-mono leading-none">Sequence Activity</h3>
              <button className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                <Filter size={16} className="text-white/20" />
              </button>
           </div>

           {loading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-[#00E054]/20 border-t-[#00E054] rounded-full animate-spin" />
                <p className="text-[10px] font-black text-[#00E054] uppercase tracking-widest animate-pulse">Syncing Logs...</p>
             </div>
           ) : filteredRides.length > 0 ? (
             <div className="space-y-4">
               {filteredRides.map((ride, i) => (
                 <motion.button
                   key={ride.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.05 }}
                   onClick={() => navigate(`/user/ride/${ride.id}`)}
                   className="w-full bg-white/5 border border-white/10 rounded-[40px] p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:bg-white/10 hover:border-white/20 transition-all text-left relative overflow-hidden active:scale-[0.98]"
                 >
                    {/* Status Glow */}
                    <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] -mr-16 -mt-16 opacity-30 pointer-events-none transition-all group-hover:opacity-60 ${
                      ride.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`} />

                    <div className="flex items-center gap-6 relative z-10">
                       <div className={`w-16 h-16 rounded-[24px] ${ride.status === 'completed' ? 'bg-emerald-500 text-black' : 'bg-blue-500 text-white'} flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110`}>
                          <Clock size={28} />
                       </div>
                       <div className="space-y-1">
                          <p className="text-lg font-black italic uppercase tracking-tight text-white/90 leading-none">Transit Sequence</p>
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] font-mono leading-none underline decoration-[#00E054]/30 underline-offset-4">{ride.type}</p>
                       </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                       <div className="space-y-4">
                          <div className="flex gap-4">
                             <div className="flex flex-col items-center gap-1">
                                <div className="w-2.5 h-2.5 rounded-full border-2 border-emerald-500" />
                                <div className="w-0.5 h-6 bg-white/5" />
                                <MapPin size={12} className="text-orange-500" />
                             </div>
                             <div className="space-y-4">
                                <div className="space-y-1">
                                   <p className="text-[8px] font-black text-white/20 uppercase tracking-widest font-mono italic">Origin Node</p>
                                   <p className="text-[11px] font-black text-white/80 uppercase truncate max-w-[200px]">{ride.pickup}</p>
                                </div>
                                <div className="space-y-1">
                                   <p className="text-[8px] font-black text-white/20 uppercase tracking-widest font-mono italic">Target Node</p>
                                   <p className="text-[11px] font-black text-white/80 uppercase truncate max-w-[200px]">{ride.drop}</p>
                                </div>
                             </div>
                          </div>
                       </div>
                       <div className="flex flex-col md:items-end justify-between gap-4">
                          <div className="text-right">
                             <p className="text-2xl font-black italic uppercase tracking-tighter text-white">₹{ride.fare}</p>
                             <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">Valuation Unit</p>
                          </div>
                          <div className="flex items-center gap-3">
                             <span className={`text-[8px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border ${
                               ride.status === 'completed' 
                                 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                                 : 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                             }`}>
                               {ride.status}
                             </span>
                             <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/30 group-hover:text-[#00E054] transition-all group-hover:translate-x-1">
                                <ChevronRight size={20} />
                             </div>
                          </div>
                       </div>
                    </div>
                 </motion.button>
               ))}
             </div>
           ) : (
             <div className="bg-white/5 border border-white/10 rounded-[48px] p-20 flex flex-col items-center justify-center text-center gap-6">
                <div className="w-20 h-20 bg-white/5 rounded-[40px] flex items-center justify-center text-white/10">
                   <Clock size={40} />
                </div>
                <div className="space-y-2">
                   <h3 className="text-2xl font-black italic uppercase text-white/30">Void History</h3>
                   <p className="text-[10px] font-black text-white/10 uppercase tracking-widest max-w-[250px] mx-auto leading-relaxed">No transit sequences detected in this sector of the network.</p>
                </div>
                <button 
                  onClick={() => navigate('/user/select')}
                  className="px-10 h-14 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#00E054] hover:text-black transition-all"
                >
                  Initiate First Transit
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
