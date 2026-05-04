import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { 
  Users, Car, TrendingUp, ShieldCheck, Activity, 
  LayoutDashboard, Inbox, CreditCard, Star, 
  RefreshCcw, Database, CheckCircle2, AlertCircle, 
  Settings, Headphones, Map as MapIcon, BarChart3, 
  Shield, Bell, Zap, ChevronRight 
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, LineChart, CartesianGrid, 
  XAxis, YAxis, Tooltip, Line, AreaChart, 
  Area, PieChart, Pie, Cell 
} from 'recharts';
import { Card } from '../../components/ui/Card';
import { cn } from '../../lib/utils';
import MapComponent from '../../components/admin/MapComponent';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../../services/firebase';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ users: 0, drivers: 0, activeRides: 230, revenue: '₹ 1,25,430', rating: 4.8 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const usersSnap = await getCountFromServer(collection(db, 'users'));
        const driversSnap = await getCountFromServer(collection(db, 'drivers'));
        
        setCounts(prev => ({
          ...prev,
          users: usersSnap.data().count,
          drivers: driversSnap.data().count,
        }));
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };

    fetchCounts();
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6 lg:space-y-8 pb-20 lg:pb-10">
        
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
          <SummaryCard 
            label="Total Drivers" 
            value={counts.drivers || 1268} 
            trend="+12 today" 
            icon={<Car size={24} />} 
            color="blue"
          />
          <SummaryCard 
            label="Total Users" 
            value={counts.users || 5683} 
            trend="+45 today" 
            icon={<Users size={24} />} 
            color="green"
          />
          <SummaryCard 
            label="Active Rides" 
            value={counts.activeRides} 
            trend="Live Now" 
            icon={<Inbox size={24} />} 
            color="indigo"
          />
          <SummaryCard 
            label="Today's Revenue" 
            value={counts.revenue} 
            trend="+8.5%" 
            icon={<CreditCard size={24} />} 
            color="orange"
          />
          <SummaryCard 
            label="Avg. Rating" 
            value={counts.rating} 
            trend="★★★★★" 
            icon={<Star size={24} />} 
            color="teal"
          />
        </div>

        {/* Main Section: Map and Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Left: Map and Recent Activity */}
          <div className="xl:col-span-3 space-y-6 lg:space-y-8">
            <Card className="p-0 overflow-hidden border-zinc-200/60 shadow-sm transition-all duration-500 hover:shadow-2xl">
              <div className="p-4 lg:p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between bg-white gap-2">
                 <h3 className="font-black italic uppercase tracking-tighter text-lg">Global Fleet Telemetry</h3>
                 <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20"></span>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Real-time GPS Sync Active</span>
                 </div>
              </div>
              <div className="h-[300px] lg:h-[500px] bg-zinc-100 relative group overflow-hidden">
                 <MapComponent />
                 
                 {/* Floating Info Box - Desktop Only */}
                 <div className="hidden lg:block absolute top-8 right-8 bg-white/95 backdrop-blur-md p-5 rounded-3xl shadow-2xl border border-zinc-100 w-72">
                    <div className="flex justify-between items-start mb-4">
                       <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest ring-1 ring-blue-100">Live Monitor</span>
                       <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter italic">#NODE-88</span>
                    </div>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center"><span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Zone Capacity</span> <span className="text-xs font-black italic">High (88%)</span></div>
                       <div className="flex justify-between items-center"><span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Peak Load</span> <span className="text-xs font-black italic text-zinc-600">Expected 18:00</span></div>
                       <div className="flex justify-between items-center pt-2 border-t border-zinc-100"><span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Network</span> <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black uppercase italic tracking-widest">Stable</span></div>
                    </div>
                 </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <Card className="p-6 lg:p-8 border-zinc-200/60 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                   <div>
                      <h3 className="font-black italic uppercase tracking-tighter text-xl">Ride Dynamics</h3>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Operational Velocity Monitor</p>
                   </div>
                   <div className="flex items-center gap-3 text-[8px] lg:text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Comp</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Live</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Void</div>
                   </div>
                </div>
                <div className="h-64 sm:h-72">
                   <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={rideData}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                         <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 9, fill: '#A1A1AA', fontWeight: '800'}} 
                            dy={10} 
                         />
                         <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 9, fill: '#A1A1AA', fontWeight: '800'}} 
                         />
                         <Tooltip 
                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)', background: '#fff' }}
                         />
                         <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={4} dot={{ r: 0 }} />
                         <Line type="monotone" dataKey="ongoing" stroke="#3b82f6" strokeWidth={4} dot={{ r: 0 }} />
                         <Line type="monotone" dataKey="cancelled" stroke="#ef4444" strokeWidth={4} dot={{ r: 0 }} />
                      </LineChart>
                   </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6 lg:p-8 border-zinc-200/60 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                   <div>
                      <h3 className="font-black italic uppercase tracking-tighter text-xl">Revenue Stream</h3>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Financial Liquid Data</p>
                   </div>
                   <select className="bg-zinc-100 border-none rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-widest outline-none cursor-pointer">
                      <option>This Week</option>
                      <option>Last Month</option>
                   </select>
                </div>
                <div className="h-64 sm:h-72">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                         <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                               <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#A1A1AA', fontWeight: '800'}} dy={10} />
                         <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#A1A1AA', fontWeight: '800'}} />
                         <Tooltip />
                         <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <Card className="p-0 border-zinc-200/60 shadow-sm overflow-hidden mb-20 lg:mb-0">
               <div className="p-6 lg:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white gap-4">
                  <div>
                     <h3 className="font-black italic uppercase tracking-tighter text-xl leading-none">Journal Logs</h3>
                     <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-2">Active Transaction Flow</p>
                  </div>
                  <button className="w-full sm:w-auto text-[10px] font-black text-white px-6 py-2.5 bg-[#0A1128] rounded-xl lg:rounded-2xl uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95 italic">Export All</button>
               </div>
               <div className="overflow-x-auto overflow-y-hidden">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                     <thead>
                        <tr className="bg-zinc-50 border-y border-zinc-100">
                           <th className="px-6 lg:px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">ID</th>
                           <th className="px-6 lg:px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Driver / User</th>
                           <th className="px-6 lg:px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Protocol State</th>
                           <th className="px-6 lg:px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Quota</th>
                           <th className="px-6 lg:px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Timestamp</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-zinc-100">
                        {recentRides.map((ride) => (
                           <tr key={ride.id} className="group hover:bg-blue-50/20 transition-colors">
                              <td className="px-6 lg:px-8 py-6 text-[11px] font-black italic">#{ride.id}</td>
                              <td className="px-6 lg:px-8 py-6">
                                 <div>
                                    <p className="text-[11px] font-black uppercase mb-0.5">{ride.driver}</p>
                                    <p className="text-[9px] text-zinc-400 font-bold uppercase italic">{ride.user}</p>
                                 </div>
                              </td>
                              <td className="px-6 lg:px-8 py-6">
                                 <div className="flex items-center gap-2">
                                    <span className={cn(
                                       "w-1.5 h-1.5 rounded-full shrink-0",
                                       ride.status === 'Completed' ? "bg-emerald-500" :
                                       ride.status === 'In Progress' ? "bg-blue-500" : "bg-red-500"
                                    )}></span>
                                    <span className={cn(
                                       "text-[10px] font-black uppercase tracking-widest italic",
                                       ride.status === 'Completed' ? "text-emerald-600" :
                                       ride.status === 'In Progress' ? "text-blue-600" : "text-red-600"
                                    )}>
                                       {ride.status}
                                    </span>
                                 </div>
                              </td>
                              <td className="px-6 lg:px-8 py-6 text-xs font-black tabular-nums">₹{ride.amount}</td>
                              <td className="px-6 lg:px-8 py-6 text-[10px] font-bold text-zinc-400 text-right italic uppercase">{ride.time}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </Card>
          </div>

          {/* Right: Key Modules & Driver Stats */}
          <div className="space-y-6 lg:space-y-8">
            <Card className="p-6 lg:p-8 border-none bg-gradient-to-br from-[#0A1128] to-[#1a2b5d] text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
               <h3 className="font-black italic uppercase tracking-widest text-blue-400 text-[10px] mb-8 flex items-center gap-3">
                  <Database size={14} /> Database Integrity
               </h3>
               <div className="space-y-3">
                  {dbCollections.map((col, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group cursor-pointer">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-black italic text-xs">
                             {col.name.charAt(0)}
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-tight">{col.name}</span>
                       </div>
                       <span className="text-[11px] font-black tracking-tighter opacity-80">{col.count.toLocaleString()}</span>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-8 p-3 rounded-xl border border-white/10 text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:bg-white hover:text-[#0A1128] transition-all italic">Run Global Audit</button>
            </Card>

            <Card className="p-6 lg:p-8 border-zinc-200/60 shadow-sm transition-all hover:shadow-xl">
               <div className="flex items-center gap-3 mb-10">
                  <Star fill="#f59e0b" size={18} className="text-amber-500" />
                  <h3 className="font-black italic uppercase tracking-tighter text-lg">Vanguard Fleet</h3>
               </div>
               <div className="space-y-6">
                  {topDrivers.map((driver, i) => (
                    <div key={i} className="flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-xl bg-zinc-100 flex items-center justify-center font-black overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500 transition-all shadow-inner">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${driver.name}`} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div>
                             <p className="text-[11px] font-black uppercase tracking-tight leading-none mb-1.5">{driver.name}</p>
                             <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 rounded-full w-fit">
                                <Star fill="#f59e0b" size={10} className="text-amber-500" />
                                <span className="text-[10px] font-black text-amber-700">{driver.rating}</span>
                             </div>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-black italic tabular-nums">₹{driver.earnings}</p>
                          <p className="text-[8px] font-black uppercase text-zinc-400 tracking-tighter">Gross</p>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-10 p-4 bg-zinc-100/50 hover:bg-zinc-900 hover:text-white text-zinc-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic">Full Fleet Logs</button>
            </Card>

            <Card className="p-6 lg:p-8 border-zinc-200/60 shadow-sm transition-all hover:shadow-xl bg-white mb-20 lg:mb-0">
               <h3 className="font-black italic uppercase tracking-tighter text-lg mb-8 flex items-center gap-2">
                  <Activity className="text-blue-600" /> Signal Broadcast
               </h3>
               <div className="p-6 bg-[#0A1128] text-white rounded-[2rem] space-y-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                     <GridPattern />
                  </div>
                  <div className="space-y-5 relative">
                     <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase text-white/50 tracking-widest">Protocol</span> <span className="text-[10px] font-black bg-blue-500 px-2 py-0.5 rounded-full uppercase italic">V4-Global</span></div>
                     <div className="flex justify-between items-center"><span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Status</span> <span className="text-[10px] font-black text-emerald-400 uppercase italic">Active Grid</span></div>
                     <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase text-white/50 tracking-widest">Latency</span> <span className="text-[10px] font-black text-white italic tabular-nums">~14ms</span></div>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                     <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-blue-500 animate-pulse"></div>
                     </div>
                     <p className="text-[8px] font-bold text-center mt-3 uppercase tracking-widest opacity-40">Operational asia-east1</p>
                  </div>
               </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer / Actions Bar moved to AdminLayout or fixed here */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 h-20 bg-white/95 backdrop-blur-2xl border-t border-zinc-100 z-40 px-4 lg:px-12 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)] overflow-x-auto no-scrollbar">
         <div className="flex items-center gap-4 shrink-0">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-[#0A1128] flex items-center justify-center text-white shadow-xl">
               <ShieldCheck size={20} />
            </div>
            <div className="hidden sm:block">
               <span className="text-[10px] font-black text-[#0A1128] italic uppercase tracking-widest block leading-none">Admin Core</span>
               <span className="text-[9px] text-emerald-500 font-bold uppercase mt-1 block tracking-tighter italic">Live Sync Active</span>
            </div>
         </div>
         
         <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mx-4">
            <FooterAction icon={<CheckCircle2 size={14} />} label="Approve" color="emerald" />
            <FooterAction icon={<AlertCircle size={14} />} label="Suspend" color="red" />
            <FooterAction icon={<Settings size={14} />} label="Refresh Node" color="blue" />
            <FooterAction icon={<Database size={14} />} label="Clear Buffer" color="indigo" />
         </div>

         <div className="flex items-center gap-3 shrink-0">
            <button className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-[#0A1128] hover:text-white transition-all shadow-inner">
               <Headphones size={18} />
            </button>
            <button className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-[#0A1128] hover:text-white transition-all shadow-inner">
               <Settings size={18} />
            </button>
         </div>
      </div>
    </AdminLayout>
  );
}

function SummaryCard({ label, value, trend, icon, color }: any) {
  const colorMap: any = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100 shadow-blue-500/10',
    green: 'text-emerald-600 bg-emerald-50 border-emerald-100 shadow-emerald-500/10',
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100 shadow-indigo-500/10',
    orange: 'text-orange-600 bg-orange-50 border-orange-100 shadow-orange-500/10',
    teal: 'text-teal-600 bg-teal-50 border-teal-100 shadow-teal-500/10'
  };

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Card className="p-6 lg:p-8 border-zinc-200/60 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden bg-white h-full">
         <div className={cn("absolute -top-10 -right-10 w-32 h-32 opacity-5 blur-3xl transition-opacity group-hover:opacity-10", colorMap[color].split(' ')[1])}></div>
         <div className="flex items-start justify-between relative z-10">
            <div className={cn("p-4 rounded-2xl shadow-lg border-2 border-white ring-1 ring-zinc-50 group-hover:scale-110 transition-transform duration-500 bg-white", colorMap[color].split(' ')[0])}>
               {icon}
            </div>
            <p className={cn("text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm", colorMap[color])}>{trend}</p>
         </div>
         <div className="mt-8 relative z-10">
            <p className="text-2xl lg:text-3xl font-black italic tracking-tighter text-[#0A1128] tabular-nums mb-1">{value}</p>
            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em]">{label}</p>
         </div>
      </Card>
    </motion.div>
  );
}

function FooterAction({ icon, label, color }: any) {
  const colors: any = {
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-600 hover:text-white',
    red: 'text-red-600 bg-red-50 border-red-100 hover:bg-red-600 hover:text-white',
    blue: 'text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-600 hover:text-white',
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100 hover:bg-indigo-600 hover:text-white'
  };
  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl border font-black text-[9px] uppercase tracking-widest transition-all italic whitespace-nowrap active:scale-95", colors[color])}>
       {icon}
       {label}
    </motion.button>
  );
}

function GridPattern() {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
       <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
             <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
          </pattern>
       </defs>
       <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

const recentRides = [
  { id: 'RD1256', driver: 'Rahul Verma', user: 'Amit Kumar', status: 'In Progress', amount: 210, time: '10:30 AM' },
  { id: 'RD1255', driver: 'Amit Singh', user: 'Pooja Singh', status: 'Completed', amount: 185, time: '10:20 AM' },
  { id: 'RD1254', driver: 'Vikash Yadav', user: 'Neha Kumari', status: 'Completed', amount: 240, time: '10:15 AM' },
  { id: 'RD1253', driver: 'Neeraj Kumar', user: 'Rohit Sharma', status: 'Cancelled', amount: 0, time: '10:05 AM' },
];

const topDrivers = [
  { name: 'Rahul Verma', rating: 4.9, earnings: '2,450' },
  { name: 'Amit Singh', rating: 4.8, earnings: '1,870' },
  { name: 'Vikash Yadav', rating: 4.7, earnings: '1,620' },
];

const rideData = [
  { name: '08:00', completed: 12, ongoing: 5, cancelled: 1 },
  { name: '10:00', completed: 25, ongoing: 12, cancelled: 2 },
  { name: '12:00', completed: 35, ongoing: 18, cancelled: 4 },
  { name: '14:00', completed: 48, ongoing: 25, cancelled: 3 },
  { name: '16:00', completed: 52, ongoing: 30, cancelled: 5 },
  { name: '18:00', completed: 65, ongoing: 42, cancelled: 6 },
  { name: '20:00', completed: 80, ongoing: 15, cancelled: 2 },
];

const revenueData = [
  { name: 'Mon', amount: 45000 },
  { name: 'Tue', amount: 52000 },
  { name: 'Wed', amount: 48000 },
  { name: 'Thu', amount: 61000 },
  { name: 'Fri', amount: 55000 },
  { name: 'Sat', amount: 72000 },
  { name: 'Sun', amount: 85000 },
];

const dbCollections = [
  { name: 'Users', count: 5683 },
  { name: 'Drivers', count: 1268 },
  { name: 'Rides', count: 24503 },
  { name: 'Payments', count: 18920 },
];
