import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Eye,
  FlagTriangleRight,
  RotateCcw,
  Search,
  Timer,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Shell from "../Components/Shell";
import Card from "../Components/Card";
import Chip from "../Components/Chip";
import Button from "../Components/Button";
import IconBadge from "../Components/IconBadge";
import { getAdminStats, getAdminTransactions, exportAdminCsv, currency } from "../api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    getAdminStats().then(setStats).catch(() => {});
  }, []);

  useEffect(() => {
    getAdminTransactions(query, statusFilter, dateFilter, page, pageSize).then((data) => {
      setRows(data.entries || []);
      setTotalRows(data.total || 0);
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, [query, statusFilter, dateFilter, page]);

  const filtered = useMemo(() => rows, [rows]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleRows = filtered.slice(startIndex, startIndex + pageSize);
  const startEntry = filtered.length === 0 ? 0 : startIndex + 1;
  const endEntry = filtered.length === 0 ? 0 : startIndex + visibleRows.length;

  const handleFilterChange = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };

  const handleExportCSV = () => {
    exportAdminCsv().catch(() => {
      const headers = ["Customer Name", "Transaction ID", "Amount", "Status", "Time"];
      const csvRows = filtered.map((row) => [
        row.customer, row.id, row.amount, row.status, row.time,
      ]);
      const csvContent = [headers, ...csvRows]
        .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const today = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `switchguard-transactions-${today}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  const statuses = ["All", "Alert", "Reversed", "Pending"];
  const dates = ["All", "Today", "Yesterday"];

  return (
    <Shell brand="SwitchGuard Admin Console" mobileTitle="SwitchGuard Admin Console" showSearch hideNav>
      <div className="space-y-5 lg:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          <Card className="flex items-start gap-3.5">
            <IconBadge icon={RotateCcw} tone="success" size={44} />
            <div className="min-w-0">
              <p className="text-xs font-bold tracking-[0.18em] uppercase text-on-surface-variant">Total reversals today</p>
              <p className="text-2xl font-bold text-on-surface mt-1">{stats.totalReversalsToday}</p>
              <p className="text-xs text-on-tertiary-container font-semibold mt-1 flex items-center gap-1">
                <TrendingUp size={12} />
                +{stats.reversalsGrowthPct}% vs yesterday
              </p>
            </div>
          </Card>

          <Card className="flex items-start gap-3.5">
            <IconBadge icon={FlagTriangleRight} tone="error" size={44} />
            <div className="min-w-0">
              <p className="text-xs font-bold tracking-[0.18em] uppercase text-on-surface-variant">Active flagged items</p>
              <p className="text-2xl font-bold text-on-surface mt-1">{stats.activeFlagged}</p>
              <p className="text-xs text-error font-semibold mt-1">Requires immediate action</p>
            </div>
          </Card>

          <Card className="flex items-start gap-3.5">
            <IconBadge icon={Timer} tone="neutral" size={44} />
            <div className="min-w-0">
              <p className="text-xs font-bold tracking-[0.18em] uppercase text-on-surface-variant">Avg. resolution time (s)</p>
              <p className="text-2xl font-bold text-on-surface mt-1">{stats.avgResolutionSeconds}s</p>
              <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                <TrendingDown size={12} className="text-on-tertiary-container" />
                {stats.avgResolutionDeltaSeconds}s vs average
              </p>
            </div>
          </Card>
        </div>

        <Card padded={false}>
          <div className="flex flex-col gap-4 p-5 md:p-6 border-b border-outline-variant bg-surface-lowest/40">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-xs font-bold tracking-[0.18em] uppercase text-on-surface-variant">Transaction Monitoring</p>
                <h1 className="text-xl font-bold text-on-surface mt-1">High priority queue</h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 xl:min-w-[48rem]">
                <label className="relative block sm:col-span-2 xl:col-span-1">
                  <span className="sr-only">Search transactions</span>
                  <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setPage(1);
                    }}
                    placeholder="Search customer or txn ID"
                    className="w-full h-11 rounded-md border border-outline-variant bg-surface-lowest pl-11 pr-4 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </label>

                <label className="block">
                  <span className="sr-only">Status filter</span>
                  <select
                    value={statusFilter}
                    onChange={handleFilterChange(setStatusFilter)}
                    className="w-full h-11 rounded-md border border-outline-variant bg-surface-lowest px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status === "All" ? "All statuses" : status}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="sr-only">Date filter</span>
                  <select
                    value={dateFilter}
                    onChange={handleFilterChange(setDateFilter)}
                    className="w-full h-11 rounded-md border border-outline-variant bg-surface-lowest px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    {dates.map((date) => (
                      <option key={date} value={date}>
                        {date === "All" ? "All dates" : date}
                      </option>
                    ))}
                  </select>
                </label>

                <Button variant="outline" icon={Download} className="!h-11 !px-4 !justify-center sm:col-span-2 xl:col-span-1" onClick={handleExportCSV}>
                  Export CSV
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="bg-surface-low text-left text-xs font-bold text-on-surface-variant uppercase tracking-wide">
                  <th className="px-5 py-3">Customer Name</th>
                  <th className="px-5 py-3">Transaction ID</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Time</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {visibleRows.map((row) => {
                  const initials = row.customer
                    .split(" ")
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("");

                  return (
                    <tr key={row.id} className="hover:bg-surface-low transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-xs font-bold shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-on-surface truncate">{row.customer}</p>
                            <p className="text-xs text-on-surface-variant mt-1">Acct. {row.account}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-on-surface-variant">#{row.id}</td>
                      <td className="px-5 py-4 text-right font-bold text-on-surface">{currency(row.amount)}</td>
                      <td className="px-5 py-4">
                        <Chip status={row.status}>{row.status}</Chip>
                      </td>
                      <td className="px-5 py-4 text-xs text-on-surface-variant">{row.time}</td>
                      <td className="px-5 py-4 text-right">
                        <Button variant="outline" icon={Eye} aria-label={`View ${row.id}`} className="!h-10 !w-10 !px-0" />
                      </td>
                    </tr>
                  );
                })}
                {visibleRows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-sm text-on-surface-variant">
                      No transactions match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-t border-outline-variant">
            <p className="text-xs text-on-surface-variant">
              Showing {startEntry} to {endEntry} of {filtered.length} entries
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="!h-10 !px-4"
                disabled={currentPage === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Prev
              </Button>
              <Button variant="outline" className="!h-10 !px-4">
                {currentPage}
              </Button>
              <Button
                variant="outline"
                className="!h-10 !px-4"
                disabled={currentPage === totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Shell>
  );
}