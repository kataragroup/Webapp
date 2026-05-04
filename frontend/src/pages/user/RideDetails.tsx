import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useMemo } from 'react';
import { Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { useJsApiLoader } from '@react-google-maps/api';
import { rideService } from '../../services/rideService';
import { Ride } from '../../types';
import { cn } from '../../lib/utils';
import { LiveTrackingMap } from '../../components/ride/LiveTrackingMap';
import { DriverDetailsCard } from '../../components/ride/DriverDetailsCard';
import { RouteDetailsCard } from '../../components/ride/RouteDetailsCard';
import { RideHeader } from './components/RideHeader';
import { RideStatus } from './components/RideStatus';
import { RideActionButtons } from './components/RideActionButtons';

const LIBRARIES: any = ['places'];

const MAP_OPTIONS = {
  disableDefaultUI: true,
  zoomControl: false,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] }
  ],
};

export default function RideDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTracking, setIsTracking] = useState(true); // Default to tracking for ongoing ride
  const [driverPos, setDriverPos] = useState({ lat: 28.625, lng: 77.22 });
  const [eta, setEta] = useState(12);
  const [displayStatus, setDisplayStatus] = useState('Driver on the way');
  const [mapError, setMapError] = useState(false);

  const userPos = useMemo(() => ({ lat: 28.6139, lng: 77.2090 }), []);

  const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsKey,
    libraries: LIBRARIES
  });

  useEffect(() => {
    if (id) {
       const fetchRide = async () => {
         const data = await rideService.getRideById(id);
         if (data) setRide(data);
         setLoading(false);
       };
       
       fetchRide();
       const interval = setInterval(fetchRide, 5000);
       return () => clearInterval(interval);
    }
  }, [id]);

  useEffect(() => {
    let moveTimer: any;
    let completionTimer: any;

    if (isTracking && ride && ride.status !== 'completed') {
      setDisplayStatus('Driver on the way');
      
      const startTimer = setTimeout(async () => {
        if (id && ride.status === 'pending') {
          await rideService.updateStatus(id, 'confirmed');
          setDisplayStatus('Pilot Matching Confirmed');
        } else if (id && ride.status === 'confirmed') {
          await rideService.updateStatus(id, 'ongoing');
          setDisplayStatus('Ride in Progress');
        }
      }, 3000); 

      completionTimer = setTimeout(() => {
        setDisplayStatus('Reached Destination');
        handleCompleteRide();
      }, 10000); 

      moveTimer = setInterval(() => {
        setDriverPos(prev => {
          const distLat = Math.abs(userPos.lat - prev.lat);
          const distLng = Math.abs(userPos.lng - prev.lng);
          const totalDist = distLat + distLng;

          if (totalDist < 0.002) {
             setDisplayStatus('Arriving Now');
          } else if (totalDist < 0.005) {
             setDisplayStatus('Nearly There');
          }

          const dLat = (userPos.lat - prev.lat) * 0.2;
          const dLng = (userPos.lng - prev.lng) * 0.2;
          
          const newLat = prev.lat + dLat;
          const newLng = prev.lng + dLng;

          if (Math.abs(newLat - userPos.lat) < 0.0005 && Math.abs(newLng - userPos.lng) < 0.0005) {
            handleCompleteRide();
            clearInterval(moveTimer);
            if (completionTimer) clearTimeout(completionTimer);
            return userPos;
          }

          setEta(prevEta => Math.max(1, prevEta - 2));
          return { lat: newLat, lng: newLng };
        });
      }, 1000);
    }
    return () => {
      clearInterval(moveTimer);
      if (completionTimer) clearTimeout(completionTimer);
    };
  }, [isTracking, ride?.status, userPos]);

  useEffect(() => {
    if (isTracking && !isLoaded) {
      const timer = setTimeout(() => {
        if (!isLoaded) setMapError(true);
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [isTracking, isLoaded]);

  const handleTrackRide = () => {
    setIsTracking(true);
    setEta(12);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteRide = async () => {
    if (id) {
      await rideService.completeRide(id);
      const data = await rideService.getRideById(id);
      if (data) setRide(data);
      setIsTracking(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0D1B1E] flex flex-col items-center justify-center p-8 text-center italic text-white">
    <div className="w-16 h-16 border-4 border-white/5 border-t-[#00E054] rounded-full animate-spin mb-4" />
    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Synchronizing Signals...</p>
  </div>;
  
  if (!ride) return <div className="min-h-screen bg-[#0D1B1E] flex items-center justify-center font-black uppercase italic text-white underline decoration-red-500 underline-offset-8">Protocol Error: Node Not Found</div>;

  return (
    <div className="min-h-screen bg-[#0D1B1E] text-white pb-32 font-sans overflow-hidden">
      <RideHeader id={id || ''} />

      <div className="container max-w-[500px] md:max-w-5xl mx-auto px-6 pt-32 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-10">
            <AnimatePresence mode="wait">
              {isTracking && ride.status !== 'completed' && (
                <motion.div 
                  key="tracking-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="relative rounded-[48px] overflow-hidden border border-white/10 shadow-2xl h-[400px]"
                >
                  <LiveTrackingMap 
                    isLoaded={isLoaded}
                    driverPos={driverPos}
                    userPos={userPos}
                    eta={eta}
                    displayStatus={displayStatus}
                    mapOptions={{
                      ...MAP_OPTIONS,
                      styles: [
                        { elementType: 'geometry', stylers: [{ color: '#0D1B1E' }] },
                        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
                        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
                        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
                        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
                      ]
                    }}
                    mapError={mapError}
                    onClose={() => setIsTracking(false)}
                    theme="dark"
                  />
                  <div className="absolute top-6 inset-x-0 flex justify-center z-10 pointer-events-none">
                    <div className="px-6 py-2.5 bg-emerald-500 text-black border border-emerald-400 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_10px_30px_rgba(0,224,84,0.3)] italic">
                        Arriving in {eta}m
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {ride.status === 'completed' && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/5 border border-white/10 p-10 rounded-[48px] text-center space-y-8 shadow-2xl backdrop-blur-xl"
              >
                  <div className="w-24 h-24 bg-[#00E054]/10 text-[#00E054] rounded-[40px] flex items-center justify-center mx-auto shadow-2xl shadow-[#00E054]/10">
                    <CheckCircle2 size={48} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black italic uppercase text-white/90">Destination Node Reached</h3>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] leading-relaxed font-mono">Mission Parameters Completed. Please certify Pilot performance.</p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/user/feedback')} 
                    className="w-full h-16 rounded-[28px] bg-[#00E054] text-black font-black italic uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(0,224,84,0.3)] active:scale-95 transition-all text-[10px]"
                  >
                    Certify Performance
                  </motion.button>
              </motion.div>
            )}
          </div>

          <div className="space-y-10">
            <RideStatus status={ride.status} />

            <DriverDetailsCard 
              vehicleType={ride.vehicleType}
              paymentMethod={ride.paymentMethod}
              fare={ride.fare}
              driverDetails={ride.driverDetails as any}
              pickupCode={ride.pickupCode}
              theme="dark"
            />

            <RouteDetailsCard 
              pickup={ride.pickup}
              drop={ride.drop}
              theme="dark"
            />
          </div>
        </div>

        <RideActionButtons 
          status={ride.status} 
          isTracking={isTracking} 
          onTrack={handleTrackRide} 
        />
      </div>
    </div>
  );
}
