import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, MoreVertical, Star, ShieldCheck, 
  ShieldAlert, Edit2, Trash2, X, CheckCircle2,
  ExternalLink, Layout
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';

export default function AdminDrivers() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<User[]>([]);
  const [editingDriver, setEditingDriver] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'drivers'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const driversData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as User[];
      setDrivers(driversData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this driver partner?')) {
      try {
        await deleteDoc(doc(db, 'drivers', id));
      } catch (err) {
        alert('Failed to delete driver');
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDriver) {
      setIsUpdating(true);
      try {
        const driverRef = doc(db, 'drivers', editingDriver.id);
        const { id, ...updateData } = editingDriver;
        await updateDoc(driverRef, updateData);
        setEditingDriver(null);
      } catch (err) {
        console.error(err);
        alert('Error updating driver');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const viewDashboard = (driver: User) => {
    authService.impersonate(driver);
    navigate('/');
  };

  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Drivers">
      <div className="space-y-6 lg:space-y-8">
        <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-[#0A1128] tracking-tight italic">Partner Fleet</h2>
            <p className="text-zinc-400 font-bold mt-1 text-xs lg:text-sm italic">Manage high-performance partners and monitor vehicle compliance metrics.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
             <div className="relative flex-1 sm:w-64">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  placeholder="Find driver..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold outline-none focus:ring-1 focus:ring-blue-400 shadow-sm"
                />
             </div>
             <Button className="h-11 px-8 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 italic whitespace-nowrap">
               Onboard Partner
             </Button>
          </div>
        </div>

        <Card className="p-0 overflow-hidden border-gray-100 bg-white shadow-xl shadow-gray-200/20 rounded-2xl lg:rounded-[32px]">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Driver Partner</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Vehicle Profile</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Performance</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Compliance</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Presence</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredDrivers.map((driver, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={driver.id || `row-${i}`} 
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${driver.name}`} 
                          className="w-12 h-12 rounded-2xl bg-orange-500 border-2 border-white shadow-lg shadow-orange-500/10 object-cover" 
                          alt="pfp"
                        />
                        <div>
                          <p className="text-sm font-black text-gray-900 italic tracking-tight">{driver.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">ID: GO-D-{driver.id}77</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div>
                        <p className="text-sm text-gray-700 font-black italic">{driver.vehicle}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Asset Intelligence</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm font-black text-orange-500 italic">
                          <Star size={14} fill="currentColor" />
                          {driver.rating}
                        </div>
                        <p className="text-[10px] font-bold text-emerald-500 italic uppercase">{driver.earnings} Net</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border w-fit ${
                        driver.kyc === 'Verified' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-orange-50 border-orange-100 text-orange-600'
                      }`}>
                        {driver.kyc === 'Verified' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{driver.kyc}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${
                           driver.status === 'Online' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse' : 
                           driver.status === 'Suspended' ? 'bg-red-500' : 'bg-gray-300'
                         }`}></div>
                         <span className={cn(
                           "text-xs font-black uppercase tracking-tight",
                           driver.status === 'Suspended' ? 'text-red-500' : 'text-gray-700'
                         )}>{driver.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => viewDashboard(driver)}
                          className="p-2.5 bg-zinc-50 text-zinc-600 rounded-xl hover:bg-black hover:text-white transition-all shadow-sm"
                          title="View Driver Dashboard"
                        >
                           <ExternalLink size={16} />
                        </button>
                        <button 
                          onClick={() => setEditingDriver(driver)}
                          className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          title="Edit Driver"
                        >
                           <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(driver.id)}
                          className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Delete Driver"
                        >
                           <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Edit Driver Modal */}
        <AnimatePresence>
          {editingDriver && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-24 bg-gray-900/40 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl overflow-hidden border border-gray-100"
              >
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                   <div>
                      <h3 className="text-xl font-black text-gray-900 italic tracking-tight">Modify Partner Parameters</h3>
                      <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-widest italic">GO-D-{editingDriver.id}77</p>
                   </div>
                   <button onClick={() => setEditingDriver(null)} className="p-3 hover:bg-white rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-sm">
                      <X size={20} />
                   </button>
                </div>
                
                <form onSubmit={handleUpdate} className="p-8 space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Partner Name</label>
                         <input 
                           type="text"
                           value={editingDriver.name}
                           onChange={(e) => setEditingDriver({...editingDriver, name: e.target.value})}
                           className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 text-sm font-bold italic focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Live Binary Status</label>
                         <select 
                           value={editingDriver.status}
                           onChange={(e) => setEditingDriver({...editingDriver, status: e.target.value})}
                           className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 text-sm font-bold italic focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                         >
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                            <option value="Suspended">Suspended</option>
                         </select>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Asset Allocation (Vehicle)</label>
                      <input 
                         type="text"
                         value={editingDriver.vehicle}
                         onChange={(e) => setEditingDriver({...editingDriver, vehicle: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 text-sm font-bold italic focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Compliance State</label>
                         <select 
                           value={editingDriver.kyc}
                           onChange={(e) => setEditingDriver({...editingDriver, kyc: e.target.value})}
                           className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 text-sm font-bold italic focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                         >
                            <option value="Verified">Verified</option>
                            <option value="Pending">Pending</option>
                            <option value="Rejected">Rejected</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Financial Accumulation</label>
                         <input 
                           type="text"
                           value={editingDriver.earnings}
                           onChange={(e) => setEditingDriver({...editingDriver, earnings: e.target.value})}
                           className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 text-sm font-bold italic focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                         />
                      </div>
                   </div>

                   <div className="pt-4 flex gap-4">
                      <Button type="button" onClick={() => setEditingDriver(null)} variant="secondary" className="flex-1 h-14 rounded-2xl font-black italic shadow-xs" disabled={isUpdating}>Abort Operation</Button>
                      <Button type="submit" variant="primary" className="flex-1 h-14 rounded-2xl font-black italic shadow-lg shadow-blue-500/20" disabled={isUpdating}>
                         {isUpdating ? 'Committing...' : 'Commit Updates'}
                      </Button>
                   </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
