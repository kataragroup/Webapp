import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet as WalletIcon, TrendingUp, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Header } from '../../components/layout/Header';

export default function Wallet() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0D1B1E] text-white pb-32">
       <Header onMenuClick={() => {}} showBack={true} theme="dark" title="Settlement Node" />

       <div className="px-6 space-y-12 mt-10 container mx-auto lg:max-w-xl">
         <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[48px] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
               <TrendingUp size={120} />
            </div>
            <div className="relative z-10 space-y-8">
               <div>
                  <p className="font-black italic uppercase text-[10px] tracking-[0.4em] text-white/60 mb-2">Total Node Credits</p>
                  <h2 className="text-5xl font-black italic tracking-tighter">₹ 1,240.50</h2>
               </div>
               
               <div className="flex gap-4">
                  <button className="flex-1 h-16 bg-white text-black rounded-2xl font-black italic uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                     Deposit
                  </button>
                  <button className="flex-1 h-16 bg-white/10 rounded-2xl font-black italic uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                     Withdraw
                  </button>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] font-mono pl-4 leading-none">Recent Transactions</h3>
            <div className="space-y-4">
               {[
                 { label: 'Network Ride #932', value: '- ₹120.00', type: 'debit', date: 'Today' },
                 { label: 'Manual Credit Load', value: '+ ₹500.00', type: 'credit', date: 'Yesterday' },
                 { label: 'Network Ride #901', value: '- ₹185.00', type: 'debit', date: '2 days ago' },
               ].map((tx, i) => (
                 <div key={i} className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex items-center justify-between group hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-6">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'debit' ? 'bg-red-500/10 text-red-500' : 'bg-[#00E054]/10 text-[#00E054]'}`}>
                          {tx.type === 'debit' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                       </div>
                       <div>
                          <p className="text-sm font-black italic uppercase italic text-white/90">{tx.label}</p>
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">{tx.date}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className={`text-lg font-black italic uppercase ${tx.type === 'debit' ? 'text-white' : 'text-[#00E054]'}`}>{tx.value}</p>
                       <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">Confirmed</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
       </div>
    </div>
  );
}
