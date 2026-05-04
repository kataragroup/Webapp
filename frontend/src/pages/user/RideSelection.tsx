import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useJsApiLoader } from '@react-google-maps/api';
import { MapBackground } from '../../components/ride/MapBackground';
import { LocationStep } from './components/LocationStep';
import { VehicleStep } from './components/VehicleStep';

const LIBRARIES: any = ['places'];

const VEHICLES = [
  { 
    id: '1', 
    type: 'Go Silver', 
    price: 120.00, 
    eta: '2 mins', 
    passengers: 4, 
    models: 'Wagon R, S-Presso',
    category: 'city',
    driver: {
      name: 'Amit Kumar',
      rating: 4.8,
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
      vehicleNumber: 'DL 1C A 1234',
      vehicleModel: 'Maruti Suzuki Wagon R (Silver)'
    }
  },
  { 
    id: '2', 
    type: 'Go Gold', 
    price: 185.00, 
    eta: '5 mins', 
    passengers: 4, 
    models: 'Maruti Dzire, Hyundai Aura',
    category: 'city',
    driver: {
      name: 'Rahul Verma',
      rating: 4.9,
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
      vehicleNumber: 'DL 2C B 5678',
      vehicleModel: 'Maruti Suzuki Dzire (White)'
    }
  },
  { 
    id: '3', 
    type: 'Go Diamond', 
    price: 450.00, 
    eta: '8 mins', 
    passengers: 4, 
    models: 'BMW, Mercedes, Audi',
    category: 'city',
    driver: {
      name: 'Vikram Singh',
      rating: 5.0,
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
      vehicleNumber: 'DL 1C S 0001',
      vehicleModel: 'BMW 3 Series (Black)'
    }
  },
  { 
    id: '4', 
    type: 'Go SUV', 
    price: 280.00, 
    eta: '6 mins', 
    passengers: 6, 
    models: 'Ertiga, Kia Carens',
    category: 'city',
    driver: {
      name: 'Suresh Raina',
      rating: 4.7,
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh',
      vehicleNumber: 'DL 2C X 9922',
      vehicleModel: 'Maruti Ertiga (Grey)'
    }
  },
  { 
    id: '5', 
    type: 'Half Day Rental', 
    price: 1200.00, 
    eta: '10 mins', 
    passengers: 4, 
    models: 'Sedan/SUV (4 Hours)',
    category: 'rental',
    driver: {
      name: 'Mahesh Babu',
      rating: 4.9,
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mahesh',
      vehicleNumber: 'DL 3C AB 9988',
      vehicleModel: 'Hyundai Creta'
    }
  },
  { 
    id: '6', 
    type: 'Full Day Rental', 
    price: 2200.00, 
    eta: '10 mins', 
    passengers: 4, 
    models: 'Sedan/SUV (8 Hours)',
    category: 'rental',
    driver: {
      name: 'Rajesh Khanna',
      rating: 4.8,
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
      vehicleNumber: 'DL 9C XY 1122',
      vehicleModel: 'Toyota Innova'
    }
  },
];

const NEARBY_DRIVERS = [
  { id: 'd1', pos: { lat: 28.615, lng: 77.210 } },
  { id: 'd2', pos: { lat: 28.610, lng: 77.205 } },
  { id: 'd3', pos: { lat: 28.618, lng: 77.215 } },
  { id: 'd4', pos: { lat: 28.612, lng: 77.220 } },
];

const MAP_CENTER = { lat: 28.6139, lng: 77.2090 }; // New Delhi
const MAP_OPTIONS = {
  disableDefaultUI: true,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] }
  ],
};

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' };

