import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Navigation, Clock, X } from 'lucide-react';
import { motion } from 'motion/react';

interface LiveTrackingMapProps {
  isLoaded: boolean;
  driverPos: { lat: number; lng: number };
  userPos: { lat: number; lng: number };
  eta: number;
  displayStatus: string;
  mapOptions: google.maps.MapOptions;
  mapError: boolean;
  onClose: () => void;
}

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  isLoaded,
  driverPos,
  userPos,
  eta,
  displayStatus,
  mapOptions,
  mapError,
  onClose,
}) => {
  return (
    <div className="relative h-full">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={driverPos}
          zoom={14}
          options={mapOptions}
        >
          <Marker
            position={userPos}
            icon={{
              url: 'https://cdn-icons-png.flaticon.com/512/7263/7263652.png',
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
          <Marker
            position={driverPos}
            icon={{
              url: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png',
              scaledSize: new window.google.maps.Size(46, 46),
            }}
          />
        </GoogleMap>
      ) : (
        <div className="w-full h-full bg-[#0D1B1E] border-b border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ffffff15_1px,_transparent_1px)] bg-[size:40px_40px] opacity-20" />
          <div className="relative z-10 flex flex-col items-center gap-6 text-center px-10">
            {mapError ? (
              <>
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[32px] flex items-center justify-center text-[#00E054] shadow-2xl backdrop-blur-xl">
                  <Navigation size={40} className="animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black uppercase tracking-tighter italic text-white/90">Position Locked</h4>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest font-mono">Active Signal from Node Alpha</p>
                </div>
              </>
            ) : (
              <>
                <Navigation className="text-white/10 animate-spin" size={60} />
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] font-mono">Syncing Payload...</p>
              </>
            )}
          </div>
        </div>
      )}

      <div className="absolute top-6 left-6 right-6 flex gap-3 pointer-events-none">
        <div className="bg-[#0D1B1E]/80 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10 flex items-center gap-2 shadow-2xl">
          <div className="w-2 h-2 bg-[#00E054] rounded-full animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] italic text-[#00E054]">Telemetry Live</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6 bg-[#0D1B1E]/90 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-6 rounded-[32px] flex items-center justify-between backdrop-blur-3xl">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-[#00E054] shadow-inner shrink-0 scale-90">
            <Navigation size={28} className="rotate-45" />
          </div>
          <div>
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">{displayStatus}</p>
            <p className="text-sm font-black italic uppercase italic text-white/90 leading-none">Vector Target Locked</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-4 bg-white/5 rounded-2xl text-white/20 hover:text-white transition-colors border border-white/10"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};
