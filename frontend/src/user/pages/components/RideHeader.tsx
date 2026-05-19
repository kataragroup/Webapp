import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RideHeaderProps {
  id: string;
}

export const RideHeader = ({ id }: RideHeaderProps) => {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 inset-x-0 bg-[#0D1B1E]/80 backdrop-blur-3xl z-50 flex items-center justify-between p-6 border-b border-white/5 shadow-2xl">
      <button onClick={() => navigate(-1)} className="p-4 bg-white/5 border border-white/10 rounded-2xl active:scale-95 transition-all">
        <ChevronLeft size={24} />
      </button>
      <div className="text-right">
          <h1 className="text-2xl font-black italic uppercase underline underline-offset-8 decoration-[#00E054] tracking-tighter">Transit Sequence</h1>
          <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] leading-none mt-1 font-mono">ID: {id.slice(0, 12)}</p>
      </div>
    </header>
  );
};
