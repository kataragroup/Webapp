import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/Card';
import { Users, Car } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Driver {
  name: string;
  rating: number;
  photo: string;
  vehicleNumber: string;
  vehicleModel: string;
}

interface Vehicle {
  id: string;
  type: string;
  price: number;
  eta: string;
  passengers: number;
  models: string;
  driver: Driver;
}

interface VehicleTypeSelectorProps {
  vehicles: Vehicle[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const VehicleTypeSelector: React.FC<VehicleTypeSelectorProps> = ({
  vehicles,
  selectedId,
  onSelect,
}) => {
  return (
    <div className="space-y-4">
      {vehicles.map((v) => (
        <motion.div
          key={v.id}
          onClick={() => onSelect(v.id)}
          whileTap={{ scale: 0.99 }}
          className={cn(
            "p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between",
            selectedId === v.id
              ? "border-white/40 bg-zinc-900 shadow-lg"
              : "border-white/5 bg-zinc-900/50 hover:bg-zinc-900"
          )}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center p-1">
               <img src="https://cdn-icons-png.flaticon.com/512/3202/3202926.png" className="w-full object-contain" alt="SUV" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xl font-bold text-white leading-tight">{v.type}</h4>
              <p className="text-xs text-white/40 font-medium font-sans">We will arrived in {v.eta}</p>
            </div>
          </div>

          <div className="text-right space-y-1">
            <p className="text-xl font-bold text-white">$ {v.price}</p>
            <div className="flex items-center justify-end gap-1 text-[#FF8A00]">
              <Users size={14} fill="currentColor" />
              <span className="text-sm font-bold">{v.passengers}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
