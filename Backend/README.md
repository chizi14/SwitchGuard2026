# SwitchGuard Backend

Owned by Akuzike + Cyrus (adjust if roles have shifted). Stub only —
implementation approach is yours to decide.

## Suggested structure
- `Routes/` — Express route definitions
- `Controllers/` — request handlers / business logic
- `Database/` — SQLite schema + connection setup
- `Middleware/` — auth, validation, error handling

## Core logic to implement
The detection + reversal engine should check three things before
ever reversing a transaction — all three, not just one:
1. The ATM's transaction log shows a real dispense error for that transaction
2. The transaction ID matches an actual record in that log
3. That transaction ID belongs to the account/card of the person requesting it

Only reverse automatically under a set amount threshold; anything
above it should route to a manual review queue instead.

## Stack
- Node.js + Express
- SQLite (better-sqlite3)
- Africa's Talking API for SMS (confirmed to support Malawi, has a
  free sandbox — check their docs before building)

## Getting started
```
npm init -y
npm install express better-sqlite3 cors dotenv africastalking
npm install -D nodemon
```

## Important framing
This is a simulated transaction log, not live interception of real
ATM/bank network traffic — that infrastructure (NatSwitch) isn't
something a student team can access. Build the simulator to produce
realistic log entries, then run the detection logic against that.
