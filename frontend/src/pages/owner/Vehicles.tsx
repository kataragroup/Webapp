import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Plus, 
  Car, 
  Search,
  MoreVertical,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

export default function OwnerVehicles() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const vehicles = [
    { id: '1', plate: 'MH12 AB 1234', model: 'Maruti Suzuki Dzire', type: 'Sedan', status: 'Active', driver: 'Rahul S.' },
    { id: '2', plate: 'MH12 CD 5678', model: 'Hyundai Xcent', type: 'Mini', status: 'Active', driver: 'Arjun K.' },
    { id: '3', plate: 'MH12 EF 9012', model: 'Toyota Etios', type: 'Sedan', status: 'Inactive', driver: '-' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 pb-32">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/owner')}
            className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter uppercase">Fleet Registry</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Manage your assets</p>
          </div>
        </div>
        <button className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
          <Plus size={24} />
        </button>
      </header>

      <div className="mb-6">
        <Input 
          icon={<Search size={20} />}
          placeholder="Search plate or model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/5 border-white/5 rounded-3xl h-14"
        />
      </div>

      <div className="space-y-4">
        {vehicles.map((v) => (
          <Card key={v.id} className="p-6 bg-[#141414] border-white/5 rounded-[32px] group relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center">
                  <Car className="text-zinc-500 group-hover:text-blue-500 transition-colors" size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-black italic">{v.plate}</h3>
                  <p className="text-sm text-zinc-500 font-medium">{v.model}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded-full border border-white/10 text-zinc-400">
                      {v.type}
                    </span>
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                      v.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {v.status}
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-zinc-600 hover:text-white transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">DRIVING: {v.driver}</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-500">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="fixed bottom-8 left-6 right-6">
        <Card className="p-4 bg-amber-500/10 border-amber-500/20 rounded-[24px]">
          <div className="flex items-start gap-4">
            <AlertTriangle className="text-amber-500 shrink-0" size={20} />
            <p className="text-[10px] text-amber-500 uppercase font-black tracking-widest leading-relaxed">
              1 vehicle requires document renewal (Insurance expiring in 3 days)
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
