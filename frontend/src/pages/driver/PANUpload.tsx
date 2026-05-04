import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, ShieldCheck, Lock, Upload, Eye, CheckCircle, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function PANUpload() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Identify Note, 2: Pixel Note, 3: Final Verified
  const [panNumber, setPanNumber] = useState('');
  const [isPanVerified, setIsPanVerified] = useState(false);
  const [panError, setPanError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [hasFile, setHasFile] = useState(false);
  const [isFinalVerified, setIsFinalVerified] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  const validatePAN = () => {
    if (!panNumber) {
      setPanError('Please enter Fiscal Signature');
      return false;
    }
    setPanError('');
    return true;
  };

  const handleIdentifyVerify = () => {
    if (validatePAN()) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsPanVerified(true);
        setIsProcessing(false);
      }, 1000);
    }
  };

  const handleNextToUploads = () => {
    setStep(2);
  };

  const handleFileUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setHasFile(true);
      setIsUploading(false);
    }, 1000);
  };

  const handleFinalSubmit = () => {
    if (hasFile) {
      setIsFinalVerified(true);
      setStep(3);
      localStorage.setItem('kyc_pan', 'verified');
    }
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
          <h1 className="text-2xl font-black italic uppercase tracking-tight leading-none">Fiscal Terminal</h1>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mt-2 font-mono italic">Node Tax Protocol Sync v1.0</p>
        </div>
      </div>

      <div className="max-w-md mx-auto space-y-8">
        
        {/* Progress Radar */}
        <div className="flex justify-center mb-4">
           <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                 <div 
                   key={s} 
                   className={cn(
                     "w-12 h-1 rounded-full transition-all duration-500",
                     step >= s ? "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" : "bg-white/5"
                   )} 
                 />
              ))}
           </div>
        </div>

        {/* Step 1: Identify Note (PAN Number) */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={cn(
            "p-8 rounded-[44px] border transition-all duration-700 relative overflow-hidden backdrop-blur-xl",
            isPanVerified ? "border-orange-500/30 bg-orange-500/5" : "border-white/10 bg-white/5"
          )}
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <CreditCard size={120} />
          </div>

          <div className="flex items-center justify-between mb-10 relative z-10">
             <div className="space-y-1">
                <h3 className="font-black italic uppercase tracking-tight text-xl text-white/90">Identify Note</h3>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 italic">Fiscal Signature Entry</p>
             </div>
             {isPanVerified ? (
                <div className="flex items-center gap-2">
                   <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-[#0D1B1E] shadow-2xl shadow-orange-500/20 ring-4 ring-orange-500/10">
                      <CheckCircle size={24} />
                   </div>
                </div>
             ) : (
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/20">
                   {isProcessing ? <RefreshCw size={22} className="animate-spin text-orange-500" /> : <Lock size={22} />}
                </div>
             )}
          </div>

          <div className="space-y-6 relative z-10">
             <input 
               type="text" 
               placeholder="ABCDE1234F"
               value={panNumber}
               disabled={isFinalVerified || isPanVerified}
               onChange={(e) => {
                 setPanNumber(e.target.value.toUpperCase().slice(0, 10));
                 if (isPanVerified) {
                   setIsPanVerified(false);
                   setStep(1);
                   setHasFile(false);
                 }
               }}
               className={cn(
                 "w-full h-24 bg-[#0D1B1E]/40 border rounded-[32px] px-8 text-3xl font-black tabular-nums tracking-[0.3em] outline-none transition-all placeholder:text-white/5 font-mono",
                 panError ? "border-red-500/40" : "border-white/5 focus:border-orange-500/40",
                 isPanVerified && "border-orange-500/40 text-orange-500 shadow-inner"
               )}
               maxLength={10}
             />
             
             {panError && (
                <div className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
                   <AlertCircle size={14} className="text-red-500" />
                   <span className="text-[9px] font-black uppercase text-red-500 italic">{panError}</span>
                </div>
             )}

             {!isPanVerified ? (
                <button 
                  onClick={handleIdentifyVerify}
                  disabled={isProcessing}
                  className="w-full h-16 bg-orange-600 text-white font-black uppercase italic tracking-widest text-xs rounded-2xl shadow-xl shadow-orange-600/20 active:scale-95 transition-all mt-4"
                >
                  {isProcessing ? 'Verifying...' : 'Verify Identify Note'}
                </button>
             ) : step < 2 && (
                <motion.button 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={handleNextToUploads}
                  className="w-full h-16 bg-emerald-500 text-[#0D1B1E] font-black uppercase italic tracking-widest text-xs rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all mt-4 flex items-center justify-center gap-2"
                >
                  Proceed to Pixel Note <ArrowRight size={16} />
                </motion.button>
             )}
          </div>
        </motion.div>

        {/* Step 2: Pixel Note (Physical Scan) */}
        <AnimatePresence>
          {isPanVerified && (
            <motion.div 
              initial={{ y: 30, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              className={cn(
                "p-8 rounded-[40px] border transition-all duration-500 relative overflow-hidden bg-white/5",
                isFinalVerified ? "border-emerald-500/30 ring-1 ring-emerald-500/20" : "border-white/10"
              )}
            >
              <div className="flex items-center justify-between mb-8">
                 <div className="space-y-1">
                    <h3 className="font-black italic uppercase tracking-tight text-lg text-white">Pixel Note</h3>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30 italic">Physical Document Scan</p>
                 </div>
                 <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/20">
                    <Eye size={18} />
                 </div>
              </div>

              <div className="space-y-4">
                 <button 
                   onClick={handleFileUpload}
                   disabled={hasFile || isUploading}
                   className={cn(
                     "w-full aspect-[1.6/1] rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all relative group",
                     hasFile ? "bg-emerald-500/10 border-emerald-500/30" : "bg-white/5 border-white/10 hover:bg-white/10"
                   )}
                 >
                    {hasFile ? (
                       <div className="text-emerald-500 flex flex-col items-center gap-3">
                          <CheckCircle size={32} />
                          <span className="text-[10px] font-black uppercase italic tracking-widest">Document Ingested</span>
                       </div>
                    ) : isUploading ? (
                       <div className="flex flex-col items-center gap-3">
                          <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                          <span className="text-[10px] font-black uppercase text-orange-500 animate-pulse">Syncing...</span>
                       </div>
                    ) : (
                       <>
                         <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/30 group-hover:scale-110 group-hover:text-orange-500 transition-all">
                            <Upload size={24} />
                         </div>
                         <div className="text-center">
                            <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Select Pixel Data</p>
                            <p className="text-[8px] font-black text-white/10 mt-1">MAX 10MB SCANS</p>
                         </div>
                       </>
                    )}
                 </button>

                 {!isFinalVerified && (
                    <button 
                      onClick={handleFinalSubmit}
                      disabled={!hasFile}
                      className={cn(
                        "w-full h-16 mt-4 font-black uppercase italic tracking-widest text-xs rounded-2xl transition-all shadow-xl",
                        hasFile ? "bg-emerald-500 text-[#0D1B1E] shadow-emerald-500/20 active:scale-95" : "bg-white/5 text-white/10 cursor-not-allowed"
                      )}
                    >
                      Authenticate Node
                    </button>
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success State */}
        <AnimatePresence>
          {isFinalVerified && (
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-emerald-500 rounded-[40px] p-8 text-[#0D1B1E] text-center shadow-2xl shadow-emerald-500/40 relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-white/20 translate-x-16 translate-y-16 rotate-45 pointer-events-none"></div>
               <div className="w-20 h-20 bg-[#0D1B1E] text-white rounded-[32px] flex items-center justify-center mb-6 mx-auto shadow-2xl">
                  <ShieldCheck size={48} />
               </div>
               <h2 className="text-3xl font-black italic uppercase leading-none mb-2 tracking-tight">Node Secured</h2>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Visual Interface Synchronized</p>
               <button 
                  onClick={() => navigate('/driver/kyc')}
                  className="w-full h-16 bg-white/10 text-[#0D1B1E] rounded-2xl mt-8 font-black uppercase italic tracking-widest text-[10px] border border-[#0D1B1E]/10 hover:bg-white/20 transition-all"
               >
                  Verify More Nodes
               </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-center gap-3 py-6 opacity-20">
           <Lock size={12} />
           <span className="text-[8px] font-black uppercase tracking-[0.4em] italic leading-none">High Fidelity Auth Sync</span>
        </div>
      </div>
    </div>
  );
}
