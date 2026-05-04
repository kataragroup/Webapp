import React from 'react';
import { Card } from '../ui/Card';
import { Car } from 'lucide-react';

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  status: string;
  driver: string;
}

interface FleetMonitorProps {
  vehicles: Vehicle[];
}

export const FleetMonitor: React.FC<FleetMonitorProps> = ({ vehicles }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6 px-2">
        <h3 className="text-xl font-black italic uppercase underline underline-offset-8 decoration-blue-500">
          Fleet Monitor
        </h3>
        <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100">
          Live Feed
        </button>
      </div>
      <div className="space-y-4">
        {vehicles.map((v) => (
          <Card
            key={v.id}
            className="p-5 rounded-[32px] bg-zinc-50 border-zinc-100 hover:bg-white hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white border border-zinc-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <Car className="text-blue-500" size={28} />
                </div>
                <div>
                  <h4 className="font-black italic uppercase text-lg">{v.plate}</h4>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{v.model}</p>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-[9px] font-black uppercase tracking-[0.1em] px-4 py-1.5 rounded-full inline-block ${
                    v.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                  }`}
                >
                  {v.status}
                </div>
                <p className="text-[10px] text-zinc-400 mt-2 uppercase font-black tracking-tighter">
                  PILOT: {v.driver}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
