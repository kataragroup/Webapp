import { LocationSelector } from '../../../components/ride/LocationSelector';

interface LocationStepProps {
  pickup: string;
  drop: string;
  pickupSuggestions: any[];
  dropSuggestions: any[];
  showLocationList: boolean;
  locations: any[];
  onPickupChange: (val: string) => void;
  onDropChange: (val: string) => void;
  onSelect: (loc: string, type: 'pickup' | 'drop') => void;
  onContinue: () => void;
  onFocusDrop: () => void;
  onClearPickup: () => void;
}

export const LocationStep = ({
  pickup,
  drop,
  pickupSuggestions,
  dropSuggestions,
  showLocationList,
  locations,
  onPickupChange,
  onDropChange,
  onSelect,
  onContinue,
  onFocusDrop,
  onClearPickup
}: LocationStepProps) => {
  return (
    <div className="space-y-10 pb-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter underline underline-offset-8 decoration-[#00E054]">
          Route Matrix
        </h2>
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] font-mono">Initializing Transit Nodes</p>
      </div>
      
      <LocationSelector 
         pickup={pickup}
         drop={drop}
         pickupSuggestions={pickupSuggestions}
         dropSuggestions={dropSuggestions}
         showLocationList={showLocationList}
         staticLocations={locations}
         onPickupChange={onPickupChange}
         onDropChange={onDropChange}
         onSelect={onSelect}
         onFocusDrop={onFocusDrop}
         onClearPickup={onClearPickup}
      />

      <div className="px-2">
        <button 
          onClick={onContinue} 
          disabled={!drop || !pickup} 
          className={`w-full h-20 rounded-[32px] font-black italic uppercase tracking-[0.2em] text-sm transition-all shadow-2xl relative overflow-hidden group
            ${(!drop || !pickup) 
              ? 'bg-white/5 text-white/10 border border-white/5 grayscale' 
              : 'bg-[#00E054] text-black shadow-[#00E054]/20 active:scale-[0.98]'
            }
          `}
        >
          {(!drop || !pickup) ? (
            <span className="relative z-10">Select Endpoints</span>
          ) : (
            <div className="relative z-10 flex items-center justify-center gap-4">
               <span>Authorize Transit</span>
               <div className="w-6 h-6 rounded-lg bg-black/10 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
               </div>
            </div>
          )}
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        </button>
      </div>
    </div>
  );
};
