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

---

## Proposed Solution

SwitchGuard watches ATM transaction activity and detects dispense errors as they happen. Instead of a multi-day manual dispute process, the system verifies the error against the transaction record and **automatically reverses the funds**, usually within minutes. The customer is notified by **SMS** as soon as the reversal completes.

A reversal only happens after **three checks** pass:

1. The transaction log must show a **real dispense error**
2. The **transaction ID** must match an actual record in that log
3. That transaction ID must **belong to the account** making the request

The system never acts on a customer’s claim alone — only on what the record proves. No dispute form and no branch visit are required for a verified dispense error.

---

## Key Features

- **Instant, automatic detection and reversal** of ATM dispense errors, verified against the transaction log before any money moves
- **Card blocking and unblocking**, done instantly by the customer with no branch visit required
- **Real-time payment approval**, letting a customer accept, decline, or block a pending online payment as it happens
- **Suspicious activity detection**, flagging patterns that are not physically possible (for example, two withdrawals in different cities minutes apart)
- **SMS notifications** confirming reversals, card blocks, and payment decisions
- **USSD access**, so the system works on any phone, not only smartphones — important for financial inclusion in rural areas
- **Admin dashboard** giving bank staff visibility into every reversal, block, and flagged transaction
- **In-app help chatbot** and help centre for common customer questions

---

## Technologies Used

- **Frontend:** React, Tailwind CSS, React Router, Leaflet (maps)
- **Backend:** Node.js, Express, SQLite
- **SMS and USSD:** Africa’s Talking API (confirmed to support Malawi; developer sandbox available)
- **AI tools:** Claude, used during development in line with FINOVATE’s AI policy. The team understands and can explain all code.

---

## Installation Instructions

*To be completed by Cyrus once the backend setup steps are finalized.*

### Frontend (current demo)

```bash
cd Frontend
npm install
npm run dev
