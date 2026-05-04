import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search } from 'lucide-react';
import { Logo } from '../../components/Logo';
import { authService } from '../../services/authService';
import { OTPVerification } from './components/OTPVerification';

export default function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);

  const handleSendOTP = async (e: any) => {
    e.preventDefault();
    if (!identifier) {
      setError('Email or Phone required.');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      await authService.sendLoginOTP(identifier);
      setOtpSent(true);
    } catch (err: any) {
      const msg = err.message || 'Failed to send OTP';
      setError(msg);
      if (msg.includes('Incorrect credentials')) {
        alert(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTPAndLogin = async () => {
    const otp = otpDigits.join('');
    if (otp.length < 4) {
      setError('Enter complete OTP.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const isValid = await authService.verifyOTP(identifier, otp);
      if (isValid) {
        const user = await authService.loginByEmailOrPhone(identifier);
        if (user.role === 'owner') navigate('/owner');
        else if (user.role === 'driver') navigate('/driver');
        else if (user.role === 'admin') navigate('/admin');
        else navigate('/user');
      } else {
        setError('Invalid OTP code.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white text-black p-6 relative overflow-hidden font-sans">
      <div className="w-full flex justify-center mb-4 pt-4">
        <Logo size="sm" />
      </div>

      <div className="flex-1 flex flex-col items-center gap-10 w-full max-w-sm relative z-20">
        <h1 className="text-3xl font-bold mt-10">Log In</h1>

        <form onSubmit={handleSendOTP} className="w-full space-y-8 mt-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-lg font-bold">Email or Phone</label>
              <div className="relative group">
                <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" />
                <input 
                  placeholder="Enter email or phone"
                  value={identifier}
                  disabled={otpSent}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (otpSent) setOtpSent(false);
                  }}
                  className="w-full h-14 bg-white border border-zinc-200 rounded-xl pl-12 pr-4 focus:border-blue-500 focus:ring-0 outline-none text-black font-medium transition-all disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {!otpSent ? (
            <button 
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-700 to-[#82D91E] text-white font-bold text-lg active:scale-[0.98] transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Send OTP'}
            </button>
          ) : (
             <div className="space-y-6">
                <p className="text-center text-sm font-bold text-[#00E054]">OTP sent to your device</p>
                <OTPVerification 
                  otpDigits={otpDigits}
                  onOtpChange={handleOtpChange}
                  onVerify={handleVerifyOTPAndLogin}
                  loading={loading}
                />
                <button 
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-center text-sm font-bold text-zinc-400 hover:text-black transition-colors"
                >
                  Change identifier
                </button>
             </div>
          )}

          <footer className="text-center pt-8">
            <p className="text-zinc-500 font-medium">
              New to GoYatari? <Link to="/signup" className="text-[#00E054] font-bold ml-1">Sign Up</Link>
            </p>
          </footer>
        </form>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 left-6 right-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center font-bold text-sm shadow-xl z-50"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
