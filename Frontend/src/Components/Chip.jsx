const STATUS_STYLES = {
  verified: "bg-tertiary-container text-on-tertiary-container",
  active: "bg-tertiary-container text-on-tertiary-container",
  reversed: "bg-tertiary-container text-on-tertiary-container",
  alert: "bg-error-container text-on-error-container",
  flagged: "bg-error-container text-on-error-container",
  pending: "bg-secondary-container text-on-secondary-container",
  frozen: "bg-secondary-container text-on-secondary-container",
};

export default function Chip({ status, className = "" }) {
  const key = status?.toLowerCase();
  const style = STATUS_STYLES[key] ?? "bg-surface-high text-on-surface-variant";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style} ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status?.toUpperCase()}
    </span>
  );
}
