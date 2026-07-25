import { statusStyles } from "../Data/mockData";

export default function Chip({ status, children }) {
  const style = statusStyles[status] || "bg-surface-container text-on-surface-variant";
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {children || status}
    </span>
  );
}
