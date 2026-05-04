import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet as WalletIcon, ArrowLeft } from 'lucide-react';

export default function DriverWallet() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0d0d0d] p-6">
      <button onClick={() => navigate(-1)} className="mb-8 p-3 bg-white/5 rounded-2xl">
        <ArrowLeft size={24} />
      </button>
      <div className="bg-orange-600 rounded-[40px] p-8 mb-8 text-white shadow-2xl shadow-orange-500/20">
        <p className="font-bold uppercase text-[10px] tracking-widest opacity-60 mb-2">Earnings to Payout</p>
        <h2 className="text-4xl font-black italic">₹ 4,850.00</h2>
      </div>
    </div>
  );
}
