<<<<<<< HEAD
# GoYatree - Modern Ride-Sharing Platform

GoYatree is a full-stack, production-ready ride-sharing application designed for seamless transportation management. It provides a unified experience for passengers, drivers, and administrators.

---

## 🚀 Getting Started Locally

To run this project on your local machine using VS Code, follow these steps:

### Prerequisites
- **Node.js**: Ensure you have Node.js (v18 or higher) installed.
- **npm**: Standard Node package manager.

### Installation & Setup

1. **Download the Project**: Download the source code, extract it, and open the root folder in VS Code.
2. **Terminal Setup**: Open a new terminal in VS Code (Ctrl + `).
3. **Install Dependencies**: Run the following command to install all required packages:
   ```bash
   npm install
   ```
4. **Environment Variables**: Create a `.env` file in the root directory (refer to `.env.example`). You will need Firebase credentials if you are using your own backend.
5. **Start Development Server**: Run the following command to launch the app:
   ```bash
   npm run dev
   ```
6. **Access the App**: Open your browser and navigate to `http://localhost:3000`.

---

## 🏗️ Project Architecture & Structure

The project follows a modern monorepo-lite structure, with a Vite-powered React frontend and a lightweight Express backend.

### Full Directory Tree
```text
.
├── backend/                # Express server logic
│   └── server.ts           # Unified server entry point
├── frontend/               # React (Vite) Frontend
│   ├── src/
│   │   ├── components/     # UI Component Library
│   │   │   ├── admin/      # Admin-specific modules
│   │   │   ├── dashboard/  # Shared dashboard widgets
│   │   │   ├── layout/     # Header, Sidebar, Containers
│   │   │   ├── ride/       # Ride selection & booking UI
│   │   │   └── ui/         # Base design components (Cards, Buttons)
│   │   ├── pages/          # View entry points by Role
│   │   │   ├── admin/      # Admin Command Center views
│   │   │   ├── auth/       # Login, Signup, OTP screens
│   │   │   ├── driver/     # Pilot Node (Driver) screens
│   │   │   ├── owner/      # Fleet owner management
│   │   │   └── user/       # Passenger Dashboard
│   │   ├── services/       # API & Firebase logic
│   │   ├── lib/            # Utilities (Tailwind merge, etc.)
│   │   ├── hooks/          # Custom state hooks
│   │   ├── App.tsx         # Main Routing & Provider setup
│   │   └── main.tsx        # Client entry point
│   └── vite.config.ts      # Frontend build config
├── firebase-blueprint.json # NoSQL Schema definitions
├── firestore.rules         # Security & Access Control
├── package.json            # Unified dependencies
└── .env.example            # Environment roadmap
```

---

## 👤 User Roles & Dashboards

### 🛡️ Admin Dashboard (`/admin`)
**How to login:**
- Navigate to `http://localhost:3000/admin/login`.
- **Credentials**: `admin@system.node` / `GoYatariUser@2025`.
- **Features**:
  - **KYC Verification**: Approve or reject driver documents in real-time.
  - **Platform Insights**: View global earnings, active rides, and user growth.
  - **Driver Control**: Track pilot node statuses across the network.
  - **Incentive Management**: Configure bonuses and driver targets.

### 🏎️ Pilot Node (Driver) Desktop (`/driver`)
**How to login:**
- Navigate to `/driver/login` or select "Driver" on the home screen.
- **Verification Flow**: 
  1. Complete **Technical Note** (Vehicle registration).
  2. Sync **Identify Note** (Aadhaar number).
  3. Perform **Biometric Capture** (Profile photo).
- **Features**:
  - **Duty Terminal**: Toggle between Online/Standby modes.
  - **Incoming Lattice**: Intelligent modals for new passenger requests.
  - **Fiscal Tracking**: Detailed earning breakdown and wallet withdrawals.
  - **Performance Matrix**: Real-time rating, acceptance, and cancellation metrics.

### 📱 Passenger (User) Dashboard (`/`)
**How to login:**
- Standard login via phone number and OTP (`1234`).
- **Features**:
  - **Booking Lattice**: Select origin/destination and vehicle class (Eco, Pro, Prime, XL).
  - **Real-time Tracking**: Monitor active rides and driver details.
  - **Global Wallet**: Recharge and pay for rides seamlessly.
  - **Address Book**: Store frequently used locations for quick booking.

---

## 🔐 Authentication Flows

### How to Log In
- **General Users**: Enter phone/email -> Verify OTP (Mocked as `1234` for demo) -> Access Dashboard.
- **Drivers**: Same as general users but redirects to the Pilot Node interface.
- **Admin**: Enter specific admin credentials in the Admin Login terminal.

### How to Log Out
- Every dashboard features a **Logout** button or a **Terminate Session** option within the sidebar or profile menu, which calls the `authService.logout()` protocol.

---

## 🛠️ Implementation Technology

### Frontend
- **React 18+**: Functional components with hooks.
- **Tailwind CSS**: Utility-first styling with a "Dark Industrial" aesthetic.
- **Motion**: High-fidelity layout and route animations.
- **Lucide React**: Modern iconography.

### Backend & Database
- **Firebase Auth**: Secure user authentication.
- **Firestore**: Real-time NoSQL database for lattice state management.
- **Express / Node.js**: Unified server for API proxying and asset delivery.

---

## 📝 Features Summary
- **Real-Time Lattice**: Synchronized state across all user desks via Firebase Snapshots.
- **High-Security KYC**: Multi-step verification for driver onboarding with encrypted storage.
- **Mesh UI**: Distinctive visual design using gradients, glassmorphism, and custom animations.
- **Responsiveness**: Fully adaptive layouts for mobile and desktop views with a mobile-first philosophy.
=======
# Webapp
>>>>>>> 12fa3f57919cb6f8ab522b2d40a47ada25a599f5
