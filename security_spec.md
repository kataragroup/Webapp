# Security Specification - Go-Yatree Taxi App

## Data Invariants
1. A Driver cannot go ONLINE without verified KYC documents (Aadhaar, License, PCC).
2. A Vehicle must be owned by a verified Car Owner to be active in the system.
3. A Driver can only be assigned to one vehicle at any given time.
4. Bookings can only be created by regular Users.
5. Fare and Commission settings can ONLY be modified by Admins.
6. Cash rides are automatically blocked for drivers who exceed the system cash limit.
7. Ratings can only be submitted for completed bookings by the associated user.

## The "Dirty Dozen" Payloads (Test Scenarios)
1. **Identity Spoofing**: User A attempts to create a profile with User B's UID.
2. **Role Escalation**: User A attempts to update their `role` to `admin`.
3. **Ghost Driver**: Driver A attempts to go `ONLINE` while `isKycVerified` is `false`.
4. **Relationship Poisoning**: Driver A attempts to update their `vehicleId` to a vehicle they don't own/assigned to.
5. **Fare Tampering**: User A attempts to create a booking with a `fare` of `0`.
6. **Bypassing Cash Limit**: Driver A (over limit) attempts to accept a cash ride.
7. **Orphaned Rating**: User A attempts to rate a booking that doesn't exist or isn't theirs.
8. **Wallet Injection**: User A attempts to increment their `walletBalance` directly.
9. **Admin Settings Breach**: Driver A attempts to update `baseFare` in `fareSettings`.
10. **Unauthorized Location Update**: Driver A attempts to update Driver B's `driverLocation`.
11. **Shadow Field Injection**: User A attempts to add a `verifiedByAdmin: true` field to their profile.
12. **Status Shortcutting**: User A attempts to move a booking from `pending` directly to `completed` without a driver assigned.

## Test Runner (Logic Verification)
The `firestore.rules.test.ts` will implement these scenarios once the blueprint is finalized.
