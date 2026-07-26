# SwitchGuard

Instant ATM dispense error detection and automatic reversal, built for the FINOVATE 2026 National Virtual Hackathon for Financial Innovation in Malawi.

Challenge Track: Fraud Detection and Cybersecurity

---

## Problem Statement

When an ATM fails to dispense cash, the customer's account is still debited. Right now in Malawi, fixing this means visiting a bank branch in person, filling out a paper dispute form, and waiting three to fourteen days for staff to manually review the machine's logs. This leaves people without access to their own money, sometimes for essentials like food or transport, and it erodes trust in digital banking. This problem affects any bank customer who uses an ATM, including rural and low income users who can least afford the delay.

## Proposed Solution

SwitchGuard watches ATM transaction activity and detects dispense errors the moment they happen. Instead of a manual, multi day dispute process, the system verifies the error against the transaction record and automatically reverses the funds, usually within a few minutes. The customer is notified by SMS as soon as the reversal completes.

A reversal only happens after three checks pass. The transaction log must show a real dispense error. The transaction ID must match an actual record in that log. That transaction ID must belong to the account making the request. This means the system never acts on a customer's claim alone, only on what the record actually proves.

## Key Features

- Instant, automatic detection and reversal of ATM dispense errors, verified against the transaction log before any money moves
- Card blocking and unblocking, done instantly by the customer with no branch visit required
- Real time payment approval, letting a customer accept, decline, or block a pending online payment as it happens
- Suspicious activity detection, flagging patterns that are not physically possible, such as two withdrawals in different cities minutes apart
- SMS notifications confirming reversals, card blocks, and payment decisions
- USSD access, so the system works on any phone, not only smartphones, which matters for financial inclusion in rural areas
- An admin dashboard giving bank staff full visibility into every reversal, block, and flagged transaction, so nothing happens without a record

## Technologies Used

- Frontend: React, Tailwind CSS
- Backend: Node.js, Express, SQLite
- SMS and USSD: Africa's Talking API, confirmed to support Malawi with an accessible developer sandbox
- AI tools: Claude, used throughout development in line with FINOVATE's AI policy. All code is understood and can be explained by the team.

## Installation Instructions

*To be completed by Cyrus once the backend setup steps are finalized.*

## Business Model Summary

SwitchGuard is a business to business software licence sold to banks, not a consumer app. The first target customer is National Bank of Malawi, the hackathon's sponsor and a natural pilot partner.

Revenue comes from a licence fee charged per ATM network monitored, positioned to banks as a direct reduction in the cost of manually handling disputes. The failure hotspot data the system collects, showing which specific ATMs break down most often, can also be offered as a maintenance insight add on.

Because SwitchGuard analyzes transaction logs rather than requiring a proprietary integration with one bank's internal systems, the same system can be licensed to any bank operating on similar shared switch infrastructure. Malawi has eight commercial banks, each a potential customer, making this a sector wide opportunity rather than a single customer product.

Key partners: National Bank of Malawi, Africa's Talking, and NatSwitch, Malawi's national interbank switch operator.

## Team Members

- Uchizi, Team Lead and Frontend Developer
- Zai, Frontend Developer
- Angella, Frontend Developer
- Akuzike, Backend Developer
- Cyrus, Backend Developer

## Screenshots

*To be added by Cyrus, alongside the installation instructions.*

## Demo Link

*To be added once the demo video is recorded.*
