export interface User {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'driver' | 'owner';
  avatar?: string;
  location?: string;
  isVerified?: boolean;
  walletBalance?: number;
  status?: string;
  createdAt?: any;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface Driver extends User {
  vehicle?: {
    type: string;
    brand: string;
    model: string;
    plateNumber: string;
  };
  kycStatus: 'pending' | 'verified' | 'rejected' | 'none';
  earnings: number;
  walletBalance: number;
  rating: number;
  totalReviews: number;
  isOnline: boolean;
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    ifscCode: string;
  };
  stats: {
    new: number;
    ongoing: number;
    completed: number;
    rejected: number;
    cancelled: number;
  };
}

export interface Ride {
  id: string;
  userId: string;
  driverId?: string;
  pickupCode?: string;
  pickup: string;
  drop: string;
  fare: number;
  status: 'placed' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled';
  date: string;
  time: string;
  vehicleType: string;
  passengers?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  driverDetails?: {
    name: string;
    photo: string;
    vehicleNumber: string;
    vehicleModel: string;
    rating: number;
  };
}
