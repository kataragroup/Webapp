import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Navigation } from 'lucide-react';

interface MapBackgroundProps {
  isLoaded: boolean;
  googleMapsKey: string;
  center: { lat: number; lng: number };
  nearbyDrivers: { id: string; pos: { lat: number; lng: number } }[];
  options: google.maps.MapOptions;
  containerStyle: React.CSSProperties;
}

export const MapBackground: React.FC<MapBackgroundProps> = ({
  isLoaded,
  googleMapsKey,
  center,
  nearbyDrivers,
  options,
  containerStyle,
}) => {
  if (!isLoaded || !googleMapsKey) {
    return (
      <div className="absolute inset-0 bg-[#0D1B1E] flex items-center justify-center p-6 text-center border-b border-white/5">
        <div className="space-y-4">
          <Navigation className="text-white/5 mx-auto animate-pulse" size={80} />
          <p className="text-white/20 font-black uppercase text-[10px] tracking-[0.3em] font-mono">Satellite Feed Offline</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      options={options}
    >
      <Marker
        position={center}
        icon={{
          url: 'https://cdn-icons-png.flaticon.com/512/7263/7263652.png',
          scaledSize: new window.google.maps.Size(40, 40),
        }}
      />
      {nearbyDrivers.map((driver) => (
        <Marker
          key={driver.id}
          position={driver.pos}
          icon={{
            url: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png',
            scaledSize: new window.google.maps.Size(32, 32),
          }}
        />
      ))}
    </GoogleMap>
  );
};
