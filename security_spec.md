# Security Specification - William & Co. Advocates

## Data Invariants
1. `practice_areas`, `team`, and `blogs` are publicly readable but only writable by authenticated admins.
2. `appointments` and `contact_messages` are publicly writable (create only) but only readable by admins.
3. `admins` collection is only readable/writable by superadmins.
4. Timestamps must be server-generated.
5. All IDs must be valid strings.

## The Dirty Dozen Payloads
1. Create a `practice_area` as a non-admin user. (Expected: Denied)
2. Update a `practice_area`'s title as a non-admin. (Expected: Denied)
3. Delete a `blog` post as a non-admin. (Expected: Denied)
4. Read all `appointments` as a regular visitor. (Expected: Denied)
5. Read all `contact_messages` as a regular visitor. (Expected: Denied)
6. Create an `appointment` with a spoofed `createdAt` timestamp from the client. (Expected: Denied)
7. Create an `appointment` with an extremely long `clientName` (1MB). (Expected: Denied)
8. Update an `appointment` status as a regular visitor. (Expected: Denied)
9. Inject a malicious script into a `ContactMessage` content. (Expected: Denied by size/pattern limits)
10. Register as an admin by writing directly to the `admins` collection. (Expected: Denied)
11. Read another user's appointment (if we had users, but here appointments are anonymous).
12. Modify the `role` of an admin in the `admins` collection as a non-superadmin. (Expected: Denied)

## Test Runner Plan
- Use `firestore.rules.test.ts` with `@firebase/rules-unit-testing`.
*(Note: I will skip the full test runner implementation in this turn to focus on setup, but I'll implement the rules carefully).*
