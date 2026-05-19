import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, Camera, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

const VEHICLE_TYPES = [
  { id: 'mini', label: 'Mini', icon: '🚗' },
  { id: 'sedan', label: 'Sedan', icon: '🚘' },
  { id: 'suv', label: 'SUV', icon: '🚙' },
  { id: 'ev', label: 'EV', icon: '⚡' },
];

export default function VehicleDetails() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('sedan');

  const handleConfirm = () => {
    localStorage.setItem('kyc_vehicle', 'true');
    navigate('/driver/kyc');
  };

  return (
    <div className="min-h-screen bg-[#0D1B1E] text-white p-6 md:p-10 font-sans overflow-x-hidden">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-5 mb-12">
          <button 
            onClick={() => navigate('/driver/kyc')} 
            className="p-4 bg-white/5 border border-white/10 rounded-2xl active:scale-95 hover:bg-white/10 transition-all shadow-xl"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Technical Note</h1>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mt-1.5 font-mono italic">Asset Registration Hub</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[44px] p-8 md:p-10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5">
             <Car size={160} />
          </div>

          <div className="space-y-10 relative z-10">
            {/* Vehicle Type Selection */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em] ml-4 font-mono">Select Node Class</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {VEHICLE_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-6 rounded-[32px] border transition-all duration-500",
                      selectedType === type.id 
                        ? 'bg-emerald-500 border-emerald-400 text-[#0D1B1E] shadow-2xl shadow-emerald-500/30 font-black italic' 
                        : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                    )}
                  >
                    <span className="text-3xl">{type.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em] ml-4 font-mono italic">Brand</label>
                  <input 
                    type="text" 
                    placeholder="E.G. MARUTI SUZUKI"
                    className="w-full h-18 bg-[#0D1B1E]/60 border border-white/5 rounded-[28px] px-8 text-sm font-black uppercase italic tracking-wider placeholder:text-white/5 focus:outline-none focus:border-emerald-500/40 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em] ml-4 font-mono italic">Model</label>
                  <input 
                    type="text" 
                    placeholder="E.G. DZIRE"
                    className="w-full h-18 bg-[#0D1B1E]/60 border border-white/5 rounded-[28px] px-8 text-sm font-black uppercase italic tracking-wider placeholder:text-white/5 focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em] ml-4 font-mono italic">Node Number</label>
                  <input 
                    type="text" 
                    placeholder="DL 2C B 5678"
                    className="w-full h-18 bg-[#0D1B1E]/60 border border-white/5 rounded-[28px] px-8 text-xs font-black uppercase tracking-[0.2em] font-mono placeholder:text-white/5 focus:outline-none focus:border-emerald-500/40 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em] ml-4 font-mono italic">Color Scheme</label>
                  <input 
                    type="text" 
                    placeholder="WHITE / SILVER"
                    className="w-full h-18 bg-[#0D1B1E]/60 border border-white/5 rounded-[28px] px-8 text-xs font-black uppercase tracking-[0.2em] placeholder:text-white/5 focus:outline-none focus:border-emerald-500/40 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Photo Upload Placeholder */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em] ml-4 font-mono italic">Registration Certificate (RC)</label>
              <div className="w-full h-48 bg-[#0D1B1E]/60 border-2 border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all group">
                 <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/30 group-hover:scale-110 group-hover:text-emerald-500 transition-all">
                    <Camera size={32} />
                 </div>
                 <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">Ingest RC Pixel Note</p>
                    <p className="text-[8px] font-mono font-black text-white/10 mt-1 uppercase">MAX FILE SIZE: 15MB</p>
                 </div>
              </div>
            </div>

            <button 
              onClick={handleConfirm}
              className="w-full h-20 bg-emerald-500 text-[#0D1B1E] font-black uppercase tracking-[0.3em] italic text-xs rounded-[32px] shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all mt-6"
            >
              Verify Technical Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
