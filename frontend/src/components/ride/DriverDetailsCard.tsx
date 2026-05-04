import React from 'react';
import { Card } from '../ui/Card';
import { Car } from 'lucide-react';

interface DriverDetails {
  name: string;
  rating: number;
  photo: string;
  vehicleModel: string;
  vehicleNumber: string;
}

interface DriverDetailsCardProps {
  vehicleType: string;
  paymentMethod: string;
  fare: number;
  driverDetails?: DriverDetails;
  pickupCode?: string;
}

export const DriverDetailsCard: React.FC<DriverDetailsCardProps> = ({
  vehicleType,
  paymentMethod,
  fare,
  driverDetails,
  pickupCode,
}) => {
  return (
    <Card className="p-8 border-white/5 bg-white/5 rounded-[48px] space-y-8 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="bg-[#152528] p-5 rounded-[28px] shadow-2xl border border-white/5 transition-transform hover:rotate-6">
            <Car size={36} className="text-[#00E054]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">{vehicleType}</h3>
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] font-mono">{paymentMethod} • SECURED</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-white/10 uppercase tracking-widest leading-none mb-1">Contract Sum</p>
          <span className="text-2xl font-black italic uppercase text-white/90">₹{fare}</span>
        </div>
      </div>

      {driverDetails && (
        <div className="pt-8 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <img
              src={driverDetails.photo}
              className="w-16 h-16 rounded-[24px] border border-white/10 shadow-2xl"
              alt="driver"
            />
            <div>
              <p className="text-[12px] font-black italic uppercase text-white">
                {driverDetails.name} <span className="text-orange-400 ml-1 font-mono">★ {driverDetails.rating}</span>
              </p>
              <p className="text-[10px] font-black text-white/20 uppercase mt-1 leading-none">{driverDetails.vehicleModel}</p>
              <div className="mt-3 bg-white/10 text-white/80 px-3 py-1.5 rounded-xl w-fit border border-white/5">
                <p className="text-[11px] font-black tracking-[0.2em] font-mono">{driverDetails.vehicleNumber}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-5 bg-[#0D1B1E] border border-white/10 rounded-[32px] shadow-2xl min-w-[90px] shadow-inner">
            <span className="text-[8px] font-black text-white/10 uppercase tracking-widest font-mono">Protocol ID</span>
            <span className="text-2xl font-black italic tracking-widest mt-1 text-[#00E054] animate-pulse">{pickupCode || '----'}</span>
          </div>
        </div>
      )}
    </Card>
  );
};
