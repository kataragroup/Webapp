import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { Card } from '../ui/Card';
import { Car, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Driver {
  id: string;
  lat: number;
  lng: number;
  name: string;
  rating: number;
  vehicle: string;
}

interface LiveDriverRadarProps {
  isLoaded: boolean;
  drivers: Driver[];
  center: { lat: number; lng: number };
  mapOptions: google.maps.MapOptions;
}

export const LiveDriverRadar: React.FC<LiveDriverRadarProps> = ({
  isLoaded,
  drivers,
  center,
  mapOptions,
}) => {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-black italic tracking-tight flex items-center gap-2 uppercase">
          <div className="w-2 h-2 rounded-full bg-[#00E054] animate-ping" />
          Pilot Proximity
        </h2>
        <span className="text-[10px] font-black text-[#00E054] bg-[#00E054]/10 border border-[#00E054]/20 px-3 py-1 rounded-full uppercase tracking-tighter">
          Active Trace
        </span>
      </div>

      <Card className="p-0 overflow-hidden border border-zinc-100 rounded-[40px] shadow-2xl relative bg-zinc-50">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '250px' }}
            center={center}
            zoom={14}
            options={mapOptions}
          >
            {drivers.map((driver) => (
              <Marker
                key={driver.id}
                position={{ lat: driver.lat, lng: driver.lng }}
                onClick={() => setSelectedDriver(driver)}
              />
            ))}

            {selectedDriver && (
              <InfoWindow
                position={{ lat: selectedDriver.lat, lng: selectedDriver.lng }}
                onCloseClick={() => setSelectedDriver(null)}
              >
                <div className="p-2 text-black min-w-[150px] bg-white rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-black italic uppercase tracking-tighter">{selectedDriver.name}</p>
                    <div className="flex items-center gap-1 text-orange-500">
                      <Star size={10} fill="currentColor" />
                      <span className="text-[10px] font-bold">{selectedDriver.rating}</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">{selectedDriver.vehicle}</p>
                  <button
                    onClick={() => navigate('/user/select')}
                    className="w-full mt-3 py-2 bg-linear-to-r from-blue-600 to-emerald-500 text-white text-[10px] font-black uppercase rounded-lg shadow-lg"
                  >
                    Request Ride
                  </button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div className="w-full h-[250px] bg-zinc-50 flex items-center justify-center">
            <div className="text-center space-y-3">
              <Car size={32} className="text-zinc-300 animate-pulse mx-auto" />
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                Waking up Satellites...
              </p>
            </div>
          </div>
        )}

        <div className="absolute top-4 right-4 z-10">
          <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-zinc-100 flex items-center gap-3 shadow-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-tighter">
              {drivers.length} Partners Nearby
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
