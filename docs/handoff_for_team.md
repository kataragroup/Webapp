Handoff Notes
=============

A. What to share with Admin developer
-------------------------------------
- Admin endpoints kept under `backend/routes/admin.js` (or `backend/routes/admin.ts`). If you remove admin code locally, share the following:
  - `GET /api/admin/rides` — list rides with filters
  - `GET /api/admin/users` — list users
  - `POST /api/admin/login` — admin authentication
  - `PATCH /api/admin/rides/:rideId/status` — change ride status

- Database fields: ride schema, user schema, payment schema
- Socket events: `admin:ride-update`, `admin:stats-refresh`

B. What to share with Driver App developer
-----------------------------------------
- The `docs/driver_integration.md` contains the API contract and socket events.
- Integration file: `backend/integrations/driverService.js` — example usage for REST calls.
- Explain that user site will call internal backend `/api/rides` then backend forwards to Driver App using `driverService`.

C. Database Schemas (concise)
----------------------------
User (key fields):
- `_id` (ObjectId)
- `name`, `email`, `phone` (unique)
- `role`: 'user' | 'driver' | 'admin'
- `isVerified`, `isKycComplete`
- timestamps

Ride (key fields):
- `_id`, `id` (string fallback)
- `userId`, `driverId`
- `pickup`, `drop` (addresses + optional coordinates)
- `fare`, `vehicleType`, `status` ('requested','confirmed','ongoing','completed','cancelled')
- `paymentStatus`
- `pickupCode`, `driverDetails` (embedded)
- timestamps

D. Auth flow summary
--------------------
- Users authenticate on User Website via OTP. Backend issues JWT on successful OTP.
- Driver App should use JWT or API key for its endpoints and socket auth.

E. Socket events
----------------
- User Website subscribes to ride events (ride-accepted, driver-location-update, ride-completed)
- Driver App emits events when driver accepts or updates location

F. Error handling recommendations
--------------------------------
- Always return `{ success: boolean, message?: string, data?: any }`
- Use 4xx for client errors, 5xx for server errors
- Include `errorCode` for machine-readable errors in later versions

