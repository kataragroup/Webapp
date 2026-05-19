import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

export let db: any = null;
const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB() {
  if (MONGODB_URI) {
    try {
      const client = new MongoClient(MONGODB_URI);
      await client.connect();
      db = client.db("goyatree");
      console.log("✅ Connected to MongoDB");
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error);
    }
  }
}

// In-memory fallback
export const memoryStore = {
  rides: [
    {
      id: 'R12345',
      userId: '1',
      pickup: '3/53 Main road Block, M Vishwakarma park, New Delhi',
      drop: 'C206, Pandav Nagar, near Akshardham, Delhi',
      fare: 53.48,
      status: 'confirmed',
      date: '01 May 2026',
      time: '11:49 AM',
      vehicleType: 'SUV',
      pickupCode: '8820',
      driverDetails: {
        name: 'Rahul Sharma',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
        vehicleNumber: 'DL 2C B 5678',
        vehicleModel: 'Maruti Suzuki Dzire (White)',
        rating: 4.9
      }
    }
  ],
  kyc: {
    '2': { photo: 'verified', vehicle: 'verified', pan: 'verified', aadhaar: 'verified', isVerified: true }
  },
  users: [
    { id: '1', name: 'Prathama Verma', email: 'user@example.com', phone: '9876543210', role: 'user' },
    { id: '2', name: 'Rahul Sharma', email: 'driver@example.com', phone: '9999999999', role: 'driver', location: 'New Delhi', isVerified: true }
  ],
  otps: {} as Record<string, string>,
  payments: [],
  feedbacks: [],
  complaints: [],
  addresses: [],
  wallets: [
    { userId: '1', balance: 1000, updatedAt: new Date().toISOString() },
    { userId: '2', balance: 500, updatedAt: new Date().toISOString() }
  ],
  walletTransactions: [],
  driverPositions: [
    { id: '2', lat: 28.6139, lng: 77.2090, name: 'Rahul Sharma', rating: 4.8, vehicle: 'Maruti Suzuki Dzire', status: 'available' },
    { id: 'd2', lat: 28.6250, lng: 77.2200, name: 'Amit Kumar', rating: 4.9, vehicle: 'Hyundai Xcent', status: 'available' },
    { id: 'd3', lat: 28.6100, lng: 77.2300, name: 'Suresh Singh', rating: 4.7, vehicle: 'Toyota Etios', status: 'available' },
    { id: 'd4', lat: 28.6300, lng: 77.1900, name: 'Vikram Pal', rating: 4.6, vehicle: 'Honda Amaze', status: 'available' }
  ]
};