export default function RideSelection() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('1');
  const [activeCategory, setActiveCategory] = useState<'city' | 'rental'>('city');
  const [step, setStep] = useState(0); 
  const [pickup, setPickup] = useState('Current Location');
  const [drop, setDrop] = useState('');
  const [showLocationList, setShowLocationList] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);

  const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsKey,
    libraries: LIBRARIES
  });

  const locations = [
    { name: 'Terminal 3', address: 'Indira Gandhi International Airport', icon: 'plane' },
    { name: 'Cannaught Place', address: 'Central Delhi, Delhi', icon: 'map-pin' },
    { name: 'Select Citywalk', address: 'Saket District Centre, Sector 6, Delhi', icon: 'shopping-bag' },
    { name: 'DLF Cyber City', address: 'Building No. 10, Tower B, Gurugram', icon: 'briefcase' },
  ];

  const fetchSuggestions = useCallback((query: string, type: 'pickup' | 'drop') => {
    if (!query) {
      if (type === 'pickup') setPickupSuggestions([]);
      else setDropSuggestions([]);
      return;
    }

    if (isLoaded && window.google) {
      const autocompleteService = new window.google.maps.places.AutocompleteService();
      autocompleteService.getPlacePredictions(
        { 
          input: query,
          componentRestrictions: { country: 'IN' },
          types: ['geocode', 'establishment']
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            const formatted = predictions.map(p => ({
              place_id: p.place_id,
              description: p.description,
              structured_formatting: {
                main_text: p.structured_formatting.main_text,
                secondary_text: p.structured_formatting.secondary_text
              }
            }));
            if (type === 'pickup') setPickupSuggestions(formatted as any);
            else setDropSuggestions(formatted as any);
          }
        }
      );
    } else {
      // Fallback
      const filtered = locations.filter(loc => 
        loc.name.toLowerCase().includes(query.toLowerCase()) || 
        loc.address.toLowerCase().includes(query.toLowerCase())
      ).map((loc, i) => ({
        place_id: `place-${i}`,
        description: loc.name,
        structured_formatting: {
          main_text: loc.name,
          secondary_text: loc.address
        }
      }));
      
      if (type === 'pickup') setPickupSuggestions(filtered as any);
      else setDropSuggestions(filtered as any);
    }
  }, [isLoaded]);

  const filteredVehicles = useMemo(() => 
    VEHICLES.filter(v => v.category === activeCategory),
    [activeCategory]
  );

  const selectedVehicle = VEHICLES.find(v => v.id === selected);

  useEffect(() => {
     // Ensure selection is valid for category
     if (selectedVehicle?.category !== activeCategory) {
        setSelected(filteredVehicles[0]?.id || '1');
     }
  }, [activeCategory, filteredVehicles, selectedVehicle]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white relative font-sans overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[60vh] bg-zinc-900 overflow-hidden">
        <MapBackground 
          isLoaded={isLoaded}
          googleMapsKey={googleMapsKey}
          center={MAP_CENTER}
          nearbyDrivers={NEARBY_DRIVERS}
          options={{
            ...MAP_OPTIONS,
            styles: [
              { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
              { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
              { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
              { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
              { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
            ]
          }}
          containerStyle={MAP_CONTAINER_STYLE}
        />
        
        {/* Map Bottom Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0D0D0D] to-transparent z-[5]"></div>

        <div className="absolute top-10 left-6 z-10">
          <button 
            onClick={() => {
              if (step > 0) setStep(step - 1);
              else navigate(-1);
            }}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-black hover:bg-zinc-100 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20">
        <motion.div 
           initial={{ y: 200, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="bg-[#0D0D0D] rounded-t-[32px] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] p-6 pt-2 overflow-hidden"
        >
          <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6"></div>

          {step === 0 ? (
            <LocationStep 
              pickup={pickup}
              drop={drop}
              pickupSuggestions={pickupSuggestions}
              dropSuggestions={dropSuggestions}
              showLocationList={showLocationList}
              locations={locations}
              onPickupChange={(val) => {
                setPickup(val);
                fetchSuggestions(val, 'pickup');
              }}
              onDropChange={(val) => {
                setDrop(val);
                fetchSuggestions(val, 'drop');
                setShowLocationList(true);
              }}
              onSelect={(loc, type) => {
                if (type === 'drop') {
                  setDrop(loc);
                  setShowLocationList(false);
                  setDropSuggestions([]);
                } else {
                  setPickup(loc);
                  setPickupSuggestions([]);
                }
              }}
              onContinue={() => setStep(1)}
              onFocusDrop={() => setShowLocationList(true)}
              onClearPickup={() => setPickup('')}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex bg-white/5 p-1 rounded-2xl gap-1">
                 <button 
                  onClick={() => setActiveCategory('city')}
                  className={`flex-1 h-10 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeCategory === 'city' ? 'bg-white text-black shadow-lg' : 'text-white/40'}`}
                 >
                   City Rides
                 </button>
                 <button 
                  onClick={() => setActiveCategory('rental')}
                  className={`flex-1 h-10 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeCategory === 'rental' ? 'bg-white text-black shadow-lg' : 'text-white/40'}`}
                 >
                   Rentals
                 </button>
              </div>

              <VehicleStep 
                vehicles={filteredVehicles}
                selectedId={selected}
                onSelect={setSelected}
                onContinue={(selectedVehicle) => {
                  navigate('/user/payment', { 
                    state: { 
                      vehicleType: selectedVehicle?.type,
                      fare: selectedVehicle?.price,
                      pickup: pickup,
                      drop: drop,
                      category: selectedVehicle?.category,
                      driver: selectedVehicle?.driver
                    } 
                  });
                }}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

