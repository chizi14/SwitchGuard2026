# SwitchGuard

**Instant ATM dispense error detection and automatic reversal**

FINOVATE 2026 National Virtual Hackathon for Financial Innovation in Malawi  
**Challenge track:** Fraud Detection and Cybersecurity  
**Team:** Terminal Titans — Malawi University of Business and Applied Sciences (MUBAS)

**GitHub:** https://github.com/chizi14/SwitchGuard2026  
**Demo video:** https://drive.google.com/file/d/1mi-DcauiUCFzPG3laz5RaokasY9acdY7/view?usp=drivesdk

---

## Problem Statement

When an ATM fails to dispense cash, the customer’s account is still debited. In Malawi today, fixing that often means visiting a bank branch, filling out a paper dispute form, and waiting while staff manually review the machine’s logs — sometimes for hours or more than a day. People are left without access to their own money for essentials such as food or transport, and trust in digital banking is damaged.

This problem affects any bank customer who uses an ATM, including rural and low-income users who can least afford the delay.

ATM dispense errors currently take more than 24 hours to resolve manually, leaving people without access to their own money in emergency situations.

---

## Proposed Solution

SwitchGuard watches ATM transaction activity and detects dispense errors as they happen. Instead of a multi-day manual dispute process, the system verifies the error against the transaction record and **automatically reverses the funds**, usually within minutes. The customer is notified by **SMS** as soon as the reversal completes.

A reversal only happens after **three checks** pass:

1. The transaction log must show a **real dispense error**
2. The **transaction ID** must match an actual record in that log
3. That transaction ID must **belong to the account** making the request

The system never acts on a customer’s claim alone — only on what the record proves. No dispute form and no branch visit are required for a verified dispense error.

**Workflow:** Amount deducted → Dispense error detected → Transaction ID verified → Ownership confirmed → Funds reversed → SMS sent.

---

## Key Features

- Instant, automatic detection and reversal of ATM dispense errors, verified against the transaction log before any money moves
- Card blocking and unblocking, done instantly by the customer with no branch visit required
- Real-time payment approval — accept, decline, or block a pending online payment as it happens
- Suspicious activity detection, flagging patterns that are not physically possible (for example, two withdrawals in different cities minutes apart)
- SMS notifications confirming reversals, card blocks, and payment decisions
- USSD access so the system works on any phone, not only smartphones
- Admin dashboard giving bank staff visibility into every reversal, block, and flagged transaction
- In-app help chatbot and help centre

---

## Technologies Used

- **Frontend:** React, Tailwind CSS, React Router, Leaflet
- **Backend:** Node.js, Express, SQLite
- **SMS and USSD:** Africa’s Talking API (confirmed to support Malawi; developer sandbox available)
- **AI tools:** Claude, used under FINOVATE’s AI policy; the team understands and can explain all code
- **Architecture:** log simulator → detection engine → verification → reversal and notification

---

## Installation Instructions

### Requirements

- Node.js 18 or newer
- npm

### Run the frontend locally

```bash
cd Frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173/
```

### Demo login

| Role | URL | Credentials |
|------|-----|-------------|
| Customer | http://localhost:5173/login | Account `5829` · PIN `1234` |
| Admin | http://localhost:5173/admin-login | Staff ID `ADMIN01` · PIN `1234` |

Any non-empty account number and PIN also work in this prototype.

### Main routes

| Page | URL |
|------|-----|
| Dashboard | http://localhost:5173/dashboard |
| Activity (reversal) | http://localhost:5173/activity |
| Alerts | http://localhost:5173/alerts |
| Security (block card) | http://localhost:5173/security |
| Payments | http://localhost:5173/payment-approval |
| USSD Demo | http://localhost:5173/ussd-demo |

The frontend demo runs on simulated data and does not require the backend for the hackathon walkthrough.

---

## Business Model Summary

SwitchGuard is **not** a consumer app sold to individual customers. It is a **B2B software licence sold to banks**, starting with **National Bank of Malawi**.

### What we sell

Software that detects and automatically reverses ATM dispense errors, and gives bank staff a real-time dashboard of every reversal, block, and flagged transaction.

### Revenue model

- Licence fee charged **per ATM network monitored**, not per individual customer
- Positioned to banks as a direct cost reducer: fewer manual disputes means lower branch staffing and processing costs
- ATM failure-hotspot data (which machines break down most) can be offered as a premium add-on for maintenance planning

### Market size

| Metric | Detail |
|--------|--------|
| Commercial banks in Malawi | 8, each operating its own ATM network |
| Shared infrastructure | NatSwitch has connected banks’ ATMs since 2015 |
| Current resolution time | Up to 24 hours+ per dispense error |

Because SwitchGuard analyzes transaction logs rather than requiring a proprietary integration with one bank’s internal systems, the same core detection engine can be licensed across banks on similar shared switch infrastructure.

### Who uses it

- **Bank customers** — failed ATM withdrawal fixed in minutes, not days
- **Bank operations and fraud teams** — visibility into every reversal, block, and flagged pattern
- **Feature-phone users** — same protection via USSD without a smartphone

### Key partners

- National Bank of Malawi (hackathon sponsor and natural first pilot)
- Africa’s Talking (SMS and USSD)
- Reserve Bank of Malawi / NatSwitch (national interbank switch context)

### Growth path

1. Now → 3 months: real Africa’s Talking SMS/USSD integration; pilot conversation with National Bank of Malawi
2. 3 → 9 months: aggregator integration for live transaction data; security and compliance audit
3. 9+ months: expand detection beyond ATM errors; onboard a second bank

### Honest scope

This is a **hackathon prototype**. Live ATM network monitoring and real mobile-money integration require licensed partners and infrastructure a student team cannot obtain alone. What is demonstrated is the detection and reversal logic on a realistic **simulated** transaction log — disclosed honestly, not overstated.

---

## Team Members

| Name | Role |
|------|------|
| Uchizi Kanyimbo | Strategist |
| Akuzike | Software Developer |
| Zaithwa Chikuse | Communicator |
| Cyrus Thindwa | Researcher |
| Angella Kamanga | UI Designer |

---

## Screenshots

### Login
![Login](docs/screenshots/Login.png)

### Dashboard
![Dashboard](docs/screenshots/Dashboard.png)

### Activity — automatic reversal
![Activity reversal](docs/screenshots/Activity-Reversal.png)

### Alerts
![Alerts](docs/screenshots/Alerts.png)

### Security — block card
![Security](docs/screenshots/Security-Block-card.png)

### Payments
![Payments](docs/screenshots/Payments.png)

### USSD Demo
![USSD Demo](docs/screenshots/USSD%20Demo.png)

### Notifications
![Notifications](docs/screenshots/Notifications.png)

### Profile
![Profile](docs/screenshots/Profile.png)

### Settings
![Settings](docs/screenshots/Settings.png)

### Help Centre
![Help Centre](docs/screenshots/Help%20Centre.png)

### Chatbot
![Chatbot](docs/screenshots/Chatbot.png)

### Privacy Policy
![Privacy Policy](docs/screenshots/Privacy%20Policy.png)

### Terms of Service
![Terms of Service](docs/screenshots/Terms%20of%20Service.png)

---

## Demo Link

https://drive.google.com/file/d/1mi-DcauiUCFzPG3laz5RaokasY9acdY7/view?usp=drivesdk
