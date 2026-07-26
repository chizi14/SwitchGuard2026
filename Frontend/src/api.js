/**
 * SwitchGuard API Client
 *
 * Centralized HTTP client that replaces all mockData.js imports.
 * Base URL defaults to localhost:8000 — override with VITE_API_BASE_URL env var.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function authHeaders() {
  const token = localStorage.getItem("switchguard-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, path, body = null) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json", ...authHeaders() },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, opts);

  if (res.status === 401) {
    localStorage.removeItem("switchguard-token");
    localStorage.removeItem("switchguard-customer");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || err.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

// ── Auth ───────────────────────────────────────────────────────
export async function login(accountId, pin, rememberMe = false) {
  const data = await request("POST", "/api/auth/login", { accountId, pin, rememberMe });
  localStorage.setItem("switchguard-token", data.token);
  if (data.customer) {
    localStorage.setItem("switchguard-customer", JSON.stringify(data.customer));
  }
  return data;
}

export async function adminLogin(staffId, pin) {
  const data = await request("POST", "/api/admin/login", { staffId, pin });
  localStorage.setItem("switchguard-token", data.token);
  return data;
}

export function logout() {
  localStorage.removeItem("switchguard-token");
  localStorage.removeItem("switchguard-customer");
}

export function getStoredCustomer() {
  try {
    return JSON.parse(localStorage.getItem("switchguard-customer"));
  } catch {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem("switchguard-token");
}

// ── Customer ───────────────────────────────────────────────────
export async function getProfile() {
  return request("GET", "/api/customer/profile");
}

export async function getBalance() {
  return request("GET", "/api/customer/balance");
}

export async function updatePreferences(prefs) {
  return request("PUT", "/api/customer/preferences", prefs);
}

// ── Cards ──────────────────────────────────────────────────────
export async function getCards() {
  return request("GET", "/api/cards");
}

export async function blockCard(cardId) {
  return request("POST", `/api/cards/${cardId}/block`);
}

export async function unblockCard(cardId) {
  return request("POST", `/api/cards/${cardId}/unblock`);
}

export async function freezeCard(cardId) {
  return request("POST", `/api/cards/${cardId}/freeze`);
}

export async function unfreezeCard(cardId) {
  return request("POST", `/api/cards/${cardId}/unfreeze`);
}

export async function getCardControls(cardId) {
  return request("GET", `/api/cards/${cardId}/controls`);
}

export async function updateCardControls(cardId, controls) {
  return request("PUT", `/api/cards/${cardId}/controls`, controls);
}

// ── Transactions ───────────────────────────────────────────────
export async function getTransactions(page = 1, pageSize = 20) {
  return request("GET", `/api/transactions?page=${page}&pageSize=${pageSize}`);
}

// ── Reversals ──────────────────────────────────────────────────
export async function getReversalDetail(txnId) {
  return request("GET", `/api/reversals/${txnId}`);
}

export async function triggerReversal(txnId) {
  return request("POST", "/api/reversals/trigger", { transactionId: txnId });
}

// ── Security Alerts ────────────────────────────────────────────
export async function getAlerts() {
  return request("GET", "/api/alerts");
}

export async function getAlertDetail(alertId) {
  return request("GET", `/api/alerts/${alertId}`);
}

export async function resolveAlert(alertId, action) {
  return request("POST", `/api/alerts/${alertId}/resolve`, { action });
}

// ── Payments ───────────────────────────────────────────────────
export async function getPendingPayments() {
  return request("GET", "/api/payments/pending");
}

export async function approvePayment(paymentId) {
  return request("POST", `/api/payments/${paymentId}/approve`);
}

export async function declinePayment(paymentId) {
  return request("POST", `/api/payments/${paymentId}/decline`);
}

export async function blockPayment(paymentId) {
  return request("POST", `/api/payments/${paymentId}/block`);
}

// ── Notifications ──────────────────────────────────────────────
export async function getNotifications() {
  return request("GET", "/api/notifications");
}

export async function markNotificationRead(notifId) {
  return request("POST", `/api/notifications/${notifId}/read`);
}

export async function markAllNotificationsRead() {
  return request("POST", "/api/notifications/read-all");
}

export function subscribeToNotifications(customerId, onNotification) {
  const token = getToken();
  if (!token) return () => {};

  const eventSource = new EventSource(
    `${BASE_URL}/api/notifications/stream?token=${encodeURIComponent(token)}`
  );

  eventSource.addEventListener("notification", (event) => {
    try {
      const data = JSON.parse(event.data);
      onNotification(data);
    } catch { /* ignore parse errors */ }
  });

  eventSource.onerror = () => {
    // SSE connection lost — will auto-reconnect
  };

  return () => eventSource.close();
}

// ── Admin ──────────────────────────────────────────────────────
export async function getAdminStats() {
  return request("GET", "/api/admin/stats");
}

export async function getAdminTransactions(search = "", status = "All", date = "All", page = 1, pageSize = 20) {
  const params = new URLSearchParams({ search, status, date, page, pageSize });
  return request("GET", `/api/admin/transactions?${params}`);
}

export async function exportAdminCsv() {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/api/admin/transactions/export`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Export failed");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `switchguard-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function getAtmHotspots() {
  return request("GET", "/api/admin/atm-hotspots");
}

// ── Support ────────────────────────────────────────────────────
export async function reportIssue(transactionId, category, details) {
  return request("POST", "/api/issues", { transactionId, category, details });
}

export async function chatQuery(question, language = "en") {
  return request("POST", "/api/chat/query", { question, language });
}

export async function getFaq(language = "en") {
  return request("GET", `/api/faq?language=${language}`);
}

// ── USSD & ATM Webhooks (for demo simulation) ──────────────────
export async function submitAtmWebhook(payload) {
  return request("POST", "/api/transactions/webhook", payload);
}

export async function submitAtmErrorWebhook(payload) {
  return request("POST", "/api/transactions/atm/error-webhook", payload);
}

// ── Currency formatter (matches mockData.js currency function) ─
export function currency(amount) {
  const sign = amount < 0 ? "-" : "";
  const abs = Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sign}MWK ${abs}`;
}
