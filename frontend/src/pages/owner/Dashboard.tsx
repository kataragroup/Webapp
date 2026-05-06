import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, 
  Users, 
  Wallet, 
  BarChart3, 
  ShieldCheck, 
  PlusCircle,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Card } from '../../components/ui/Card';
import { Header } from '../../components/layout/Header';
import { StatCard } from '../../components/dashboard/StatCard';
import { FleetReportCard } from '../../components/dashboard/FleetReportCard';
import { FleetMonitor } from '../../components/dashboard/FleetMonitor';

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const stats = [
    { label: 'Total Vehicles', value: '12', icon: Car, color: 'text-blue-500', bg: 'bg-blue-50', trend: '+2' },
    { label: 'Active Drivers', value: '08', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: '+1' },
    { label: 'Today Earnings', value: '₹4,250', icon: Wallet, color: 'text-orange-500', bg: 'bg-orange-50', trend: '+₹800' },
    { label: 'Fleet Growth', value: '+12%', icon: BarChart3, color: 'text-purple-500', bg: 'bg-purple-50', trend: '+2%' }
  ];

  const vehicles = [
    { id: '1', plate: 'MH12 AB 1234', model: 'Maruti Suzuki Dzire', status: 'Active', driver: 'Rahul S.' },
    { id: '2', plate: 'MH12 CD 5678', model: 'Hyundai Xcent', status: 'Active', driver: 'Arjun K.' },
    { id: '3', plate: 'MH12 EF 9012', model: 'Toyota Etios', status: 'Maintenance', driver: '-' }
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Header 
        onMenuClick={() => setIsSidebarOpen(true)} 
        title="Operations" 
        subtitle="Command Hub" 
      />

      <main className="p-6 pt-24 pb-24 max-w-lg mx-auto lg:max-w-7xl">
        <FleetReportCard />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        {/* Action Quick Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card 
            onClick={() => navigate('/owner/vehicles')}
            className="bg-linear-to-br from-blue-600 via-blue-500 to-emerald-500 p-8 rounded-[40px] border-none shadow-2xl shadow-blue-500/20 group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-10">
              <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-md text-white group-hover:rotate-12 transition-transform">
                <PlusCircle size={32} />
              </div>
              <div className="p-2 bg-white/10 rounded-full">
                <ShieldCheck className="text-white/40" size={16} />
              </div>
            </div>
            <h3 className="text-2xl font-black text-white italic uppercase">Expand Fleet</h3>
            <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mt-2">Node Registration Protocol</p>
          </Card>

          <Card 
            onClick={() => navigate('/owner/kyc')}
            className="bg-zinc-900 p-8 rounded-[40px] border-none shadow-2xl shadow-zinc-900/20 group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute right-[-20px] top-[-20px] opacity-10 text-white">
              <BarChart3 size={140} />
            </div>
            <div className="flex justify-between items-start mb-10">
              <div className="p-4 bg-white/10 rounded-3xl text-emerald-400 group-hover:-rotate-12 transition-transform">
                <CreditCard size={32} />
              </div>
              <TrendingUp className="text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black text-white italic uppercase">Dues Matrix</h3>
            <div className="mt-2 text-4xl font-black text-emerald-400 italic">₹4,500</div>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-2">Settlement Required</p>
          </Card>
        </div>

        <FleetMonitor vehicles={vehicles} />
      </main>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
    </div>
  );
}
