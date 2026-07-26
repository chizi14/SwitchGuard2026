const variants = {
  primary: "bg-primary text-on-primary hover:opacity-90",
  secondary: "bg-secondary-container text-on-secondary-container hover:brightness-95",
  ghost: "bg-transparent text-primary border border-primary/20 hover:bg-surface-container",
  outline: "bg-surface-lowest text-on-surface border border-outline-variant hover:bg-surface-low",
  danger: "bg-error text-on-error hover:brightness-95",
};

export default function Button({
  children,
  icon: Icon,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 h-12 px-5 rounded font-semibold text-sm transition-all duration-150 min-h-[48px] disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-lowest shadow-soft ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={18} strokeWidth={2.25} />}
      {children}
    </button>
  );
}
