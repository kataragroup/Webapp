import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';
import Welcome from './pages/auth/Welcome';
import SplashScreen from './pages/auth/SplashScreen';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import SessionExpired from './pages/auth/SessionExpired';
import UserDashboard from './user/pages/Dashboard';
import RideSelection from './user/pages/RideSelection';
import RideDetails from './user/pages/RideDetails';
import Payment from './user/pages/Payment';
import Wallet from './user/pages/Wallet';
import Feedback from './user/pages/Feedback';
import Profile from './user/pages/Profile';
import Settings from './user/pages/Settings';
import AddressBook from './user/pages/AddressBook';
import BookingConfirmation from './user/pages/BookingConfirmation';
import Complaint from './user/pages/Complaint';
import RideHistoryPage from './user/pages/RideHistory';
import DriverDashboard from './pages/driver/Dashboard';
import DriverWallet from './pages/driver/Wallet';
import KYCList from './pages/driver/KYCList';
import AadhaarUpload from './pages/driver/AadhaarUpload';
import PANUpload from './pages/driver/PANUpload';
import VehicleDetails from './pages/driver/VehicleDetails';
import PhotoUpload from './pages/driver/PhotoUpload';
import DriverBank from './pages/driver/Bank';
import DriverRatings from './pages/driver/Ratings';
import DriverSupport from './pages/driver/Support';
import DriverLogin from './pages/driver/DriverLogin';
import DriverSignUp from './pages/driver/DriverSignUp';
import OwnerLogin from './pages/owner/OwnerLogin';
import OwnerDashboard from './pages/owner/Dashboard';
import OwnerKYC from './pages/owner/KYC';
import OwnerVehicles from './pages/owner/Vehicles';

import { authService } from './services/authService';

// --- PROTECTED ROUTE COMPONENT ---
function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: 'user' | 'driver' | 'owner' }) {
  const user = authService.getCurrentUser();
  
  if (!user) {
    if (role === 'driver') return <Navigate to="/driver/login" replace />;
    if (role === 'owner') return <Navigate to="/owner/login" replace />;
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    if (user.role === 'driver') return <Navigate to="/driver" replace />;
    if (user.role === 'owner') return <Navigate to="/owner" replace />;
    return <Navigate to="/user" replace />;
  }

  return <>{children}</>;
}

// --- DYNAMIC DASHBOARD REDIRECTOR ---
function DashboardRedirect() {
  const user = authService.getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  
  if (user.role === 'driver') return <Navigate to="/driver" replace />;
  if (user.role === 'owner') return <Navigate to="/owner" replace />;
  return <Navigate to="/user" replace />;
}

// --- MOBILE CONTAINER WRAPPER ---
function MobileContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-[#050B0C] flex justify-center overflow-x-hidden overflow-y-auto">
      <div className="w-full bg-[#0D1B1E] relative min-h-screen shadow-2xl transition-all duration-300 overflow-x-hidden overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Global Dashboard Redirect */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Other apps in Mobile Container */}
        <Route path="*" element={
          <MobileContainer>
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/session-expired" element={<SessionExpired />} />
              <Route path="/driver/login" element={<DriverLogin />} />
              <Route path="/driver/signup" element={<DriverSignUp />} />
              <Route path="/owner/login" element={<OwnerLogin />} />

              <Route path="/user" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
              <Route path="/user/select" element={<ProtectedRoute role="user"><RideSelection /></ProtectedRoute>} />
              <Route path="/user/ride/:id" element={<ProtectedRoute role="user"><RideDetails /></ProtectedRoute>} />
              <Route path="/user/payment" element={<ProtectedRoute role="user"><Payment /></ProtectedRoute>} />
              <Route path="/user/feedback" element={<ProtectedRoute role="user"><Feedback /></ProtectedRoute>} />
              <Route path="/user/wallet" element={<ProtectedRoute role="user"><Wallet /></ProtectedRoute>} />
              <Route path="/user/history" element={<ProtectedRoute role="user"><RideHistoryPage /></ProtectedRoute>} />
              <Route path="/user/profile" element={<ProtectedRoute role="user"><Profile /></ProtectedRoute>} />
              <Route path="/user/settings" element={<ProtectedRoute role="user"><Settings /></ProtectedRoute>} />
              <Route path="/user/address-book" element={<ProtectedRoute role="user"><AddressBook /></ProtectedRoute>} />
              <Route path="/user/booking-confirmation" element={<ProtectedRoute role="user"><BookingConfirmation /></ProtectedRoute>} />
              <Route path="/user/complaints" element={<ProtectedRoute role="user"><Complaint /></ProtectedRoute>} />

              <Route path="/driver" element={<ProtectedRoute role="driver"><DriverDashboard /></ProtectedRoute>} />
              <Route path="/driver/kyc" element={<ProtectedRoute role="driver"><KYCList /></ProtectedRoute>} />
              <Route path="/driver/kyc/aadhaar" element={<ProtectedRoute role="driver"><AadhaarUpload /></ProtectedRoute>} />
              <Route path="/driver/kyc/pan" element={<ProtectedRoute role="driver"><PANUpload /></ProtectedRoute>} />
              <Route path="/driver/kyc/vehicle" element={<ProtectedRoute role="driver"><VehicleDetails /></ProtectedRoute>} />
              <Route path="/driver/kyc/photo" element={<ProtectedRoute role="driver"><PhotoUpload /></ProtectedRoute>} />
              <Route path="/driver/wallet" element={<ProtectedRoute role="driver"><DriverWallet /></ProtectedRoute>} />
              <Route path="/driver/bank" element={<ProtectedRoute role="driver"><DriverBank /></ProtectedRoute>} />
              <Route path="/driver/ratings" element={<ProtectedRoute role="driver"><DriverRatings /></ProtectedRoute>} />
              <Route path="/driver/support" element={<ProtectedRoute role="driver"><DriverSupport /></ProtectedRoute>} />

              <Route path="/owner" element={<ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute>} />
              <Route path="/owner/kyc" element={<ProtectedRoute role="owner"><OwnerKYC /></ProtectedRoute>} />
              <Route path="/owner/vehicles" element={<ProtectedRoute role="owner"><OwnerVehicles /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MobileContainer>
        } />
      </Routes>
    </Router>
  );
}
