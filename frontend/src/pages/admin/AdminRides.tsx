import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { motion } from 'motion/react';
import { 
  Navigation, 
  Clock, 
  MapPin, 
  MoreHorizontal, 
  Search, 
  Filter,
  CheckCircle2,
  Clock3,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';

interface RideLog {
  id: string;
  passenger: string;
  driver: string;
  pickup: string;
  drop: string;
  status: 'Active' | 'Completed' | 'Cancelled' | 'Pending';
  fare: string;
  time: string;
}

const mockRides: RideLog[] = [
  { id: 'RD-001', passenger: 'Prathama Verma', driver: 'Rahul Sharma', pickup: 'Terminal 3, IGI Airport', drop: 'Hauz Khas Village', status: 'Active', fare: '₹450', time: '12 mins elapsed' },
  { id: 'RD-002', passenger: 'Ankita Singh', driver: 'Amit Patel', pickup: 'Cyber Hub, Gurugram', drop: 'Saket District Centre', status: 'Completed', fare: '₹320', time: '14:20, 02 May' },
  { id: 'RD-003', passenger: 'Rohan Mehta', driver: 'Sandeep Yadav', pickup: 'Noida Sector 62', drop: 'Connaught Place', status: 'Cancelled', fare: '₹0', time: '11:45, 02 May' },
  { id: 'RD-004', passenger: 'Isha Gupta', driver: 'Vikram Das', pickup: 'South Ex Part 1', drop: 'Greater Kailash 2', status: 'Pending', fare: '₹180', time: 'Searching...' },
];

export default function AdminRides() {
  const [rides] = useState(mockRides);

  return (
    <AdminLayout title="Rides">
      <div className="space-y-6 lg:space-y-10">
        <header className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
          <div>
            <h2 className="text-3xl lg:text-4xl font-black italic uppercase tracking-tighter text-[#0A1128] leading-none">Transit Logs</h2>
            <p className="text-[9px] lg:text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] lg:tracking-[0.3em] mt-2 lg:mt-3 italic">Live Global Transport Stream Analytics</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
             <div className="relative flex-1 sm:w-64">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  placeholder="Scan Ride ID..." 
                  className="w-full bg-white border border-gray-100 rounded-xl lg:rounded-2xl py-3 pl-12 pr-6 text-xs font-black uppercase italic tracking-widest outline-none focus:border-blue-400 shadow-xl shadow-gray-200/20 transition-all"
                />
             </div>
             <button className="flex items-center justify-center p-3 lg:p-4 bg-white border border-gray-100 rounded-xl lg:rounded-2xl text-gray-400 hover:text-black transition-all shadow-xl shadow-gray-200/20 shrink-0">
                <Filter size={20} />
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rides.map((ride, i) => (
            <motion.div
              key={ride.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-white border-gray-100 p-8 rounded-[40px] shadow-xl shadow-gray-200/20 group hover:border-blue-200 transition-all flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="flex items-center gap-6 shrink-0">
                    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl transition-transform group-hover:rotate-6 ${
                      ride.status === 'Active' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400'
                    }`}>
                       <Navigation size={32} />
                    </div>
                    <div className="space-y-1">
                       <h3 className="text-xl font-black italic uppercase italic leading-none">{ride.id}</h3>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-mono">{ride.time}</p>
                    </div>
                 </div>

                 <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <div className="space-y-4">
                       <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center">
                             <MapPin size={16} />
                          </div>
                          <div>
                             <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Origin</p>
                             <p className="text-xs font-black italic uppercase mt-0.5 max-w-[180px] truncate">{ride.pickup}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 border border-orange-100 flex items-center justify-center">
                             <MapPin size={16} />
                          </div>
                          <div>
                             <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Target</p>
                             <p className="text-xs font-black italic uppercase mt-0.5 max-w-[180px] truncate">{ride.drop}</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center justify-center md:justify-end gap-8">
                       <div className="text-center md:text-right">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Human Nodes</p>
                          <div className="flex items-center gap-2 text-xs font-black italic uppercase whitespace-nowrap">
                             <span className="text-gray-900">{ride.passenger.split(' ')[0]}</span>
                             <span className="text-gray-300">↔</span>
                             <span className="text-blue-600">{ride.driver.split(' ')[0]}</span>
                          </div>
                       </div>
                       <div className="text-center md:text-right min-w-[80px]">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Fare</p>
                          <span className="text-lg font-black italic uppercase text-gray-900">{ride.fare}</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-6 shrink-0 w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 border-gray-50">
                    <div className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border flex-1 md:flex-none justify-center ${
                      ride.status === 'Active' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                      ride.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      ride.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-50 text-gray-400 border-gray-200'
                    }`}>
                       {ride.status === 'Active' && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />}
                       {ride.status}
                    </div>
                    <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl text-gray-400 transition-all">
                       <MoreHorizontal size={20} />
                    </button>
                 </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
