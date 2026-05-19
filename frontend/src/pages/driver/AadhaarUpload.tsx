import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle, ShieldCheck, Lock, Eye, AlertCircle, RefreshCw, ArrowRight, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function AadhaarUpload() {
  const navigate = useNavigate();
  
  // States for sequential flow
  const [step, setStep] = useState(1); // 1: Identify Note, 2: Pixel Note, 3: Final Verification
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
  const [aadhaarError, setAadhaarError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<{front: boolean, back: boolean}>({ front: false, back: false });
  const [isFinalVerified, setIsFinalVerified] = useState(false);

  // Aadhaar Validation: Demo Mode (any 12 inputs)
  const validateAadhaar = () => {
    if (!aadhaarNumber) {
      setAadhaarError('Please enter Identification Note');
      return false;
    }
    setAadhaarError('');
    return true;
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handleIdentifyVerify = () => {
    if (validateAadhaar()) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsAadhaarVerified(true);
        setIsProcessing(false);
      }, 1000);
    }
  };

  const handleNextToUploads = () => {
    setStep(2);
  };

  const handleFileUpload = (side: 'front' | 'back') => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setFiles(prev => ({ ...prev, [side]: true }));
      setIsUploading(false);
    }, 1000);
  };

  const handleFinalSubmit = () => {
    if (files.front && files.back) {
      setIsFinalVerified(true);
      setStep(3);
      localStorage.setItem('kyc_aadhaar', 'verified');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1B1E] text-white p-6 lg:p-10 font-sans overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={() => navigate('/driver/kyc')} 
          className="p-4 bg-white/5 border border-white/10 rounded-2xl active:scale-95 hover:bg-white/10 transition-all shadow-xl"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tight leading-none">Authentication Lab</h1>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mt-2 font-mono italic">Node Identity Protocol v4.2</p>
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
                     step >= s ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-white/5"
                   )} 
                 />
              ))}
           </div>
        </div>

        {/* Step 1: Identify Note (Aadhaar Number) */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={cn(
            "p-8 rounded-[44px] border transition-all duration-700 relative overflow-hidden backdrop-blur-xl",
            isAadhaarVerified ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10 bg-white/5"
          )}
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <ShieldCheck size={120} />
          </div>

          <div className="flex items-center justify-between mb-10 relative z-10">
             <div className="space-y-1">
                <h3 className="font-black italic uppercase tracking-tight text-xl text-white/90">Identify Note</h3>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 italic">Primary Identity Signature</p>
             </div>
             {isAadhaarVerified ? (
                <div className="flex items-center gap-2">
                   <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-[#0D1B1E] shadow-2xl shadow-emerald-500/20 ring-4 ring-emerald-500/10">
                      <CheckCircle size={24} />
                   </div>
                </div>
             ) : (
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/20">
                   {isProcessing ? <RefreshCw size={22} className="animate-spin text-blue-500" /> : <Lock size={22} />}
                </div>
             )}
          </div>

          <div className="space-y-6 relative z-10">
             <div className="relative group">
                <input 
                  type="text" 
                  value={aadhaarNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                    setAadhaarNumber(val);
                    if (isAadhaarVerified) {
                      setIsAadhaarVerified(false);
                      setStep(1);
                      setFiles({ front: false, back: false });
                    }
                  }}
                  disabled={isFinalVerified || isAadhaarVerified}
                  placeholder="0000 0000 0000"
                  className={cn(
                    "w-full h-24 bg-[#0D1B1E]/40 border rounded-[32px] px-8 text-3xl font-black tabular-nums tracking-[0.3em] outline-none transition-all placeholder:text-white/5 font-mono",
                    aadhaarError ? "border-red-500/40" : "border-white/5 focus:border-blue-500/40",
                    isAadhaarVerified && "border-emerald-500/40 text-emerald-500 shadow-inner"
                  )}
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-8 pointer-events-none opacity-20">
                   <Fingerprint size={24} />
                </div>
             </div>
             
             {aadhaarError && (
                <div className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
                   <AlertCircle size={14} className="text-red-500" />
                   <span className="text-[9px] font-black uppercase text-red-500 italic">{aadhaarError}</span>
                </div>
             )}

             {!isAadhaarVerified ? (
                <button 
                  onClick={handleIdentifyVerify}
                  disabled={isProcessing}
                  className="w-full h-16 bg-blue-600 text-white font-black uppercase italic tracking-widest text-xs rounded-2xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all mt-4"
                >
                  {isProcessing ? 'Verifying...' : 'Verify Identity Note'}
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

        {/* Step 2: Pixel Note (Image Uploads) - Only appears after Identify Note is verified */}
        <AnimatePresence>
          {isAadhaarVerified && (
            <motion.div 
              initial={{ y: 30, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.95 }}
              className={cn(
                "p-8 rounded-[40px] border transition-all duration-500 relative overflow-hidden bg-white/5",
                isFinalVerified ? "border-emerald-500/30 ring-1 ring-emerald-500/20" : "border-white/10"
              )}
            >
              <div className="flex items-center justify-between mb-8">
                 <div className="space-y-1">
                    <h3 className="font-black italic uppercase tracking-tight text-lg text-white">Pixel Note</h3>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30 italic">High-Fidelity Document Capture</p>
                 </div>
                 <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/20">
                    <Eye size={18} />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase text-white/20 tracking-widest ml-4">Front Canvas</span>
                    <button 
                      onClick={() => handleFileUpload('front')}
                      disabled={files.front || isUploading}
                      className={cn(
                        "w-full aspect-[4/3] rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all relative overflow-hidden group",
                        files.front ? "bg-emerald-500/10 border-emerald-500/30" : "bg-white/5 border-white/10 hover:bg-white/10"
                      )}
                    >
                       {files.front ? (
                          <div className="text-emerald-500 flex flex-col items-center gap-2">
                             <CheckCircle size={28} />
                             <span className="text-[8px] font-black uppercase italic">Captured</span>
                          </div>
                       ) : isUploading ? (
                          <div className="flex flex-col items-center gap-2">
                             <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                             <span className="text-[8px] font-black uppercase text-blue-500 animate-pulse">Syncing...</span>
                          </div>
                       ) : (
                          <>
                            <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-white/30 group-hover:scale-110 transition-transform">
                              <Upload size={20} />
                            </div>
                            <span className="text-[8px] font-black uppercase text-white/20 tracking-widest">Select Pixel</span>
                          </>
                       )}
                    </button>
                 </div>

                 <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase text-white/20 tracking-widest ml-4">Reverse Canvas</span>
                    <button 
                      onClick={() => handleFileUpload('back')}
                      disabled={files.back || isUploading}
                      className={cn(
                        "w-full aspect-[4/3] rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all relative overflow-hidden group",
                        files.back ? "bg-emerald-500/10 border-emerald-500/30" : "bg-white/5 border-white/10 hover:bg-white/10"
                      )}
                    >
                       {files.back ? (
                          <div className="text-emerald-500 flex flex-col items-center gap-2">
                             <CheckCircle size={28} />
                             <span className="text-[8px] font-black uppercase italic">Captured</span>
                          </div>
                       ) : isUploading ? (
                          <div className="flex flex-col items-center gap-2">
                             <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                             <span className="text-[8px] font-black uppercase text-blue-500 animate-pulse">Syncing...</span>
                          </div>
                       ) : (
                          <>
                            <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-white/30 group-hover:scale-110 transition-transform">
                              <Upload size={20} />
                            </div>
                            <span className="text-[8px] font-black uppercase text-white/20 tracking-widest">Select Pixel</span>
                          </>
                       )}
                    </button>
                 </div>
              </div>

              {!isFinalVerified && (
                <button 
                  onClick={handleFinalSubmit}
                  disabled={!files.front || !files.back}
                  className={cn(
                    "w-full h-16 mt-8 font-black uppercase italic tracking-widest text-xs rounded-2xl transition-all shadow-xl",
                    files.front && files.back ? "bg-emerald-500 text-[#0D1B1E] shadow-emerald-500/20 active:scale-95" : "bg-white/5 text-white/10 cursor-not-allowed"
                  )}
                >
                  Verify Pixel Data
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final Status: Visual Interface Success */}
        <AnimatePresence>
          {isFinalVerified && (
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-emerald-500 rounded-[32px] p-8 text-[#0D1B1E] text-center shadow-2xl shadow-emerald-500/40 relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-white/10 translate-x-12 translate-y-12 rotate-45 pointer-events-none"></div>
               <div className="w-20 h-20 bg-white/20 rounded-[32px] flex items-center justify-center mb-6 mx-auto">
                  <ShieldCheck size={48} />
               </div>
               <h2 className="text-3xl font-black italic uppercase leading-none mb-2">Protocol Verified</h2>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Visual Interface Synchronized Successfully</p>
               <button 
                  onClick={() => navigate('/driver/kyc')}
                  className="w-full h-16 bg-[#0D1B1E] text-white rounded-2xl mt-8 font-black uppercase italic tracking-widest text-[10px] hover:bg-zinc-800 transition-all shadow-lg"
               >
                  Return to Control Center
               </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Authentication Notice */}
        <div className="flex items-center justify-center gap-3 py-6 opacity-20">
           <Lock size={12} />
           <span className="text-[8px] font-black uppercase tracking-[0.4em] italic">End-to-End Encrypted Session</span>
        </div>
      </div>
    </div>
  );
}
