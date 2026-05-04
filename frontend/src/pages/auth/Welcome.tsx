import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Logo } from '../../components/Logo';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center h-screen bg-white text-black p-8 relative font-sans overflow-hidden">
      {/* Skip Button */}
      <div className="w-full flex justify-end relative z-10">
        <button 
          onClick={() => navigate('/login')}
          className="text-black font-medium text-sm flex items-center gap-1 hover:opacity-70 transition-opacity"
        >
          Skip <ChevronRight size={18} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12 w-full max-w-md relative z-10 pt-10">
        <Logo size="lg" />
        
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold leading-tight">Welcome To GoYatari</h1>
          <p className="text-zinc-600 text-sm font-medium leading-relaxed px-4">
            your reliable partner for swift and convenient ride. Experience hassle-free transportation at your fingertips.
          </p>
        </div>
      </div>

      <footer className="w-full flex flex-col items-center gap-6 pb-12 relative z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/signup')}
          className="relative w-20 h-20 flex items-center justify-center"
        >
          {/* Progress Ring Background */}
          <div className="absolute inset-0 rounded-full border-4 border-zinc-100"></div>
          {/* Progress Ring Arc (approx 25% for first step) */}
          <div className="absolute inset-0 rounded-full border-4 border-t-[#FF8A00] border-r-[#FF8A00] border-l-transparent border-b-transparent transform -rotate-45"></div>
          
          <div className="w-14 h-14 bg-[#FF8A00] rounded-full flex items-center justify-center shadow-lg">
            <ChevronRight size={24} className="text-white" />
          </div>
        </motion.button>
      </footer>
    </div>
  );
}
