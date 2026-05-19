Driver App Integration Contract (User Website)

Overview
--------
This document defines the REST and Socket.IO contract between the User Website (this repo) and the external Driver App. Share this with the Driver App developer so both sides implement compatible endpoints and events.

Base URL (example)
-------------------
- `http://localhost:5000/api/driver`

Authentication
--------------
Options (pick one):
- JWT Bearer tokens in `Authorization: Bearer <token>`
- API Key header `x-api-key: <key>` (simple)

Recommended: JWT for driver identification and secure operations. For quick integration, support `x-api-key` too.

REST Endpoints (Driver App)
---------------------------
1. POST `/requests`
   - Purpose: Receive a new ride request from User Website. Driver App should dispatch to nearby drivers.
   - Request body:
     {
       "rideId": "string",
       "userId": "string",
       "pickup": { "lat": number, "lng": number, "address": "string" },
       "drop": { "lat": number, "lng": number, "address": "string" },
       "fare": number,
       "vehicleType": "string",
       "meta": { ... }
     }
   - Response 200:
     {
       "success": true,
       "requestId": "string",
       "candidates": [ { "driverId": "", "eta": 3, "distance": 120, "vehicle": {} } ]
     }
   - Errors: 4xx/5xx with `{ success:false, message: '...' }`

2. POST `/requests/:requestId/cancel` (optional)
   - Cancel an outstanding request.

3. POST `/:driverId/accept` or `/rides/:rideId/accept`
   - Called by driver app or used to confirm acceptance.
   - Body: { driverId, rideId, eta, vehicleInfo }

4. GET `/:driverId/status`
   - Returns driver current status: { online: true, location: {lat,lng}, currentRideId: null }

5. POST `/:driverId/location` (or socket)
   - Body: { lat, lng, timestamp }

6. POST `/:driverId/rides/:rideId/status`
   - Body: { status: 'accepted'|'started'|'arrived'|'completed'|'cancelled', extra?: {} }

Socket.IO Events (Realtime)
---------------------------
Use Socket.IO for low-latency updates. Namespace: `/driver` (suggested). Events below:

Server (Driver App) -> Client (User Site)
- `ride-requested` : Sent when a driver accepts or candidate chosen.
  payload: { rideId, driver: { driverId, name, photo, vehicleNumber, vehicleModel, eta } }
- `ride-accepted` : Sent when a driver accepts the ride.
  payload: same as above
- `ride-started` : ride started
  payload: { rideId }
- `ride-completed` : ride ended
  payload: { rideId, fare, endTime }
- `driver-location-update` : frequent location update
  payload: { driverId, lat, lng, bearing, speed, ts }

Client (User Site) -> Server (Driver App)
- `request-ride` : User site requests a ride via socket if chosen
  payload: ride object (same as REST `/requests`)
- `cancel-ride`
  payload: { rideId }

Data Formats
------------
- All IDs: strings (UUID or Mongo ObjectId string)
- Coordinates: floats
- Timestamps: ISO strings or epoch ms

Sample Flow (simple)
--------------------
1. User books ride -> User site POST `/api/rides` (own backend)
2. Backend calls Driver App `/requests` via `driverService.sendRideRequest(ride)`
3. Driver App notifies chosen driver and emits socket `ride-accepted` back to User Website (or backend forwards)
4. User site receives `ride-accepted` and shows driver details
5. Driver App emits `driver-location-update` while en route
6. Driver App updates `/:driverId/rides/:rideId/status` to `completed` when finished

Postman / Testing
-----------------
Provide a minimal Postman collection with these endpoints and example bodies so integration testing is quick.

Socket Auth
-----------
- Authenticate socket connections using the same method as REST (JWT in connection auth or query param token). Example with Socket.IO:
  const socket = io(DRIVER_BASE, { auth: { token: 'Bearer <token>' } });

What I need from Driver App developer (concise list)
---------------------------------------------------
- Base URL
- Auth method (JWT or API Key)
- Implement endpoints listed above
- Implement socket namespace and events
- Provide sample responses and a Postman collection

Handoff Notes for Admin Developer
---------------------------------
- Admin developer still needs admin endpoints for reports/management. If you remove admin code locally, share these:
  - Admin ride list: `GET /api/admin/rides`
  - Admin user list: `GET /api/admin/users`
  - Admin auth: `/api/admin/auth` (login)

Change Log / Integration File
----------------------------
- `backend/integrations/driverService.js` created as a placeholder to call Driver App REST APIs.

