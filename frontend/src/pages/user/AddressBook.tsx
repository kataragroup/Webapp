import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Plus, MapPin, Home, Briefcase, Heart, Trash2, Search, X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

interface SavedLocation {
  id: string;
  type: 'home' | 'work' | 'favorite' | 'other';
  label: string;
  address: string;
}

const INITIAL_LOCATIONS: SavedLocation[] = [
  { id: '1', type: 'home', label: 'Home', address: 'B-24, Shalimar Garden, Lucknow, India' },
  { id: '2', type: 'work', label: 'Office', address: 'Cyber Tower, Vibhuti Khand, Gomti Nagar, Lucknow' },
  { id: '3', type: 'favorite', label: 'Hazratganj Square', address: 'Lucknow, Uttar Pradesh, India' },
];

const TYPE_ICONS = {
  home: Home,
  work: Briefcase,
  favorite: Heart,
  other: MapPin
};

export default function AddressBook() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<SavedLocation[]>(INITIAL_LOCATIONS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLocation, setNewLocation] = useState({ label: '', address: '', type: 'other' as const });

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const loc: SavedLocation = {
      id: Date.now().toString(),
      ...newLocation
    };
    setLocations([...locations, loc]);
    setShowAddModal(false);
    setNewLocation({ label: '', address: '', type: 'other' });
  };

  const handleRemove = (id: string) => {
    setLocations(locations.filter(l => l.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0D1B1E] text-white pb-32">
      <header className="fixed top-0 inset-x-0 bg-[#0D1B1E]/80 backdrop-blur-3xl z-50 flex items-center justify-between p-6 border-b border-white/5 shadow-2xl">
        <button onClick={() => navigate(-1)} className="p-4 bg-white/5 border border-white/10 rounded-2xl active:scale-95 transition-all">
          <ChevronLeft size={24} />
        </button>
        <div className="text-right">
            <h1 className="text-2xl font-black italic uppercase italic underline underline-offset-8 decoration-[#00E054] tracking-tighter">Address Matrix</h1>
            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] leading-none mt-1 font-mono">Location Data Nodes</p>
        </div>
      </header>

      <div className="container max-w-xl mx-auto px-6 pt-32 space-y-8">
        <div className="flex justify-between items-center">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] font-mono leading-none">Saved Endpoints</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#00E054] text-black font-black italic uppercase text-[10px] tracking-widest shadow-lg shadow-[#00E054]/20 active:scale-95 transition-all"
            >
              <Plus size={16} /> New Node
            </button>
        </div>

        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {locations.map((loc) => {
              const Icon = TYPE_ICONS[loc.type];
              return (
                <motion.div
                  key={loc.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="bg-white/5 border-white/10 rounded-[32px] p-6 hover:bg-white/10 transition-colors group">
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#00E054] group-hover:bg-[#00E054]/10 transition-all">
                          <Icon size={24} />
                        </div>
                        <div>
                          <p className="text-lg font-black italic uppercase tracking-tighter">{loc.label}</p>
                          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1 line-clamp-1">{loc.address}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemove(loc.id)}
                        className="p-3 text-red-500/20 hover:text-red-500 hover:bg-white/5 rounded-xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0D1B1E] border border-white/10 rounded-[40px] w-full max-w-sm p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute top-6 right-6 p-2 text-white/20 hover:text-white"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-black italic uppercase underline underline-offset-8 decoration-[#00E054] tracking-tighter mb-8">Initialize Node</h3>
              
              <form onSubmit={handleAddLocation} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Label</label>
                  <input 
                    required
                    placeholder="Work, Gym, etc."
                    value={newLocation.label}
                    onChange={(e) => setNewLocation({...newLocation, label: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-6 font-bold text-sm outline-none focus:border-[#00E054] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Endpoint Address</label>
                  <div className="relative">
                     <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
                     <input 
                       required
                       placeholder="Enter full address"
                       value={newLocation.address}
                       onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 pl-14 pr-6 font-bold text-sm outline-none focus:border-[#00E054] transition-all"
                     />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Protocol Type</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['home', 'work', 'favorite', 'other'] as const).map((type) => {
                       const Icon = TYPE_ICONS[type];
                       return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNewLocation({...newLocation, type})}
                          className={`aspect-square rounded-2xl flex items-center justify-center transition-all border ${newLocation.type === type ? 'bg-[#00E054] text-black border-[#00E054]' : 'bg-white/5 border-white/10 text-white/20 hover:border-white/20'}`}
                        >
                          <Icon size={20} />
                        </button>
                       )
                    })}
                  </div>
                </div>

                <Button type="submit" className="w-full h-16 rounded-2xl mt-4 font-black italic shadow-lg shadow-[#00E054]/20 uppercase tracking-[0.2em] text-[12px]">
                   Authorize Node
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
