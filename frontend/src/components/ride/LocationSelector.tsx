import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Navigation } from 'lucide-react';

interface Suggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface LocationSelectorProps {
  pickup: string;
  drop: string;
  pickupSuggestions: Suggestion[];
  dropSuggestions: Suggestion[];
  showLocationList: boolean;
  staticLocations: { name: string; address: string }[];
  onPickupChange: (val: string) => void;
  onDropChange: (val: string) => void;
  onSelect: (loc: string, type: 'pickup' | 'drop') => void;
  onFocusDrop: () => void;
  onClearPickup: () => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  pickup,
  drop,
  pickupSuggestions,
  dropSuggestions,
  showLocationList,
  staticLocations,
  onPickupChange,
  onDropChange,
  onSelect,
  onFocusDrop,
  onClearPickup,
}) => {
  return (
    <div className="space-y-6 relative mt-10 px-2">
      {/* Connecting Dotted Line */}
      <div className="absolute left-[31px] top-[48px] bottom-[48px] w-0 border-l-2 border-dashed border-[#00E054]/20 z-0"></div>

      {/* Pickup Input */}
      <div className="relative group z-10">
        <div className={`flex items-center gap-4 bg-white/5 backdrop-blur-3xl border ${pickup ? 'border-[#00E054]/30' : 'border-white/5'} group-hover:border-white/10 group-focus-within:border-[#00E054]/50 group-focus-within:bg-white/10 p-2 pr-4 rounded-[32px] shadow-2xl transition-all duration-500`}>
          <div className="w-12 h-12 flex items-center justify-center">
             <div className="relative">
               <div className={`w-8 h-8 rounded-full border-2 ${pickup ? 'border-[#00E054]' : 'border-[#00E054]/30'} flex items-center justify-center group-focus-within:scale-110 transition-all duration-500`}>
                 <div className={`w-2.5 h-2.5 ${pickup ? 'bg-[#00E054] shadow-[0_0_15px_#00E054]' : 'bg-[#00E054]/30'} rounded-full transition-all`}></div>
               </div>
               {/* Target crosshair lines */}
               <div className="absolute top-1/2 left-0 w-8 h-px -translate-y-1/2 bg-[#00E054]/30 group-focus-within:w-10 transition-all"></div>
               <div className="absolute top-0 left-1/2 w-px h-8 -translate-x-1/2 bg-[#00E054]/30 group-focus-within:h-10 transition-all"></div>
             </div>
          </div>
          <div className="flex-1">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20 ml-1 mb-0.5">Start Node</p>
            <input
              placeholder="Detecting sector..."
              className="bg-transparent border-none outline-none w-full text-white text-base font-black italic uppercase italic tracking-tight placeholder:text-white/10 placeholder:font-normal placeholder:not-italic"
              value={pickup}
              onChange={(e) => onPickupChange(e.target.value)}
            />
          </div>
          {pickup && (
            <button 
              onClick={onClearPickup}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <AnimatePresence>
          {pickupSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-4 bg-[#0D1B1E]/95 backdrop-blur-3xl border border-white/10 rounded-[32px] overflow-hidden z-[100] shadow-[0_32px_64px_rgba(0,0,0,0.8)]"
            >
              <div className="p-4 border-b border-white/5 bg-white/5">
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#00E054] animate-pulse">Relay Suggestions</p>
              </div>
              <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                {pickupSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    onClick={() => onSelect(suggestion.description, 'pickup')}
                    className="w-full p-6 text-left hover:bg-[#00E054]/10 transition-all border-b border-white/5 last:border-0 flex items-center gap-6 group/item"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/10 group-hover/item:text-[#00E054] group-hover/item:bg-[#00E054]/10 transition-all">
                       <MapPin size={22} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black italic uppercase tracking-tight text-white group-hover/item:text-[#00E054] transition-colors">
                        {suggestion.structured_formatting?.main_text}
                      </p>
                      <p className="text-[9px] font-bold text-white/30 truncate mt-1 uppercase tracking-[0.1em]">
                        {suggestion.structured_formatting?.secondary_text}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Drop Input */}
      <div className="relative group z-[5]">
        <div className={`flex items-center gap-4 bg-white/5 backdrop-blur-3xl border ${drop ? 'border-[#FF8A00]/30' : 'border-white/5'} group-hover:border-white/10 group-focus-within:border-[#FF8A00]/50 group-focus-within:bg-white/10 p-2 pr-4 rounded-[32px] shadow-2xl transition-all duration-500`}>
          <div className="w-12 h-12 flex items-center justify-center">
             <div className="relative">
               <div className={`w-8 h-8 rounded-full border-2 ${drop ? 'border-[#FF8A00]' : 'border-[#FF8A00]/30'} flex items-center justify-center group-focus-within:scale-110 transition-all duration-500`}>
                 <div className={`w-2.5 h-2.5 ${drop ? 'bg-[#FF8A00] shadow-[0_0_15px_#FF8A00]' : 'bg-[#FF8A00]/30'} rounded-full transition-all`}></div>
               </div>
               {/* Target crosshair lines */}
               <div className="absolute top-1/2 left-0 w-8 h-px -translate-y-1/2 bg-[#FF8A00]/30 group-focus-within:w-10 transition-all"></div>
               <div className="absolute top-0 left-1/2 w-px h-8 -translate-x-1/2 bg-[#FF8A00]/30 group-focus-within:h-10 transition-all"></div>
             </div>
          </div>
          <div className="flex-1">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20 ml-1 mb-0.5">Termination Node</p>
            <input
              placeholder="Enter destination..."
              className="bg-transparent border-none outline-none w-full text-white text-base font-black italic uppercase italic tracking-tight placeholder:text-white/10 placeholder:font-normal placeholder:not-italic"
              value={drop}
              onChange={(e) => onDropChange(e.target.value)}
              onFocus={onFocusDrop}
            />
          </div>
        </div>

        <AnimatePresence>
          {(showLocationList || dropSuggestions.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-4 bg-[#0D1B1E]/95 backdrop-blur-3xl border border-white/10 rounded-[32px] overflow-hidden z-[100] shadow-[0_32px_64px_rgba(0,0,0,0.8)]"
            >
              <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#FF8A00] animate-pulse">Endpoint Feed</p>
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">{dropSuggestions.length} Nodes Found</p>
              </div>
              <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                {drop.length < 3 &&
                  staticLocations.map((loc, idx) => (
                    <button
                      key={`static-${idx}`}
                      onClick={() => onSelect(loc.name, 'drop')}
                      className="w-full p-6 text-left hover:bg-[#FF8A00]/10 transition-all flex items-start gap-6 border-b border-white/5 last:border-0 group/item"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/10 group-hover/item:text-[#FF8A00] group-hover/item:bg-[#FF8A00]/10 transition-all">
                        <MapPin size={22} />
                      </div>
                      <div>
                        <p className="text-sm font-black italic uppercase tracking-tight text-white group-hover/item:text-[#FF8A00] transition-colors">{loc.name}</p>
                        <p className="text-[9px] font-bold text-white/30 uppercase mt-1 tracking-[0.1em]">{loc.address}</p>
                      </div>
                    </button>
                  ))}

                {dropSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    onClick={() => onSelect(suggestion.description, 'drop')}
                    className="w-full p-6 text-left hover:bg-[#FF8A00]/10 transition-all flex items-start gap-6 border-b border-white/5 last:border-0 group/item"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/10 group-hover/item:text-[#FF8A00] group-hover/item:bg-[#FF8A00]/10 transition-all">
                      <Navigation size={22} fill={suggestion.description ? "currentColor" : "none"} className="text-inherit" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black italic uppercase tracking-tight text-white group-hover/item:text-[#FF8A00] transition-colors">
                        {suggestion.structured_formatting?.main_text}
                      </p>
                      <p className="text-[9px] font-bold text-white/30 uppercase mt-1 tracking-[0.1em] truncate max-w-[240px]">
                        {suggestion.structured_formatting?.secondary_text}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
