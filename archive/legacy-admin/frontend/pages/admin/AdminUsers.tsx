import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, MoreVertical, Mail, Phone, MapPin, 
  Edit2, Trash2, X, CheckCircle2, Layout, User as UserIcon,
  Shield, ExternalLink
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  collection, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as User[];
      setUsers(usersData);
      setIsLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user? This action is non-destructive (soft-delete recommended in production, but here we perform actual delete for demo).')) {
      try {
        await deleteDoc(doc(db, 'users', id));
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      try {
        const userRef = doc(db, 'users', editingUser.id);
        const { id, ...updateData } = editingUser;
        await updateDoc(userRef, updateData);
        setEditingUser(null);
      } catch (err) {
        alert('Failed to update user');
      }
    }
  };

  const viewDashboard = (user: User) => {
    authService.impersonate(user);
    navigate('/');
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Users">
      <div className="space-y-6 lg:space-y-8">
        <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-[#0A1128] tracking-tight italic">User Ecosystem</h2>
            <p className="text-zinc-400 font-bold mt-1 text-xs lg:text-sm italic">Manage passengers, account statuses and ride statistics.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
             <div className="relative flex-1 sm:w-64">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  placeholder="Find user..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold outline-none focus:ring-1 focus:ring-blue-400 shadow-sm transition-all"
                />
             </div>
             <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-black text-gray-600 hover:bg-gray-50 transition-all shadow-sm uppercase tracking-widest italic shrink-0">
                <Filter size={16} />
                Filters
             </button>
          </div>
        </div>

        <Card className="p-0 overflow-hidden border-gray-100 bg-white shadow-xl shadow-gray-200/20 rounded-2xl lg:rounded-[32px]">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Passenger Identity</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Contact Matrix</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Primary Zone</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic text-center">Rides</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Status</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={user.id || `row-${i}`} 
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500 flex shrink-0 items-center justify-center text-white font-black italic shadow-lg shadow-blue-500/10">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 italic tracking-tight">{user.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">UID-{user.id}092-ALPHA</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 italic">
                          <Mail size={14} className="text-blue-400" /> {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 italic">
                          <Phone size={14} className="text-emerald-400" /> {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-700 italic">
                        <MapPin size={16} className="text-gray-400" />
                        {user.location}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-base font-black text-gray-900 italic font-mono">{user.rides}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2 w-fit ${
                        user.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => viewDashboard(user)}
                          className="p-2.5 bg-zinc-50 text-zinc-600 rounded-xl hover:bg-black hover:text-white transition-all shadow-sm"
                          title="View Dashboard"
                        >
                           <ExternalLink size={16} />
                        </button>
                        <button 
                          onClick={() => setEditingUser(user)}
                          className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          title="Edit User"
                        >
                           <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Delete User"
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

        {/* Edit Modal */}
        <AnimatePresence>
          {editingUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-24 bg-gray-900/40 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl overflow-hidden border border-gray-100"
              >
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                   <div>
                      <h3 className="text-xl font-black text-gray-900 italic tracking-tight">Edit Passenger Data</h3>
                      <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-widest italic font-serif">Modifying UID-{editingUser.id}092</p>
                   </div>
                   <button onClick={() => setEditingUser(null)} className="p-3 hover:bg-white rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-sm">
                      <X size={20} />
                   </button>
                </div>
                
                <form onSubmit={handleUpdate} className="p-8 space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Full Name</label>
                         <input 
                           type="text"
                           value={editingUser.name}
                           onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                           className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 text-sm font-bold italic focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Account Status</label>
                         <select 
                           value={editingUser.status}
                           onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                           className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 text-sm font-bold italic focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                         >
                            <option value="Active">Active</option>
                            <option value="Suspended">Suspended</option>
                            <option value="Banned">Banned</option>
                         </select>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Email Address Intelligence</label>
                      <input 
                         type="email"
                         value={editingUser.email}
                         onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 text-sm font-bold italic focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Phonetic Data</label>
                         <input 
                           type="text"
                           value={editingUser.phone}
                           onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                           className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 text-sm font-bold italic focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Operating Zone</label>
                         <input 
                           type="text"
                           value={editingUser.location}
                           onChange={(e) => setEditingUser({...editingUser, location: e.target.value})}
                           className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 text-sm font-bold italic focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                         />
                      </div>
                   </div>

                   <div className="pt-4 flex gap-4">
                      <Button type="button" onClick={() => setEditingUser(null)} variant="secondary" className="flex-1 h-14 rounded-2xl font-black italic shadow-xs">Cancel Changes</Button>
                      <Button type="submit" variant="primary" className="flex-1 h-14 rounded-2xl font-black italic shadow-lg shadow-blue-500/20">
                         Save Synchronization
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
