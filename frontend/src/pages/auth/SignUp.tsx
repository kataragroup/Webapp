import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../../components/Logo';
import { authService } from '../../services/authService';
import { SignUpForm } from './components/SignUpForm';
import { OTPVerification } from './components/OTPVerification';

export default function SignUp() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);

  const handleSendOTP = async (e: any) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Complete all parameters.');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      await authService.sendOTP(formData.phone, formData.email);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
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
      setError('Enter complete OTP.');
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
          'user'
        );
        navigate('/user');
      } else {
        setError('Invalid OTP code.');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
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
    <div className="flex flex-col items-center min-h-screen bg-white text-black p-6 relative font-sans overflow-hidden">
      <div className="w-full flex justify-center mb-4 pt-4">
        <Logo size="sm" />
      </div>

      <div className="w-full max-w-sm flex-1 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-10">Sign Up</h1>

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
          <p className="text-red-500 text-sm font-bold text-center mt-4">
            {error}
          </p>
        )}

        <footer className="text-center pt-8 pb-10">
          <p className="text-zinc-500 font-medium">
            Already have an account? <Link to="/login" className="text-[#00E054] font-bold ml-1">Log In</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
