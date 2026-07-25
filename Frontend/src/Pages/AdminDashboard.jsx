import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw, Flag, Timer, Search, Calendar, Download, Eye, TrendingUp, TrendingDown, MapPin } from "lucide-react";
import Shell from "../Components/Shell";
import Card from "../Components/Card";
import Chip from "../Components/Chip";
import Button from "../Components/Button";
import { adminStats, adminTransactions, atmFailureHotspots, currency } from "../Data/mockData";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const dateRanges = ["Today", "This week", "This month"];
  const [dateRangeIndex, setDateRangeIndex] = useState(0);

  const exportCsv = () => {
    const header = ["Customer", "Account", "Transaction ID", "Amount (MWK)", "Status", "Time"];
    const rows = filtered.map((t) => [t.customer, t.account, t.txnId, t.amount, t.status, t.time]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "switchguard-transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const filtered = useMemo(() => {
    return adminTransactions.filter((t) => {
      const matchesQuery = `${t.customer} ${t.txnId}`.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "All" || t.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter]);

  const statuses = ["All", "Alert", "Reversed", "Pending"];

  return (
    <Shell brand="SwitchGuard Admin" mobileTitle="Admin" showSearch>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">Admin Console</h1>
        <p className="text-sm text-on-surface-variant mt-0.5">
          Every detection, reversal, and block — visible in real time. Nothing happens in a black box.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <Card className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-full bg-tertiary-container/20 flex items-center justify-center shrink-0">
            <RotateCcw size={18} className="text-on-tertiary-container" />
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Total reversals today</p>
            <p className="text-2xl font-bold text-on-surface mt-1">{adminStats.totalReversalsToday}</p>
            <p className="text-xs text-on-tertiary-container font-semibold mt-1 flex items-center gap-1">
              <TrendingUp size={12} /> +{adminStats.reversalsGrowthPct}% from yesterday
            </p>
          </div>
        </Card>
        <Card className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-full bg-error-container flex items-center justify-center shrink-0">
            <Flag size={18} className="text-on-error-container" />
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Active flagged items</p>
            <p className="text-2xl font-bold text-on-surface mt-1">{adminStats.activeFlagged}</p>
            <p className="text-xs text-error font-semibold mt-1">Requires review</p>
          </div>
        </Card>
        <Card className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-full bg-secondary-container/40 flex items-center justify-center shrink-0">
            <Timer size={18} className="text-on-secondary-container" />
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Avg. resolution time</p>
            <p className="text-2xl font-bold text-on-surface mt-1">{adminStats.avgResolutionSeconds}s</p>
            <p className="text-xs text-on-surface-variant mt-1">vs. {adminStats.manualProcessDays} manually</p>
          </div>
        </Card>
      </div>

      {/* ATM hotspots - the "helps the bank too" angle */}
      <Card className="mb-5">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={16} className="text-on-surface-variant" />
          <h3 className="font-bold text-on-surface text-sm">ATMs with the most dispense errors this month</h3>
        </div>
        <div className="space-y-3">
          {atmFailureHotspots.map((atm) => (
            <div key={atm.location} className="flex items-center justify-between gap-3">
              <span className="text-sm text-on-surface flex-1 min-w-0 truncate">{atm.location}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-bold text-on-surface">{atm.failures} failures</span>
                {atm.trend === "up" ? (
                  <TrendingUp size={14} className="text-error" />
                ) : (
                  <TrendingDown size={14} className="text-on-tertiary-container" />
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-on-surface-variant mt-4 pt-4 border-t border-outline-variant leading-relaxed">
          This same detection data can flag which physical machines need maintenance —
          turning customer protection into an operations signal for the bank.
        </p>
      </Card>

      {/* Transaction monitoring table */}
      <Card padded={false}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5">
          <h3 className="font-bold text-on-surface">Transaction monitoring</h3>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Transaction ID, customer…"
                className="w-48 h-9 pl-9 pr-3 rounded-full bg-surface-low border border-outline-variant text-xs placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-full bg-surface-low border border-outline-variant text-xs font-medium text-on-surface-variant focus:outline-none focus:border-primary"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s === "All" ? "All statuses" : s}</option>
              ))}
            </select>
            <button
              onClick={() => setDateRangeIndex((i) => (i + 1) % dateRanges.length)}
              className="flex items-center gap-1.5 h-9 px-3 rounded-full bg-surface-low border border-outline-variant text-xs font-medium text-on-surface-variant hover:border-primary transition-colors"
            >
              <Calendar size={13} />
              {dateRanges[dateRangeIndex]}
            </button>
            <Button variant="primary" icon={Download} className="!h-9 !px-3 !text-xs" onClick={exportCsv}>
              Export CSV
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-low text-left text-xs font-bold text-on-surface-variant uppercase tracking-wide">
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Transaction ID</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Time</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filtered.map((t) => (
                <tr key={t.txnId} className="hover:bg-surface-low transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-on-surface">{t.customer}</p>
                    <p className="text-xs text-on-surface-variant">Acc: {t.account}</p>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-on-surface-variant">{t.txnId}</td>
                  <td className="px-5 py-3.5 text-right font-bold text-on-surface">{currency(t.amount)}</td>
                  <td className="px-5 py-3.5"><Chip status={t.status} /></td>
                  <td className="px-5 py-3.5 text-xs text-on-surface-variant">{t.time}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      aria-label={`View ${t.txnId}`}
                      onClick={() => navigate("/activity")}
                      className="text-on-surface-variant hover:text-on-surface transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-on-surface-variant">
                    No transactions match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-t border-outline-variant">
          <p className="text-xs text-on-surface-variant">Showing {filtered.length} of {adminTransactions.length} today's entries</p>
        </div>
      </Card>
    </Shell>
  );
}
