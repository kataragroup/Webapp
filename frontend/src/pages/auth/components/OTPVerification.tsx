import { motion } from 'motion/react';

interface OTPVerificationProps {
  otpDigits: string[];
  onOtpChange: (index: number, value: string) => void;
  onVerify: () => void;
  loading: boolean;
}

export const OTPVerification = ({ otpDigits, onOtpChange, onVerify, loading }: OTPVerificationProps) => {
  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      className="space-y-4 pt-4"
    >
      <div className="flex items-center gap-4">
        <label className="text-lg font-bold text-zinc-400">OTP</label>
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <input 
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength={1}
              value={otpDigits[i]}
              onChange={(e) => onOtpChange(i, e.target.value)}
              className="w-12 h-12 border border-zinc-300 rounded-lg text-center font-bold text-xl focus:border-blue-500 outline-none"
            />
          ))}
        </div>
      </div>
      <button 
        type="button"
        disabled={loading}
        className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-700 to-[#82D91E] text-white font-bold text-lg active:scale-[0.98] transition-all shadow-lg"
        onClick={onVerify}
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>
    </motion.div>
  );
};
