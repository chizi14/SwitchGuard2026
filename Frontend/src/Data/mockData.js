// Centralized mock data for SwitchGuard.
// One consistent customer identity across all customer-facing screens.
// Swap for real API calls once the backend is wired up.

export const customer = {
  name: "Thoko Mvula",
  accountNumber: "**** **** 5829",
  accountId: "SG-4829-1192",
  phone: "+265 991 442 018",
  initials: "TM",
  homeCity: "Blantyre",
};

export const customerBalance = {
  amount: 45280.64,
  accountNumber: "**** **** 5829",
  lastUpdated: "Today, 08:15 AM",
};

export const customerCards = [
  { id: "cust-card-1", network: "Visa", label: "SwitchGuard Savings", last4: "4242", exp: "12/26", status: "Active", frozen: false },
  { id: "cust-card-2", network: "Mastercard", label: "SwitchGuard Travel", last4: "8891", exp: "08/26", status: "Active", frozen: false },
];

export const carouselSlides = [
  { src: "/images/atm-machine.jpg", caption: "Every ATM transaction, verified" },
  { src: "/images/bank-notes.jpg", caption: "Your money, protected in minutes" },
  { src: "/images/transaction.jpg", caption: "Instant reversal when something goes wrong" },
];

export const promoSlides = [
  { src: "/images/mobile-banking.jpg", caption: "Bank from anywhere, anytime" },
  { src: "/images/shaking-hands.jpg", caption: "Trusted by National Bank of Malawi" },
];

export const customerTransactions = [
  {
    id: "txn-1",
    merchant: "Chipiku Stores",
    timestamp: "Today, 09:42 AM",
    amount: -124000,
    status: "Verified",
    icon: "cart",
  },
  {
    id: "txn-2",
    merchant: "NBM ATM Blantyre Main",
    timestamp: "Today, 08:11 AM",
    amount: -50000,
    status: "Reversed",
    icon: "atm",
  },
  {
    id: "txn-3",
    merchant: "Airtel Money",
    timestamp: "Yesterday, 06:18 PM",
    amount: -15000,
    status: "Verified",
    icon: "mobile",
  },
  {
    id: "txn-4",
    merchant: "Salary Deposit",
    timestamp: "Yesterday, 03:03 PM",
    amount: 560000,
    status: "Verified",
    icon: "income",
  },
  {
    id: "txn-5",
    merchant: "Airtel Money",
    timestamp: "Jul 23, 2026, 11:10 AM",
    amount: -25000,
    status: "Verified",
    icon: "mobile",
  },
  {
    id: "txn-6",
    merchant: "Kibanda Market",
    timestamp: "Jul 23, 2026, 09:18 AM",
    amount: -18750,
    status: "Verified",
    icon: "cart",
  },
  {
    id: "txn-7",
    merchant: "NBM ATM Lilongwe City",
    timestamp: "Jul 22, 2026, 06:44 PM",
    amount: -50000,
    status: "Reversed",
    icon: "atm",
  },
  {
    id: "txn-8",
    merchant: "National Switch transfer",
    timestamp: "Jul 22, 2026, 02:20 PM",
    amount: -7500,
    status: "Verified",
    icon: "mobile",
  },
  {
    id: "txn-9",
    merchant: "Salary Deposit",
    timestamp: "Jul 22, 2026, 08:01 AM",
    amount: 560000,
    status: "Verified",
    icon: "income",
  },
  {
    id: "txn-10",
    merchant: "TotalEnergies",
    timestamp: "Jul 21, 2026, 07:12 PM",
    amount: -22000,
    status: "Verified",
    icon: "cart",
  },
  {
    id: "txn-11",
    merchant: "NBM ATM Mzuzu Main",
    timestamp: "Jul 21, 2026, 04:34 PM",
    amount: -60000,
    status: "Reversed",
    icon: "atm",
  },
  {
    id: "txn-12",
    merchant: "Airtel Money",
    timestamp: "Jul 21, 2026, 10:15 AM",
    amount: -10000,
    status: "Verified",
    icon: "mobile",
  },
];

export const loginHistory = [
  {
    city: "Blantyre",
    region: "Southern Region",
    timestamp: "Today, 09:42 AM",
    coordinates: { x: 46, y: 74 },
  },
  {
    city: "Lilongwe",
    region: "Central Region",
    timestamp: "Yesterday, 08:11 PM",
    coordinates: { x: 56, y: 42 },
  },
  {
    city: "Mzuzu",
    region: "Northern Region",
    timestamp: "Jul 23, 2026, 06:18 PM",
    coordinates: { x: 53, y: 16 },
  },
];

