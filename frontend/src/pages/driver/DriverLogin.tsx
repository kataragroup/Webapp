import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronLeft } from 'lucide-react';
import { Logo } from '../../components/Logo';
import { Input } from '../../components/ui/Input';
import { authService } from '../../services/authService';

export default function DriverLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Pilot credentials required.');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      await authService.login(email, password);
      navigate('/driver');
    } catch (err: any) {
      setError(err.message || 'Authentication Protocol Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.loginWithGoogle('driver');
      navigate('/driver');
    } catch (err: any) {
      setError(err.message || 'Google Auth Sequence Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white text-black p-8 relative overflow-hidden font-sans">
      <div className="w-full flex justify-start mb-4">
        <button 
          onClick={() => navigate('/welcome')}
          className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col items-center gap-8 w-full max-w-sm"
      >
        <Logo size="md" />
        <div className="text-center space-y-2">
            <h1 className="text-3xl font-black italic uppercase">Pilot Portal</h1>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Driver Partner Acquisition</p>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Input 
                type="email"
                icon={<Search size={20} className="text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />}
                placeholder="Partner Identity (Email)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-zinc-200 text-black h-16 rounded-[24px] pl-14 shadow-sm focus:ring-emerald-500/20 uppercase font-black text-[11px]"
              />
            </div>

            <div className="relative group">
              <Input 
                type="password"
                placeholder="Authorization Key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border-zinc-200 text-black h-16 rounded-[24px] px-8 shadow-sm focus:ring-emerald-500/20 font-black tracking-widest"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-16 rounded-[24px] bg-linear-to-r from-emerald-600 via-emerald-500 to-emerald-400 text-white font-black uppercase tracking-[0.2em] text-xs active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
          >
            {loading ? 'Synchronizing...' : 'Access Protocol'}
          </button>

          <div className="relative py-4 flex items-center gap-4">
            <div className="flex-1 border-t border-zinc-100"></div>
            <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Backup Entry</span>
            <div className="flex-1 border-t border-zinc-100"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-16 rounded-[24px] border border-zinc-200 text-black flex items-center justify-center gap-4 hover:bg-zinc-50 active:scale-95 transition-all bg-white font-black uppercase text-[10px] tracking-widest"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5 rounded-full" alt="Google" />
            Partner Node Sync
          </button>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[10px] font-black uppercase text-center tracking-widest italic">
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="text-center pt-6 pb-4">
            <div className="flex flex-col items-center gap-2">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Not registered yet?</p>
              <button 
                onClick={() => navigate('/driver/signup')}
                className="text-xs font-black text-emerald-500 uppercase tracking-widest hover:underline italic"
              >
                Create Driver Account
              </button>
            </div>
          </footer>
        </form>
      </motion.div>
    </div>
  );
}
