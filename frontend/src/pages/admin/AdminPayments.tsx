import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { motion } from 'motion/react';
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  User, 
  CheckCircle2,
  AlertTriangle,
  Download
} from 'lucide-react';
import { Card } from '../../components/ui/Card';

interface Transaction {
  id: string;
  type: 'Inflow' | 'Outflow';
  amount: string;
  entity: string;
  status: 'Settled' | 'Pending' | 'Flagged';
  time: string;
}

const mockTransactions: Transaction[] = [
  { id: 'TX-9021', type: 'Inflow', amount: '₹450', entity: 'Ride RD-001', status: 'Settled', time: '14:32' },
  { id: 'TX-9022', type: 'Outflow', amount: '₹360', entity: 'Rahul Sharma (Payout)', status: 'Pending', time: '15:10' },
  { id: 'TX-9023', type: 'Inflow', amount: '₹320', entity: 'Ride RD-002', status: 'Settled', time: '15:45' },
  { id: 'TX-9024', type: 'Outflow', amount: '₹1,200', entity: 'System Maintenance', status: 'Flagged', time: '16:00' },
];

export default function AdminPayments() {
  const [txs] = useState(mockTransactions);

  return (
    <AdminLayout>
      <div className="space-y-10">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">Fiscal Flow</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] font-mono mt-3">Ledger & Transaction Matrix</p>
          </div>
          <div className="flex gap-4">
             <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-all shadow-xl shadow-gray-200/10">
                <Download size={16} />
                Export Ledger
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="bg-white p-8 rounded-[40px] border-gray-100 shadow-xl shadow-gray-200/20 space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                 <ArrowUpRight size={24} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Inflow</p>
                 <h2 className="text-3xl font-black italic uppercase italic text-gray-900 leading-none">₹ 1,24,000</h2>
              </div>
           </Card>
           <Card className="bg-white p-8 rounded-[40px] border-gray-100 shadow-xl shadow-gray-200/20 space-y-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                 <ArrowDownLeft size={24} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Outflow</p>
                 <h2 className="text-3xl font-black italic uppercase italic text-gray-900 leading-none">₹ 82,000</h2>
              </div>
           </Card>
           <Card className="bg-black p-8 rounded-[40px] shadow-2xl space-y-4 border border-white/5">
              <div className="w-12 h-12 bg-white/10 text-emerald-400 rounded-2xl flex items-center justify-center">
                 <CreditCard size={24} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">System Balance</p>
                 <h2 className="text-3xl font-black italic uppercase italic text-white leading-none">₹ 42,000</h2>
              </div>
           </Card>
        </div>

        <div className="space-y-4">
           <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] font-mono px-4 leading-none">Recent Activity</h3>
           <div className="space-y-3">
              {txs.map((tx, i) => (
                 <motion.div
                   key={tx.id}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.05 }}
                   className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/10 flex items-center justify-between group hover:border-blue-200 transition-all"
                 >
                    <div className="flex items-center gap-6">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-colors ${
                          tx.type === 'Inflow' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                       }`}>
                          {tx.type === 'Inflow' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                       </div>
                       <div className="space-y-1">
                          <h4 className="text-base font-black italic uppercase italic text-gray-900 leading-none">{tx.entity}</h4>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest font-mono">ID: {tx.id}</p>
                       </div>
                    </div>

                    <div className="flex items-center gap-12">
                       <div className="text-right">
                          <p className={`text-lg font-black italic uppercase italic ${tx.type === 'Inflow' ? 'text-emerald-600' : 'text-gray-900'}`}>
                             {tx.type === 'Inflow' ? '+' : '-'}{tx.amount}
                          </p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-mono">{tx.time}</p>
                       </div>
                       <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border ${
                          tx.status === 'Settled' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          tx.status === 'Pending' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          'bg-red-50 text-red-600 border-red-100'
                       }`}>
                          {tx.status}
                       </div>
                    </div>
                 </motion.div>
              ))}
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
