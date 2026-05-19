import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, Mail, ChevronRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../services/authService';
import { Logo } from '../../components/Logo';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identity: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.identity || !formData.password) {
      setError('Terminal credentials required.');
      return;
    }
    
    setError('');
    setIsLoading(true);

    try {
      await authService.login(formData.identity, formData.password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-black p-6 relative overflow-hidden font-sans">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md border border-zinc-100 bg-zinc-50 rounded-[40px] p-10 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <Logo size="md" className="mb-6" />
          <h1 className="text-3xl font-black tracking-tight uppercase italic underline underline-offset-8 decoration-blue-500">Terminal</h1>
          <p className="text-zinc-400 font-black mt-6 text-center text-[10px] uppercase tracking-[0.3em] leading-none">Security Protocol Active</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">Terminal ID</label>
            <Input 
              icon={<Mail size={20} className="text-zinc-400" />}
              placeholder="admin@system.node"
              type="email"
              value={formData.identity}
              onChange={(e) => setFormData({ ...formData, identity: e.target.value })}
              className="bg-white border-zinc-200 rounded-2xl h-16 shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">Master Key</label>
            <Input 
              icon={<Lock size={20} className="text-zinc-400" />}
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="bg-white border-zinc-200 rounded-2xl h-16 shadow-sm"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />
          </div>

          {error && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-[10px] font-black uppercase tracking-widest"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          <button 
            className="w-full h-16 rounded-[24px] bg-black text-white font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all text-xs"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Unlock Node'}
          </button>
        </form>

        <p className="text-center text-zinc-400 text-[9px] font-black mt-10 uppercase tracking-[0.2em] leading-loose">
          Encrypted Session • Node 042-X • Monitoring Active
        </p>
      </motion.div>
    </div>
  );
}
