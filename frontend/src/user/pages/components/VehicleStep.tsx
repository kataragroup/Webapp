import { VehicleTypeSelector } from '../../../components/ride/VehicleTypeSelector';

interface VehicleStepProps {
  vehicles: any[];
  selectedId: string;
  onSelect: (id: string) => void;
  onContinue: (vehicle: any) => void;
}

export const VehicleStep = ({
  vehicles,
  selectedId,
  onSelect,
  onContinue
}: VehicleStepProps) => {
  const selectedVehicle = vehicles.find(v => v.id === selectedId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
         <h2 className="text-lg font-bold">Choose a trip</h2>
      </div>
      
      <div className="max-h-[35vh] overflow-y-auto no-scrollbar pb-24">
        <VehicleTypeSelector 
          vehicles={vehicles}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </div>

       <div className="absolute bottom-0 inset-x-0 p-6 bg-[#0D0D0D] border-t border-white/5">
          <div className="flex items-center justify-between gap-4">
             <div className="flex flex-col">
               <span className="text-xs text-white/40 font-medium">Total</span>
               <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">$ {selectedVehicle?.price}</span>
               </div>
               <div className="flex items-center gap-1.5 mt-1 border border-white/10 rounded-full px-2 py-0.5 bg-white/5 w-fit">
                  <img src="https://cdn-icons-png.flaticon.com/512/2331/2331714.png" className="w-4 h-4 object-contain" alt="Cash" />
                  <span className="text-[10px] font-bold">Cash</span>
               </div>
             </div>
             <button 
               onClick={() => onContinue(selectedVehicle)} 
               className="flex-1 max-w-[200px] h-14 rounded-full bg-[#FF8A00] text-black font-bold text-lg active:scale-95 transition-all"
             >
                Continue
             </button>
          </div>
       </div>
    </div>
  );
};
