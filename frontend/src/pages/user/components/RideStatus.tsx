import { cn } from '../../../lib/utils';

interface RideStatusProps {
  status: string;
}

export const RideStatus = ({ status }: RideStatusProps) => {
  return (
    <div className="flex justify-between items-center px-4">
      <span className="text-white/20 font-black uppercase text-[10px] tracking-[0.5em]">Global Status</span>
      <span className={cn(
        "px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.3em] inline-flex items-center gap-3 border shadow-2xl",
        status === 'completed' ? "bg-[#00E054]/10 text-[#00E054] border-[#00E054]/20" : (status === 'ongoing' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-white/5 text-white/20 border-white/5")
      )}>
        <div className={cn("w-2 h-2 rounded-full", status === 'completed' ? "bg-[#00E054] shadow-[0_0_10px_#00E054]" : (status === 'ongoing' ? "bg-blue-400 animate-pulse shadow-[0_0_10px_#3b82f6]" : "bg-white/10"))} />
        {status}
      </span>
    </div>
  );
};
