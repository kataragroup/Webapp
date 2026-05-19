import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Eye,
  Clock,
  User,
  CreditCard,
  Car
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface KYCPayload {
  id: string;
  driverName: string;
  type: 'Aadhar' | 'PAN' | 'RC' | 'Photo';
  submittedAt: string;
  status: 'Pending' | 'Flagged';
  previewUrl: string;
}

const mockKYCs: KYCPayload[] = [
  { id: 'KYC-881', driverName: 'Rahul Sharma', type: 'Aadhar', submittedAt: '12 mins ago', status: 'Pending', previewUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=200' },
  { id: 'KYC-882', driverName: 'Amit Patel', type: 'PAN', submittedAt: '45 mins ago', status: 'Pending', previewUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=200' },
  { id: 'KYC-883', driverName: 'Sandeep Yadav', type: 'RC', submittedAt: '1 hour ago', status: 'Flagged', previewUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=200' },
  { id: 'KYC-884', driverName: 'Priya Singh', type: 'Photo', submittedAt: '3 hours ago', status: 'Pending', previewUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=200' },
];

export default function AdminKYC() {
  const [pendingKYCs, setPendingKYCs] = useState(mockKYCs);
  const [selectedKYC, setSelectedKYC] = useState<KYCPayload | null>(null);

  const handleAction = (id: string, action: 'Approve' | 'Reject') => {
    setPendingKYCs(prev => prev.filter(k => k.id !== id));
    setSelectedKYC(null);
    alert(`Node ${id} ${action === 'Approve' ? 'Certified' : 'Rejected'}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-10">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">Authentication Matrix</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-3 font-mono">KYC Verification Queue</p>
          </div>
          <div className="flex gap-3">
             <div className="px-6 py-3 bg-white border border-gray-100 rounded-2xl flex items-center gap-3 shadow-xl shadow-gray-200/20">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{pendingKYCs.length} Nodes Pending</span>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Queue List */}
          <div className="xl:col-span-2 space-y-4">
             {pendingKYCs.map((kyc, i) => (
                <motion.div
                  key={kyc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedKYC(kyc)}
                  className={`group p-6 rounded-[32px] border transition-all cursor-pointer flex items-center justify-between ${
                    selectedKYC?.id === kyc.id 
                      ? 'bg-blue-600 border-blue-600 shadow-2xl shadow-blue-500/20' 
                      : 'bg-white border-gray-100 hover:border-blue-200 shadow-lg shadow-gray-200/10'
                  }`}
                >
                   <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                        selectedKYC?.id === kyc.id ? 'bg-white/20 text-white' : 'bg-gray-50 text-gray-400 group-hover:text-blue-500'
                      }`}>
                         {kyc.type === 'Aadhar' && <User size={24} />}
                         {kyc.type === 'PAN' && <CreditCard size={24} />}
                         {kyc.type === 'RC' && <Car size={24} />}
                         {kyc.type === 'Photo' && <Eye size={24} />}
                      </div>
                      <div className="space-y-1">
                         <h3 className={`text-lg font-black italic uppercase tracking-tight leading-none ${
                           selectedKYC?.id === kyc.id ? 'text-white' : 'text-gray-900'
                         }`}>
                           {kyc.driverName}
                         </h3>
                         <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${
                           selectedKYC?.id === kyc.id ? 'text-white/60' : 'text-gray-400'
                         }`}>
                            <span className={selectedKYC?.id === kyc.id ? 'text-white' : 'text-blue-500'}>{kyc.type}</span>
                            <span>•</span>
                            <span>{kyc.submittedAt}</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-4">
                      {kyc.status === 'Flagged' && (
                         <div className="px-3 py-1 bg-red-100 text-red-600 rounded-full flex items-center gap-2 text-[9px] font-black uppercase tracking-widest border border-red-200">
                            <ShieldAlert size={12} />
                            Flagged
                         </div>
                      )}
                      <div className={`p-3 rounded-2xl transition-all ${
                         selectedKYC?.id === kyc.id ? 'bg-white/20 text-white' : 'bg-gray-50 text-gray-300'
                      }`}>
                         <ExternalLink size={18} />
                      </div>
                   </div>
                </motion.div>
             ))}

             {pendingKYCs.length === 0 && (
                <div className="h-64 border-2 border-dashed border-gray-100 rounded-[48px] flex flex-col items-center justify-center text-center space-y-4 opacity-50 grayscale">
                   <CheckCircle2 size={48} className="text-emerald-500" />
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">Queue Sanitized: No Pending Nodes</p>
                </div>
             )}
          </div>

          {/* Verification Panel */}
          <div className="space-y-6">
             <AnimatePresence mode="wait">
                {selectedKYC ? (
                   <motion.div
                     key={selectedKYC.id}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 20 }}
                     className="bg-white border border-gray-100 rounded-[48px] p-8 space-y-8 shadow-2xl shadow-gray-300/40 sticky top-12"
                   >
                      <div className="aspect-[1.4/1] bg-gray-100 rounded-[32px] overflow-hidden border border-gray-200 group relative">
                         <img 
                           src={selectedKYC.previewUrl} 
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                           alt="Identity Scan" 
                         />
                         <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button className="p-4 bg-white rounded-full text-black shadow-2xl transition-transform hover:scale-110">
                               <Eye size={24} />
                            </button>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <div className="space-y-2">
                            <h4 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">Integrity Analysis</h4>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-mono">Verifying Node {selectedKYC.id}</p>
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 border border-gray-100 p-5 rounded-[24px]">
                               <Clock size={16} className="text-gray-300 mb-2" />
                               <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Latency</p>
                               <p className="text-xs font-black italic uppercase mt-1">{selectedKYC.submittedAt}</p>
                            </div>
                            <div className="bg-gray-50 border border-gray-100 p-5 rounded-[24px]">
                               <FileText size={16} className="text-gray-300 mb-2" />
                               <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Doc Type</p>
                               <p className="text-xs font-black italic uppercase mt-1">{selectedKYC.type}</p>
                            </div>
                         </div>
                      </div>

                      <div className="pt-4 flex flex-col gap-4">
                         <button 
                           onClick={() => handleAction(selectedKYC.id, 'Reject')}
                           className="w-full h-18 rounded-[24px] bg-red-500/10 border border-red-500/20 text-red-600 font-black italic uppercase tracking-[0.2em] text-[10px] active:scale-95 transition-all flex items-center justify-center gap-3"
                         >
                            <XCircle size={18} />
                            Discard Node
                         </button>
                         <button 
                           onClick={() => handleAction(selectedKYC.id, 'Approve')}
                           className="w-full h-20 rounded-[28px] bg-black text-white font-black italic uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all text-xs flex items-center justify-center gap-4"
                         >
                            <CheckCircle2 size={24} className="text-emerald-400" />
                            Certify Partner
                         </button>
                      </div>
                   </motion.div>
                ) : (
                   <div className="h-[500px] border-2 border-dashed border-gray-100 rounded-[48px] flex flex-col items-center justify-center text-center p-8 space-y-6 grayscale opacity-30">
                      <ShieldCheck size={64} className="text-gray-200" />
                      <div className="space-y-2">
                        <p className="text-lg font-black italic uppercase italic text-gray-400">Analysis Required</p>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-relaxed max-w-[200px]">Select a pending identity node to initiate semantic certification.</p>
                      </div>
                   </div>
                )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