export const customerRecentActivity = {
  city: "Blantyre",
  country: "MW",
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

export const paymentApproval = {
  merchant: "Chipiku Stores",
  amount: 124000,
  location: "Blantyre, MW",
  countdown: 57,
};

// Admin dashboard — multiple different customers, deliberately diverse
export const adminStats = {
  totalReversalsToday: 42,
  reversalsGrowthPct: 12.5,
  activeFlagged: 6,
  avgResolutionSeconds: 184,
  avgResolutionDeltaSeconds: -14,
  manualProcessDays: "3–14 days",
};

export const adminTransactionRows = [
  {
    id: "TXN-992031-S",
    customer: "Joseph Banda",
    account: "**** 8829",
    amount: 12450,
    status: "Alert",
    time: "09:42:12 AM",
    dateLabel: "Today",
  },
  {
    id: "TXN-991984-R",
    customer: "Alice Mwakaseka",
    account: "**** 4102",
    amount: 420.5,
    status: "Reversed",
    time: "09:38:55 AM",
    dateLabel: "Today",
  },
  {
    id: "TXN-991872-P",
    customer: "Brian Kapito",
    account: "**** 0031",
    amount: 2100,
    status: "Pending",
    time: "09:35:10 AM",
    dateLabel: "Today",
  },
  {
    id: "TXN-991755-R",
    customer: "Catherine Lungu",
    account: "**** 1192",
    amount: 15.75,
    status: "Reversed",
    time: "09:22:04 AM",
    dateLabel: "Today",
  },
  {
    id: "TXN-991622-S",
    customer: "David Mwale",
    account: "**** 5543",
    amount: 5000,
    status: "Alert",
    time: "09:15:30 AM",
    dateLabel: "Yesterday",
  },
];

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

export const faqEntries = [
  {
    id: "dispense-error",
    keywords: ["dispense", "error", "atm", "took", "money", "cash", "didn't give", "no cash", "failed withdrawal", "deducted"],
    en: {
      q: "What is a dispense error?",
      a: "A dispense error happens when an ATM deducts money from your account but fails to physically release the cash. It's usually a machine fault — not something you did wrong. SwitchGuard detects these automatically and starts the reversal process.",
    },
    ch: {
      q: "Ndi chiyani dispense error?",
      a: "Dispense error ndi chinthu chomwe chimachitika poti ATM yabadwa ndalama paakaunti yanu koma sinapatsire ndalama zimenezi. Nthawi zambiri ndi vuto la chida — osati chifukwa chomwe mwachita. SwitchGuard amadziwa zimenezi ndikuyamba kubwezera ndalama.",
    },
  },
  {
    id: "reversal-speed",
    keywords: ["reversal", "how fast", "how long", "minutes", "time", "credit", "back", "refund", "bwezera", "mkupuno"],
    en: {
      q: "How fast do reversals happen?",
      a: "Once SwitchGuard confirms the dispense error through the ATM log, transaction ID, and ownership checks, the reversal is processed automatically. Most reversals complete within 2 to 10 minutes, and you'll receive an SMS confirmation when the funds are credited back.",
    },
    ch: {
      q: "Bwezera amachitika msangawi?",
      a: "SwitchGuard atapoona kuti ndi dispense error kudzera pa ATM log, transaction ID, ndi kuyeza milandu, bwezera amachitika otomoka. Bwezera ambiri amaliza m'ma mphindi 2 mpaka 10, ndipo mudzalandira SMS kutsimikizira poti ndalama zabwezeredwa.",
    },
  },
  {
    id: "block-card",
    keywords: ["block", "lost", "stolen", "stole", "card", "someone", "theft", "tsekera", "tayala", "yabedwa"],
    en: {
      q: "How do I block a lost or stolen card?",
      a: "Go to the Security page and tap Block Card, or use USSD by dialling *384*46# and selecting option 3 from any phone. Blocking takes effect immediately — no branch visit needed. You can unblock it later from the same page if you find it.",
    },
    ch: {
      q: "Ndiwonetsera bwanji kadi yotayidwa kapena yabedwa?",
      a: "Pita ku Security page ndikudina Block Card, kapena gwiritsani USSD pochira *384*46# ndikusankha option 3 kuchoka ku foni iliyonse. Kutsekera kumayamba nthawi yomwe — osafunika kupita ku bank. Mungatsegule kembali ku page yomweyo muli kupeza.",
    },
  },
  {
    id: "two-factor",
    keywords: ["2fa", "two-factor", "two factor", "security tip", "authentication", "approve", "verification", "chitetezo", "chinsinsi"],
    en: {
      q: "What is the security tip / 2FA for?",
      a: "Two-factor authentication adds a second approval step when logging in, so even if someone gets your password, they still can't access your account without the second verification. You can manage it from the Security settings.",
    },
    ch: {
      q: "Security tip / 2FA ndi ya chiyani?",
      a: "Two-factor authentication imapatsa chilolezo chachiwiri poti mulowe m'akaunti, kotero ngati munthu ali ndi mawu achinsinsi anu, sadzatha kulowa m'akaunti yanu popanda kuyezetsa kachiwiri. Mungayimange mu Security settings.",
    },
  },
  {
    id: "ussd-banking",
    keywords: ["ussd", "phone", "feature phone", "no internet", "no app", "no smartphone", "dial", "code", "any phone", "*384*46"],
    en: {
      q: "How do I use USSD banking?",
      a: "Dial *384*46# from any phone — smartphone or basic feature phone. No internet or app required. You can check your balance, report a failed withdrawal, block your card, and see recent alerts, all through a simple text menu.",
    },
    ch: {
      q: "Ndiwagwiritsa bwanji USSD banking?",
      a: "Pechirani *384*46# kuchoka ku foni iliyonse — smartphone kapena foni yosavuta. Osafunika intaneti kapena app. Mungaone baki, muziwuza za withdrawal yolephera, kutsekera kadi yanu, ndikuona alerts zachilendo, zonse kudzera pa menyu yosavuta.",
    },
  },
  {
    id: "fallback",
    keywords: [],
    en: {
      q: "",
      a: "I'm not sure about that yet — try Contact Support for help from our team.",
    },
    ch: {
      q: "",
      a: "Sindine woyimira kale — yesetsani Contact Support kuti mupeze thandizo kuchoka kwa ife.",
    },
  },
];
