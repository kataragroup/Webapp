import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Landmark } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function Bank() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0d0d0d] p-6 text-white text-center">
      <button onClick={() => navigate(-1)} className="mb-12 p-3 bg-white/5 rounded-2xl w-fit">
        <ArrowLeft size={24} />
      </button>
      <div className="max-w-md mx-auto space-y-8">
        <Landmark size={48} className="text-orange-500 mx-auto" />
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Bank Settings</h1>
        <div className="p-6 bg-[#1a1a1a] rounded-[30px] border-2 border-white/5">
           <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mb-4 text-left">Primary Payout Method</p>
           <div className="flex items-center justify-between">
              <span className="font-bold">HDFC Bank .... 4521</span>
              <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Active</span>
           </div>
        </div>
        <Button onClick={() => navigate(-1)} className="w-full">Save Config</Button>
      </div>
    </div>
  );
}
