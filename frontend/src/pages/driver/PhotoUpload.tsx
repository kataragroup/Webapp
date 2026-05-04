import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCircle, ShieldCheck, Camera, CheckCircle, Lock, Eye, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function PhotoUpload() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Capture, 2: Preview & Auth, 3: Success
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isFinalVerified, setIsFinalVerified] = useState(false);

  const handleCapture = () => {
    setIsVerifying(true);
    // Simulate biometric analysis
    setTimeout(() => {
      setHasPhoto(true);
      setIsVerifying(false);
      setStep(2);
    }, 2000);
  };

  const handleCertify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsFinalVerified(true);
      setStep(3);
      setIsVerifying(false);
      localStorage.setItem('kyc_photo', 'verified');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0D1B1E] text-white p-6 lg:p-10 font-sans overflow-x-hidden">
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={() => navigate('/driver/kyc')} 
          className="p-4 bg-white/5 border border-white/10 rounded-2xl active:scale-95 hover:bg-white/10 transition-all shadow-xl"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tight leading-none">Visual Interface</h1>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mt-2 font-mono italic">Node Biometric Capture v2.0</p>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12 flex flex-col items-center"
            >
              {/* Scan Frame */}
              <div className="relative group">
                {/* Decorative Rings */}
                <div className="absolute inset-x-[-20px] inset-y-[-20px] border border-white/5 rounded-full animate-[pulse_4s_infinite]" />
                <div className="absolute inset-x-[-40px] inset-y-[-40px] border border-white/5 rounded-full animate-[pulse_6s_infinite]" />
                
                <div className="w-72 h-72 rounded-full border-4 border-dashed border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-blue-500/50 transition-all shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-md">
                   <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
                   <UserCircle size={140} className="text-white/5" />
                   
                   {/* Scanning Line */}
                   <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-scan-y z-20"></div>
                   
                   <button 
                     onClick={handleCapture}
                     disabled={isVerifying}
                     className="absolute bottom-8 right-8 w-18 h-18 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-all border-4 border-[#0D1B1E] z-30 group-hover:bg-blue-500"
                   >
                     {isVerifying ? <RefreshCw size={28} className="animate-spin" /> : <Camera size={32} />}
                   </button>
                </div>
              </div>

              <div className="text-center space-y-4">
                 <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white/90">Initialize Frame</h3>
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] font-mono leading-relaxed max-w-[280px] mx-auto italic">
                   Optical node initialization. <br/>Awaiting 3D liveness synchronization.
                 </p>
              </div>

              <div className="w-full flex items-center justify-center gap-3 py-6 opacity-20 mt-8">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                 <span className="text-[8px] font-black uppercase tracking-[0.4em] italic leading-none">High Fidelity Auth Link</span>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="p-8 rounded-[40px] border border-white/10 bg-white/5 space-y-8">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                       <h3 className="font-black italic uppercase tracking-tight text-lg">Preview Note</h3>
                       <p className="text-[9px] font-black uppercase tracking-widest text-white/30 italic">Liveness Verified</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
                       <Eye size={20} />
                    </div>
                 </div>

                 <div className="flex justify-center">
                    <div className="w-48 h-48 rounded-full border-4 border-emerald-500/50 p-2 overflow-hidden shadow-2xl">
                       <img 
                         src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                         className="w-full h-full object-cover rounded-full" 
                         alt="Captured Profile" 
                       />
                    </div>
                 </div>

                 <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl flex items-start gap-4">
                    <ShieldCheck size={24} className="text-blue-500 shrink-0 mt-1" />
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 block mb-1">Authenticated Sync</p>
                       <p className="text-[9px] text-white/30 font-bold uppercase tracking-tight leading-relaxed italic">
                          This visual signature will be your permanent nodal identifier across the GoYatari lattice.
                       </p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setStep(1)}
                      className="h-16 bg-white/5 border border-white/10 rounded-2xl font-black uppercase italic tracking-widest text-[10px] hover:bg-white/10 transition-all text-white/50"
                    >
                      Re-Capture
                    </button>
                    <button 
                      onClick={handleCertify}
                      disabled={isVerifying}
                      className="h-16 bg-blue-600 text-white rounded-2xl font-black uppercase italic tracking-widest text-[10px] shadow-xl shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      {isVerifying ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                      Certify Node
                    </button>
                 </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
               key="step3"
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-emerald-500 rounded-[48px] p-10 text-[#0D1B1E] text-center shadow-2xl shadow-emerald-500/40 relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-white/10 translate-x-20 translate-y-20 rotate-45 pointer-events-none"></div>
               <div className="w-24 h-24 bg-white/20 rounded-[40px] flex items-center justify-center mb-8 mx-auto shadow-2xl ring-4 ring-white/10">
                  <CheckCircle size={56} />
               </div>
               <h2 className="text-4xl font-black italic uppercase leading-none mb-3 tracking-tighter">Identity Locked</h2>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Visual Interface Synchronized & Secured</p>
               
               <button 
                  onClick={() => navigate('/driver/kyc')}
                  className="w-full h-20 bg-[#0D1B1E] text-white rounded-[28px] mt-10 font-black uppercase italic tracking-[0.2em] text-xs hover:bg-zinc-800 transition-all shadow-2xl relative z-10"
               >
                  Return to Control Center
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes scan-y {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
        .animate-scan-y {
          animation: scan-y 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
