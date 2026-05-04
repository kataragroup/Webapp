import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../../components/Logo';
import { authService } from '../../services/authService';
import { SignUpForm } from '../auth/components/SignUpForm';
import { OTPVerification } from '../auth/components/OTPVerification';
import { ChevronLeft } from 'lucide-react';

export default function DriverSignUp() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);

  const handleSendOTP = async (e: any) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Provide all partner credentials.');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      await authService.sendOTP(formData.phone, formData.email);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || 'Verification relay failed.');
      setOtpSent(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (otpSent) {
      setOtpSent(false);
      setOtpDigits(['', '', '', '']);
    }
  };

  const handleVerifyOTP = async () => {
    const otp = otpDigits.join('');
    if (otp.length < 4) {
      setError('Incomplete authorization code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const isValid = await authService.verifyOTP(formData.phone, otp);
      if (isValid) {
        await authService.signupAfterVerification(
          formData.name,
          formData.email,
          formData.phone,
          'driver'
        );
        navigate('/driver');
      } else {
        setError('Authorization signature invalid.');
      }
    } catch (err: any) {
      setError(err.message || 'Nodal registration failed.');
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
    <div className="flex flex-col items-center h-screen bg-white text-black p-6 relative font-sans overflow-hidden">
      <div className="w-full flex justify-start mb-2">
        <button 
          onClick={() => navigate('/driver/login')}
          className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="w-full max-w-sm flex-1 flex flex-col items-center">
        <div className="text-center mb-8">
           <Logo size="sm" />
           <h1 className="text-3xl font-black italic uppercase mt-4">Partner Setup</h1>
           <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Driver Network Onboarding</p>
        </div>

        <SignUpForm 
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSendOTP}
          loading={loading}
          otpSent={otpSent}
        />

        {otpSent && (
          <OTPVerification 
            otpDigits={otpDigits}
            onOtpChange={handleOtpChange}
            onVerify={handleVerifyOTP}
            loading={loading}
          />
        )}

        {error && (
          <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center mt-6 italic">
            {error}
          </p>
        )}

        <footer className="text-center pt-8 pb-10">
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Already registered?</p>
            <button 
              onClick={() => navigate('/driver/login')}
              className="text-xs font-black text-blue-500 uppercase tracking-widest hover:underline italic"
            >
              Sign In to Portal
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
