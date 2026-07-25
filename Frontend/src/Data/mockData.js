// Centralized mock data for SwitchGuard.
// One consistent customer identity across all customer-facing screens.
// Swap for real API calls once the backend is wired up.

export const customer = {
  name: "Thoko Mvula",
  accountNumber: "**** **** 5829",
  phone: "+265 991 442 018",
  initials: "TM",
  homeCity: "Blantyre",
};

export const currency = (amount) => {
  const sign = amount < 0 ? "-" : "";
  const abs = Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sign}MWK ${abs}`;
};

// Cards belong to the bank (National Bank of Malawi) — SwitchGuard
// protects them, it does not issue them.
export const cards = [
  { id: "card-1", network: "Visa", label: "NBM Visa Debit", last4: "4242", exp: "12/26", status: "Active" },
  { id: "card-2", network: "Mastercard", label: "NBM Travel Card", last4: "8891", exp: "08/26", status: "Active" },
];

export const reversalDetail = {
  transactionId: "TXN-882944012",
  atmLocation: "NBM Blantyre Main — Lobby 1",
  amount: 50000,
  originalTimestamp: "Jul 21, 2026 · 14:15:02",
  reversedOn: "Jul 21, 2026 · 14:15:52",
  timeline: [
    {
      key: "deducted",
      title: "Amount deducted",
      detail: "Transaction initiated and MWK 50,000.00 held from account.",
      time: "14:15:02",
      state: "done",
    },
    {
      key: "error",
      title: "Dispense error detected",
      detail: "ATM hardware log reported \u201CFailed to Dispense\u201D at ATM NBM-BLZ-01.",
      time: "14:15:45",
      state: "done",
    },
    {
      key: "id-match",
      title: "Transaction ID verified",
      detail: "The transaction ID matched an actual record in the ATM's log — not just a claim.",
      time: "14:15:47",
      state: "done",
    },
    {
      key: "ownership",
      title: "Ownership confirmed",
      detail: "The transaction ID was confirmed to belong to this account before anything moved.",
      time: "14:15:48",
      state: "done",
    },
    {
      key: "reversed",
      title: "Funds reversed",
      detail: "MWK 50,000.00 credited back to the primary savings account.",
      time: "14:15:52",
      state: "done",
    },
    {
      key: "sms",
      title: "SMS sent",
      detail: "Confirmation sent to the number ending in *2018.",
      time: "14:16:05",
      state: "done",
    },
  ],
};

export const securityAlert = {
  amount: 450,
  time: "Today, 10:42 AM",
  atmLocation: "ATM #4922 — Area 47, Lilongwe",
  method: "Physical Debit Card",
  homeCity: "Blantyre",
  flaggedCity: "Lilongwe",
  status: "Needs Review",
  reason:
    "Two withdrawals detected in different cities 6 minutes apart. This distance is physically impossible to travel in that time.",
};

export const pendingPayments = [
  { id: "pp-1", merchant: "Amazon Purchase", type: "One-time purchase", amount: 42000, cardId: "card-1", urgent: true, countdown: 45 },
  { id: "pp-2", merchant: "Netflix Subscription", type: "Recurring subscription", amount: 12500, cardId: "card-1", urgent: false },
  { id: "pp-3", merchant: "Prime Video Subscription", type: "Recurring subscription", amount: 8900, cardId: "card-2", urgent: false },
  { id: "pp-4", merchant: "Alibaba Order", type: "One-time purchase", amount: 67500, cardId: "card-2", urgent: false },
];

// Admin dashboard — multiple different customers, deliberately diverse
export const adminStats = {
  totalReversalsToday: 42,
  reversalsGrowthPct: 12.5,
  activeFlagged: 6,
  avgResolutionSeconds: 184,
  avgResolutionDeltaSeconds: -14,
  manualProcessDays: "3–14 days",
};

// Which ATMs fail most often — this is the "help the bank, not just the
// customer" angle: SwitchGuard doubles as a maintenance signal.
export const atmFailureHotspots = [
  { location: "NBM Blantyre Main — Lobby 1", failures: 14, trend: "up" },
  { location: "NBM Lilongwe City Centre", failures: 9, trend: "up" },
  { location: "NBM Mzuzu Branch ATM", failures: 5, trend: "down" },
];

export const adminTransactions = [
  { customer: "Joseph Banda", account: "...8829", txnId: "#TXN-992031-S", amount: 12450, status: "Alert", time: "09:42:12 AM" },
  { customer: "Alice Mwakaseka", account: "...4102", txnId: "#TXN-991984-R", amount: 420.5, status: "Reversed", time: "09:38:55 AM" },
  { customer: "Brian Kapito", account: "...0031", txnId: "#TXN-991872-P", amount: 2100, status: "Pending", time: "09:35:10 AM" },
  { customer: "Catherine Lungu", account: "...1192", txnId: "#TXN-991755-R", amount: 15.75, status: "Reversed", time: "09:22:04 AM" },
  { customer: "David Mwale", account: "...5543", txnId: "#TXN-991622-S", amount: 5000, status: "Alert", time: "09:15:30 AM" },
];

export const statusStyles = {
  Active: "bg-tertiary-container text-on-tertiary-container",
  Blocked: "bg-error-container text-on-error-container",
  Reversed: "bg-tertiary-container text-on-tertiary-container",
  Alert: "bg-error-container text-on-error-container",
  Pending: "bg-secondary-container/40 text-on-secondary-container",
  "Needs Review": "bg-secondary-container text-on-secondary-container",
};

// USSD menu tree — simulates the *384*46# session a feature-phone user
// would see. No smartphone or app required, which matters for financial
// inclusion in rural areas. Real deployment needs a shortcode registered
// with a telco or aggregator (e.g. Africa's Talking, which already
// supports USSD in Malawi) — this simulates that session for the demo.
export const ussdShortcode = "*384*46#";

export const ussdMenu = {
  root: {
    text: "SwitchGuard\n1. Check balance\n2. Report failed withdrawal\n3. Block my card\n4. Recent alerts\n0. Exit",
    options: {
      "1": "balance",
      "2": "report-start",
      "3": "block-confirm",
      "4": "alerts",
      "0": "exit",
    },
  },
  balance: {
    text: "Account balance:\nMWK 45,280.64\n\n0. Back to menu\n00. Exit",
    options: { "0": "root", "00": "exit" },
  },
  "report-start": {
    text: "Report failed withdrawal\nEnter the amount you were charged but not given, e.g. 50000\n\n0. Back",
    options: { "0": "root" },
    isInput: true,
    next: "report-confirm",
  },
  "report-confirm": {
    text: "We found a matching ATM error for MWK 50,000.\n\n1. Confirm and reverse\n0. Back to menu",
    options: { "1": "report-done", "0": "root" },
  },
  "report-done": {
    text: "Reversal started.\nMWK 50,000 will be credited within 10 minutes.\nSMS confirmation will follow.\n\n0. Back to menu\n00. Exit",
    options: { "0": "root", "00": "exit" },
  },
  "block-confirm": {
    text: "Block your card ending 4242?\n1. Yes, block it\n2. No, go back",
    options: { "1": "block-done", "2": "root" },
  },
  "block-done": {
    text: "Your card ending 4242 is now blocked.\nSMS confirmation sent.\n\n0. Back to menu\n00. Exit",
    options: { "0": "root", "00": "exit" },
  },
  alerts: {
    text: "Recent alerts:\n1. Withdrawal flagged in Lilongwe\n2. Card blocked (self-requested)\n\n0. Back to menu",
    options: { "1": "root", "2": "root", "0": "root" },
  },
  exit: {
    text: "Session ended. Dial *384*46# any time to check your account.",
    options: {},
  },
};
