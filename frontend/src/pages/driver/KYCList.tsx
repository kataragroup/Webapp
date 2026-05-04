import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShieldCheck, CheckCircle, 
  ChevronRight, Car, Fingerprint, CreditCard, 
  Camera, Lock, Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function KYCList() {
  const navigate = useNavigate();
  
  // Mocking verification states from local storage for demo persistence
  const [verificationStatus] = useState({
    vehicle: localStorage.getItem('kyc_vehicle') === 'true',
    aadhaar: localStorage.getItem('kyc_aadhaar') === 'verified',
    pan: localStorage.getItem('kyc_pan') === 'verified',
    photo: localStorage.getItem('kyc_photo') === 'verified'
  });

  const steps = [
    { 
      label: 'Vehicle Diagnostics', 
      path: '/driver/kyc/vehicle', 
      status: verificationStatus.vehicle ? 'verified' : 'pending', 
      description: 'Asset Mapping & Parameters',
      icon: <Car size={20} />
    },
    { 
      label: 'Identity Protocol', 
      path: '/driver/kyc/aadhaar', 
      status: verificationStatus.aadhaar ? 'verified' : 'pending', 
      description: 'Primary Biometric Sync',
      icon: <Fingerprint size={20} />
    },
    { 
      label: 'Fiscal Synchronization', 
      path: '/driver/kyc/pan', 
      status: verificationStatus.pan ? 'verified' : 'pending', 
      description: 'Taxation & Node Registry',
      icon: <CreditCard size={20} />
    },
    { 
      label: 'Visual Verification', 
      path: '/driver/kyc/photo', 
      status: verificationStatus.photo ? 'verified' : 'pending', 
      description: 'Real-time Node Capture',
      icon: <Camera size={20} />
    },
  ];

  const verifiedCount = Object.values(verificationStatus).filter(v => v === true || v === 'verified').length;
  const progressPercent = (verifiedCount / steps.length) * 100;
  const allVerified = verifiedCount === steps.length;

  return (
    <div className="min-h-screen bg-[#0D1B1E] text-white p-6 md:p-10 font-sans flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate('/driver')} 
              className="p-4 bg-white/5 border border-white/10 rounded-2xl active:scale-95 transition-all hover:bg-white/10"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Partner Setup</h1>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mt-1.5 font-mono italic">Node Onboarding Protocol</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
             <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
             <span className="text-[9px] font-black uppercase tracking-widest text-orange-500">Encrypted Session</span>
          </div>
        </div>

        {/* Progress Matrix */}
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 mb-10 relative overflow-hidden backdrop-blur-xl">
           <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                 <h3 className="text-xl font-black italic uppercase text-white/90">Setup Progress</h3>
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{verifiedCount} of {steps.length} parameters verified</p>
              </div>
              <div className="text-right">
                 <span className="text-3xl font-mono font-black italic text-[#00E054]">{Math.round(progressPercent)}%</span>
              </div>
           </div>
           
           <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full bg-[#00E054] shadow-[0_0_20px_rgba(0,224,84,0.4)]"
              />
           </div>

           {allVerified && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="mt-8 p-6 bg-[#00E054]/10 border border-[#00E054]/20 rounded-3xl flex items-center justify-between"
             >
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-[#00E054] flex items-center justify-center text-[#0D1B1E]">
                      <ShieldCheck size={24} />
                   </div>
                   <div className="space-y-0.5">
                      <p className="text-xs font-black uppercase text-white">Clearance Granted</p>
                      <p className="text-[10px] font-black text-[#00E054]/60 uppercase tracking-tight">Access Dashboard Protocols</p>
                   </div>
                </div>
                <button 
                  onClick={() => navigate('/driver')}
                  className="px-6 py-3 bg-[#00E054] text-[#0D1B1E] rounded-xl font-black uppercase italic tracking-widest text-[10px] active:scale-95 transition-all shadow-xl shadow-[#00E054]/20"
                >
                  Enter Matrix
                </button>
             </motion.div>
           )}
        </div>
        
        {/* Step Grid */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => step.status !== 'verified' && navigate(step.path)}
              className={cn(
                "group relative bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center justify-between cursor-pointer transition-all hover:bg-white/10 hover:border-white/20 active:scale-[0.98]",
                step.status === 'verified' ? 'opacity-100 pointer-events-none border-emerald-500/20 bg-emerald-500/5' : ''
              )}
            >
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                  step.status === 'verified' 
                    ? "bg-emerald-500 text-[#0D1B1E] shadow-lg shadow-emerald-500/20" 
                    : "bg-white/5 text-white/30 font-mono group-hover:text-white group-hover:bg-white/10"
                )}>
                  {step.status === 'verified' ? <CheckCircle size={24} /> : step.icon}
                </div>
                
                <div className="space-y-1">
                  <h3 className={cn(
                    "text-lg font-black italic uppercase leading-none transition-colors",
                    step.status === 'verified' ? "text-emerald-500" : "text-white/80 group-hover:text-white"
                  )}>
                    {step.label}
                  </h3>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest group-hover:text-white/40 transition-colors">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                 {step.status === 'verified' ? (
                   <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/10">Verified</span>
                 ) : (
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-white group-hover:bg-white/10 transition-all">
                      <ChevronRight size={20} />
                   </div>
                 )}
              </div>
            </motion.div>
          ))}
        </div>

        <footer className="mt-12 text-center space-y-6">
           <div className="flex items-center justify-center gap-3 text-white/10">
              <Lock size={12} />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] font-mono">End-to-End Encryption Enabled</span>
           </div>
           
           <div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-3xl flex items-start gap-4 text-left">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                 <Info size={18} />
              </div>
              <p className="text-[10px] font-black text-blue-200/40 uppercase leading-relaxed tracking-tight">
                 Your data is processed securely for regulatory compliance. 
                 <br/><span className="text-blue-500">GoYatari</span> maintains strict zero-knowledge security protocols for all partner assets.
              </p>
           </div>
        </footer>
      </div>
    </div>
  );
}
