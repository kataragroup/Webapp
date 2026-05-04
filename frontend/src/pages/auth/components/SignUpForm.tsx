import { Search } from 'lucide-react';

interface SignUpFormProps {
  formData: { name: string; email: string; phone: string };
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: any) => void;
  loading: boolean;
  otpSent: boolean;
}

export const SignUpForm = ({ formData, onInputChange, onSubmit, loading, otpSent }: SignUpFormProps) => {
  return (
    <form onSubmit={onSubmit} className="w-full space-y-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-lg font-bold">Full Name</label>
          <div className="relative group">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" />
            <input 
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              className="w-full h-14 bg-white border border-zinc-200 rounded-xl pl-12 pr-4 focus:border-blue-500 focus:ring-0 outline-none text-black font-medium transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-lg font-bold">Email</label>
          <div className="relative group">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" />
            <input 
              placeholder="Enter your email"
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              className="w-full h-14 bg-white border border-zinc-200 rounded-xl pl-12 pr-4 focus:border-blue-500 focus:ring-0 outline-none text-black font-medium transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-lg font-bold">Phone Number</label>
          <div className="relative group">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" />
            <input 
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
              className="w-full h-14 bg-white border border-zinc-200 rounded-xl pl-12 pr-4 focus:border-blue-500 focus:ring-0 outline-none text-black font-medium transition-all"
            />
          </div>
        </div>
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-700 to-[#82D91E] text-white font-bold text-lg active:scale-[0.98] transition-all shadow-lg mt-4 disabled:opacity-50"
      >
        {loading && !otpSent ? 'Processing...' : otpSent ? 'Resend OTP' : 'Send OTP'}
      </button>
    </form>
  );
};
