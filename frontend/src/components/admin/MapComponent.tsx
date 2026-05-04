import React from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 28.6139,
  lng: 77.2090
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#f5f5f5" }]
    },
    {
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#616161" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#f5f5f5" }]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#bdbdbd" }]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [{ "color": "#eeeeee" }]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#757575" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [{ "color": "#e5e5e5" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#ffffff" }]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#757575" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{ "color": "#dadada" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#616161" }]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#9e9e9e" }]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [{ "color": "#e5e5e5" }]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [{ "color": "#eeeeee" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#c9c9c9" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#9e9e9e" }]
    }
  ]
};

const markers = [
  { lat: 28.6139, lng: 77.2090 },
  { lat: 28.6239, lng: 77.2190 },
  { lat: 28.6039, lng: 77.1990 },
];

export default function MapComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
  });

  const [map, setMap] = React.useState<google.maps.Map | null>(null);

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={mapOptions}
    >
      {markers.map((pos, idx) => (
        <MarkerF key={idx} position={pos} />
      ))}
    </GoogleMap>
  ) : (
    <div className="w-full h-full bg-zinc-100 animate-pulse flex items-center justify-center text-zinc-400 font-black uppercase text-xs">
      Initializing Map System...
    </div>
  );
}
